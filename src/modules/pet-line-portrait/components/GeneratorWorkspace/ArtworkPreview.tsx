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
      return "max-w-[320px]"
    case "large":
      return "max-w-[520px]"
    default:
      return "max-w-[420px]"
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
      <div className="flex min-h-[560px] flex-col items-center justify-center rounded-[30px] border border-stone-300 bg-white px-8 text-center">
        <div className="h-[420px] w-full max-w-[420px] animate-pulse rounded-[28px] bg-[linear-gradient(110deg,#f5f5f4_8%,#e7e5e4_18%,#f5f5f4_33%)] bg-[length:200%_100%]" />
        <h4 className="mt-6 text-2xl font-semibold text-stone-950">
          Generating your portrait preview...
        </h4>
        <p className="mt-4 max-w-md text-sm leading-7 text-stone-500">
          The AI request only uses the cropped image and selected style.
        </p>
      </div>
    )
  }

  if (generationStatus === "error" && !artworkUrl) {
    return (
      <div className="flex min-h-[560px] flex-col items-center justify-center rounded-[30px] border border-red-200 bg-red-50 px-8 text-center">
        <h4 className="text-2xl font-semibold text-red-900">Generation issue</h4>
        <p className="mt-4 max-w-md text-sm leading-7 text-red-700">
          {generationError || "We could not generate the preview for this image."}
        </p>
      </div>
    )
  }

  const displayUrl = artworkUrl || croppedImageUrl
  const showFrame = productType === "print" && frameOption !== "none"

  return (
    <div className="rounded-[30px] border border-stone-300 bg-white p-5">
      <div className="relative min-h-[620px] overflow-hidden rounded-[28px] bg-[#fcfbf8] p-6">
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

        <div className="relative mx-auto flex h-full flex-col items-center">
          <div
            className={`w-full ${sizeMaxWidth(sizeOption)} rounded-[30px] transition-all duration-300 ${
              showFrame ? frameClasses(frameOption) : ""
            }`}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_20px_50px_rgba(28,25,23,0.08)]">
              {displayUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayUrl}
                  alt="Pet portrait artwork preview"
                  className="h-full w-full object-cover"
                />
              ) : null}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.45),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.38))]" />
              {customText ? (
                <div className="absolute inset-x-6 bottom-6 text-center">
                  <div className="inline-flex max-w-full items-center justify-center rounded-full bg-white/88 px-5 py-2 text-sm font-semibold text-stone-900 shadow-sm backdrop-blur">
                    <span className="truncate">{customText}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {!artworkUrl && croppedImageUrl ? (
            <p className="mt-6 max-w-md text-center text-sm leading-7 text-stone-500">
              Crop is ready. Generate the preview to create AI line art from this image.
            </p>
          ) : null}

          {needsRegeneration ? (
            <div className="mt-6 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900">
              Preview is outdated. Generate again to match the latest crop or style.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
