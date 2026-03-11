import { ImagePlus } from "lucide-react"

import ImageUploadCropper from "../controls/ImageUploadCropper"

export default function UploadSection({
  sourceImageUrl,
  croppedImageUrl,
  onSourceImageChange,
  onCroppedImageChange,
  onReplacePhoto,
}: {
  sourceImageUrl: string | null
  croppedImageUrl: string | null
  onSourceImageChange: (url: string | null) => void
  onCroppedImageChange: (url: string | null) => void
  onReplacePhoto: () => void
}) {
  return (
    <div className="rounded-[24px] bg-white p-1 xl:rounded-[30px] xl:border xl:border-stone-200 xl:bg-[#faf8f3] xl:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
            Image Upload
          </p>
          <h3 className="mt-2 text-xl font-semibold text-stone-950 xl:text-2xl">
            Upload and Crop Your Pet Photo
          </h3>
          <p className="mt-3 text-sm leading-6 text-stone-600 xl:leading-7">
            Choose a clear single-pet image. Crop and scale the artwork area before generating.
          </p>
        </div>
        <ImagePlus className="h-5 w-5 text-stone-400" />
      </div>

      <div className="mt-5 xl:mt-6">
        <div className="mb-4 rounded-[18px] border border-stone-200 bg-[#f8f7f4] px-4 py-3 xl:hidden">
          {sourceImageUrl ? (
            <p className="text-sm text-stone-700">
              <span className="font-semibold text-stone-950">1 photo uploaded</span>
              {" "}·{" "}
              <span className="font-semibold text-stone-950">Crop ready</span>
              {" "}· Ready for generation
            </p>
          ) : (
            <p className="text-sm text-stone-700">
              <span className="font-semibold text-stone-950">Single pet</span>
              {" "}· Bright lighting · Face visible
            </p>
          )}
        </div>
        <ImageUploadCropper
          sourceImageUrl={sourceImageUrl}
          croppedImageUrl={croppedImageUrl}
          onSourceImageChange={onSourceImageChange}
          onCroppedImageChange={onCroppedImageChange}
          onRemovePhoto={onReplacePhoto}
        />
      </div>
    </div>
  )
}
