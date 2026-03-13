import { NextRequest, NextResponse } from "next/server"

import { getPool } from "@lib/db"
import { ensurePortraitSessionsTable } from "@lib/db/init"

export const dynamic = "force-dynamic"

function isAuthorized(request: NextRequest) {
  const secret = process.env.PORTRAIT_FULFILLMENT_SECRET?.trim()
  const header = request.headers.get("x-portrait-fulfillment-secret")?.trim()

  if (!secret) {
    return {
      ok: false,
      status: 500,
      error: "PORTRAIT_FULFILLMENT_SECRET is not configured",
    }
  }

  if (!header || header !== secret) {
    return {
      ok: false,
      status: 401,
      error: "Unauthorized",
    }
  }

  return { ok: true as const }
}

export async function POST(request: NextRequest) {
  const authorization = isAuthorized(request)
  if (!authorization.ok) {
    return NextResponse.json(
      { error: authorization.error },
      { status: authorization.status }
    )
  }

  try {
    const body = await request.json().catch(() => null)
    const sessionId =
      body && typeof body === "object" && "sessionId" in body
        ? String(body.sessionId || "").trim()
        : ""

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      )
    }

    await ensurePortraitSessionsTable()

    const result = await getPool().query(
      `SELECT
         id AS "sessionId",
         portrait_url AS "previewPortraitUrl",
         delivery_portrait_url AS "deliveryPortraitUrl",
         portrait_svg_url AS "portraitSvgUrl"
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
    const deliveryPortraitUrl =
      session.deliveryPortraitUrl || session.previewPortraitUrl || null

    if (!deliveryPortraitUrl) {
      return NextResponse.json(
        { error: "Delivery asset is not ready" },
        { status: 409 }
      )
    }

    return NextResponse.json({
      sessionId: session.sessionId,
      previewPortraitUrl: session.previewPortraitUrl,
      deliveryPortraitUrl,
      portraitSvgUrl: session.portraitSvgUrl,
    })
  } catch (error) {
    console.error("[Portrait Delivery] Internal API error:", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
