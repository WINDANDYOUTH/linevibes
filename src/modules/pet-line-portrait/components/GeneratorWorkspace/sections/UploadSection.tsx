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
    <div className="rounded-[18px] bg-white">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
            Upload
          </p>
          <h3 className="mt-1 text-lg font-semibold text-stone-950 md:text-xl">
            Photo
          </h3>
        </div>
        <ImagePlus className="h-5 w-5 text-stone-400" />
      </div>

      <div className="mt-4">
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
