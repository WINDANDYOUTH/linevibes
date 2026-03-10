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
    ? "clamp(360px, 54svh, 520px)"
    : "clamp(420px, 66svh, 620px)"
  const desktopHeight =
    "calc(100svh - var(--pet-portrait-header-height, 76px) - (var(--pet-portrait-preview-gap, 12px) * 2))"

  return (
    <div
      className={`flex h-[var(--preview-panel-height)] max-h-[var(--preview-panel-height)] flex-col overflow-hidden rounded-[26px] border border-stone-200 bg-[#f1ece2]/98 shadow-[0_14px_36px_rgba(28,25,23,0.08)] backdrop-blur transition-[height,min-height,max-height,transform] duration-300 ${
        hasStartedEditing ? "min-h-[360px]" : "min-h-[420px] sm:min-h-[460px]"
      } xl:h-[var(--preview-panel-desktop-height)] xl:max-h-[var(--preview-panel-desktop-height)] xl:min-h-0 xl:rounded-[34px] xl:bg-[#f3efe6] xl:p-6 xl:shadow-none xl:backdrop-blur-none`}
      style={{
        ["--preview-panel-height" as string]: mobileHeight,
        ["--preview-panel-desktop-height" as string]: desktopHeight,
        ["--pet-portrait-mobile-preview-height" as string]: mobileHeight,
      }}
    >
      <div className="flex items-start justify-between gap-3 border-b border-stone-200/60 px-3 py-1.5 sm:px-5 sm:py-4 xl:border-b-0 xl:px-0 xl:py-0">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">
            Live Preview
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <h3 className="font-[family-name:Georgia,_Times_New_Roman,_serif] text-[15px] text-stone-950 sm:text-2xl xl:text-3xl">
              Preview
            </h3>
            <span className="inline-flex rounded-full border border-stone-300 bg-white/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-stone-500 sm:px-2.5 sm:py-1 sm:text-[11px]">
              {mobileStatusLabel}
            </span>
          </div>
          <p className="mt-0.5 text-[10px] leading-4 text-stone-500 xl:hidden">
            Your artwork stays visible while you edit.
          </p>
          <p className="mt-3 hidden text-sm leading-7 text-stone-600 xl:block">
            Text, size, and framing update here instantly. Only the cropped image
            and style trigger regeneration.
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 p-1.5 sm:p-4 xl:mt-5 xl:p-0">
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
