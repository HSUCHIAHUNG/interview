import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'

async function main() {
  const sql = neon(process.env.DATABASE_URL!)
  const topics = await sql`SELECT slug, title, sub_category, difficulty FROM topics WHERE theme = '陣列方法' ORDER BY sub_category, slug LIMIT 30`
  console.log('陣列方法 topics:')
  for (const t of topics) console.log(`  ${t.slug.padEnd(25)} [${t.sub_category}] ${t.difficulty}`)
  console.log('\n總計:', topics.length, '個')
}
main()
