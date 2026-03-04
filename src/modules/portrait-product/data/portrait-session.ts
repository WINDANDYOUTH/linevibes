/**
 * Portrait Session Data Utilities
 *
 * Handles fetching and managing portrait generation session data.
 * Session data is stored in PostgreSQL (sessions) and Cloudflare R2 (images).
 *
 * Server-side: Queries PostgreSQL directly
 * Client-side: Uses API routes
 */

export type PortraitSession = {
  /** Unique session identifier */
  sessionId: string
  /** Status of the portrait generation */
  status: "pending" | "generating" | "completed" | "failed" | "expired"
  /** URL to the generated portrait image (PNG) */
  portraitUrl: string
  /** URL to the SVG version (if available) */
  portraitSvgUrl: string
  /** URL to the original uploaded photo */
  originalUrl: string
  /** Thumbnail URL for previews */
  thumbnailUrl: string
  /** Selected art style */
  style: string
  /** Error message if generation failed */
  errorMessage?: string
  /** When the session was created */
  createdAt: string
  /** When the session/download links expire */
  expiresAt: string
}

/**
 * Fetches portrait session data by session ID.
 *
 * This function can be called from both server and client contexts:
 * - Server (RSC): Queries PostgreSQL directly
 * - Client: Calls the /api/portrait/session endpoint
 *
 * @param sessionId - The session ID from the URL parameter
 * @returns Session data or null if not found/expired
 */
export async function fetchPortraitSession(
  sessionId: string
): Promise<PortraitSession | null> {
  try {
    // Determine if we're on the server or client
    const isServer = typeof window === "undefined"

    if (isServer) {
      // ─── Server-side: Direct PostgreSQL query ─────────
      const { getPool } = await import("@lib/db")
      const { ensurePortraitSessionsTable } = await import("@lib/db/init")

      await ensurePortraitSessionsTable()
      const pool = getPool()

      const result = await pool.query(
        `SELECT
           id AS "sessionId",
           status,
           style,
           original_url AS "originalUrl",
           portrait_url AS "portraitUrl",
           portrait_svg_url AS "portraitSvgUrl",
           thumbnail_url AS "thumbnailUrl",
           error_message AS "errorMessage",
           created_at AS "createdAt",
           expires_at AS "expiresAt"
         FROM portrait_sessions
         WHERE id = $1`,
        [sessionId]
      )

      if (result.rows.length === 0) return null

      const session = result.rows[0] as PortraitSession

      // Check expiration
      if (new Date(session.expiresAt) < new Date()) {
        await pool.query(
          `UPDATE portrait_sessions SET status = 'expired' WHERE id = $1`,
          [sessionId]
        )
        session.status = "expired"
      }

      return session
    } else {
      // ─── Client-side: API call ────────────────────────
      const response = await fetch(`/api/portrait/session/${sessionId}`)

      if (!response.ok) return null

      return await response.json()
    }
  } catch (error) {
    console.error("[Portrait Session] Error fetching session:", error)
    return null
  }
}

/**
 * Checks if a portrait session is still valid (not expired and completed).
 */
export function isSessionValid(session: PortraitSession): boolean {
  if (session.status === "expired") return false
  if (session.status === "failed") return false
  return new Date(session.expiresAt) > new Date()
}
