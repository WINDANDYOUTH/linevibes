"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripeLike, isPaypal, paymentInfoMap } from "@lib/constants"
import { useAnalytics } from "@lib/analytics/provider"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import PayPalCardContainer from "@modules/checkout/components/payment-container/paypal-card-container"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const { trackPaymentInfo } = useAnalytics()
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [isInitializingSession, setIsInitializingSession] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const setPaymentMethod = async (method: string) => {
    if (isInitializingSession) {
      return
    }

    setError(null)
    setSelectedPaymentMethod(method)

    const requiresSession = isStripeLike(method) || isPaypal(method)

    if (!requiresSession) {
      return
    }

    if (activeSession?.provider_id === method) {
      return
    }

    setIsInitializingSession(true)

    try {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to initialize payment session")
    } finally {
      setIsInitializingSession(false)
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const requiresSession =
        isStripeLike(selectedPaymentMethod) || isPaypal(selectedPaymentMethod)
      const hasMatchingSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (isInitializingSession) {
        setError("Payment session is still being prepared. Please wait.")
        return
      }

      if (requiresSession && !hasMatchingSession) {
        setError(
          "Payment session is not ready yet. Please wait a moment and try again."
        )
        return
      }

      if (cart?.items?.length) {
        trackPaymentInfo(
          selectedPaymentMethod || "unknown",
          cart.items.map((item: any) => ({
            id: item.variant_id || item.variant?.id || item.id,
            name: item.product_title || item.title || "Unknown Product",
            price: item.unit_price || 0,
            quantity: item.quantity || 1,
          })),
          (cart.currency_code || "USD").toUpperCase(),
          cart.total || 0
        )
      }

      return router.push(
        pathname + "?" + createQueryString("step", "review"),
        {
          scroll: false,
        }
      )
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (activeSession?.provider_id) {
      setSelectedPaymentMethod(activeSession.provider_id)
    }
  }, [activeSession?.provider_id])

  useEffect(() => {
    setError(null)
  }, [isOpen])

  const paymentActionDisabled =
    isInitializingSession ||
    (isStripeLike(selectedPaymentMethod) && !cardComplete) ||
    (!selectedPaymentMethod && !paidByGiftcard) ||
    ((isStripeLike(selectedPaymentMethod) || isPaypal(selectedPaymentMethod)) &&
      activeSession?.provider_id !== selectedPaymentMethod)

  return (
    <div className="checkout-section-wrapper">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row items-center gap-x-3 text-xl font-semibold text-black",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          <span className="checkout-section-badge flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm text-white">
            3
          </span>
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid className="text-green-600" />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-sm font-medium text-black transition-opacity hover:opacity-70"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && availablePaymentMethods?.length && (
            <>
              <div className="mb-4 flex items-center gap-2 text-sm text-black/70">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p>All transactions are secure and encrypted.</p>
              </div>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
                className="space-y-3"
              >
                {availablePaymentMethods.map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    {isStripeLike(paymentMethod.id) ? (
                      <StripeCardContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={paymentInfoMap}
                        setCardBrand={setCardBrand}
                        setError={setError}
                        setCardComplete={setCardComplete}
                      />
                    ) : isPaypal(paymentMethod.id) ? (
                      <PayPalCardContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={paymentInfoMap}
                      />
                    ) : (
                      <PaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus mb-1 text-black">
                Payment method
              </Text>
              <Text
                className="txt-medium text-black/70"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="large"
            className="mt-6 w-full bg-black text-white hover:bg-neutral-800"
            onClick={handleSubmit}
            isLoading={isLoading || isInitializingSession}
            disabled={paymentActionDisabled}
            data-testid="submit-payment-button"
          >
            {isInitializingSession
              ? "Preparing payment method..."
              : !activeSession && isStripeLike(selectedPaymentMethod)
                ? "Enter card details"
                : "Continue to review"}
          </Button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus mb-1 text-black">
                  Payment method
                </Text>
                <Text
                  className="txt-medium text-black/70"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus mb-1 text-black">
                  Payment details
                </Text>
                <div
                  className="txt-medium flex items-center gap-2 text-black/70"
                  data-testid="payment-details-summary"
                >
                  <div className="flex h-7 w-fit items-center rounded border border-black bg-white p-2">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </div>
                  <Text>
                    {isStripeLike(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : "Another step will appear"}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus mb-1 text-black">
                Payment method
              </Text>
              <Text
                className="txt-medium text-black/70"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Payment



