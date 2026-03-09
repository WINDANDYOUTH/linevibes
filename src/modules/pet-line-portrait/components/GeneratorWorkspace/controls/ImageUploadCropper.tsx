"use client"

import { useEffect, useRef, useState } from "react"
import { Crop, Upload } from "lucide-react"

export type ImageUploadCropperProps = {
  sourceImageUrl: string | null
  croppedImageUrl: string | null
  onSourceImageChange: (url: string | null) => void
  onCroppedImageChange: (url: string | null) => void
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Could not read image"))
    image.src = src
  })
}

export default function ImageUploadCropper({
  sourceImageUrl,
  croppedImageUrl,
  onSourceImageChange,
  onCroppedImageChange,
}: ImageUploadCropperProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const sourceObjectUrlRef = useRef<string | null>(null)
  const croppedObjectUrlRef = useRef<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (sourceObjectUrlRef.current) {
        URL.revokeObjectURL(sourceObjectUrlRef.current)
      }
      if (croppedObjectUrlRef.current) {
        URL.revokeObjectURL(croppedObjectUrlRef.current)
      }
    }
  }, [])

  useEffect(() => {
    let isActive = true

    async function updateCrop() {
      if (!sourceImageUrl) {
        if (croppedObjectUrlRef.current) {
          URL.revokeObjectURL(croppedObjectUrlRef.current)
          croppedObjectUrlRef.current = null
        }
        onCroppedImageChange(null)
        return
      }

      try {
        const image = await loadImage(sourceImageUrl)
        if (!isActive) {
          return
        }

        const canvas = document.createElement("canvas")
        canvas.width = 1024
        canvas.height = 1280
        const context = canvas.getContext("2d")

        if (!context) {
          throw new Error("Canvas is not available in this browser.")
        }

        const baseScale = Math.max(canvas.width / image.width, canvas.height / image.height)
        const scale = baseScale * zoom
        const drawWidth = image.width * scale
        const drawHeight = image.height * scale
        const offsetX = (canvas.width - drawWidth) / 2
        const offsetY = (canvas.height - drawHeight) / 2

        context.fillStyle = "#ffffff"
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/png")
        )

        if (!blob || !isActive) {
          return
        }

        if (croppedObjectUrlRef.current) {
          URL.revokeObjectURL(croppedObjectUrlRef.current)
        }

        const objectUrl = URL.createObjectURL(blob)
        croppedObjectUrlRef.current = objectUrl
        onCroppedImageChange(objectUrl)
      } catch (cropError) {
        const message =
          cropError instanceof Error ? cropError.message : "Could not update crop preview."
        setError(message)
      }
    }

    void updateCrop()

    return () => {
      isActive = false
    }
  }, [onCroppedImageChange, sourceImageUrl, zoom])

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (!file) {
            return
          }

          if (!file.type.startsWith("image/")) {
            setError("Please upload a JPG, PNG, or WEBP image.")
            return
          }

          if (file.size > 15 * 1024 * 1024) {
            setError("Please keep uploads under 15MB.")
            return
          }

          if (sourceObjectUrlRef.current) {
            URL.revokeObjectURL(sourceObjectUrlRef.current)
          }

          const objectUrl = URL.createObjectURL(file)
          sourceObjectUrlRef.current = objectUrl
          setZoom(1)
          setError(null)
          onSourceImageChange(objectUrl)
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex min-h-[240px] w-full flex-col items-center justify-center rounded-[28px] border border-dashed px-6 text-center transition ${
          sourceImageUrl
            ? "border-stone-300 bg-white"
            : "border-stone-300 bg-white hover:border-stone-500"
        }`}
      >
        {sourceImageUrl ? (
          <div className="w-full">
            <div className="relative mx-auto aspect-[4/3] max-w-md overflow-hidden rounded-[22px] border border-stone-200 bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sourceImageUrl} alt="Uploaded pet" className="h-full w-full object-cover" />
            </div>
            <p className="mt-4 text-sm font-semibold text-stone-900">
              Replace photo
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.24em] text-stone-400">
              Click to upload a different image
            </p>
          </div>
        ) : (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f6f1e8] text-stone-900">
              <Upload className="h-6 w-6" />
            </div>
            <p className="mt-5 text-lg font-semibold text-stone-900">
              Drag and drop your image here
            </p>
            <p className="mt-2 text-sm text-stone-500">or click to upload</p>
            <p className="mt-4 text-xs uppercase tracking-[0.24em] text-stone-400">
              JPG, PNG, WEBP
            </p>
          </>
        )}
      </button>

      {sourceImageUrl ? (
        <div className="mt-6 rounded-[24px] border border-stone-200 bg-white p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-stone-950">Crop and scale</p>
              <p className="mt-1 text-sm text-stone-500">
                Preview uses a fixed portrait crop. Scale changes only the image crop, not the text or product options.
              </p>
            </div>
            <Crop className="mt-1 h-5 w-5 text-stone-400" />
          </div>

          <div className="mt-5 rounded-[20px] border border-stone-200 bg-[#faf8f3] p-4">
            <div className="relative mx-auto aspect-[4/5] max-w-[260px] overflow-hidden rounded-[20px] border border-stone-200 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={croppedImageUrl || sourceImageUrl}
                alt="Cropped preview"
                className="h-full w-full object-cover"
              />
            </div>

            <label className="mt-5 block text-sm font-medium text-stone-700">
              Scale
            </label>
            <input
              type="range"
              min={1}
              max={1.8}
              step={0.05}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="mt-3 w-full"
            />
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}
    </div>
  )
}
