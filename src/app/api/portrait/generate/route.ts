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

import { generateStylePortrait } from "@lib/ai/generate-style-portrait"
import { getCustomerIdFromRequest } from "@lib/auth/api-auth"
import {
  generateLinePortrait,
  type PortraitStyle,
} from "@lib/ai/generate-portrait"
import { listProducts } from "@lib/data/products"
import { getPool } from "@lib/db"
import { ensurePortraitSessionsTable } from "@lib/db/init"
import {
  acquirePortraitActorLock,
  applyPortraitOwnerCookie,
  assertPortraitGenerationAllowed,
  getPortraitOwnerContext,
  isPortraitGuardError,
  recordPortraitGenerationEvent,
} from "@lib/portrait/anti-abuse"
import { buildStylePortraitAssetBundle } from "@lib/portrait/delivery-assets"
import { getPortraitStyleTemplate } from "@lib/portrait/style-template"
import { portraitKey, uploadToR2 } from "@lib/r2"

export const maxDuration = 120
export const dynamic = "force-dynamic"

function validatePhotoFile(file: File | null, label = "photo") {
  if (!file) {
    throw new Error(`No ${label} file provided`)
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid ${label} file type. Please upload JPG, PNG, or WebP.`)
  }

  if (file.size > 15 * 1024 * 1024) {
    throw new Error(`${label} file too large. Maximum size is 15MB.`)
  }
}

async function resolveStyleTemplate(
  templateHandle: string,
  countryCode: string
) {
  const { response } = await listProducts({
    countryCode,
    queryParams: { handle: templateHandle, limit: 1 },
  })

  const product = response.products[0]

  if (!product) {
    return null
  }

  const template = getPortraitStyleTemplate(product)

  if (!template) {
    return null
  }

  return {
    product,
    template,
  }
}

function buffersMatch(left: Buffer, right: Buffer) {
  if (left.length !== right.length) {
    return false
  }

  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return false
    }
  }

  return true
}

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
  let sessionCreated = false

  try {
    const formData = await request.formData()
    const file = formData.get("photo") as File | null
    const originalPhoto = formData.get("originalPhoto") as File | null
    const style = (formData.get("style") as PortraitStyle) || "classic"
    const templateHandle =
      (formData.get("templateHandle") as string | null)?.trim() || null
    const countryCode =
      (formData.get("countryCode") as string | null)?.trim() || "us"

    try {
      validatePhotoFile(file)
      if (originalPhoto) {
        validatePhotoFile(originalPhoto, "original photo")
      }
    } catch (validationError) {
      return respond(
        {
          error:
            validationError instanceof Error
              ? validationError.message
              : "Invalid upload.",
        },
        { status: 400 }
      )
    }

    const resolvedTemplate = templateHandle
      ? await resolveStyleTemplate(templateHandle, countryCode)
      : null

    if (templateHandle && !resolvedTemplate) {
      return respond(
        { error: "Style template not found for this product." },
        { status: 404 }
      )
    }

    const sessionStyle = resolvedTemplate
      ? resolvedTemplate.template.templateId
      : style

    await ensurePortraitSessionsTable()
    const pool = getPool()
    const client = await pool.connect()

    sessionId = nanoid(16)

    try {
      await client.query("BEGIN")
      await acquirePortraitActorLock(client, owner, sessionId)
      await assertPortraitGenerationAllowed(client, owner)

      await client.query(
        `INSERT INTO portrait_sessions (
           id,
           status,
           style,
           template_id,
           template_handle,
           template_group,
           template_family,
           reference_image_url,
           prompt_version,
           customer_id,
           anonymous_owner_token,
           request_ip,
           request_user_agent
         ) VALUES ($1, 'generating', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          sessionId,
          sessionStyle,
          resolvedTemplate?.template.templateId ?? null,
          resolvedTemplate?.template.handle ?? null,
          resolvedTemplate?.template.group ?? null,
          resolvedTemplate?.template.family ?? null,
          resolvedTemplate?.template.referenceImageUrl ?? null,
          resolvedTemplate ? "style-template-v1" : "line-portrait-v1",
          customerId,
          owner.anonymousOwnerToken,
          owner.requestIp,
          owner.userAgent,
        ]
      )

      await recordPortraitGenerationEvent(client, {
        action: "generate",
        owner,
        sessionId,
      })

      await client.query("COMMIT")
      sessionCreated = true
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined)
      throw error
    } finally {
      client.release()
    }

    console.log(
      `[Portrait] Session created: ${sessionId} (style: ${sessionStyle}, template: ${
        resolvedTemplate?.template.handle ?? "none"
      }, customer: ${customerId || "anonymous"})`
    )

    const generationFile = file as File
    const originalFile = originalPhoto ?? generationFile
    const [generationBuffer, originalBuffer] = await Promise.all([
      generationFile.arrayBuffer(),
      originalFile.arrayBuffer(),
    ])

    const generationInputBuffer = Buffer.from(generationBuffer)
    const originalInputBuffer = Buffer.from(originalBuffer)
    const originalExt = originalFile.type.split("/")[1] || "jpg"
    const generationExt = generationFile.type.split("/")[1] || "jpg"
    const originalKey = portraitKey(sessionId, `original.${originalExt}`)
    const originalUrl = await uploadToR2(
      originalKey,
      originalInputBuffer,
      originalFile.type
    )

    let croppedUrl = originalUrl
    const hasDistinctCroppedInput =
      !!originalPhoto &&
      (generationFile.type !== originalFile.type ||
        !buffersMatch(generationInputBuffer, originalInputBuffer))

    if (hasDistinctCroppedInput) {
      const croppedKey = portraitKey(sessionId, `cropped.${generationExt}`)
      croppedUrl = await uploadToR2(
        croppedKey,
        generationInputBuffer,
        generationFile.type
      )
    }

    console.log(
      `[Portrait] Source images uploaded: original=${originalUrl}, cropped=${croppedUrl}`
    )

    await pool.query(
      `UPDATE portrait_sessions
       SET original_url = $1,
           cropped_url = $2,
           updated_at = NOW()
       WHERE id = $3`,
      [originalUrl, croppedUrl, sessionId]
    )

    let portraitUrl: string
    let deliveryPortraitUrl: string
    let provider: string
    let model: string

    try {
      const result = resolvedTemplate
        ? await generateStylePortrait(
            generationInputBuffer,
            generationFile.type,
            resolvedTemplate.template,
            croppedUrl
          )
        : await generateLinePortrait(
            generationInputBuffer,
            generationFile.type,
            style,
            croppedUrl
          )
      provider = result.provider
      model = result.model

      if (resolvedTemplate) {
        const assets = await buildStylePortraitAssetBundle(
          result.buffer,
          resolvedTemplate.template.aspectRatio
        )
        const previewR2Key = portraitKey(sessionId, "preview.png")
        const deliveryR2Key = portraitKey(
          sessionId,
          `delivery-${nanoid(24)}.png`
        )

        const [previewUrl, deliveryUrl] = await Promise.all([
          uploadToR2(previewR2Key, assets.previewBuffer, "image/png"),
          uploadToR2(deliveryR2Key, assets.deliveryBuffer, "image/png"),
        ])

        portraitUrl = previewUrl
        deliveryPortraitUrl = deliveryUrl
      } else {
        const portraitR2Key = portraitKey(sessionId, "portrait.png")
        portraitUrl = await uploadToR2(portraitR2Key, result.buffer, "image/png")
        deliveryPortraitUrl = portraitUrl
      }

      console.log(
        `[Portrait] Portrait assets uploaded to R2: preview=${portraitUrl}, delivery=${deliveryPortraitUrl} (${provider}:${model})`
      )

      await pool.query(
        `UPDATE portrait_sessions
         SET status = 'completed',
             portrait_url = $1,
             delivery_portrait_url = $2,
             portrait_svg_url = NULL,
             thumbnail_url = $1,
             updated_at = NOW()
         WHERE id = $3`,
        [portraitUrl, deliveryPortraitUrl, sessionId]
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

      return respond(
        {
          error: "Portrait generation failed. Please try again.",
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
      originalUrl,
      croppedUrl,
      style: sessionStyle,
      templateHandle: resolvedTemplate?.template.handle ?? null,
      templateGroup: resolvedTemplate?.template.group ?? null,
      provider,
      model,
      status: "completed",
    })
  } catch (error: any) {
    if (sessionCreated && sessionId) {
      try {
        const pool = getPool()
        await pool.query(
          `UPDATE portrait_sessions
           SET status = 'failed',
               error_message = $1,
               updated_at = NOW()
           WHERE id = $2`,
          [error instanceof Error ? error.message : "Unknown error", sessionId]
        )
      } catch (updateError) {
        console.error(
          `[Portrait] Failed to mark session ${sessionId} as failed:`,
          updateError
        )
      }
    }

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

    console.error("[Portrait] Unexpected error:", error)
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
