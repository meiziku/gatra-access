import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

const poolConnection = mysql.createPool(
  process.env.DATABASE_URL || 'mysql://root:@127.0.0.1:3306/gatra_db'
)

export const db = drizzle(poolConnection, { schema, mode: 'default' })
export type DB = typeof db
