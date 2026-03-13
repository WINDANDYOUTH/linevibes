import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { Resend } from "resend"
import { generatePortraitDownloadEmail } from "../utils/portrait-email-template"

type DeliveryPayload = {
  deliveryPortraitUrl: string | null
  portraitSvgUrl: string | null
}

async function resolvePortraitDelivery(
  sessionId: string
): Promise<DeliveryPayload | null> {
  const storefrontBaseUrl =
    process.env.STOREFRONT_INTERNAL_URL?.trim() ||
    process.env.NEXT_PUBLIC_BASE_URL?.trim()
  const fulfillmentSecret = process.env.PORTRAIT_FULFILLMENT_SECRET?.trim()

  if (!storefrontBaseUrl || !fulfillmentSecret) {
    return null
  }

  const response = await fetch(
    `${storefrontBaseUrl.replace(/\/$/, "")}/api/internal/portrait/delivery`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-portrait-fulfillment-secret": fulfillmentSecret,
      },
      body: JSON.stringify({ sessionId }),
    }
  )

  if (!response.ok) {
    const errorText = await response.text().catch(() => "")
    throw new Error(
      `Storefront delivery lookup failed (${response.status}): ${errorText}`
    )
  }

  const data = (await response.json()) as {
    deliveryPortraitUrl?: string | null
    portraitSvgUrl?: string | null
  }

  return {
    deliveryPortraitUrl: data.deliveryPortraitUrl ?? null,
    portraitSvgUrl: data.portraitSvgUrl ?? null,
  }
}

/**
 * Portrait Download Notification Subscriber
 *
 * When an order is placed, checks if any line items are portrait products
 * (via metadata.includes_digital_download). If so, sends a download email
 * via Resend with PNG + SVG download links.
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

  // Initialize Resend
  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || "LineVibes <noreply@linevibes.com>"

  if (!resendApiKey) {
    logger.warn("[Portrait Download] RESEND_API_KEY not configured, skipping email")
    return
  }

  const resend = new Resend(resendApiKey)

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

    if (!order.email) {
      logger.warn(
        `[Portrait Download] Order ${data.id} has no customer email, skipping delivery email`
      )
      return
    }

    const orderNumber = order.display_id ?? order.id

    // Find portrait items that include digital download
    const portraitItems = (order.items || []).filter(
      (item: any) =>
        item && item.metadata?.includes_digital_download === "true"
    )

    if (portraitItems.length === 0) {
      // Not a portrait order, nothing to do
      return
    }

    logger.info(
      `[Portrait Download] Order #${order.display_id} contains ${portraitItems.length} portrait item(s)`
    )

    // Send download email for each portrait item
    for (const item of portraitItems) {
      if (!item) {
        continue
      }

      const metadata = item.metadata || {}
      const sessionId = metadata.portrait_session_id as string | undefined
      let imageUrl = metadata.portrait_image_url as string
      let svgUrl = (metadata.portrait_svg_url as string) || null
      const variantType = (metadata.variant_type as string) || "digital"
      const style = (metadata.portrait_style as string) || "Classic"

      if (sessionId) {
        try {
          const delivery = await resolvePortraitDelivery(sessionId)

          if (delivery?.deliveryPortraitUrl) {
            imageUrl = delivery.deliveryPortraitUrl
          }

          if (delivery?.portraitSvgUrl) {
            svgUrl = delivery.portraitSvgUrl
          }
        } catch (deliveryError) {
          logger.warn(
            `[Portrait Download] Delivery lookup failed for session ${sessionId}, falling back to stored preview URL: ${deliveryError}`
          )
        }
      }

      if (!imageUrl) {
        logger.warn(
          `[Portrait Download] No image URL for item ${item.id}, skipping email`
        )
        continue
      }

      // Generate email HTML
      const html = generatePortraitDownloadEmail({
        orderNumber,
        portraitStyle: style,
        variantType,
        downloadUrlPng: imageUrl,
        downloadUrlSvg: svgUrl,
      })

      // Send via Resend
      try {
        const { data: emailResult, error } = await resend.emails.send({
          from: fromEmail,
          to: order.email,
          subject: `Your Line Portrait is Ready! (Order #${orderNumber})`,
          html,
        })

        if (error) {
          logger.error(
            `[Portrait Download] Resend error for order #${order.display_id}: ${JSON.stringify(error)}`
          )
        } else {
          logger.info(
            `[Portrait Download] Email sent for order #${order.display_id}, Resend ID: ${emailResult?.id}`
          )
        }
      } catch (emailError) {
        logger.error(
          `[Portrait Download] Failed to send email for order #${order.display_id}: ${emailError}`
        )
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
