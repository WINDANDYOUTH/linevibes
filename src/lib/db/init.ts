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

  const statements = [
    `CREATE TABLE IF NOT EXISTS portrait_sessions (
      id              TEXT PRIMARY KEY,
      status          TEXT NOT NULL DEFAULT 'pending',
      style           TEXT NOT NULL DEFAULT 'classic',
      template_id     TEXT,
      template_handle TEXT,
      template_group  TEXT,
      template_family TEXT,
      reference_image_url TEXT,
      prompt_version  TEXT,
      customer_id     TEXT,
      anonymous_owner_token TEXT,
      request_ip      TEXT,
      request_user_agent TEXT,
      original_url    TEXT,
      cropped_url     TEXT,
      portrait_url    TEXT,
      delivery_portrait_url TEXT,
      portrait_svg_url TEXT,
      thumbnail_url   TEXT,
      error_message   TEXT,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days')
    )`,
    `CREATE TABLE IF NOT EXISTS portrait_generation_events (
      id              BIGSERIAL PRIMARY KEY,
      session_id      TEXT NOT NULL,
      event_type      TEXT NOT NULL,
      customer_id     TEXT,
      anonymous_owner_token TEXT,
      request_ip      TEXT,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `ALTER TABLE portrait_sessions ADD COLUMN IF NOT EXISTS template_id TEXT`,
    `ALTER TABLE portrait_sessions ADD COLUMN IF NOT EXISTS template_handle TEXT`,
    `ALTER TABLE portrait_sessions ADD COLUMN IF NOT EXISTS template_group TEXT`,
    `ALTER TABLE portrait_sessions ADD COLUMN IF NOT EXISTS template_family TEXT`,
    `ALTER TABLE portrait_sessions ADD COLUMN IF NOT EXISTS reference_image_url TEXT`,
    `ALTER TABLE portrait_sessions ADD COLUMN IF NOT EXISTS prompt_version TEXT`,
    `ALTER TABLE portrait_sessions ADD COLUMN IF NOT EXISTS customer_id TEXT`,
    `ALTER TABLE portrait_sessions ADD COLUMN IF NOT EXISTS anonymous_owner_token TEXT`,
    `ALTER TABLE portrait_sessions ADD COLUMN IF NOT EXISTS request_ip TEXT`,
    `ALTER TABLE portrait_sessions ADD COLUMN IF NOT EXISTS request_user_agent TEXT`,
    `ALTER TABLE portrait_sessions ADD COLUMN IF NOT EXISTS cropped_url TEXT`,
    `ALTER TABLE portrait_sessions ADD COLUMN IF NOT EXISTS delivery_portrait_url TEXT`,
    `ALTER TABLE portrait_generation_events ADD COLUMN IF NOT EXISTS customer_id TEXT`,
    `ALTER TABLE portrait_generation_events ADD COLUMN IF NOT EXISTS anonymous_owner_token TEXT`,
    `ALTER TABLE portrait_generation_events ADD COLUMN IF NOT EXISTS request_ip TEXT`,
    `CREATE INDEX IF NOT EXISTS idx_portrait_sessions_status
      ON portrait_sessions (status)`,
    `CREATE INDEX IF NOT EXISTS idx_portrait_sessions_expires_at
      ON portrait_sessions (expires_at)`,
    `CREATE INDEX IF NOT EXISTS idx_portrait_sessions_customer_id
      ON portrait_sessions (customer_id)`,
    `CREATE INDEX IF NOT EXISTS idx_portrait_sessions_anonymous_owner_token
      ON portrait_sessions (anonymous_owner_token)`,
    `CREATE INDEX IF NOT EXISTS idx_portrait_sessions_request_ip
      ON portrait_sessions (request_ip)`,
    `CREATE INDEX IF NOT EXISTS idx_portrait_generation_events_customer_id
      ON portrait_generation_events (customer_id, created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_portrait_generation_events_anon_owner
      ON portrait_generation_events (anonymous_owner_token, created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_portrait_generation_events_request_ip
      ON portrait_generation_events (request_ip, created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_portrait_generation_events_event_type
      ON portrait_generation_events (event_type, created_at DESC)`,
  ]

  for (const statement of statements) {
    await pool.query(statement)
  }

  initialized = true
  console.log("[DB] portrait_sessions table ensured")
}

export default ensurePortraitSessionsTable

