/**
 * POST /api/portrait/generate
 *
 * Accepts an uploaded photo (FormData), generates a line art portrait
 * using Google Gemini image generation, stores everything in R2, and manages
 * the session in PostgreSQL.
 *
 * Flow:
 * 1. Parse uploaded file from FormData
 * 2. Create a session in PostgreSQL (status: "generating")
 * 3. Upload original photo to R2
 * 4. Call Gemini to generate line art
 * 5. Upload generated image to R2
 * 6. Update session with URLs (status: "completed")
 * 7. Return { sessionId, portraitUrl, status }
 */
import { NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"

import { getCustomerIdFromRequest } from "@lib/auth/api-auth"
import {
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
    const formData = await request.formData()
    const file = formData.get("photo") as File | null
    const style = (formData.get("style") as PortraitStyle) || "classic"

    if (!file) {
      return NextResponse.json(
        { error: "No photo file provided" },
        { status: 400 }
      )
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload JPG, PNG, or WebP." },
        { status: 400 }
      )
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 15MB." },
        { status: 400 }
      )
    }

    await ensurePortraitSessionsTable()
    const pool = getPool()
    const sessionId = nanoid(16)
    const customerId = await getCustomerIdFromRequest()

    await pool.query(
      `INSERT INTO portrait_sessions (id, status, style, customer_id)
       VALUES ($1, 'generating', $2, $3)`,
      [sessionId, style, customerId]
    )

    console.log(
      `[Portrait] Session created: ${sessionId} (style: ${style}, customer: ${
        customerId || "anonymous"
      })`
    )

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const ext = file.type.split("/")[1] || "jpg"
    const originalKey = portraitKey(sessionId, `original.${ext}`)
    const originalUrl = await uploadToR2(originalKey, fileBuffer, file.type)

    console.log(`[Portrait] Original uploaded: ${originalUrl}`)

    await pool.query(
      `UPDATE portrait_sessions
       SET original_url = $1, updated_at = NOW()
       WHERE id = $2`,
      [originalUrl, sessionId]
    )

    let portraitUrl: string
    let provider: string
    let model: string

    try {
      const result = await generateLinePortrait(
        fileBuffer,
        file.type,
        style,
        originalUrl
      )
      provider = result.provider
      model = result.model
      const portraitR2Key = portraitKey(sessionId, "portrait.png")
      portraitUrl = await uploadToR2(portraitR2Key, result.buffer, "image/png")

      console.log(
        `[Portrait] Portrait uploaded to R2: ${portraitUrl} (${provider}:${model})`
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
      console.error("[Portrait] AI generation failed:", aiError)

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

    return NextResponse.json({
      sessionId,
      portraitUrl,
      portraitSvgUrl: null,
      originalUrl,
      style,
      provider,
      model,
      status: "completed",
    })
  } catch (error: any) {
    console.error("[Portrait] Unexpected error:", error)
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
