import type {
  FrameOption,
  GenerationStatus,
  ProductType,
  SizeOption,
  TextAlignOption,
  TextFontOption,
} from "../../types/generator"
import EmptyPreviewState from "./EmptyPreviewState"

function frameClasses(frameOption: FrameOption) {
  switch (frameOption) {
    case "oak":
      return "bg-[linear-gradient(135deg,#c8a876_0%,#d8bb8c_35%,#b28853_100%)] p-4 md:p-5"
    case "black":
      return "bg-[linear-gradient(135deg,#2a2a2a_0%,#494949_50%,#121212_100%)] p-4 md:p-5"
    case "acrylic":
      return "bg-[linear-gradient(135deg,#d6bf89_0%,#ebd7a8_40%,#b78e45_100%)] p-4 md:p-5"
    default:
      return "bg-transparent p-0"
  }
}

function printSizeScaleClass(sizeOption: SizeOption) {
  switch (sizeOption) {
    case "small":
      return "w-full md:max-w-[320px]"
    case "large":
      return "w-full md:max-w-[500px]"
    default:
      return "w-full md:max-w-[410px]"
  }
}

function textFontClass(font: TextFontOption) {
  switch (font) {
    case "serif":
      return "font-[family-name:Georgia,_Times_New_Roman,_serif]"
    case "script":
      return "font-[family-name:Brush_Script_MT,_Segoe_Script,_cursive]"
    case "modern":
      return "font-[family-name:Helvetica_Neue,_Arial,_sans-serif]"
    default:
      return "font-sans"
  }
}

function textAlignClass(align: TextAlignOption) {
  switch (align) {
    case "left":
      return "items-start text-left"
    case "right":
      return "items-end text-right"
    default:
      return "items-center text-center"
  }
}

const transparentCanvasBackground =
  "bg-[linear-gradient(45deg,_rgba(231,229,228,0.8)_25%,_transparent_25%),linear-gradient(-45deg,_rgba(231,229,228,0.8)_25%,_transparent_25%),linear-gradient(45deg,_transparent_75%,_rgba(231,229,228,0.8)_75%),linear-gradient(-45deg,_transparent_75%,_rgba(231,229,228,0.8)_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0]"

