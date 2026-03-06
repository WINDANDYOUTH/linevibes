"use client"

import { isManual, isStripeLike, isPaypal } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { PayPalButtons, usePayPalCardFields, usePayPalScriptReducer } from "@paypal/react-paypal-js"
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

  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (session) => session.status === "pending"
  )

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
  const { cardFieldsForm } = usePayPalCardFields()

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.provider_id.startsWith("pp_paypal") && s.status === "pending"
  )

  const onPaymentCompleted = async () => {
    await placeOrder().catch((err) => {
      setErrorMessage(err.message)
    })
  }

  const handleCardSubmit = async () => {
    if (!cardFieldsForm) {
      return
    }

    setSubmitting(true)
    setErrorMessage(null)

    try {
      await cardFieldsForm.submit()
    } catch (err: any) {
      setSubmitting(false)
      setErrorMessage(err.message || "PayPal card payment failed")
    }
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-black bg-white py-4">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-black"></div>
        <span className="ml-3 text-black/70">Loading PayPal...</span>
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
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-black bg-white p-4">
          <p className="mb-4 text-sm text-black/70">
            Pay directly with your card here, or continue into the PayPal checkout flow.
          </p>

          <Button
            onClick={handleCardSubmit}
            isLoading={submitting}
            disabled={!cardFieldsForm || submitting}
            className="w-full bg-black text-white hover:bg-neutral-800"
          >
            Pay Now
          </Button>

          <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-black/40">
            <span className="h-px flex-1 bg-black/10" />
            <span>or</span>
            <span className="h-px flex-1 bg-black/10" />
          </div>

          <p className="mb-3 text-sm font-medium text-black">
            Proceed to PayPal
          </p>

          <div className="paypal-button-container">
            <PayPalButtons
              style={{
                layout: "vertical",
                shape: "rect",
                color: "gold",
                label: "paypal",
                height: 48,
                tagline: false,
              }}
              disabled={notReady || submitting}
              createOrder={async () => {
                const orderId = session?.data?.order_id as string
                if (!orderId) {
                  throw new Error("PayPal order ID not found in session")
                }
                return orderId
              }}
              onApprove={async (_data, actions) => {
                setSubmitting(true)
                setErrorMessage(null)

                try {
                  if (actions.order) {
                    await actions.order.capture()
                  }

                  await onPaymentCompleted()
                } catch (err: any) {
                  setErrorMessage(
                    err.message || "PayPal payment capture failed."
                  )
                } finally {
                  setSubmitting(false)
                }
              }}
              onError={(err) => {
                console.error("PayPal error:", err)
                setSubmitting(false)
                setErrorMessage("PayPal payment failed. Please try again.")
              }}
              onCancel={() => {
                setSubmitting(false)
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
        className="w-full bg-black py-4 text-base font-semibold uppercase tracking-wide text-white transition-all hover:bg-neutral-800"
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
        className="w-full bg-black py-4 text-base font-semibold uppercase tracking-wide text-white transition-all hover:bg-neutral-800"
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
