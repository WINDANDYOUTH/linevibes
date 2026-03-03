"use client"

import React from "react"
import {
  PRINT_HIGHLIGHTS,
  PRINT_SIZES,
  PRINT_COLORS,
  type SizeOption,
  type ColorOption,
} from "../data/portrait-data"

type OrderPrintPanelProps = {
  /** Currently selected size */
  selectedSize: string
  /** Currently selected color */
  selectedColor: string
  /** Callbacks */
  onSizeChange: (sizeId: string) => void
  onColorChange: (colorId: string) => void
  /** Price display string */
  priceLabel: string
  /** Loading state */
  isLoading: boolean
  /** Add to cart callback */
  onAddToCart: () => void
}

/**
 * Panel for the "Order Print" variant.
 * Shows print highlights, size selector, color selector, and CTA.
 */
export default function OrderPrintPanel({
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
  priceLabel,
  isLoading,
  onAddToCart,
}: OrderPrintPanelProps) {
  return (
    <div className="animate-fade-in-up" data-testid="order-print-panel">
      {/* Highlights */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
          Print Quality
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {PRINT_HIGHLIGHTS.map((hl, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50/80 border border-gray-100"
            >
              <span className="text-lg flex-shrink-0 mt-0.5">{hl.icon}</span>
              <div>
                <p className="text-xs font-semibold text-gray-900 leading-tight">
                  {hl.title}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                  {hl.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Size selector */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-2.5 uppercase tracking-wider">
          Size
        </h3>
        <div className="flex gap-2">
          {PRINT_SIZES.map((size) => (
            <button
              key={size.id}
              onClick={() => onSizeChange(size.id)}
              className={`
                flex-1 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-200
                ${
                  selectedSize === size.id
                    ? "border-linevibes-blue bg-linevibes-blue/5 text-linevibes-blue ring-1 ring-linevibes-blue/20"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }
              `}
              data-testid={`print-size-${size.id}`}
            >
              <span className="block">{size.label}</span>
              <span className="block text-[10px] text-gray-400 mt-0.5">
                {size.dimensions}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Color selector */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2.5 uppercase tracking-wider">
          Ink Color
        </h3>
        <div className="flex gap-3">
          {PRINT_COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => onColorChange(color.id)}
              className={`
                relative w-10 h-10 rounded-full transition-all duration-200
                ${
                  selectedColor === color.id
                    ? "ring-2 ring-linevibes-blue ring-offset-2"
                    : "ring-1 ring-gray-200 hover:ring-gray-300"
                }
              `}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              data-testid={`print-color-${color.id}`}
            >
              {selectedColor === color.id && (
                <svg
                  className="absolute inset-0 m-auto"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={color.hex === "#1a1a1a" ? "#fff" : "#1a1a1a"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price + CTA */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-extrabold text-gray-900">
          {priceLabel || "$29"}
        </span>
        <span className="text-xs text-gray-400">+ free shipping</span>
      </div>

      <button
        onClick={onAddToCart}
        disabled={isLoading}
        className={`
          w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
          bg-gray-900 text-white
          hover:bg-gray-800 hover:-translate-y-0.5
          active:translate-y-0
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
        `}
        data-testid="print-add-to-cart"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Adding...
          </span>
        ) : (
          "Add to Cart — Print"
        )}
      </button>
    </div>
  )
}
