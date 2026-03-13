import "server-only"

import { HttpTypes } from "@medusajs/types"

import { getPool } from "@lib/db"
import { ensurePortraitSessionsTable } from "@lib/db/init"
import { getPortraitLineItemMetadata } from "@lib/util/portrait-line-item-metadata"

export async function getPortraitDeliveryUrlMap(
  items: HttpTypes.StoreOrderLineItem[]
): Promise<Record<string, string>> {
  const sessionIds = Array.from(
    new Set(
      items
        .map((item) =>
          getPortraitLineItemMetadata(
            item.metadata as Record<string, unknown> | undefined
          ).portraitSessionId
        )
        .filter((value): value is string => Boolean(value))
    )
  )

  if (sessionIds.length === 0) {
    return {}
  }

  await ensurePortraitSessionsTable()

  const result = await getPool().query<{
    sessionId: string
    deliveryPortraitUrl: string
  }>(
    `SELECT
       id AS "sessionId",
       delivery_portrait_url AS "deliveryPortraitUrl"
     FROM portrait_sessions
     WHERE id = ANY($1::text[])
       AND delivery_portrait_url IS NOT NULL`,
    [sessionIds]
  )

  return result.rows.reduce<Record<string, string>>((map, row) => {
    map[row.sessionId] = row.deliveryPortraitUrl
    return map
  }, {})
}
