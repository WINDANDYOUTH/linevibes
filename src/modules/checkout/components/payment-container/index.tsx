import { Radio as RadioGroupOption } from "@headlessui/react"
import { Text, clx } from "@medusajs/ui"
import React, { useContext, useMemo, type JSX } from "react"

import Radio from "@modules/common/components/radio"

import { isManual } from "@lib/constants"
import SkeletonCardDetails from "@modules/skeletons/components/skeleton-card-details"
import { CardElement } from "@stripe/react-stripe-js"
import { StripeCardElementOptions } from "@stripe/stripe-js"
import PaymentTest from "../payment-test"
import { StripeContext } from "../payment-wrapper/stripe-wrapper"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  children?: React.ReactNode
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  children,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"
  const isSelected = selectedPaymentOptionId === paymentProviderId

  return (
    <RadioGroupOption
      key={paymentProviderId}
      value={paymentProviderId}
      disabled={disabled}
      className={clx(
        "payment-method-card flex flex-col gap-y-2 cursor-pointer py-4 border-2 rounded-xl px-4 transition-all",
        {
          "border-black bg-black/[0.03]": isSelected,
          "border-black/20 hover:border-black": !isSelected,
        }
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Radio checked={isSelected} />
          <Text className="font-medium text-black">
            {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
          </Text>
          {isManual(paymentProviderId) && isDevelopment && (
            <PaymentTest className="hidden small:block" />
          )}
        </div>
        <span className="flex items-center gap-2 text-black/70">
          {paymentInfoMap[paymentProviderId]?.icon}
        </span>
      </div>
      {isManual(paymentProviderId) && isDevelopment && (
        <PaymentTest className="small:hidden text-[10px]" />
      )}
      {children}
    </RadioGroupOption>
  )
}

export default PaymentContainer

export const StripeCardContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  setCardBrand,
  setError,
  setCardComplete,
}: Omit<PaymentContainerProps, "children"> & {
  setCardBrand: (brand: string) => void
  setError: (error: string | null) => void
  setCardComplete: (complete: boolean) => void
}) => {
  const stripeReady = useContext(StripeContext)
  const isSelected = selectedPaymentOptionId === paymentProviderId

  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Inter, sans-serif",
          fontSize: "15px",
          color: "#111111",
          "::placeholder": {
            color: "#525252",
          },
        },
      },
      classes: {
        base: "mt-0 block h-12 w-full appearance-none rounded-lg border-2 border-black/20 bg-white px-4 pb-3 pt-3 transition-all duration-200 hover:border-black focus:outline-none focus:border-black",
        focus: "border-black",
      },
    }
  }, [])

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {isSelected &&
        (stripeReady ? (
          <div className="card-fields-inline mt-4 border-t border-black pt-4">
            <div className="mb-1">
              <Text className="mb-2 text-sm font-medium text-black">
                Card Information
              </Text>
              <div className="flex items-center gap-2 mb-3">
                {/* Card Brand Icons */}
                <svg className="h-5 w-auto" viewBox="0 0 48 32" fill="none">
                  <rect width="48" height="32" rx="4" fill="#F7F7F7"/>
                  <path d="M18.5 21L20.5 11H23L21 21H18.5Z" fill="#1A1F71"/>
                  <path d="M32 11L29.5 18L29 15.5L28 12C28 12 27.8 11 26.5 11H22L21.9 11.3C21.9 11.3 23.4 11.7 25 12.7L27.5 21H30.5L35 11H32Z" fill="#1A1F71"/>
                </svg>
                <svg className="h-5 w-auto" viewBox="0 0 48 32" fill="none">
                  <rect width="48" height="32" rx="4" fill="#F7F7F7"/>
                  <circle cx="19" cy="16" r="8" fill="#EB001B"/>
                  <circle cx="29" cy="16" r="8" fill="#F79E1B"/>
                  <path d="M24 9.5C26 11 27.3 13.3 27.3 16C27.3 18.7 26 21 24 22.5C22 21 20.7 18.7 20.7 16C20.7 13.3 22 11 24 9.5Z" fill="#FF5F00"/>
                </svg>
                <svg className="h-5 w-auto" viewBox="0 0 48 32" fill="none">
                  <rect width="48" height="32" rx="4" fill="#F7F7F7"/>
                  <path d="M16 12H32V20H16V12Z" fill="#006FCF"/>
                  <text x="24" y="17" fontSize="6" fill="white" textAnchor="middle">AMEX</text>
                </svg>
              </div>
            </div>
            <CardElement
              options={useOptions as StripeCardElementOptions}
              onChange={(e) => {
                setCardBrand(
                  e.brand && e.brand.charAt(0).toUpperCase() + e.brand.slice(1)
                )
                setError(e.error?.message || null)
                setCardComplete(e.complete)
              }}
            />
            <div className="mt-3 flex items-center gap-2 text-xs text-black/70">
              <svg className="h-4 w-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Your card information is encrypted and secure</span>
            </div>
          </div>
        ) : (
          <SkeletonCardDetails />
        ))}
    </PaymentContainer>
  )
}
