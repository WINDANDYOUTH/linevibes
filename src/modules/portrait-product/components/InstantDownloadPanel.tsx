"use client"

import React, { useState } from "react"

type InstantDownloadPanelProps = {
  /** Price display string from Medusa */
  priceLabel: string
  /** Whether the add-to-cart / download action is loading */
  isLoading: boolean
  /** Callback when user submits for checkout */
  onAddToCart: () => void
}

/**
 * Panel for the "Instant Download" variant.
 * Shows file format info + price + add to cart button.
 * Checkout via Medusa/PayPal (not direct download).
 */
export default function InstantDownloadPanel({
  priceLabel,
  isLoading,
  onAddToCart,
}: InstantDownloadPanelProps) {
  return (
    <div className="animate-fade-in-up" data-testid="instant-download-panel">
      {/* What you get */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
          What You Get
        </h3>
        <div className="space-y-2.5">
          {[
            { icon: "📄", text: "High-res PNG (4096 × 4096 px)" },
            { icon: "🎨", text: "Scalable SVG vector file" },
            { icon: "🚫", text: "No watermark" },
            { icon: "⚡", text: "Instant delivery to your email" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-base">{item.icon}</span>
              <span className="text-sm text-gray-600">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-3xl font-extrabold text-gray-900">
          {priceLabel || "$9"}
        </span>
        <span className="text-sm text-gray-400 line-through">$19</span>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          SAVE 53%
        </span>
      </div>

      {/* CTA Button */}
      <button
        onClick={onAddToCart}
        disabled={isLoading}
        className={`
          w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
          bg-gradient-to-r from-linevibes-blue to-indigo-600 text-white
          shadow-lg shadow-linevibes-blue/20
          hover:shadow-xl hover:shadow-linevibes-blue/30 hover:-translate-y-0.5
          active:translate-y-0
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
        `}
        data-testid="download-add-to-cart"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Adding...
          </span>
        ) : (
          "Add to Cart — Download"
        )}
      </button>

      {/* Trust signals */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Secure checkout
        </span>
        <span>•</span>
        <span>PayPal accepted</span>
      </div>
    </div>
  )
}
