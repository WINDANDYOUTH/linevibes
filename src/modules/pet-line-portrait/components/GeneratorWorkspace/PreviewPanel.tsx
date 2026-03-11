import type {
  FrameOption,
  GenerationStatus,
  ProductType,
  SizeOption,
  TextAlignOption,
  TextFontOption,
} from "../../types/generator"
import ArtworkPreview from "./ArtworkPreview"

export default function PreviewPanel({
  sourceImageUrl,
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
  portraitCount,
  primaryAction,
}: {
  sourceImageUrl: string | null
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
  portraitCount: number
  primaryAction?: {
    label: string
    onClick: () => void
    disabled?: boolean
  } | null
}) {
  const statusLabel =
    generationStatus === "generating"
      ? "Generating"
      : needsRegeneration
      ? "Needs update"
      : portraitCount > 0 && artworkUrl
      ? "Portrait selected"
      : artworkUrl
      ? "Preview ready"
      : croppedImageUrl
      ? "Ready to style"
      : sourceImageUrl
      ? "Photo uploaded"
      : "Waiting for photo"

  return (
    <div className="p-0 md:rounded-[28px] md:border md:border-[#e8e8e8] md:bg-[linear-gradient(180deg,#f7f7f4_0%,#efefec_100%)] md:p-6 md:shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-400 md:text-[11px]">
            Live Preview
          </p>
          <h3 className="mt-1 font-[family-name:Georgia,_Times_New_Roman,_serif] text-xl text-stone-950 md:mt-2 md:text-3xl">
            Portrait Canvas
          </h3>
          <p className="mt-2 hidden text-sm leading-6 text-stone-500 md:block">
            Crop, text, and format updates appear here in real time. Style
            changes apply after you click Generate.
          </p>
        </div>
        <span className="inline-flex rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500 md:border-white/80 md:bg-white/75 md:px-3">
          {statusLabel}
        </span>
      </div>

      <ArtworkPreview
        artworkUrl={artworkUrl}
        croppedImageUrl={croppedImageUrl}
        customText={customText}
        textFont={textFont}
        textColor={textColor}
        textAlign={textAlign}
        textSize={textSize}
        productType={productType}
        frameOption={frameOption}
        sizeOption={sizeOption}
        generationStatus={generationStatus}
        needsRegeneration={needsRegeneration}
        generationError={generationError}
        primaryAction={primaryAction}
      />
    </div>
  )
}
