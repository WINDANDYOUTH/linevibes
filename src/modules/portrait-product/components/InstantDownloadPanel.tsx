"use client"

import React from "react"

type InstantDownloadPanelProps = {
  priceLabel: string
  isLoading: boolean
  onAddToCart: () => void
}

export default function InstantDownloadPanel({
  priceLabel,
  isLoading,
  onAddToCart,
}: InstantDownloadPanelProps) {
  const downloadFeatures = [
    { icon: "PNG", text: "High-res PNG (4096 x 4096 px)" },
    { icon: "BG", text: "Transparent background" },
    { icon: "OK", text: "No watermark" },
    { icon: "NOW", text: "Instant delivery to your email" },
  ]

  return (
    <div className="animate-fade-in-up" data-testid="instant-download-panel">
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900">
          What You Get
        </h3>
        <div className="space-y-2.5">
          {downloadFeatures.map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <span className="inline-flex min-w-9 justify-center rounded-md bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-500">
                {item.icon}
              </span>
              <span className="text-sm text-gray-600">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-gray-900">
          {priceLabel || "$9"}
        </span>
        <span className="text-sm text-gray-400 line-through">$19</span>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
          SAVE 53%
        </span>
      </div>

      <button
        onClick={onAddToCart}
        disabled={isLoading}
        className="
          w-full rounded-xl bg-gradient-to-r from-linevibes-blue to-indigo-600 py-3.5
          text-sm font-semibold text-white shadow-lg shadow-linevibes-blue/20
          transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl
          hover:shadow-linevibes-blue/30 active:translate-y-0 disabled:cursor-not-allowed
          disabled:opacity-60 disabled:hover:translate-y-0
        "
        data-testid="download-add-to-cart"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
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
          "Add to Cart - Download"
        )}
      </button>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Secure checkout
        </span>
        <span>|</span>
        <span>PayPal accepted</span>
      </div>
    </div>
  )
}
