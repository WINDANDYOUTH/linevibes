"use client"

import React from "react"
import {
  CANVAS_HIGHLIGHTS,
  CANVAS_SIZES,
  FRAME_MATERIALS,
  type FrameMaterial,
  type SizeOption,
} from "../data/portrait-data"

type OrderCanvasPanelProps = {
  /** Currently selected size */
  selectedSize: string
  /** Currently selected frame material */
  selectedMaterial: string
  /** Callbacks */
  onSizeChange: (sizeId: string) => void
  onMaterialChange: (materialId: string) => void
  /** Price display string */
  priceLabel: string
  /** Loading state */
  isLoading: boolean
  /** Add to cart callback */
  onAddToCart: () => void
}

/**
 * Panel for the "Order Canvas" variant.
 * Shows canvas highlights, size selector, frame material selector
 * (which triggers the FrameOverlay preview on the left panel), and CTA.
 */
export default function OrderCanvasPanel({
  selectedSize,
  selectedMaterial,
  onSizeChange,
  onMaterialChange,
  priceLabel,
  isLoading,
  onAddToCart,
}: OrderCanvasPanelProps) {
  return (
    <div className="animate-fade-in-up" data-testid="order-canvas-panel">
      {/* Highlights */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
          Canvas Quality
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {CANVAS_HIGHLIGHTS.map((hl, idx) => (
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
          {CANVAS_SIZES.map((size) => (
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
              data-testid={`canvas-size-${size.id}`}
            >
              <span className="block">{size.label}</span>
              <span className="block text-[10px] text-gray-400 mt-0.5">
                {size.dimensions}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Frame Material Selector */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2.5 uppercase tracking-wider">
          Frame
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {FRAME_MATERIALS.map((mat) => {
            const isSelected = selectedMaterial === mat.id
            return (
              <button
                key={mat.id}
                onClick={() => onMaterialChange(mat.id)}
                className={`
                  relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200
                  ${
                    isSelected
                      ? "border-linevibes-blue bg-linevibes-blue/5 ring-1 ring-linevibes-blue/20"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
                data-testid={`canvas-material-${mat.id}`}
              >
                {/* Material swatch */}
                {mat.id === "none" ? (
                  <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center bg-white flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                ) : (
                  <div
                    className="w-10 h-10 rounded-lg flex-shrink-0 shadow-sm"
                    style={{ background: mat.borderStyle }}
                  />
                )}

                {/* Label + price */}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {mat.name}
                  </p>
                  {mat.priceLabel && (
                    <p className="text-[11px] text-linevibes-blue font-medium">
                      {mat.priceLabel}
                    </p>
                  )}
                </div>

                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-linevibes-blue flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Price + CTA */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-extrabold text-gray-900">
          {priceLabel || "$69"}
        </span>
        <span className="text-xs text-gray-400">+ free shipping</span>
      </div>

      <button
        onClick={onAddToCart}
        disabled={isLoading}
        className={`
          w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
          bg-gradient-to-r from-violet-600 to-purple-700 text-white
          shadow-lg shadow-purple-500/20
          hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5
          active:translate-y-0
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
        `}
        data-testid="canvas-add-to-cart"
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
          "Add to Cart — Canvas"
        )}
      </button>
    </div>
  )
}
