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
      "padding": "1.25rem 0 0.25rem",
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
            <div className="paypal-card-field">
              <label className="paypal-card-field__label">Cardholder Name</label>
              <PayPalNameField
                style={style}
                className="paypal-card-field__input"
              />
            </div>

            <div className="paypal-card-field">
              <label className="paypal-card-field__label">Card Number</label>
              <PayPalNumberField
                style={style}
                className="paypal-card-field__input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="paypal-card-field">
                <label className="paypal-card-field__label">Expiration</label>
                <PayPalExpiryField
                  style={style}
                  className="paypal-card-field__input"
                />
              </div>
              <div className="paypal-card-field">
                <label className="paypal-card-field__label">CVV</label>
                <PayPalCVVField
                  style={style}
                  className="paypal-card-field__input"
                />
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
