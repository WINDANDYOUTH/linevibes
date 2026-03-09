import type {
  FrameOption,
  GenerationStatus,
  ProductType,
  SizeOption,
} from "../../types/generator"
import ArtworkPreview from "./ArtworkPreview"

export default function PreviewPanel({
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
  return (
    <div className="rounded-[34px] border border-stone-200 bg-[#f3efe6] p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
            Live Preview
          </p>
          <h3 className="mt-2 font-[family-name:Georgia,_Times_New_Roman,_serif] text-3xl text-stone-950">
            Preview
          </h3>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            Text, size, and framing update here instantly. Only the cropped image
            and style trigger regeneration.
          </p>
        </div>
      </div>

      <div className="mt-6">
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
