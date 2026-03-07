/**
 * PostgreSQL Connection Pool
 * 
 * Shared connection pool for portrait session management.
 * Uses the `pg` package which is already in the project dependencies.
 */
import { Pool } from "pg"

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const connectionString =
      process.env.PORTRAIT_DATABASE_URL ||
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres123@localhost:5432/linevibes"

    pool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })

    pool.on("error", (err) => {
      console.error("[DB Pool] Unexpected error on idle client", err)
    })
  }

  return pool
}

export default getPool
