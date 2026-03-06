"use client"

import { Heading, Text, clx } from "@medusajs/ui"
import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="checkout-section-wrapper">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row items-center gap-x-3 text-xl font-semibold text-black",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          <span className="checkout-section-badge flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm text-white">
            4
          </span>
          Review & Place Order
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          {/* Order Agreement */}
          <div className="mb-6 rounded-xl border border-black bg-white p-4">
            <Text className="text-sm leading-relaxed text-black">
              By clicking the <strong>Place Order</strong> button, you confirm that you have
              read, understand and accept our{" "}
              <LocalizedClientLink 
                href="/terms" 
                className="font-medium text-black underline-offset-2 hover:underline"
              >
                Terms of Service
              </LocalizedClientLink>
              ,{" "}
              <LocalizedClientLink 
                href="/returns" 
                className="font-medium text-black underline-offset-2 hover:underline"
              >
                Returns Policy
              </LocalizedClientLink>
              {" "}and acknowledge our{" "}
              <LocalizedClientLink 
                href="/privacy" 
                className="font-medium text-black underline-offset-2 hover:underline"
              >
                Privacy Policy
              </LocalizedClientLink>
              .
            </Text>
          </div>

          {/* Payment Button */}
          <div className="payment-button-wrapper">
            <PaymentButton cart={cart} data-testid="submit-order-button" />
          </div>

          {/* Security & Trust */}
          <div className="mt-6 flex flex-col items-center justify-center gap-4 border-t border-black pt-6 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-black/70">
              <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-black/70">
              <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Encrypted Payment</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-black/70">
              <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>30-Day Returns</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Review
