"use client"

import { PayPalCardFieldsProvider, PayPalScriptProvider } from "@paypal/react-paypal-js"
import React from "react"
import { HttpTypes } from "@medusajs/types"
import { placeOrder } from "@lib/data/cart"

type PayPalWrapperProps = {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

export const PayPalScriptWrapper: React.FC<PayPalWrapperProps> = ({
  cart,
  children,
}) => {
  if (!paypalClientId) {
    console.warn("PayPal client ID is not configured")
    return <>{children}</>
  }

  const session = cart.payment_collection?.payment_sessions?.find(
    (paymentSession) =>
      paymentSession.provider_id.startsWith("pp_paypal") &&
      paymentSession.status === "pending"
  )

  const intent = String(session?.data?.intent || "capture").toLowerCase()
  const currency = (cart.currency_code || "USD").toUpperCase()

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        currency,
        intent,
        components: "buttons,card-fields",
        dataPartnerAttributionId: "LineVibes_SP",
      }}
    >
      {children}
    </PayPalScriptProvider>
  )
}

const PayPalWrapper: React.FC<PayPalWrapperProps> = ({ cart, children }) => {
  const session = cart.payment_collection?.payment_sessions?.find(
    (paymentSession) =>
      paymentSession.provider_id.startsWith("pp_paypal") &&
      paymentSession.status === "pending"
  )

  const orderId = session?.data?.order_id as string | undefined

  if (!orderId) {
    return <>{children}</>
  }

  return (
    <PayPalCardFieldsProvider
      createOrder={async () => orderId}
      onApprove={async () => {
        await placeOrder()
      }}
      onError={(err) => {
        console.error("PayPal Card Fields Error:", err)
      }}
    >
      {children}
    </PayPalCardFieldsProvider>
  )
}

export default PayPalWrapper
