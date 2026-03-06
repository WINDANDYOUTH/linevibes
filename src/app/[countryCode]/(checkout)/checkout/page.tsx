import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import ExpressCheckoutWrapper from "@modules/checkout/templates/express-checkout-wrapper"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import "../../../../styles/checkout.css"

export const metadata: Metadata = {
  title: "Checkout | LineVibes",
  description: "Complete your LineVibes order",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Express Checkout Section */}
        <ExpressCheckoutWrapper cart={cart} />

        {/* Main Checkout Content */}
        <div className="checkout-content">
          {/* Left Column - Checkout Form */}
          <div className="checkout-form-section">
            <PaymentWrapper cart={cart}>
              <CheckoutForm cart={cart} customer={customer} />
            </PaymentWrapper>
          </div>

          {/* Right Column - Order Summary */}
          <CheckoutSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}
