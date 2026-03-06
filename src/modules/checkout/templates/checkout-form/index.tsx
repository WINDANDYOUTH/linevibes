import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div className="checkout-form-card">
      <div className="checkout-form-inner space-y-10 lg:space-y-12">
        {/* Contact & Shipping Address */}
        <div className="checkout-section" data-section="address">
          <Addresses cart={cart} customer={customer} />
        </div>

        {/* Shipping Method */}
        <div className="checkout-section" data-section="shipping">
          <Shipping cart={cart} availableShippingMethods={shippingMethods} />
        </div>

        {/* Payment Method */}
        <div className="checkout-section" data-section="payment">
          <Payment cart={cart} availablePaymentMethods={paymentMethods} />
        </div>

        {/* Review & Complete Order */}
        <div className="checkout-section" data-section="review">
          <Review cart={cart} />
        </div>
      </div>
    </div>
  )
}
