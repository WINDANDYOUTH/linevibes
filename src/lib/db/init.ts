/**
 * Portrait Sessions – Database Schema Initialization
 * 
 * Creates the portrait_sessions table if it doesn't exist.
 * This is called lazily on first API request.
 */
import { getPool } from "./index"

let initialized = false

export async function ensurePortraitSessionsTable(): Promise<void> {
  if (initialized) return

  const pool = getPool()

  await pool.query(`
    CREATE TABLE IF NOT EXISTS portrait_sessions (
      id              TEXT PRIMARY KEY,
      status          TEXT NOT NULL DEFAULT 'pending',
      style           TEXT NOT NULL DEFAULT 'classic',
      customer_id     TEXT,
      original_url    TEXT,
      portrait_url    TEXT,
      portrait_svg_url TEXT,
      thumbnail_url   TEXT,
      error_message   TEXT,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days')
    );

    CREATE INDEX IF NOT EXISTS idx_portrait_sessions_status
      ON portrait_sessions (status);

    CREATE INDEX IF NOT EXISTS idx_portrait_sessions_expires_at
      ON portrait_sessions (expires_at);

    CREATE INDEX IF NOT EXISTS idx_portrait_sessions_customer_id
      ON portrait_sessions (customer_id);
  `)

  // Add customer_id column if table already exists without it
  await pool.query(`
    ALTER TABLE portrait_sessions
      ADD COLUMN IF NOT EXISTS customer_id TEXT;
  `).catch(() => {
    // Column might already exist, that's fine
  })

  initialized = true
  console.log("[DB] portrait_sessions table ensured")
}

export default ensurePortraitSessionsTable

