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
            "flex flex-row text-xl font-semibold gap-x-3 items-center text-[#3D3229]",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          <span className="checkout-section-badge flex items-center justify-center w-7 h-7 rounded-full bg-[#8B4513] text-white text-sm">
            4
          </span>
          Review & Place Order
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          {/* Order Agreement */}
          <div className="bg-[#F5F0E8] rounded-xl p-4 mb-6">
            <Text className="text-sm text-[#3D3229] leading-relaxed">
              By clicking the <strong>Place Order</strong> button, you confirm that you have
              read, understand and accept our{" "}
              <LocalizedClientLink 
                href="/terms" 
                className="text-[#8B4513] hover:underline font-medium"
              >
                Terms of Service
              </LocalizedClientLink>
              ,{" "}
              <LocalizedClientLink 
                href="/refund-policy" 
                className="text-[#8B4513] hover:underline font-medium"
              >
                Returns Policy
              </LocalizedClientLink>
              {" "}and acknowledge our{" "}
              <LocalizedClientLink 
                href="/privacy-policy" 
                className="text-[#8B4513] hover:underline font-medium"
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 pt-6 border-t border-[#E8E0D4]">
            <div className="flex items-center gap-2 text-sm text-[#6B5B4F]">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6B5B4F]">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Encrypted Payment</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6B5B4F]">
              <svg className="w-5 h-5 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
