import 'dotenv/config'
import { drizzle } from 'drizzle-orm/mysql2'
import { migrate } from 'drizzle-orm/mysql2/migrator'
import mysql from 'mysql2/promise'

async function runMigrations() {
  const connection = await mysql.createConnection(
    process.env.DATABASE_URL || 'mysql://root:@127.0.0.1:3306/gatra_db'
  )
  const db = drizzle(connection)

  console.log('⏳ Running migrations...')
  await migrate(db, { migrationsFolder: './src/db/migrations' })
  console.log('✅ Migrations complete!')

  await connection.end()
  process.exit(0)
}

runMigrations().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
