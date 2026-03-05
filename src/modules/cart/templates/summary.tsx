"use client"

import { useAnalytics } from "@lib/analytics/provider"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading } from "@medusajs/ui"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import DiscountCode from "@modules/checkout/components/discount-code"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)
  const { trackCheckoutStart } = useAnalytics()

  const handleCheckoutClick = () => {
    if (!cart?.items?.length) {
      return
    }

    trackCheckoutStart(
      cart.items.map((item) => ({
        id: item.variant_id || item.variant?.id || item.id,
        name: item.product_title || item.title || "Unknown Product",
        price: item.unit_price || 0,
        quantity: item.quantity || 1,
      })),
      (cart.currency_code || "USD").toUpperCase(),
      cart.total || 0
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals totals={cart} />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
        onClick={handleCheckoutClick}
      >
        <Button className="w-full h-10">Go to checkout</Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary