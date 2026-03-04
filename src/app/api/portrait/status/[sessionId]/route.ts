/**
 * GET /api/portrait/status/[sessionId]
 *
 * Lightweight polling endpoint for checking portrait generation status.
 * Returns only the status and relevant URLs for fast polling.
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
      `SELECT status, portrait_url AS "portraitUrl", error_message AS "errorMessage"
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

    return NextResponse.json({
      sessionId,
      ...result.rows[0],
    })
  } catch (error: any) {
    console.error("[Portrait Status] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
