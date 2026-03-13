/**
 * POST /api/portrait/regenerate
 *
 * Re-generates a line art portrait using the saved generation input already
 * stored in R2. This avoids re-uploading and lets the user try again if the
 * first result isn't satisfactory.
 *
 * Flow:
 * 1. Look up the existing session in PostgreSQL
 * 2. Verify it has a saved source image already in R2
 * 3. Download the cropped input when present, otherwise the original upload
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
import { getCustomerIdFromRequest } from "@lib/auth/api-auth"
import { getPool } from "@lib/db"
import { ensurePortraitSessionsTable } from "@lib/db/init"
import {
  acquirePortraitActorLock,
  applyPortraitOwnerCookie,
  assertPortraitGenerationAllowed,
  assertPortraitOwnership,
  getPortraitOwnerContext,
  isPortraitGuardError,
  recordPortraitGenerationEvent,
} from "@lib/portrait/anti-abuse"
import { portraitKey, uploadToR2 } from "@lib/r2"

export const maxDuration = 120
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const customerId = await getCustomerIdFromRequest()
  const owner = getPortraitOwnerContext(request, customerId)
  const respond = (
    body: Record<string, unknown>,
    init?: ResponseInit
  ) => {
    const response = NextResponse.json(body, init)
    applyPortraitOwnerCookie(response, owner)
    return response
  }

  let sessionId: string | null = null

  try {
    const body = await request.json()
    const { sessionId: requestedSessionId, style } = body as {
      sessionId?: string
      style?: PortraitStyle
    }

    if (!requestedSessionId) {
      return respond({ error: "Missing sessionId" }, { status: 400 })
    }

    sessionId = requestedSessionId

    await ensurePortraitSessionsTable()
    const pool = getPool()
    const client = await pool.connect()

    type PortraitSessionRow = {
      anonymousOwnerToken: string | null
      customerId: string | null
      croppedUrl: string | null
      originalUrl: string | null
      requestIp: string | null
      style: PortraitStyle | null
    }

    let session: PortraitSessionRow | null = null
    let targetStyle: PortraitStyle = "classic"

    try {
      await client.query("BEGIN")

      const result = await client.query<PortraitSessionRow>(
         `SELECT
            customer_id AS "customerId",
            anonymous_owner_token AS "anonymousOwnerToken",
            cropped_url AS "croppedUrl",
            original_url AS "originalUrl",
            request_ip AS "requestIp",
            style
         FROM portrait_sessions
         WHERE id = $1`,
        [sessionId]
      )

      if (result.rows.length === 0) {
        await client.query("ROLLBACK")
        return respond({ error: "Session not found" }, { status: 404 })
      }

      session = result.rows[0]

      assertPortraitOwnership(owner, {
        anonymousOwnerToken: session.anonymousOwnerToken,
        customerId: session.customerId,
        requestIp: session.requestIp,
      })
      await acquirePortraitActorLock(client, owner, sessionId)
      await assertPortraitGenerationAllowed(client, owner)

      if (!session.croppedUrl && !session.originalUrl) {
        await client.query("ROLLBACK")
        return respond(
          { error: "No source photo found for this session" },
          { status: 400 }
        )
      }

      targetStyle = style || session.style || "classic"

      await client.query(
        `UPDATE portrait_sessions
         SET status = 'generating',
             style = $1,
             portrait_svg_url = NULL,
             error_message = NULL,
             updated_at = NOW()
         WHERE id = $2`,
        [targetStyle, sessionId]
      )

      await recordPortraitGenerationEvent(client, {
        action: "regenerate",
        owner,
        sessionId,
      })

      await client.query("COMMIT")
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined)
      throw error
    } finally {
      client.release()
    }

    const generationSourceUrl = session?.croppedUrl ?? session?.originalUrl ?? null

    if (!generationSourceUrl) {
      throw new Error("Portrait session state missing after validation")
    }

    console.log(
      `[Portrait] Regenerating session: ${sessionId} (style: ${targetStyle})`
    )

    let portraitUrl: string
    let provider: string
    let model: string

    try {
      const { buffer: originalBuffer, mimeType } = await downloadImage(
        generationSourceUrl
      )
      const result = await generateLinePortrait(
        originalBuffer,
        mimeType,
        targetStyle,
        generationSourceUrl
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

      return respond(
        {
          error: "Regeneration failed. Please try again.",
          sessionId,
          status: "failed",
        },
        { status: 500 }
      )
    }

    return respond({
      sessionId,
      portraitUrl,
      portraitSvgUrl: null,
      originalUrl: session.originalUrl,
      croppedUrl: generationSourceUrl,
      style: targetStyle,
      provider,
      model,
      status: "completed",
    })
  } catch (error: any) {
    if (isPortraitGuardError(error)) {
      const response = respond(
        { error: error.message },
        { status: error.status }
      )

      if (error.retryAfterSeconds) {
        response.headers.set("Retry-After", String(error.retryAfterSeconds))
      }

      return response
    }

    console.error("[Portrait] Regenerate unexpected error:", error)
    return respond(
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
