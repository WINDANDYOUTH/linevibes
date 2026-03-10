import type {
  FrameOption,
  GenerationStatus,
  ProductType,
  SizeOption,
} from "../../types/generator"
import ArtworkPreview from "./ArtworkPreview"

export default function PreviewPanel({
  sourceImageUrl,
  artworkUrl,
  croppedImageUrl,
  customText,
  productType,
  frameOption,
  sizeOption,
  generationStatus,
  needsRegeneration,
  generationError,
}: {
  sourceImageUrl: string | null
  artworkUrl: string | null
  croppedImageUrl: string | null
  customText: string
  productType: ProductType
  frameOption: FrameOption
  sizeOption: SizeOption
  generationStatus: GenerationStatus
  needsRegeneration: boolean
  generationError: string | null
}) {
  const mobileStatusLabel =
    generationStatus === "generating"
      ? "Generating..."
      : artworkUrl
      ? "Preview synced"
      : croppedImageUrl
      ? "Crop ready"
      : "Waiting for photo"
  const hasStartedEditing = !!sourceImageUrl
  const mobileHeight = hasStartedEditing
    ? "37svh"
    : "min(56svh, calc(100svh - var(--pet-portrait-header-height, 76px) - 24px))"
  const desktopHeight =
    "calc(100svh - var(--pet-portrait-header-height, 76px) - (var(--pet-portrait-preview-gap, 12px) * 2))"

  return (
    <div
      className={`flex h-[var(--preview-panel-height)] max-h-[var(--preview-panel-height)] flex-col overflow-hidden rounded-[28px] border border-stone-200 bg-[#f3efe6]/95 shadow-[0_18px_48px_rgba(28,25,23,0.08)] backdrop-blur transition-[height,min-height,max-height] duration-300 ${
        hasStartedEditing ? "min-h-[290px] sm:min-h-[320px]" : "min-h-[320px] sm:min-h-[360px]"
      } xl:h-[var(--preview-panel-desktop-height)] xl:max-h-[var(--preview-panel-desktop-height)] xl:min-h-0 xl:rounded-[34px] xl:bg-[#f3efe6] xl:p-6 xl:shadow-none xl:backdrop-blur-none`}
      style={{
        ["--preview-panel-height" as string]: mobileHeight,
        ["--preview-panel-desktop-height" as string]: desktopHeight,
      }}
    >
      <div className="flex items-start justify-between gap-4 border-b border-stone-200/80 px-4 py-3 sm:px-5 sm:py-4 xl:border-b-0 xl:px-0 xl:py-0">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-400">
            Live Preview
          </p>
          <div className="mt-2 flex items-center gap-3">
            <h3 className="font-[family-name:Georgia,_Times_New_Roman,_serif] text-xl text-stone-950 sm:text-2xl xl:text-3xl">
              Preview
            </h3>
            <span className="inline-flex rounded-full border border-stone-300 bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 sm:text-[11px]">
              {mobileStatusLabel}
            </span>
          </div>
          <p className="mt-2 max-w-[36ch] text-xs leading-5 text-stone-600 sm:text-sm sm:leading-6 xl:hidden">
            Keep the artwork in view while you upload, crop, and refine details.
          </p>
          <p className="mt-3 hidden text-sm leading-7 text-stone-600 xl:block">
            Text, size, and framing update here instantly. Only the cropped image
            and style trigger regeneration.
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 p-3 sm:p-4 xl:mt-5 xl:p-0">
        <ArtworkPreview
          artworkUrl={artworkUrl}
          croppedImageUrl={croppedImageUrl}
          customText={customText}
          productType={productType}
          frameOption={frameOption}
          sizeOption={sizeOption}
          generationStatus={generationStatus}
          needsRegeneration={needsRegeneration}
          generationError={generationError}
        />
      </div>
    </div>
  )
}
