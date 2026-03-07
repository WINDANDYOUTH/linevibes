"use client"

import { HttpTypes } from "@medusajs/types"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import { convertToLocale } from "@lib/util/money"
import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`checkout-summary ${!isExpanded ? 'collapsed' : ''}`}>
      {/* Header with toggle for mobile */}
      <div 
        className="checkout-summary-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="checkout-summary-title">
          Order Summary
        </h2>
        <div className="checkout-summary-toggle">
          <span>
            {convertToLocale({
              amount: cart.total ?? 0,
              currency_code: cart.currency_code,
            })}
          </span>
          <svg 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Cart Items */}
      <div className="checkout-items">
        {cart.items && cart.items.length > 0 ? (
          cart.items.map((item) => (
            <div key={item.id} className="checkout-item">
              <div className="checkout-item-image">
                {item.thumbnail && (
                  <img 
                    src={item.thumbnail} 
                    alt={item.product_title || "Product"} 
                  />
                )}
                <span className="checkout-item-quantity">
                  {item.quantity}
                </span>
              </div>
              <div className="checkout-item-details">
                <p className="checkout-item-name">
                  {item.product_title}
                </p>
                <p className="checkout-item-variant">
                  {item.variant_title}
                </p>
              </div>
              <p className="checkout-item-price">
                {convertToLocale({
                  amount: item.subtotal ?? 0,
                  currency_code: cart.currency_code,
                })}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Your cart is empty</p>
        )}
      </div>

      {/* Discount Code */}
      <div className="checkout-discount">
        <DiscountCode cart={cart} />
      </div>

      {/* Totals */}
      <div className="checkout-totals">
        <div className="checkout-totals-row">
          <span>Subtotal ({cart.items?.length || 0} items)</span>
          <span>
            {convertToLocale({
              amount: cart.subtotal ?? 0,
              currency_code: cart.currency_code,
            })}
          </span>
        </div>
        
        {!!cart.discount_total && cart.discount_total > 0 && (
          <div className="checkout-totals-row savings">
            <span>Discount</span>
            <span>
              -{convertToLocale({
                amount: cart.discount_total,
                currency_code: cart.currency_code,
              })}
            </span>
          </div>
        )}

        <div className="checkout-totals-row">
          <span>Shipping</span>
          <span>
            {cart.shipping_total && cart.shipping_total > 0
              ? convertToLocale({
                  amount: cart.shipping_total,
                  currency_code: cart.currency_code,
                })
              : "Calculated at next step"}
          </span>
        </div>

        {!!cart.tax_total && cart.tax_total > 0 && (
          <div className="checkout-totals-row">
            <span>Tax</span>
            <span>
              {convertToLocale({
                amount: cart.tax_total,
                currency_code: cart.currency_code,
              })}
            </span>
          </div>
        )}

        <div className="checkout-totals-row total">
          <span>Total</span>
          <span>
            {convertToLocale({
              amount: cart.total ?? 0,
              currency_code: cart.currency_code,
            })}
          </span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="checkout-trust">
        <div className="checkout-trust-item">
          <svg className="checkout-trust-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Secure Checkout</span>
        </div>
        <div className="checkout-trust-item">
          <svg className="checkout-trust-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Fast Delivery</span>
        </div>
      </div>

      {/* 30-Day Guarantee */}
      <div className="checkout-guarantee">
        <svg className="checkout-guarantee-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="checkout-guarantee-title">30-Day Quality Guarantee</p>
          <p className="checkout-guarantee-text">
            If something is wrong with your LineVibes order, contact support within 30 days for help.
          </p>
        </div>
      </div>

      {/* Security Note */}
      <div className="checkout-security">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>All transactions are secure and encrypted</span>
      </div>
    </div>
  )
}

export default CheckoutSummary
