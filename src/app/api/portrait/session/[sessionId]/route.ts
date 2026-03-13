/**
 * GET /api/portrait/session/[sessionId]
 *
 * Fetches the full session data for a portrait generation session.
 * Used by the result page to load portrait data.
 */
import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@lib/db"
import { ensurePortraitSessionsTable } from "@lib/db/init"

export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      )
    }

    await ensurePortraitSessionsTable()
    const pool = getPool()

    const result = await pool.query(
      `SELECT
         id AS "sessionId",
         status,
         style,
         original_url AS "originalUrl",
         cropped_url AS "croppedUrl",
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

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    const session = result.rows[0]

    // Check if expired
    if (new Date(session.expiresAt) < new Date()) {
      // Mark as expired
      await pool.query(
        `UPDATE portrait_sessions SET status = 'expired' WHERE id = $1`,
        [sessionId]
      )
      session.status = "expired"
    }

    return NextResponse.json(session)
  } catch (error: any) {
    console.error("[Portrait Session] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
