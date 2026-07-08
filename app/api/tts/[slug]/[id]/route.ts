import { NextResponse } from 'next/server'
import { put, head } from '@vercel/blob'
import { getKeyPointById } from '@/lib/db/queries'

const TTS_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions'

function blobKey(slug: string, id: number) {
  return `audio/${slug}/${id}.wav`
}

function pcmToWav(pcm: Buffer, sampleRate = 24000, channels = 1, bitDepth = 16): Buffer {
  const dataSize = pcm.length
  const buf = Buffer.alloc(44 + dataSize)
  buf.write('RIFF', 0)
  buf.writeUInt32LE(36 + dataSize, 4)
  buf.write('WAVE', 8)
  buf.write('fmt ', 12)
  buf.writeUInt32LE(16, 16)
  buf.writeUInt16LE(1, 20)
  buf.writeUInt16LE(channels, 22)
  buf.writeUInt32LE(sampleRate, 24)
  buf.writeUInt32LE(sampleRate * channels * (bitDepth / 8), 28)
  buf.writeUInt16LE(channels * (bitDepth / 8), 32)
  buf.writeUInt16LE(bitDepth, 34)
  buf.write('data', 36)
  buf.writeUInt32LE(dataSize, 40)
  pcm.copy(buf, 44)
  return buf
}

const wavHeaders = {
  'Content-Type': 'audio/wav',
  'Cache-Control': 'public, max-age=31536000',
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const { slug, id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const key = blobKey(slug, id)
  const token = process.env.BLOB_READ_WRITE_TOKEN

  // Serve from cache if exists
  try {
    const info = await head(key)
    const cached = await fetch(info.url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return new Response(cached.body, { headers: wavHeaders })
  } catch {
    // Not cached
  }

  // Fetch text from DB
  const keyPoint = await getKeyPointById(id)
  if (!keyPoint) return NextResponse.json({ error: 'Key point not found' }, { status: 404 })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 })

  const geminiRes = await fetch(TTS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      model: 'gemini-2.5-flash-preview-tts',
      input: `請朗讀以下文字：${keyPoint.text}`,
      response_format: { type: 'audio' },
      generation_config: { speech_config: [{ voice: 'Kore' }] },
    }),
  })

  if (!geminiRes.ok) {
    const errText = await geminiRes.text()
    return NextResponse.json({ error: 'Gemini API error', detail: errText }, { status: 502 })
  }

  const data = await geminiRes.json()
  const audioPart = data?.steps?.[0]?.content?.[0]
  if (!audioPart?.data) {
    return NextResponse.json(
      { error: 'No audio in response', debug: JSON.stringify(data).slice(0, 800) },
      { status: 502 },
    )
  }

  const pcmBuffer = Buffer.from(audioPart.data, 'base64')
  const wavBuffer = pcmToWav(pcmBuffer)

  // Store in blob (fire-and-forget, non-fatal)
  put(key, wavBuffer, { access: 'private', contentType: 'audio/wav' }).catch(() => {})

  return new Response(wavBuffer.buffer as ArrayBuffer, { headers: wavHeaders })
}
