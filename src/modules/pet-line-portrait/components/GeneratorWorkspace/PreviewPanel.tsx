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
  canGenerate,
  onGenerate,
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
  canGenerate: boolean
  onGenerate: () => void
}) {
  const mobileStatusLabel =
    generationStatus === "generating"
      ? "Generating"
      : needsRegeneration
      ? "Preview outdated"
      : artworkUrl
      ? "Preview ready"
      : croppedImageUrl
      ? "Crop ready"
      : "Waiting for photo"
  const mobileStatusHint =
    generationStatus === "generating"
      ? "Creating line art from your latest crop"
      : needsRegeneration
      ? "Regenerate to match your latest crop or style"
      : artworkUrl
      ? "Preview is up to date"
      : croppedImageUrl
      ? "Generate to create line art"
      : "Upload a pet photo to begin"
  const hasStartedEditing = !!sourceImageUrl
  const hasPreviewContent = !!croppedImageUrl || !!artworkUrl
  const mobileHeight = hasPreviewContent
    ? "clamp(360px, 58svh, 500px)"
    : hasStartedEditing
    ? "clamp(320px, 50svh, 420px)"
    : "clamp(300px, 46svh, 380px)"
  const desktopHeight =
    "calc(100svh - var(--pet-portrait-header-height, 76px) - (var(--pet-portrait-preview-gap, 12px) * 2))"

  return (
    <div
      className={`flex h-[var(--preview-panel-height)] max-h-[var(--preview-panel-height)] flex-col overflow-hidden rounded-[28px] border border-stone-200 bg-[#eef0eb] shadow-[0_14px_36px_rgba(28,25,23,0.08)] transition-[height,min-height,max-height] duration-300 ${
        hasPreviewContent
          ? "min-h-[360px]"
          : hasStartedEditing
          ? "min-h-[320px]"
          : "min-h-[300px] sm:min-h-[340px]"
      } xl:h-[var(--preview-panel-desktop-height)] xl:max-h-[var(--preview-panel-desktop-height)] xl:min-h-0 xl:rounded-[34px] xl:bg-[#f3efe6] xl:p-6 xl:shadow-none`}
      style={{
        ["--preview-panel-height" as string]: mobileHeight,
        ["--preview-panel-desktop-height" as string]: desktopHeight,
        ["--pet-portrait-mobile-preview-height" as string]: mobileHeight,
      }}
    >
      <div className="border-b border-stone-200/70 px-3 py-2 sm:px-5 sm:py-4 xl:border-b-0 xl:px-0 xl:py-0">
        <div className="xl:hidden">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm font-semibold text-stone-950">
              {mobileStatusLabel}
            </p>
            <span className="inline-flex shrink-0 rounded-full border border-stone-300 bg-white/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-stone-500">
              {artworkUrl ? "Ready" : croppedImageUrl ? "Action" : "Start"}
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-4 text-stone-500">
            {mobileStatusHint}
          </p>
        </div>

        <div className="hidden min-w-0 xl:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">
            Live Preview
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <h3 className="font-[family-name:Georgia,_Times_New_Roman,_serif] text-base text-stone-950 sm:text-2xl xl:text-3xl">
              Portrait Canvas
            </h3>
            <span className="inline-flex rounded-full border border-stone-300 bg-white/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-stone-500 sm:px-2.5 sm:py-1 sm:text-[11px]">
              {mobileStatusLabel}
            </span>
          </div>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            Text, size, and framing update here instantly. Only the cropped image
            and style trigger regeneration.
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 p-2 sm:p-4 xl:mt-5 xl:p-0">
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
          canGenerate={canGenerate}
          onGenerate={onGenerate}
        />
      </div>
    </div>
  )
}
