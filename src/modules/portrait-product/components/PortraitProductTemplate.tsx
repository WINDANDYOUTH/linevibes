"use client"

import React, { useState, useMemo, useCallback } from "react"
import { useParams } from "next/navigation"
import { addToCart } from "@lib/data/cart"
import VariantTabSelector from "./VariantTabSelector"
import LineArtRenderer from "./LineArtRenderer"
import FrameOverlay from "./FrameOverlay"
import InstantDownloadPanel from "./InstantDownloadPanel"
import OrderPrintPanel from "./OrderPrintPanel"
import OrderCanvasPanel from "./OrderCanvasPanel"
import {
  VariantType,
  FRAME_MATERIALS,
  PRINT_SIZES,
  PRINT_COLORS,
  CANVAS_SIZES,
} from "../data/portrait-data"

type PortraitProductTemplateProps = {
  /** URL of the user-generated portrait image */
  portraitImageUrl: string
  /** Session ID from the generation flow */
  sessionId: string
  /** Portrait style */
  portraitStyle?: string
  /** Pre-created Medusa product variant IDs for each type */
  variantIds: {
    digital: string
    print: string
    canvas: string
  }
  /** Price labels from Medusa (formatted) */
  prices: {
    digital: string
    print: string
    canvas: string
  }
}

/**
 * Main product page template for user-generated line portraits.
 *
 * Layout: Left = Preview Panel (image + frame) | Right = Config Panel (tabs + options)
 *
 * Uses 3 pre-created Medusa "template products":
 * - portrait-digital  (Instant Download)
 * - portrait-print    (Art Print)
 * - portrait-canvas   (Canvas)
 *
 * All customization options are passed as line item metadata on addToCart.
 */
export default function PortraitProductTemplate({
  portraitImageUrl,
  sessionId,
  portraitStyle = "classic",
  variantIds,
  prices,
}: PortraitProductTemplateProps) {
  // ─── State ──────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<VariantType>("digital")
  const [isAdding, setIsAdding] = useState(false)

  // Print options
  const [printSize, setPrintSize] = useState(
    PRINT_SIZES.find((s) => s.isDefault)?.id || "12x16"
  )
  const [printColor, setPrintColor] = useState(
    PRINT_COLORS.find((c) => c.isDefault)?.id || "black"
  )

  // Canvas options
  const [canvasSize, setCanvasSize] = useState(
    CANVAS_SIZES.find((s) => s.isDefault)?.id || "12x16"
  )
  const [canvasMaterial, setCanvasMaterial] = useState("none")

  const countryCode = useParams().countryCode as string

  // ─── Derived state ──────────────────────────────────
  const selectedFrameMaterial = useMemo(
    () => FRAME_MATERIALS.find((m) => m.id === canvasMaterial) || null,
    [canvasMaterial]
  )

  const showFrame = activeTab === "canvas" && canvasMaterial !== "none"

  // ─── Handlers ───────────────────────────────────────
  const handleAddToCart = useCallback(async () => {
    setIsAdding(true)

    try {
      const variantId = variantIds[activeTab]
      if (!variantId) {
        console.error(`No variant ID found for tab: ${activeTab}`)
        return
      }

      // Build metadata based on the selected tab
      const metadata: Record<string, string> = {
        portrait_session_id: sessionId,
        portrait_image_url: portraitImageUrl,
        portrait_style: portraitStyle,
        variant_type: activeTab,
      }

      if (activeTab === "print") {
        metadata.selected_size = printSize
        metadata.selected_color = printColor
      } else if (activeTab === "canvas") {
        metadata.selected_size = canvasSize
        metadata.selected_frame_material = canvasMaterial
      }

      await addToCart({
        variantId,
        quantity: 1,
        countryCode,
      })
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }, [
    activeTab,
    variantIds,
    sessionId,
    portraitImageUrl,
    portraitStyle,
    printSize,
    printColor,
    canvasSize,
    canvasMaterial,
    countryCode,
  ])

  // ─── Render ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <div className="content-container py-8 md:py-12">
        <div
          className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16"
          data-testid="portrait-product-container"
        >
          {/* ═══ LEFT: Preview Panel ═══ */}
          <div className="w-full md:w-1/2 lg:w-[55%]">
            <div className="md:sticky md:top-28">
              {/* Scene background */}
              <div className="bg-gradient-to-b from-gray-100/80 to-gray-50 rounded-2xl p-6 md:p-10 flex items-center justify-center min-h-[400px] md:min-h-[560px]">
                <div className={`w-full max-w-[380px] transition-all duration-500 ${showFrame ? "pb-8" : ""}`}>
                  <FrameOverlay material={showFrame ? selectedFrameMaterial : null}>
                    <LineArtRenderer imageUrl={portraitImageUrl} />
                  </FrameOverlay>
                </div>
              </div>

              {/* Session info */}
              <div className="mt-3 flex items-center justify-between px-1">
                <span className="text-xs text-gray-400">
                  Session: {sessionId?.slice(0, 12)}...
                </span>
                <span className="text-xs text-gray-400">
                  Style: {portraitStyle}
                </span>
              </div>
            </div>
          </div>

          {/* ═══ RIGHT: Configuration Panel ═══ */}
          <div className="w-full md:w-1/2 lg:w-[45%]">
            {/* Title */}
            <div className="mb-6">
              <span className="text-linevibes-blue font-semibold text-xs tracking-widest uppercase">
                Your Custom Portrait
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1.5">
                Line Portrait
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                Your photo transformed into a unique line drawing. Choose your
                preferred format below.
              </p>
            </div>

            {/* Variant Tabs */}
            <VariantTabSelector
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "digital" && (
                <InstantDownloadPanel
                  priceLabel={prices.digital}
                  isLoading={isAdding}
                  onAddToCart={handleAddToCart}
                />
              )}

              {activeTab === "print" && (
                <OrderPrintPanel
                  selectedSize={printSize}
                  selectedColor={printColor}
                  onSizeChange={setPrintSize}
                  onColorChange={setPrintColor}
                  priceLabel={prices.print}
                  isLoading={isAdding}
                  onAddToCart={handleAddToCart}
                />
              )}

              {activeTab === "canvas" && (
                <OrderCanvasPanel
                  selectedSize={canvasSize}
                  selectedMaterial={canvasMaterial}
                  onSizeChange={setCanvasSize}
                  onMaterialChange={setCanvasMaterial}
                  priceLabel={prices.canvas}
                  isLoading={isAdding}
                  onAddToCart={handleAddToCart}
                />
              )}
            </div>

            {/* Satisfaction Guarantee */}
            <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    100% Satisfaction Guarantee
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Not happy with your order? We'll make it right or give you a
                    full refund, no questions asked.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
