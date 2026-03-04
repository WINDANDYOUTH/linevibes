/**
 * POST /api/portrait/generate
 *
 * Accepts an uploaded photo (FormData), generates a line art portrait
 * using Together AI, stores everything in R2, and manages the session
 * in PostgreSQL.
 *
 * Flow:
 * 1. Parse uploaded file from FormData
 * 2. Create a session in PostgreSQL (status: "generating")
 * 3. Upload original photo to R2
 * 4. Call Together AI to generate line art
 * 5. Download generated image and upload to R2
 * 6. Update session with URLs (status: "completed")
 * 7. Return { sessionId, portraitUrl, status }
 */
import { NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"
import { getPool } from "@lib/db"
import { ensurePortraitSessionsTable } from "@lib/db/init"
import { uploadToR2, portraitKey } from "@lib/r2"
import {
  generateLinePortrait,
  downloadImage,
  type PortraitStyle,
} from "@lib/ai/generate-portrait"

export const maxDuration = 120 // Allow up to 2 minutes for AI generation
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    // ─── 1. Parse FormData ──────────────────────────────
    const formData = await request.formData()
    const file = formData.get("photo") as File | null
    const style = (formData.get("style") as PortraitStyle) || "classic"

    if (!file) {
      return NextResponse.json(
        { error: "No photo file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload JPG, PNG, or WebP." },
        { status: 400 }
      )
    }

    // Validate file size (15MB max)
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 15MB." },
        { status: 400 }
      )
    }

    // ─── 2. Initialize DB + Create Session ──────────────
    await ensurePortraitSessionsTable()
    const pool = getPool()
    const sessionId = nanoid(16)

    await pool.query(
      `INSERT INTO portrait_sessions (id, status, style)
       VALUES ($1, 'generating', $2)`,
      [sessionId, style]
    )

    console.log(`[Portrait] Session created: ${sessionId} (style: ${style})`)

    // ─── 3. Upload Original Photo to R2 ─────────────────
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const ext = file.type.split("/")[1] || "jpg"
    const originalKey = portraitKey(sessionId, `original.${ext}`)
    const originalUrl = await uploadToR2(originalKey, fileBuffer, file.type)

    console.log(`[Portrait] Original uploaded: ${originalUrl}`)

    // Update session with original URL
    await pool.query(
      `UPDATE portrait_sessions
       SET original_url = $1, updated_at = NOW()
       WHERE id = $2`,
      [originalUrl, sessionId]
    )

    // ─── 4. Generate Line Art via Together AI ───────────
    let portraitUrl: string
    try {
      // Call Together AI with the public R2 URL of the original photo
      const generatedUrl = await generateLinePortrait(originalUrl, style)

      // ─── 5. Download Generated Image & Upload to R2 ───
      const generatedBuffer = await downloadImage(generatedUrl)
      const portraitR2Key = portraitKey(sessionId, "portrait.png")
      portraitUrl = await uploadToR2(portraitR2Key, generatedBuffer, "image/png")

      console.log(`[Portrait] Portrait uploaded to R2: ${portraitUrl}`)

      // ─── 6. Update Session – Completed ─────────────────
      await pool.query(
        `UPDATE portrait_sessions
         SET status = 'completed',
             portrait_url = $1,
             updated_at = NOW()
         WHERE id = $2`,
        [portraitUrl, sessionId]
      )
    } catch (aiError: any) {
      console.error(`[Portrait] AI generation failed:`, aiError)

      // Mark session as failed
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
          error: "Portrait generation failed. Please try again.",
          sessionId,
          status: "failed",
        },
        { status: 500 }
      )
    }

    // ─── 7. Return Success ───────────────────────────────
    return NextResponse.json({
      sessionId,
      portraitUrl,
      originalUrl,
      style,
      status: "completed",
    })
  } catch (error: any) {
    console.error("[Portrait] Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
