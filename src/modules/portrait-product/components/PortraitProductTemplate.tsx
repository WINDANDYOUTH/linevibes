"use client"

import React, { useState, useMemo, useCallback, useEffect } from "react"
import { useParams } from "next/navigation"
import { addToCart } from "@lib/data/cart"
import { saveToHistory } from "@lib/portrait-history"
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

async function readJsonOrText(response: Response) {
  const raw = await response.text()

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    return { error: raw }
  }
}

type PortraitProductTemplateProps = {
  /** URL of the user-generated portrait image */
  portraitImageUrl: string
  /** URL of the original uploaded photo */
  originalImageUrl?: string | null
  /** URL of the cropped generation input */
  croppedImageUrl?: string | null
  /** URL of the SVG version, when the backend actually produced one */
  portraitSvgUrl?: string | null
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
const REGEN_STYLES = [
  { id: "classic", label: "Classic", emoji: "✏️" },
  { id: "bold", label: "Bold", emoji: "🖊️" },
  { id: "detailed", label: "Detailed", emoji: "🔍" },
  { id: "artistic", label: "Artistic", emoji: "🎨" },
  { id: "minimal", label: "Minimal", emoji: "〰️" },
]

export default function PortraitProductTemplate({
  portraitImageUrl,
  originalImageUrl = null,
  croppedImageUrl = null,
  portraitSvgUrl = null,
  sessionId,
  portraitStyle = "classic",
  variantIds,
  prices,
}: PortraitProductTemplateProps) {
  // ─── State ──────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<VariantType>("digital")
  const [isAdding, setIsAdding] = useState(false)
  const [currentPortraitUrl, setCurrentPortraitUrl] = useState(portraitImageUrl)
  const [currentOriginalUrl, setCurrentOriginalUrl] = useState(originalImageUrl)
  const [currentCroppedUrl, setCurrentCroppedUrl] = useState(croppedImageUrl)
  const [currentPortraitSvgUrl, setCurrentPortraitSvgUrl] =
    useState(portraitSvgUrl)
  const [currentStyle, setCurrentStyle] = useState(portraitStyle)

  // Regeneration state
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [regenStyle, setRegenStyle] = useState(portraitStyle)
  const [showRegenPanel, setShowRegenPanel] = useState(false)

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

  // ─── Save to localStorage on mount ─────────────────
  useEffect(() => {
    if (sessionId && currentPortraitUrl) {
      saveToHistory({
        sessionId,
        portraitUrl: currentPortraitUrl,
        originalUrl: currentOriginalUrl ?? undefined,
        croppedUrl: currentCroppedUrl ?? undefined,
        style: currentStyle,
        createdAt: new Date().toISOString(),
      })
    }
  }, [sessionId, currentCroppedUrl, currentOriginalUrl, currentPortraitUrl, currentStyle])

  // ─── Regenerate Handler ────────────────────────────
  const handleRegenerate = useCallback(async () => {
    setIsRegenerating(true)
    try {
      const response = await fetch("/api/portrait/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          style: regenStyle,
        }),
      })

      const data = await readJsonOrText(response)

      if (!response.ok) {
        throw new Error(
          (data &&
          typeof data === "object" &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : null) || "Regeneration failed"
        )
      }

      // Update the displayed portrait
      const nextPortraitUrl =
        data && typeof data === "object" && "portraitUrl" in data
          ? (data.portraitUrl as string)
          : currentPortraitUrl
      const nextStyle =
        data && typeof data === "object" && "style" in data
          ? (data.style as string)
          : currentStyle
      const nextPortraitSvgUrl =
        data && typeof data === "object" && "portraitSvgUrl" in data
          ? (data.portraitSvgUrl as string | null) ?? null
          : currentPortraitSvgUrl
      const nextOriginalUrl =
        data && typeof data === "object" && "originalUrl" in data
          ? (data.originalUrl as string | null) ?? null
          : currentOriginalUrl
      const nextCroppedUrl =
        data && typeof data === "object" && "croppedUrl" in data
          ? (data.croppedUrl as string | null) ?? nextOriginalUrl
          : currentCroppedUrl

      setCurrentPortraitUrl(nextPortraitUrl)
      setCurrentOriginalUrl(nextOriginalUrl)
      setCurrentCroppedUrl(nextCroppedUrl)
      setCurrentPortraitSvgUrl(nextPortraitSvgUrl)
      setCurrentStyle(nextStyle)
      setShowRegenPanel(false)

      // Update localStorage
      saveToHistory({
        sessionId,
        portraitUrl: nextPortraitUrl,
        originalUrl: nextOriginalUrl ?? undefined,
        croppedUrl: nextCroppedUrl ?? undefined,
        style: nextStyle,
        createdAt: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error("[Regenerate] Error:", error)
      alert(error.message || "Regeneration failed. Please try again.")
    } finally {
      setIsRegenerating(false)
    }
  }, [
    currentCroppedUrl,
    currentOriginalUrl,
    currentPortraitSvgUrl,
    currentPortraitUrl,
    currentStyle,
    sessionId,
    regenStyle,
  ])

  // ─── Derived state ──────────────────────────────────
  const selectedFrameMaterial = useMemo(
    () => FRAME_MATERIALS.find((m) => m.id === canvasMaterial) || null,
    [canvasMaterial]
  )

  const showFrame = activeTab === "canvas" && canvasMaterial !== "none"

  // Use portrait_image_url in addToCart metadata so cart shows actual portrait
  const portraitImageForMeta = currentPortraitUrl

  // ─── Handlers ───────────────────────────────────────
  const handleAddToCart = useCallback(async () => {
    setIsAdding(true)

    try {
      const variantId = variantIds[activeTab]
      if (!variantId) {
        console.error(`No variant ID found for tab: ${activeTab}`)
        return
      }

      // Build metadata — ALL variants include digital download
      const metadata: Record<string, string> = {
        portrait_session_id: sessionId,
        portrait_image_url: portraitImageForMeta,
        portrait_style: currentStyle,
        source_image_url: currentOriginalUrl ?? "",
        cropped_image_url: currentCroppedUrl ?? currentOriginalUrl ?? "",
        variant_type: activeTab,
        includes_digital_download: "true",
      }

      if (currentPortraitSvgUrl) {
        metadata.portrait_svg_url = currentPortraitSvgUrl
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
        metadata,
      })
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }, [
    activeTab,
    variantIds,
    currentPortraitSvgUrl,
    currentOriginalUrl,
    currentCroppedUrl,
    currentStyle,
    portraitImageForMeta,
    sessionId,
    printSize,
    printColor,
    canvasSize,
    canvasMaterial,
    countryCode,
  ])

  // ─── Render ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      {/* Regeneration overlay */}
      {isRegenerating && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="text-5xl mb-4 animate-bounce">🔄</div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                style={{
                  width: "75%",
                  animation: "regen-pulse 2s ease-in-out infinite",
                }}
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Regenerating your portrait...
            </h3>
            <p className="text-sm text-gray-500">
              Using the same photo with a fresh AI interpretation. This may take
              30–60 seconds.
            </p>
          </div>
          <style jsx>{`
            @keyframes regen-pulse {
              0%,
              100% {
                opacity: 1;
              }
              50% {
                opacity: 0.6;
              }
            }
          `}</style>
        </div>
      )}

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
                <div
                  className={`w-full max-w-[380px] transition-all duration-500 ${
                    showFrame ? "pb-8" : ""
                  }`}
                >
                  <FrameOverlay
                    material={showFrame ? selectedFrameMaterial : null}
                  >
                    <LineArtRenderer imageUrl={currentPortraitUrl} />
                  </FrameOverlay>
                </div>
              </div>

              {/* Session info + Regenerate toggle */}
              <div className="mt-3 flex items-center justify-between px-1">
                <span className="text-xs text-gray-400">
                  Session: {sessionId?.slice(0, 12)}...
                </span>
                <span className="text-xs text-gray-400">
                  Style: {currentStyle}
                </span>
              </div>

              {/* ─── Regenerate Panel ─── */}
              <div className="mt-4">
                {!showRegenPanel ? (
                  <button
                    onClick={() => setShowRegenPanel(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 hover:border-linevibes-blue/40 hover:text-linevibes-blue hover:bg-linevibes-blue/5 transition-all duration-200"
                  >
                    🔄 Not happy with the result? Regenerate
                  </button>
                ) : (
                  <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        Choose a style & regenerate
                      </span>
                      <button
                        onClick={() => setShowRegenPanel(false)}
                        className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {REGEN_STYLES.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setRegenStyle(s.id)}
                          className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                            transition-all duration-200 border
                            ${
                              regenStyle === s.id
                                ? "bg-linevibes-blue text-white border-linevibes-blue shadow-sm"
                                : "bg-white text-gray-600 border-gray-200 hover:border-linevibes-blue/40"
                            }
                          `}
                        >
                          <span>{s.emoji}</span>
                          <span>{s.label}</span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleRegenerate}
                      disabled={isRegenerating}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ✨ Regenerate Portrait
                    </button>
                    <p className="text-[11px] text-gray-400 text-center">
                      Uses your original photo – no re-upload needed
                    </p>
                  </div>
                )}
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

            {/* Digital download included notice (for Print & Canvas) */}
            {activeTab !== "digital" && (
              <div className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-linevibes-blue/5 border border-linevibes-blue/10">
                <span className="text-lg">📥</span>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Includes Free Digital Download
                  </p>
                  <p className="text-[11px] text-gray-500">
                    High-res PNG file sent to your email after purchase
                  </p>
                </div>
              </div>
            )}

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
