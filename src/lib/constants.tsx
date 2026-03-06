import React from "react"
import { CreditCard } from "@medusajs/icons"

import Ideal from "@modules/common/icons/ideal"
import Bancontact from "@modules/common/icons/bancontact"
import PayPal from "@modules/common/icons/paypal"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_stripe_stripe: {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "pp_medusa-payments_default": {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "pp_stripe-ideal_stripe": {
    title: "iDeal",
    icon: <Ideal />,
  },
  "pp_stripe-bancontact_stripe": {
    title: "Bancontact",
    icon: <Bancontact />,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <PayPal />,
  },
  "pp_paypal_paypal:card": {
    title: "Credit / Debit Card",
    icon: <CreditCard />,
  },
  "pp_paypal_paypal:paypal": {
    title: "PayPal",
    icon: <PayPal />,
  },
  pp_system_default: {
    title: "Manual Payment",
    icon: <CreditCard />,
  },
  // Add more payment providers here
}

// This only checks if it is native stripe or medusa payments for card payments, it ignores the other stripe-based providers
export const isStripeLike = (providerId?: string) => {
  return (
    providerId?.startsWith("pp_stripe_") || providerId?.startsWith("pp_medusa-")
  )
}

export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}

export const PAYPAL_CARD_OPTION_SUFFIX = ":card"
export const PAYPAL_WALLET_OPTION_SUFFIX = ":paypal"

export const getPaypalCardOptionId = (providerId: string) =>
  `${providerId}${PAYPAL_CARD_OPTION_SUFFIX}`

export const getPaypalWalletOptionId = (providerId: string) =>
  `${providerId}${PAYPAL_WALLET_OPTION_SUFFIX}`

export const isPaypalCardOption = (providerId?: string) =>
  providerId?.endsWith(PAYPAL_CARD_OPTION_SUFFIX) ?? false

export const isPaypalWalletOption = (providerId?: string) =>
  providerId?.endsWith(PAYPAL_WALLET_OPTION_SUFFIX) ?? false

export const getBasePaymentProviderId = (providerId?: string) => {
  if (!providerId) {
    return providerId
  }

  if (
    providerId.endsWith(PAYPAL_CARD_OPTION_SUFFIX) ||
    providerId.endsWith(PAYPAL_WALLET_OPTION_SUFFIX)
  ) {
    return providerId.replace(/:(card|paypal)$/, "")
  }

  return providerId
}

export const getCheckoutPaymentSelectionKey = (cartId?: string) =>
  cartId ? `checkout-payment-selection:${cartId}` : null

export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
]
