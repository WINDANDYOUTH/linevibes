"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"
import ExpressCheckout from "@modules/checkout/components/express-checkout"

type ExpressCheckoutWrapperProps = {
  cart: HttpTypes.StoreCart
}

const ExpressCheckoutWrapper: React.FC<ExpressCheckoutWrapperProps> = ({
  cart,
}) => {
  // Only show express checkout if cart has items
  if (!cart.items || cart.items.length === 0) {
    return null
  }

  return <ExpressCheckout cart={cart} />
}

export default ExpressCheckoutWrapper
