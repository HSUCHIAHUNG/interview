import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

interface HistoryMessage {
  role: 'user' | 'model'
  content: string
}

export async function POST(request: Request) {
  const { history, message }: { history: HistoryMessage[]; message: string } =
    await request.json()

  if (!message?.trim()) {
    return Response.json({ error: '請輸入問題' }, { status: 400 })
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction:
        '你是一位資深前端工程師面試官，正在協助應試者深入理解面試概念。請用繁體中文回答，保持簡潔清楚。',
    })

    const chat = model.startChat({
      history: history.map(m => ({
        role: m.role,
        parts: [{ text: m.content }],
      })),
    })

    const result = await chat.sendMessageStream(message)

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text()
          if (text) controller.enqueue(encoder.encode(text))
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'AI 回覆暫時無法使用，請稍後再試。'
    return Response.json({ error: message }, { status: 500 })
  }
}
