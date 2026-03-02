"use client"

import { Radio as RadioGroupOption } from "@headlessui/react"
import { Text, clx } from "@medusajs/ui"
import { 
  PayPalCardFieldsProvider, 
  PayPalNameField, 
  PayPalNumberField, 
  PayPalExpiryField, 
  PayPalCVVField,
  usePayPalCardFields
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
        <div className="card-fields-inline">
          <Text className="text-sm font-medium text-[#6B6B6B] mb-4">
            Credit or Debit Card
          </Text>
          
          <PayPalCardFieldsProvider
            createOrder={async () => {
              // This is handled by the submit button which calls default createOrder
              // or we can wire it up if needed, but for now we rely on the session
              return "" 
            }}
            onApprove={async (data) => {
               // Capture logic
            }}
            onError={(err) => {
              console.error("Card Fields Error:", err)
            }}
          >
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="h-14 border border-[#e0e0e0] rounded-lg bg-white overflow-hidden relative group hover:border-[#c0c0c0] focus-within:border-[#1a1a1a] focus-within:ring-1 focus-within:ring-[#1a1a1a] transition-all">
                  <label className="absolute top-2 left-4 text-[10px] font-medium text-[#6b6b6b] uppercase tracking-wider">Cardholder Name</label>
                  <PayPalNameField style={style} className="h-full w-full px-4 pt-4 pb-2" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="h-14 border border-[#e0e0e0] rounded-lg bg-white overflow-hidden flex items-center relative group hover:border-[#c0c0c0] focus-within:border-[#1a1a1a] focus-within:ring-1 focus-within:ring-[#1a1a1a] transition-all">
                   <label className="absolute top-2 left-4 text-[10px] font-medium text-[#6b6b6b] uppercase tracking-wider z-10">Card Number</label>
                   <PayPalNumberField style={style} className="h-full w-full px-4 pt-4 pb-2" />
                   <div className="pr-4">
                     <svg className="h-6 w-auto opacity-70" viewBox="0 0 48 32" fill="none"><rect width="48" height="32" rx="4" fill="#F7F7F7"/><path d="M18.5 21L20.5 11H23L21 21H18.5Z" fill="#1A1F71"/><path d="M32 11L29.5 18L29 15.5L28 12C28 12 27.8 11 26.5 11H22L21.9 11.3C21.9 11.3 23.4 11.7 25 12.7L27.5 21H30.5L35 11H32Z" fill="#1A1F71"/><path d="M15.5 11L13 18.5L12.7 17L11.5 12C11.5 12 11.3 11 10 11H6L5.9 11.3C5.9 11.3 8 11.8 10 13.2L12.5 21H15.5L20 11H17L15.5 11Z" fill="#1A1F71"/></svg>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="h-14 border border-[#e0e0e0] rounded-lg bg-white overflow-hidden relative group hover:border-[#c0c0c0] focus-within:border-[#1a1a1a] focus-within:ring-1 focus-within:ring-[#1a1a1a] transition-all">
                    <label className="absolute top-2 left-4 text-[10px] font-medium text-[#6b6b6b] uppercase tracking-wider">Expiration</label>
                    <PayPalExpiryField style={style} className="h-full w-full px-4 pt-4 pb-2" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-14 border border-[#e0e0e0] rounded-lg bg-white overflow-hidden relative group hover:border-[#c0c0c0] focus-within:border-[#1a1a1a] focus-within:ring-1 focus-within:ring-[#1a1a1a] transition-all">
                    <label className="absolute top-2 left-4 text-[10px] font-medium text-[#6b6b6b] uppercase tracking-wider">CVV</label>
                    <PayPalCVVField style={style} className="h-full w-full px-4 pt-4 pb-2" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-3 text-xs text-[#6B6B6B]">
                <svg className="w-3.5 h-3.5 text-[#1d8649]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Payments processed securely by PayPal</span>
              </div>
            </div>
          </PayPalCardFieldsProvider>
        </div>
      )}
    </RadioGroupOption>
  )
}

export default PayPalCardContainer
