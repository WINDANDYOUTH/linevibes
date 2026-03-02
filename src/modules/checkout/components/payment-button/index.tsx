"use client"

import { isManual, isStripeLike, isPaypal } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { PayPalButtons, usePayPalScriptReducer, usePayPalCardFields } from "@paypal/react-paypal-js"
import React, { useState } from "react"
import ErrorMessage from "../error-message"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isPaypal(paymentSession?.provider_id):
      return (
        <PayPalPaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    default:
      return (
        <Button 
          disabled 
          className="w-full bg-gray-300 text-gray-500"
        >
          Select a payment method
        </Button>
      )
  }
}

const PayPalPaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [{ isPending }] = usePayPalScriptReducer()
  const { cardFieldsForm, fields } = usePayPalCardFields()

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const onPaymentCompleted = async () => {
    await placeOrder().catch((err) => {
      setErrorMessage(err.message)
    })
  }

  const handleCardSubmit = async () => {
    if (!cardFieldsForm) return
    
    setSubmitting(true)
    setErrorMessage(null)
    
    try {
      await cardFieldsForm.submit()
      // onApprove in wrapper will handle placeOrder
      // But we can also do it here if needed, but wrapper is cleaner
    } catch (err: any) {
      setErrorMessage(err.message || "Payment compilation failed")
      setSubmitting(false)
    }
  }

  const isCardValid = 
    // fields?.NameField?.isValid &&
    // fields?.NumberField?.isValid &&
    // fields?.ExpiryField?.isValid &&
    // fields?.CVVField?.isValid
    false

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-4 bg-[#F5F0E8] rounded-lg">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#8B4513]"></div>
        <span className="ml-3 text-[#6B5B4F]">Loading PayPal...</span>
      </div>
    )
  }

  if (notReady) {
    return (
      <Button 
        disabled 
        data-testid={dataTestId}
        className="w-full bg-gray-300 text-gray-500"
      >
        Complete checkout information first
      </Button>
    )
  }

  return (
    <>
      {/* If Card Fields are used/valid, show explicit Pay button */}
      <div className="flex flex-col gap-4">
        {isCardValid && (
           <Button
            onClick={handleCardSubmit}
            isLoading={submitting}
            disabled={submitting}
            className="w-full bg-gradient-to-r from-[#8B4513] to-[#D2691E] hover:from-[#A0522D] hover:to-[#E07020] text-white font-semibold py-4 text-base uppercase tracking-wide shadow-lg hover:shadow-xl transition-all"
          >
            Pay with Card
          </Button>
        )}

        <div className={isCardValid ? "opacity-50 pointer-events-none" : ""}>
            <div className="relative mb-4 text-center">
               <div className="absolute inset-0 flex items-center" aria-hidden="true">
                 <div className="w-full border-t border-gray-300" />
               </div>
               <div className="relative flex justify-center">
                 <span className="bg-[#FDFBF7] px-2 text-sm text-gray-500">Or pay with PayPal</span>
               </div>
            </div>

            <div className="paypal-button-container">
              <PayPalButtons
                style={{
                  layout: "vertical",
                  shape: "rect",
                  color: "gold",
                  label: "pay",
                  height: 48,
                }}
                disabled={notReady || submitting}
                createOrder={async () => {
                  const orderId = session?.data?.order_id as string
                  if (!orderId) {
                    throw new Error("PayPal order ID not found in session")
                  }
                  return orderId
                }}
                onApprove={async (data) => {
                  await onPaymentCompleted()
                }}
                onError={(err) => {
                  console.error("PayPal error:", err)
                  setErrorMessage("PayPal payment failed. Please try again.")
                }}
                onCancel={() => {
                  setErrorMessage("Payment was cancelled.")
                }}
              />
            </div>
        </div>
      </div>
      <ErrorMessage
        error={errorMessage}
        data-testid="paypal-payment-error-message"
      />
    </>
  )
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
        className="w-full bg-gradient-to-r from-[#8B4513] to-[#D2691E] hover:from-[#A0522D] hover:to-[#E07020] text-white font-semibold py-4 text-base uppercase tracking-wide shadow-lg hover:shadow-xl transition-all"
      >
        Place Order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
        className="w-full bg-gradient-to-r from-[#8B4513] to-[#D2691E] hover:from-[#A0522D] hover:to-[#E07020] text-white font-semibold py-4 text-base uppercase tracking-wide shadow-lg hover:shadow-xl transition-all"
      >
        Place Order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
