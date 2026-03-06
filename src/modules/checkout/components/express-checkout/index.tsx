"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { placeOrder } from "@lib/data/cart"
import { useRouter } from "next/navigation"

type ExpressCheckoutProps = {
  cart: HttpTypes.StoreCart
}

const ExpressCheckout: React.FC<ExpressCheckoutProps> = ({ cart }) => {
  const [{ isPending, isResolved }] = usePayPalScriptReducer()
  const router = useRouter()

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.provider_id.startsWith("pp_paypal") && s.status === "pending"
  )

  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const onPaymentCompleted = async () => {
    try {
      await placeOrder()
    } catch (err: any) {
      console.error("Express checkout error:", err)
    }
  }

  // Don't render if cart info is not complete or no PayPal session
  if (notReady) {
    return (
      <div className="express-checkout">
        <div className="express-checkout-header">
          <span className="express-checkout-title">Express Checkout</span>
          <div className="express-checkout-divider">
            <div className="divider-line"></div>
          </div>
        </div>
        <p className="text-sm text-gray-500 text-center py-4">
          Complete your shipping information to enable express checkout
        </p>
      </div>
    )
  }

  return (
    <div className="express-checkout">
      <div className="express-checkout-header">
        <span className="express-checkout-title">Express Checkout</span>
        <div className="express-checkout-divider">
          <div className="divider-line"></div>
        </div>
      </div>
      
      <div className="express-checkout-buttons">
        {/* PayPal Express Button */}
        {isPending ? (
          <div className="express-button-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
        ) : isResolved && session ? (
          <div className="paypal-express-button">
            <PayPalButtons
              style={{
                layout: "horizontal",
                shape: "rect",
                color: "gold",
                label: "paypal",
                height: 48,
                tagline: false,
              }}
              fundingSource="paypal"
              createOrder={async () => {
                const orderId = session?.data?.order_id as string
                if (!orderId) {
                  throw new Error("PayPal order ID not found in session")
                }
                return orderId
              }}
              onApprove={async () => {
                await onPaymentCompleted()
              }}
              onError={(err) => {
                console.error("PayPal express error:", err)
              }}
            />
          </div>
        ) : null}

        {/* Google Pay Placeholder - requires additional setup */}
        <button
          type="button"
          className="express-button google-pay-button"
          disabled
          title="Google Pay coming soon"
        >
          <img src="/payment-icons/google-pay.svg" alt="Google Pay" className="google-pay-icon" />
        </button>

        {/* Apple Pay Placeholder - requires additional setup */}
        <button
          type="button"
          className="express-button apple-pay-button"
          disabled
          title="Apple Pay coming soon"
        >
          <img src="/payment-icons/apple-pay.svg" alt="Apple Pay" className="apple-pay-icon" />
        </button>
      </div>

      <div className="express-checkout-or">
        <div className="divider-line"></div>
        <span>OR</span>
        <div className="divider-line"></div>
      </div>
    </div>
  )
}

export default ExpressCheckout
