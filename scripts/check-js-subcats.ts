import { config } from 'dotenv'
config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'
import { eq } from 'drizzle-orm'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

async function main() {
  const rows = await db.select().from(schema.themeSubCategories).where(eq(schema.themeSubCategories.theme, 'JavaScript'))
  console.log('JavaScript subCategories:', rows)
  process.exit(0)
}

main().catch(console.error)
