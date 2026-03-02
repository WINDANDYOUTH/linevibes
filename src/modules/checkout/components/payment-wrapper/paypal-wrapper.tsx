import { PayPalScriptProvider, PayPalCardFieldsProvider } from "@paypal/react-paypal-js"
import React from "react"
import { HttpTypes } from "@medusajs/types"
import { placeOrder } from "@lib/data/cart"

type PayPalWrapperProps = {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

const PayPalWrapper: React.FC<PayPalWrapperProps> = ({ cart, children }) => {
  if (!paypalClientId) {
    console.warn("PayPal client ID is not configured")
    return <>{children}</>
  }

  const session = cart?.payment_collection?.payment_sessions?.find(
    (s) => s.provider_id.startsWith("pp_paypal") && s.status === "pending"
  )

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        currency: "USD",
        intent: "capture",
        components: "buttons,card-fields",
        dataPartnerAttributionId: "BetterKnitwear_SP",
        disableFunding: "credit,paylater",
      }}
    >
      <PayPalCardFieldsProvider
        createOrder={async () => {
          return session?.data?.order_id as string || ""
        }}
        onApprove={async () => {
          await placeOrder()
        }}
        onError={(err) => {
          console.error("PayPal Card Fields Error:", err)
        }}
      >
        {children}
      </PayPalCardFieldsProvider>
    </PayPalScriptProvider>
  )
}

export default PayPalWrapper
