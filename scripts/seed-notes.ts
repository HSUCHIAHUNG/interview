import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'
import { eq } from 'drizzle-orm'
import fs from 'fs'
import path from 'path'
import { arrayMethodChallenges } from '../lib/array-challenges'

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

const TOPICS_DIR = path.join(process.cwd(), 'topics')

async function seed() {
  // Seed from topics/*/notes.ts
  const slugs = fs.readdirSync(TOPICS_DIR).filter(f =>
    fs.statSync(path.join(TOPICS_DIR, f)).isDirectory() &&
    fs.existsSync(path.join(TOPICS_DIR, f, 'notes.ts'))
  )

  for (const slug of slugs) {
    const mod = await import(`../topics/${slug}/notes`)
    const notes = mod.notes as { title: string; sections: { heading: string; content: string }[] }

    // Skip if already seeded
    const existing = await db.select({ id: schema.topicNoteSections.id })
      .from(schema.topicNoteSections)
      .where(eq(schema.topicNoteSections.slug, slug))
    if (existing.length > 0) {
      console.log(`⚠ ${slug}: 已有資料，跳過`)
      continue
    }

    for (let i = 0; i < notes.sections.length; i++) {
      await db.insert(schema.topicNoteSections).values({
        slug,
        heading: notes.sections[i].heading,
        content: notes.sections[i].content,
        order: i,
      })
    }
    console.log(`✓ ${slug}: ${notes.sections.length} 個章節`)
  }

  // Seed from array-challenges notes
  for (const entry of arrayMethodChallenges) {
    const { slug, notes } = entry
    if (!notes) continue

    const existing = await db.select({ id: schema.topicNoteSections.id })
      .from(schema.topicNoteSections)
      .where(eq(schema.topicNoteSections.slug, slug))
    if (existing.length > 0) {
      console.log(`⚠ ${slug}: 已有資料，跳過`)
      continue
    }

    for (let i = 0; i < notes.sections.length; i++) {
      await db.insert(schema.topicNoteSections).values({
        slug,
        heading: notes.sections[i].heading,
        content: notes.sections[i].content,
        order: i,
      })
    }
    console.log(`✓ ${slug} (陣列方法): ${notes.sections.length} 個章節`)
  }

  console.log('\n✅ Notes seed 完成')
  process.exit(0)
}

seed().catch(e => { console.error(e); process.exit(1) })
