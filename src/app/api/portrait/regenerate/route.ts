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
 * 3. Download the original image from R2
 * 4. Call Gemini again to generate a new portrait
 * 5. Upload the result to R2 (overwriting previous portrait)
 * 6. Update the session record
 * 7. Return updated data
 *
 * Body: { sessionId: string, style?: string }
 */
import { NextRequest, NextResponse } from "next/server"

import {
  downloadImage,
  generateLinePortrait,
  type PortraitStyle,
} from "@lib/ai/generate-portrait"
import { getPool } from "@lib/db"
import { ensurePortraitSessionsTable } from "@lib/db/init"
import { portraitKey, uploadToR2 } from "@lib/r2"

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
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 })
    }

    await ensurePortraitSessionsTable()
    const pool = getPool()

    const result = await pool.query(
      `SELECT id, status, style, original_url
       FROM portrait_sessions
       WHERE id = $1`,
      [sessionId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    const session = result.rows[0]

    if (!session.original_url) {
      return NextResponse.json(
        { error: "No original photo found for this session" },
        { status: 400 }
      )
    }

    const targetStyle = style || session.style || "classic"

    await pool.query(
      `UPDATE portrait_sessions
       SET status = 'generating',
           style = $1,
           portrait_svg_url = NULL,
           error_message = NULL,
           updated_at = NOW()
       WHERE id = $2`,
      [targetStyle, sessionId]
    )

    console.log(
      `[Portrait] Regenerating session: ${sessionId} (style: ${targetStyle})`
    )

    let portraitUrl: string
    let provider: string
    let model: string

    try {
      const { buffer: originalBuffer, mimeType } = await downloadImage(
        session.original_url
      )
      const result = await generateLinePortrait(
        originalBuffer,
        mimeType,
        targetStyle,
        session.original_url
      )
      provider = result.provider
      model = result.model
      const portraitR2Key = portraitKey(sessionId, "portrait.png")
      portraitUrl = await uploadToR2(portraitR2Key, result.buffer, "image/png")

      console.log(
        `[Portrait] Regenerated portrait uploaded: ${portraitUrl} (${provider}:${model})`
      )

      await pool.query(
        `UPDATE portrait_sessions
         SET status = 'completed',
             portrait_url = $1,
             portrait_svg_url = NULL,
             updated_at = NOW()
         WHERE id = $2`,
        [portraitUrl, sessionId]
      )
    } catch (aiError: any) {
      console.error("[Portrait] Regeneration failed:", aiError)

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

    return NextResponse.json({
      sessionId,
      portraitUrl,
      portraitSvgUrl: null,
      originalUrl: session.original_url,
      style: targetStyle,
      provider,
      model,
      status: "completed",
    })
  } catch (error: any) {
    console.error("[Portrait] Regenerate unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        ...(process.env.NODE_ENV !== "production"
          ? { details: error instanceof Error ? error.message : String(error) }
          : {}),
      },
      { status: 500 }
    )
  }
}
