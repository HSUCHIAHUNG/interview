import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL!)

async function main() {
  await sql`ALTER TABLE user_weekly_goals ADD COLUMN IF NOT EXISTS target_days integer`
  console.log('✅ Added target_days column to user_weekly_goals')
}

main().catch(console.error)
