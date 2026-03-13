/**
 * GET /api/portrait/my-portraits
 *
 * Returns all portrait sessions belonging to the currently logged-in customer.
 * Requires authentication (Medusa JWT cookie).
 */
import { NextResponse } from "next/server"
import { getPool } from "@lib/db"
import { ensurePortraitSessionsTable } from "@lib/db/init"
import { getCustomerIdFromRequest } from "@lib/auth/api-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const customerId = await getCustomerIdFromRequest()

    if (!customerId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
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
         created_at AS "createdAt",
         expires_at AS "expiresAt"
       FROM portrait_sessions
       WHERE customer_id = $1
         AND status IN ('completed', 'generating')
         AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 50`,
      [customerId]
    )

    return NextResponse.json({
      portraits: result.rows,
      count: result.rows.length,
    })
  } catch (error: any) {
    console.error("[My Portraits] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
