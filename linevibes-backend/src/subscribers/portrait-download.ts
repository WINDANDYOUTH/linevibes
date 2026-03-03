import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * Portrait Download Notification Subscriber
 *
 * When an order is placed, checks if any line items are portrait products
 * (via metadata.includes_digital_download). If so, logs the download info
 * and (in production) would send a download email.
 *
 * All portrait variants (Digital, Print, Canvas) include digital download,
 * so this triggers for ANY portrait order.
 */
export default async function portraitDownloadHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  try {
    // Fetch the order with line items and their metadata
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "email",
        "display_id",
        "items.*",
        "items.metadata",
      ],
      filters: {
        id: data.id,
      },
    })

    const order = orders[0]
    if (!order) {
      logger.warn(`[Portrait Download] Order not found: ${data.id}`)
      return
    }

    // Find portrait items that include digital download
    const portraitItems = (order.items || []).filter(
      (item: any) => item.metadata?.includes_digital_download === "true"
    )

    if (portraitItems.length === 0) {
      // Not a portrait order, nothing to do
      return
    }

    logger.info(
      `[Portrait Download] Order #${order.display_id} contains ${portraitItems.length} portrait item(s)`
    )

    // Process each portrait item
    for (const item of portraitItems) {
      const metadata = item.metadata || {}
      const sessionId = metadata.portrait_session_id
      const imageUrl = metadata.portrait_image_url
      const variantType = metadata.variant_type
      const style = metadata.portrait_style

      logger.info(
        `[Portrait Download] Processing: session=${sessionId}, type=${variantType}, style=${style}`
      )

      if (imageUrl) {
        logger.info(
          `[Portrait Download] Download URL: ${imageUrl}`
        )

        // ──────────────────────────────────────────────────
        // TODO: Send download email
        //
        // When you add an email service (e.g., SendGrid, Resend,
        // or Medusa's notification module), replace this with:
        //
        // await sendEmail({
        //   to: order.email,
        //   subject: "Your Line Portrait Download is Ready!",
        //   template: "portrait-download",
        //   data: {
        //     downloadUrlPng: imageUrl,
        //     downloadUrlSvg: imageUrl.replace(/\.png$/i, ".svg"),
        //     orderNumber: order.display_id,
        //     portraitStyle: style,
        //     variantType: variantType,
        //   },
        // })
        //
        // ──────────────────────────────────────────────────
      }
    }

    logger.info(
      `[Portrait Download] Completed processing for order #${order.display_id}`
    )
  } catch (error) {
    logger.error(
      `[Portrait Download] Error processing order ${data.id}: ${error}`
    )
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