export default function ArtworkPreview({
  artworkUrl,
  croppedImageUrl,
  customText,
  textFont,
  textColor,
  textAlign,
  textSize,
  productType,
  frameOption,
  sizeOption,
  generationStatus,
  needsRegeneration,
  generationError,
  primaryAction,
}: {
  artworkUrl: string | null
  croppedImageUrl: string | null
  customText: string
  textFont: TextFontOption
  textColor: string
  textAlign: TextAlignOption
  textSize: number
  productType: ProductType
  frameOption: FrameOption
  sizeOption: SizeOption
  generationStatus: GenerationStatus
  needsRegeneration: boolean
  generationError: string | null
  primaryAction?: {
    label: string
    onClick: () => void
    disabled?: boolean
  } | null
}) {
  const displayText = customText.trim()
  const hasCustomText = displayText.length > 0
  const previewWidthClass =
    productType === "print"
      ? printSizeScaleClass(sizeOption)
      : "w-full md:max-w-[420px]"

  if (!croppedImageUrl && !artworkUrl) {
    return (
      <div className="p-0 md:rounded-[24px] md:border md:border-white/80 md:bg-white md:p-6">
        <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[20px] bg-[#ececef] px-3 py-4 md:rounded-[22px] md:bg-[#fbfbf9] md:p-6">
          <div
            className="absolute inset-6 hidden rounded-[18px] md:block"
            style={{
              backgroundImage:
                "linear-gradient(rgba(120,113,108,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120,113,108,0.06) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <EmptyPreviewState
            title="Your portrait preview will appear here"
            body="Upload and crop a pet photo to begin customizing the artwork."
          />
        </div>
      </div>
    )
  }

  if (generationStatus === "generating") {
    return (
      <div className="p-0 md:rounded-[24px] md:border md:border-white/80 md:bg-white md:p-6">
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[20px] bg-[#ececef] px-3 py-4 text-center md:rounded-[22px] md:bg-[#fbfbf9]">
          <div className="aspect-[4/5] w-[min(72vw,420px)] animate-pulse rounded-[28px] bg-[linear-gradient(110deg,#f5f5f4_8%,#e7e5e4_18%,#f5f5f4_33%)] bg-[length:200%_100%] md:w-[420px]" />
          <h4 className="mt-6 text-xl font-semibold text-stone-950">
            Generating your portrait preview
          </h4>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            This only uses the cropped image and selected style.
          </p>
        </div>
      </div>
    )
  }

  if (generationStatus === "error" && !artworkUrl) {
    return (
      <div className="p-0 md:rounded-[24px] md:border md:border-red-200 md:bg-white md:p-6">
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[20px] bg-[#ececef] px-6 py-4 text-center md:rounded-[22px] md:bg-red-50">
          <h4 className="text-xl font-semibold text-red-900">
            Generation issue
          </h4>
          <p className="mt-2 max-w-md text-sm leading-6 text-red-700">
            {generationError ||
              "We could not generate the preview for this image."}
          </p>
          {primaryAction ? (
            <button
              type="button"
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
              className={`mt-5 inline-flex items-center justify-center rounded-[10px] px-4 py-3 text-sm font-semibold transition ${
                primaryAction.disabled
                  ? "cursor-not-allowed bg-[#cfd8e6] text-white/90"
                  : "bg-[#2f80ed] text-white hover:bg-[#226fd7]"
              }`}
            >
              {primaryAction.label}
            </button>
          ) : null}
        </div>
      </div>
    )
  }

  const displayUrl = artworkUrl || croppedImageUrl
  const showFrame = productType === "print" && frameOption !== "none"

  return (
    <div className="p-0 md:rounded-[24px] md:border md:border-white/80 md:bg-white md:p-6">
      <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[20px] bg-[#ececef] px-3 py-4 md:rounded-[22px] md:bg-[#fbfbf9] md:p-8">
        <div
          className="absolute inset-4 hidden rounded-[18px] md:inset-8 md:block"
          style={{
            backgroundImage:
              "linear-gradient(rgba(120,113,108,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120,113,108,0.06) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className={`relative aspect-[4/5] w-full ${previewWidthClass}`}>
          <div
            className={`absolute inset-0 flex items-center justify-center rounded-[20px] transition-all duration-300 ${
              showFrame ? frameClasses(frameOption) : ""
            }`}
          >
            <div
              className={`relative aspect-[3/4] w-full overflow-hidden border border-stone-900/15 ${transparentCanvasBackground} shadow-[0_10px_24px_rgba(15,23,42,0.10)] md:h-full md:aspect-auto md:rounded-[18px] md:border md:border-stone-200 md:shadow-[0_22px_50px_rgba(15,23,42,0.10)]`}
            >
              <div className="flex h-full w-full flex-col">
                <div className="relative min-h-0 flex-1 px-4 pt-4 md:px-5 md:pt-5">
                  {displayUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={displayUrl}
                      alt="Pet portrait artwork preview"
                      className="h-full w-full object-contain"
                    />
                  ) : null}
                  <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.08))] md:block" />
                </div>
                {hasCustomText ? (
                  <div
                    className={`flex min-h-[56px] shrink-0 px-4 pb-4 pt-2 md:min-h-[76px] md:px-6 md:pb-5 md:pt-4 ${textAlignClass(
                      textAlign
                    )}`}
                  >
                    <div
                      className={`max-w-full leading-none ${textFontClass(
                        textFont
                      )}`}
                      style={{
                        color: textColor,
                        fontSize: `clamp(16px, ${Math.max(
                          16,
                          textSize * 0.58
                        )}px, ${textSize}px)`,
                      }}
                    >
                      <span className="block truncate">{displayText}</span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 md:mt-4 md:flex-row md:items-center md:justify-between">
        <div>
          {needsRegeneration ? (
            <p className="text-sm text-amber-700">
              Preview is outdated. Generate again to match the current crop or
              style.
            </p>
          ) : productType === "digital" ? (
            <p className="text-sm text-stone-500">
              Digital File preview. Frame selection is disabled for this format.
            </p>
          ) : (
            <p className="text-sm text-stone-500">
              Physical Print preview with live frame and size presentation.
            </p>
          )}
        </div>

        {primaryAction ? (
          <button
            type="button"
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled}
            className={`inline-flex items-center justify-center rounded-[10px] px-4 py-3 text-sm font-semibold transition ${
              primaryAction.disabled
                ? "cursor-not-allowed bg-[#cfd8e6] text-white/90"
                : "bg-[#2f80ed] text-white hover:bg-[#226fd7]"
            }`}
          >
            {primaryAction.label}
          </button>
        ) : null}
      </div>
    </div>
  )
}
