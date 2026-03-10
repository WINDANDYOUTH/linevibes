import type {
  FrameOption,
  GenerationStatus,
  ProductType,
  SizeOption,
} from "../../types/generator"
import EmptyPreviewState from "./EmptyPreviewState"

function frameClasses(frameOption: FrameOption) {
  switch (frameOption) {
    case "oak":
      return "bg-[linear-gradient(135deg,#c8a876_0%,#d8bb8c_35%,#b28853_100%)] p-5"
    case "black":
      return "bg-[linear-gradient(135deg,#2a2a2a_0%,#494949_50%,#121212_100%)] p-5"
    case "acrylic":
      return "bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(209,213,219,0.75))] p-4 backdrop-blur"
    default:
      return "bg-transparent p-0"
  }
}

function sizeMaxWidth(sizeOption: SizeOption) {
  switch (sizeOption) {
    case "small":
      return "max-w-[290px] sm:max-w-[280px] xl:max-w-[320px]"
    case "large":
      return "max-w-[420px] sm:max-w-[400px] xl:max-w-[520px]"
    default:
      return "max-w-[360px] sm:max-w-[340px] xl:max-w-[420px]"
  }
}

export default function ArtworkPreview({
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
  if (!croppedImageUrl && !artworkUrl) {
    return (
      <EmptyPreviewState
        title="Your Portrait Preview Will Appear Here"
        body="Upload a pet photo and crop it to prepare the preview. Once you generate, product text and framing choices will update here instantly."
      />
    )
  }

  if (generationStatus === "generating") {
    return (
      <div className="flex h-full min-h-0 flex-col items-center justify-center rounded-[24px] border border-stone-300 bg-white px-4 py-6 text-center sm:px-8 xl:py-8 xl:rounded-[30px]">
        <div className="h-full max-h-[52vw] min-h-[180px] w-full max-w-[220px] animate-pulse rounded-[22px] bg-[linear-gradient(110deg,#f5f5f4_8%,#e7e5e4_18%,#f5f5f4_33%)] bg-[length:200%_100%] sm:max-h-[320px] sm:max-w-[320px] xl:h-[420px] xl:max-h-none xl:max-w-[420px] xl:rounded-[28px]" />
        <h4 className="mt-4 text-lg font-semibold text-stone-950 sm:text-2xl">
          Generating your portrait preview...
        </h4>
        <p className="mt-2 max-w-md text-xs leading-5 text-stone-500 sm:mt-4 sm:text-sm sm:leading-7">
          The AI request only uses the cropped image and selected style.
        </p>
      </div>
    )
  }

  if (generationStatus === "error" && !artworkUrl) {
    return (
      <div className="flex h-full min-h-0 flex-col items-center justify-center rounded-[24px] border border-red-200 bg-red-50 px-4 py-6 text-center sm:px-8 xl:py-8 xl:rounded-[30px]">
        <h4 className="text-lg font-semibold text-red-900 sm:text-2xl">
          Generation issue
        </h4>
        <p className="mt-2 max-w-md text-xs leading-5 text-red-700 sm:mt-4 sm:text-sm sm:leading-7">
          {generationError || "We could not generate the preview for this image."}
        </p>
      </div>
    )
  }

  const displayUrl = artworkUrl || croppedImageUrl
  const showFrame = productType === "print" && frameOption !== "none"

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[24px] border border-stone-300 bg-white p-1.5 sm:p-3 xl:rounded-[30px] xl:p-5">
      <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-[20px] bg-[#fcfbf8] p-1 sm:p-3 xl:rounded-[28px] xl:p-6">
        <div className="absolute inset-0 opacity-70">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(120,113,108,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120,113,108,0.06) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative mx-auto flex h-full w-full min-w-0 flex-col items-center">
          <div
            className={`relative h-full max-h-full w-auto max-w-full ${sizeMaxWidth(sizeOption)} aspect-[4/5] rounded-[22px] transition-all duration-300 xl:rounded-[30px] ${
              showFrame ? frameClasses(frameOption) : ""
            }`}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[20px] border border-stone-200 bg-white shadow-[0_20px_50px_rgba(28,25,23,0.08)] xl:rounded-[28px]">
              {displayUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayUrl}
                  alt="Pet portrait artwork preview"
                  className="h-full w-full object-contain"
                />
              ) : null}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.45),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.38))]" />
              {customText ? (
                <div className="absolute inset-x-2 bottom-2 text-center sm:inset-x-4 sm:bottom-4 xl:inset-x-6 xl:bottom-6">
                  <div className="inline-flex max-w-full items-center justify-center rounded-full bg-white/88 px-3 py-1.5 text-xs font-semibold text-stone-900 shadow-sm backdrop-blur sm:px-4 sm:py-2 sm:text-sm xl:px-5">
                    <span className="truncate">{customText}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {!artworkUrl && croppedImageUrl ? (
            <p className="mt-3 max-w-md text-center text-xs leading-5 text-stone-500 sm:text-sm sm:leading-6 xl:mt-6 xl:leading-7">
              Crop is ready. Generate the preview to create AI line art from this image.
            </p>
          ) : null}

          {needsRegeneration ? (
            <div className="mt-3 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900 sm:text-sm xl:mt-6 xl:px-4 xl:py-2">
              Preview is outdated. Generate again to match the latest crop or style.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
