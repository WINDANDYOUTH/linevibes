"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Check } from "lucide-react"
import { useStudio } from "../StudioProvider"
import { Button } from "../shared/Button"
import {
  COLOR_VARIANTS,
  FRAME_OPTIONS,
  LEGEND_POSITIONS,
  ColorVariant,
  FrameOption,
  LegendPosition,
  LegendItem,
} from "@/types/studio"

export default function PreviewStep() {
  const { state, dispatch } = useStudio()
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleColorSelect = (variant: ColorVariant) => {
    dispatch({ type: "SET_COLOR_VARIANT", payload: { variant } })
  }

  const handleFrameSelect = (option: FrameOption) => {
    dispatch({ type: "SET_FRAME_OPTION", payload: { option } })
  }

  const handleLegendPositionSelect = (position: LegendPosition) => {
    dispatch({ type: "SET_LEGEND_POSITION", payload: { position } })
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)

    // TODO: Day 9 - Implement actual Medusa cart integration
    // For now, just simulate
    await new Promise((resolve) => setTimeout(resolve, 1500))

    alert("Added to cart! (This will be integrated with Medusa in Day 9)")
    setIsAddingToCart(false)
  }

  const selectedFrame = FRAME_OPTIONS.find(
    (f: { id: FrameOption; name: string; price: number; description: string }) => f.id === state.selectedFrameOption
  )
  const basePrice = 39.0
  const totalPrice = basePrice + (selectedFrame?.price || 0)

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Preview & Customize
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose your perfect color scheme and frame
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Your Blueprint Preview
              </h3>

              {/* Preview with selected color */}
              <div
                className="relative rounded-lg overflow-hidden"
                style={{
                  backgroundColor: state.selectedColorVariant.paperHex,
                  padding: "2rem",
                }}
              >
                {state.generatedLineartUrl && (
                  <img
                    src={state.generatedLineartUrl}
                    alt="Generated blueprint"
                    className="w-full h-auto"
                    style={{
                      filter: `invert(${state.selectedColorVariant.lineHex === "#FFFFFF" ? 1 : 0})`,
                    }}
                  />
                )}

                {/* Legend Overlay */}
                {state.legendItems.length > 0 && (
                  <div
                    className={`absolute p-4 bg-black/10 backdrop-blur-sm rounded ${
                      state.selectedLegendPosition === "topLeft"
                        ? "top-4 left-4"
                        : "bottom-4 right-4"
                    }`}
                    style={{ color: state.selectedColorVariant.lineHex }}
                  >
                    <p className="font-bold font-mono text-sm mb-1">
                      {state.title}
                    </p>
                    {state.subtitle && (
                      <p className="font-mono text-xs opacity-80 mb-2">
                        {state.subtitle}
                      </p>
                    )}
                    <div className="space-y-0.5 text-xs font-mono">
                      {state.legendItems.map((item: LegendItem, idx: number) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <div
                            className="w-3 h-px"
                            style={{
                              backgroundColor:
                                state.selectedColorVariant.lineHex,
                            }}
                          />
                          <span>
                            {idx + 1}. {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Color Variants Grid */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Color Scheme
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {COLOR_VARIANTS.map((variant: ColorVariant) => {
                    const isSelected =
                      state.selectedColorVariant.id === variant.id

                    return (
                      <button
                        key={variant.id}
                        onClick={() => handleColorSelect(variant)}
                        className={`relative p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? "border-blue-600 dark:border-blue-400 shadow-lg"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <div className="flex flex-col gap-2">
                          {/* Color preview */}
                          <div className="flex gap-1">
                            <div
                              className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
                              style={{ backgroundColor: variant.paperHex }}
                            />
                            <div
                              className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
                              style={{ backgroundColor: variant.lineHex }}
                            />
                          </div>

                          <p className="text-xs font-medium text-gray-900 dark:text-gray-100 text-left">
                            {variant.name}
                          </p>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Legend Position */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Legend Position
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {LEGEND_POSITIONS.map((pos: { id: LegendPosition; name: string; description: string }) => {
                    const isSelected = state.selectedLegendPosition === pos.id

                    return (
                      <button
                        key={pos.id}
                        onClick={() => handleLegendPositionSelect(pos.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">
                          {pos.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {pos.description}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Frame Options & Order */}
          <div className="space-y-6">
            {/* Frame Options */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Frame Options
              </h3>

              <div className="space-y-3">
                {FRAME_OPTIONS.map((frame: { id: FrameOption; name: string; price: number; description: string }) => {
                  const isSelected = state.selectedFrameOption === frame.id

                  return (
                    <button
                      key={frame.id}
                      onClick={() => handleFrameSelect(frame.id)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                            {frame.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {frame.description}
                          </p>
                        </div>
                        <p className="font-bold text-sm text-gray-900 dark:text-gray-100">
                          {frame.price > 0 ? `+$${frame.price}` : "Included"}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="mt-2 flex items-center gap-1 text-blue-600">
                          <Check className="h-4 w-4" />
                          <span className="text-xs font-medium">Selected</span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Order Summary
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    Blueprint Print
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    ${basePrice.toFixed(2)}
                  </span>
                </div>

                {selectedFrame && selectedFrame.price > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedFrame.name}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      ${selectedFrame.price.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      Total
                    </span>
                    <span className="font-bold text-xl text-blue-600">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                isLoading={isAddingToCart}
                className="w-full"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>

              <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-3">
                Free shipping on orders over $50
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
