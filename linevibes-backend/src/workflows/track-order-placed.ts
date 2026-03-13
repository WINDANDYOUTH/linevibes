import { 
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { trackEventStep } from "./steps/track-event"

type WorkflowInput = {
  id: string
}

type OrderPlacedAnalyticsPayload = {
  orderId: string
  email: string | null
  total: number
  currency: string
  items: Array<{
    id: string | null
    title: string | null
    quantity: number | null
    unit_price: number | null
  }>
  customer: {
    id: string | null
    email: string | null
    firstName: string | null
    lastName: string | null
  }
  timestamp: Date | string | null
}

function buildOrderPlacedPayload(order: any): OrderPlacedAnalyticsPayload {
  return {
    orderId: order?.id ?? "",
    email: order?.email ?? null,
    total: Number(order?.total ?? 0),
    currency: order?.currency_code ?? "",
    items: Array.isArray(order?.items)
      ? order.items.map((item: any) => ({
          id: item?.id ?? null,
          title: item?.title ?? null,
          quantity:
            typeof item?.quantity === "number" ? item.quantity : null,
          unit_price:
            typeof item?.unit_price === "number" ? item.unit_price : null,
        }))
      : [],
    customer: {
      id: order?.customer?.id ?? null,
      email: order?.customer?.email ?? null,
      firstName: order?.customer?.first_name ?? null,
      lastName: order?.customer?.last_name ?? null,
    },
    timestamp: order?.created_at ?? null,
  }
}

export const trackOrderPlacedWorkflow = createWorkflow(
  "track-order-placed",
  ({ id }: WorkflowInput) => {
    const { data: orders } = useQueryGraphStep({
      entity: "order",
      fields: [
        "id",
        "email",
        "total",
        "currency_code",
        "items.id",
        "items.title",
        "items.quantity",
        "items.unit_price",
        "customer.id",
        "customer.email",
        "customer.first_name",
        "customer.last_name",
        "created_at",
      ],
      filters: {
        id,
      },
    })
    const firstOrder = orders[0] as any

    const order = transform({
      order: firstOrder,
    }, ({ order }) => buildOrderPlacedPayload(order))

    trackEventStep({
      event: "order.placed",
      userId: order.customer?.id ?? undefined,
      properties: order,
    })
  }
)
