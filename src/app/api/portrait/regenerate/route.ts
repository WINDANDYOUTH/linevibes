/**
 * POST /api/portrait/regenerate
 *
 * Re-generates a line art portrait using the original photo already stored
 * in R2. This avoids re-uploading and lets the user try again if the first
 * result isn't satisfactory.
 *
 * Flow:
 * 1. Look up the existing session in PostgreSQL
 * 2. Verify it has an original_url (photo already in R2)
 * 3. Call Together AI again to generate a new portrait
 * 4. Download the result and upload to R2 (overwriting previous portrait)
 * 5. Update the session record
 * 6. Return updated data
 *
 * Body: { sessionId: string, style?: string }
 */
import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@lib/db"
import { ensurePortraitSessionsTable } from "@lib/db/init"
import { uploadToR2, portraitKey } from "@lib/r2"
import {
  generateLinePortrait,
  downloadImage,
  type PortraitStyle,
} from "@lib/ai/generate-portrait"

export const maxDuration = 120
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, style } = body as {
      sessionId?: string
      style?: PortraitStyle
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      )
    }

    // ─── 1. Look up existing session ───────────────────
    await ensurePortraitSessionsTable()
    const pool = getPool()

    const result = await pool.query(
      `SELECT id, status, style, original_url
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

    // ─── 2. Verify original photo exists ───────────────
    if (!session.original_url) {
      return NextResponse.json(
        { error: "No original photo found for this session" },
        { status: 400 }
      )
    }

    // Use new style if provided, otherwise keep original
    const targetStyle = style || session.style || "classic"

    // ─── 3. Mark as regenerating ───────────────────────
    await pool.query(
      `UPDATE portrait_sessions
       SET status = 'generating',
           style = $1,
           error_message = NULL,
           updated_at = NOW()
       WHERE id = $2`,
      [targetStyle, sessionId]
    )

    console.log(
      `[Portrait] Regenerating session: ${sessionId} (style: ${targetStyle})`
    )

    // ─── 4. Call Together AI with the existing original ─
    let portraitUrl: string
    try {
      const generatedUrl = await generateLinePortrait(
        session.original_url,
        targetStyle
      )

      // ─── 5. Download & Upload to R2 ──────────────────
      const generatedBuffer = await downloadImage(generatedUrl)
      const portraitR2Key = portraitKey(sessionId, "portrait.png")
      portraitUrl = await uploadToR2(portraitR2Key, generatedBuffer, "image/png")

      console.log(`[Portrait] Regenerated portrait uploaded: ${portraitUrl}`)

      // ─── 6. Update session – Completed ───────────────
      await pool.query(
        `UPDATE portrait_sessions
         SET status = 'completed',
             portrait_url = $1,
             updated_at = NOW()
         WHERE id = $2`,
        [portraitUrl, sessionId]
      )
    } catch (aiError: any) {
      console.error(`[Portrait] Regeneration failed:`, aiError)

      await pool.query(
        `UPDATE portrait_sessions
         SET status = 'failed',
             error_message = $1,
             updated_at = NOW()
         WHERE id = $2`,
        [aiError.message || "Unknown AI error", sessionId]
      )

      return NextResponse.json(
        {
          error: "Regeneration failed. Please try again.",
          sessionId,
          status: "failed",
        },
        { status: 500 }
      )
    }

    // ─── 7. Return Success ─────────────────────────────
    return NextResponse.json({
      sessionId,
      portraitUrl,
      originalUrl: session.original_url,
      style: targetStyle,
      status: "completed",
    })
  } catch (error: any) {
    console.error("[Portrait] Regenerate unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
