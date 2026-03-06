"use client"

import { Radio as RadioGroupOption } from "@headlessui/react"
import { Text, clx } from "@medusajs/ui"
import { 
  PayPalNameField, 
  PayPalNumberField, 
  PayPalExpiryField, 
  PayPalCVVField
} from "@paypal/react-paypal-js"
import React, { type JSX } from "react"
import Radio from "@modules/common/components/radio"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  children?: React.ReactNode
}

const PayPalCardContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
}) => {
  const isSelected = selectedPaymentOptionId === paymentProviderId

  const style = {
    input: {
      color: "#1a1a1a",
      "font-family": "Inter, sans-serif",
      "font-size": "15px",
      "padding": "0.5rem 0",
    },
    ".valid": { color: "#1d8649" },
    ".invalid": { color: "#d32f2f" },
  }

  return (
    <RadioGroupOption
      key={paymentProviderId}
      value={paymentProviderId}
      disabled={disabled}
      className={clx(
        "payment-method-card flex flex-col gap-y-2 cursor-pointer transition-all",
        {
          "selected": isSelected,
        }
      )}
    >
      <div className="payment-method-header">
        <div className="payment-method-info">
          <Radio checked={isSelected} />
          <Text className="payment-method-text">
            {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
          </Text>
        </div>
        <span className="payment-method-icons">
          {paymentInfoMap[paymentProviderId]?.icon}
        </span>
      </div>

      {isSelected && (
        <div className="card-fields-inline mt-4 border-t border-black pt-4">
          <Text className="mb-4 text-sm font-medium text-black">
            Credit or Debit Card
          </Text>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="relative h-14 overflow-hidden rounded-lg border border-black bg-white transition-all focus-within:ring-1 focus-within:ring-black">
                <label className="absolute left-4 top-2 text-[10px] font-medium uppercase tracking-wider text-black/60">Cardholder Name</label>
                <PayPalNameField style={style} className="h-full w-full px-4 pb-2 pt-4" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="relative flex h-14 items-center overflow-hidden rounded-lg border border-black bg-white transition-all focus-within:ring-1 focus-within:ring-black">
                <label className="absolute left-4 top-2 z-10 text-[10px] font-medium uppercase tracking-wider text-black/60">Card Number</label>
                <PayPalNumberField style={style} className="h-full w-full px-4 pb-2 pt-4" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <div className="relative h-14 overflow-hidden rounded-lg border border-black bg-white transition-all focus-within:ring-1 focus-within:ring-black">
                  <label className="absolute left-4 top-2 text-[10px] font-medium uppercase tracking-wider text-black/60">Expiration</label>
                  <PayPalExpiryField style={style} className="h-full w-full px-4 pb-2 pt-4" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="relative h-14 overflow-hidden rounded-lg border border-black bg-white transition-all focus-within:ring-1 focus-within:ring-black">
                  <label className="absolute left-4 top-2 text-[10px] font-medium uppercase tracking-wider text-black/60">CVV</label>
                  <PayPalCVVField style={style} className="h-full w-full px-4 pb-2 pt-4" />
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-black/60">
              <svg className="h-3.5 w-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Payments processed securely by PayPal</span>
            </div>
          </div>
        </div>
      )}
    </RadioGroupOption>
  )
}

export default PayPalCardContainer
