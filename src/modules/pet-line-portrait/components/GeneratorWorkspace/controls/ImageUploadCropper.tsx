"use client"

import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Crop, Minus, Plus, RotateCcw, Upload, X } from "lucide-react"

export type ImageUploadCropperProps = {
  sourceImageUrl: string | null
  croppedImageUrl: string | null
  onSourceImageChange: (url: string | null) => void
  onCroppedImageChange: (url: string | null) => void
  onRemovePhoto?: () => void
}

type CropRect = {
  x: number
  y: number
  width: number
  height: number
}

type AspectPreset = {
  id: "free" | "1:1" | "4:5" | "3:4" | "2:3"
  label: string
  ratio: number | null
  recommended?: boolean
}

type CropDraft = {
  rect: CropRect
  aspectId: AspectPreset["id"]
}

type HandleDirection = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw"

type DragState =
  | {
      kind: "move"
      pointerId: number
      startX: number
      startY: number
      startRect: CropRect
    }
  | {
      kind: "resize"
      pointerId: number
      startX: number
      startY: number
      startRect: CropRect
      handle: HandleDirection
    }

const MIN_CROP_SIZE = 120
const MAX_OUTPUT_DIMENSION = 1536

const ASPECT_PRESETS: AspectPreset[] = [
  { id: "free", label: "Free", ratio: null },
  { id: "1:1", label: "1:1", ratio: 1 },
  { id: "4:5", label: "4:5", ratio: 4 / 5, recommended: true },
  { id: "3:4", label: "3:4", ratio: 3 / 4 },
  { id: "2:3", label: "2:3", ratio: 2 / 3 },
]

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Could not read image"))
    image.src = src
  })
}

function getAspectPreset(aspectId: AspectPreset["id"]) {
  return (
    ASPECT_PRESETS.find((preset) => preset.id === aspectId) ?? ASPECT_PRESETS[2]
  )
}

function clampCropRect(rect: CropRect, image: HTMLImageElement) {
  const width = Math.max(MIN_CROP_SIZE, Math.min(rect.width, image.width))
  const height = Math.max(MIN_CROP_SIZE, Math.min(rect.height, image.height))
  const x = Math.min(Math.max(0, rect.x), image.width - width)
  const y = Math.min(Math.max(0, rect.y), image.height - height)

  return { x, y, width, height }
}

function createAspectCropRect(image: HTMLImageElement, ratio: number | null) {
  const inset = 0.08
  const maxWidth = image.width * (1 - inset * 2)
  const maxHeight = image.height * (1 - inset * 2)

  if (!ratio) {
    return clampCropRect(
      {
        x: image.width * inset,
        y: image.height * inset,
        width: maxWidth,
        height: maxHeight,
      },
      image
    )
  }

  let width = maxWidth
  let height = width / ratio

  if (height > maxHeight) {
    height = maxHeight
    width = height * ratio
  }

  return clampCropRect(
    {
      x: (image.width - width) / 2,
      y: (image.height - height) / 2,
      width,
      height,
    },
    image
  )
}

function createFullImageCropRect(image: HTMLImageElement) {
  return {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  }
}

function normalizeCropRectToAspect(
  rect: CropRect,
  image: HTMLImageElement,
  ratio: number | null
) {
  if (!ratio) {
    return clampCropRect(rect, image)
  }

  const centerX = rect.x + rect.width / 2
  const centerY = rect.y + rect.height / 2
  let width = rect.width
  let height = rect.height

  if (width / height > ratio) {
    width = height * ratio
  } else {
    height = width / ratio
  }

  const maxWidthFromHeight = image.height * ratio
  const maxHeightFromWidth = image.width / ratio

  width = Math.min(width, image.width, maxWidthFromHeight)
  height = Math.min(height, image.height, maxHeightFromWidth)
  width = Math.max(MIN_CROP_SIZE, width)
  height = Math.max(MIN_CROP_SIZE, height)

  return clampCropRect(
    {
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height,
    },
    image
  )
}

function resizeFreeformRect(
  startRect: CropRect,
  handle: HandleDirection,
  deltaX: number,
  deltaY: number,
  image: HTMLImageElement
) {
  let left = startRect.x
  let top = startRect.y
  let right = startRect.x + startRect.width
  let bottom = startRect.y + startRect.height

  if (handle.includes("w")) {
    left = Math.min(
      startRect.x + startRect.width - MIN_CROP_SIZE,
      Math.max(0, left + deltaX)
    )
  }

  if (handle.includes("e")) {
    right = Math.max(
      startRect.x + MIN_CROP_SIZE,
      Math.min(image.width, right + deltaX)
    )
  }

  if (handle.includes("n")) {
    top = Math.min(
      startRect.y + startRect.height - MIN_CROP_SIZE,
      Math.max(0, top + deltaY)
    )
  }

  if (handle.includes("s")) {
    bottom = Math.max(
      startRect.y + MIN_CROP_SIZE,
      Math.min(image.height, bottom + deltaY)
    )
  }

  return clampCropRect(
    {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
    },
    image
  )
}

function resizeFixedAspectRect(
  startRect: CropRect,
  handle: HandleDirection,
  deltaX: number,
  deltaY: number,
  image: HTMLImageElement,
  ratio: number
) {
  const centerX = startRect.x + startRect.width / 2
  const centerY = startRect.y + startRect.height / 2
  const xSign = handle.includes("w") ? -1 : handle.includes("e") ? 1 : 0
  const ySign = handle.includes("n") ? -1 : handle.includes("s") ? 1 : 0
  const dominantDelta =
    xSign !== 0 && ySign !== 0
      ? Math.max(Math.abs(deltaX), Math.abs(deltaY)) *
        Math.sign(Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : deltaY)
      : xSign !== 0
      ? deltaX
      : deltaY

  let width = startRect.width
  let height = startRect.height

  if (xSign !== 0 && ySign !== 0) {
    width = startRect.width + dominantDelta * xSign
    height = width / ratio
  } else if (xSign !== 0) {
    width = startRect.width + deltaX * xSign
    height = width / ratio
  } else {
    height = startRect.height + deltaY * ySign
    width = height * ratio
  }

  const maxWidthByBounds = Math.min(image.width, image.height * ratio)
  const maxHeightByBounds = Math.min(image.height, image.width / ratio)

  width = Math.max(MIN_CROP_SIZE, Math.min(width, maxWidthByBounds))
  height = Math.max(MIN_CROP_SIZE, Math.min(height, maxHeightByBounds))

  return clampCropRect(
    {
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height,
    },
    image
  )
}

function scaleCropRect(
  rect: CropRect,
  image: HTMLImageElement,
  scaleDelta: number,
  ratio: number | null
) {
  const centerX = rect.x + rect.width / 2
  const centerY = rect.y + rect.height / 2
  const nextWidth = rect.width * scaleDelta
  const nextHeight = rect.height * scaleDelta

  const scaledRect = clampCropRect(
    {
      x: centerX - nextWidth / 2,
      y: centerY - nextHeight / 2,
      width: nextWidth,
      height: nextHeight,
    },
    image
  )

  return normalizeCropRectToAspect(scaledRect, image, ratio)
}

function cropRectToObjectUrl(image: HTMLImageElement, cropRect: CropRect) {
  const scale = Math.min(
    1,
    MAX_OUTPUT_DIMENSION / Math.max(cropRect.width, cropRect.height)
  )
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, Math.round(cropRect.width * scale))
  canvas.height = Math.max(1, Math.round(cropRect.height * scale))
  const context = canvas.getContext("2d")

  if (!context) {
    throw new Error("Canvas is not available in this browser.")
  }

  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(
    image,
    cropRect.x,
    cropRect.y,
    cropRect.width,
    cropRect.height,
    0,
    0,
    canvas.width,
    canvas.height
  )

  return new Promise<string>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not update crop preview."))
        return
      }

      resolve(URL.createObjectURL(blob))
    }, "image/png")
  })
}

export default function ImageUploadCropper({
  sourceImageUrl,
  croppedImageUrl,
  onSourceImageChange,
  onCroppedImageChange,
  onRemovePhoto,
}: ImageUploadCropperProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const sourceObjectUrlRef = useRef<string | null>(null)
  const croppedObjectUrlRef = useRef<string | null>(null)
  const dragStateRef = useRef<DragState | null>(null)
  const autoOpenCropperRef = useRef(false)

  const [error, setError] = useState<string | null>(null)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    null
  )
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 })
  const [committedDraft, setCommittedDraft] = useState<CropDraft | null>(null)
  const [draft, setDraft] = useState<CropDraft | null>(null)

  useEffect(() => {
    if (!sourceImageUrl) {
      setImageElement(null)
      setCommittedDraft(null)
      setDraft(null)
      setIsCropModalOpen(false)
      setIsImageLoading(false)
      if (sourceObjectUrlRef.current) {
        URL.revokeObjectURL(sourceObjectUrlRef.current)
        sourceObjectUrlRef.current = null
      }
      if (croppedObjectUrlRef.current) {
        URL.revokeObjectURL(croppedObjectUrlRef.current)
        croppedObjectUrlRef.current = null
      }
      onCroppedImageChange(null)
      return
    }

    let isActive = true
    setIsImageLoading(true)

    loadImage(sourceImageUrl)
      .then((image) => {
        if (!isActive) {
          return
        }

        const shouldReuseExistingCrop = croppedImageUrl === sourceImageUrl
        const nextDraft: CropDraft = shouldReuseExistingCrop
          ? {
              aspectId: "4:5",
              rect: createFullImageCropRect(image),
            }
          : {
              aspectId: "4:5",
              rect: createAspectCropRect(image, getAspectPreset("4:5").ratio),
            }

        setImageElement(image)
        setCommittedDraft(nextDraft)
        setDraft(nextDraft)
        setError(null)
        setIsImageLoading(false)

        if (autoOpenCropperRef.current) {
          setIsCropModalOpen(true)
          autoOpenCropperRef.current = false
        }
      })
      .catch((loadError) => {
        if (!isActive) {
          return
        }

        const message =
          loadError instanceof Error
            ? loadError.message
            : "Could not read image."
        setError(message)
        setIsImageLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [onCroppedImageChange, sourceImageUrl])

  useEffect(() => {
    if (
      !stageRef.current ||
      !isCropModalOpen ||
      typeof ResizeObserver === "undefined"
    ) {
      return
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) {
        return
      }

      setStageSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })

    observer.observe(stageRef.current)

    return () => observer.disconnect()
  }, [isCropModalOpen])

  useEffect(() => {
    if (!isCropModalOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDraft(committedDraft)
        setIsCropModalOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [committedDraft, isCropModalOpen])

  useEffect(() => {
    if (!sourceImageUrl || !imageElement || !committedDraft) {
      return
    }

    let isActive = true

    const updateCrop = async () => {
      try {
        const shouldReuseExistingCrop =
          !!croppedImageUrl &&
          croppedImageUrl === sourceImageUrl &&
          committedDraft.rect.x === 0 &&
          committedDraft.rect.y === 0 &&
          committedDraft.rect.width === imageElement.width &&
          committedDraft.rect.height === imageElement.height

        if (shouldReuseExistingCrop) {
          onCroppedImageChange(croppedImageUrl)
          return
        }

        const objectUrl = await cropRectToObjectUrl(
          imageElement,
          committedDraft.rect
        )

        if (!isActive) {
          URL.revokeObjectURL(objectUrl)
          return
        }

        if (croppedObjectUrlRef.current) {
          URL.revokeObjectURL(croppedObjectUrlRef.current)
        }

        croppedObjectUrlRef.current = objectUrl
        onCroppedImageChange(objectUrl)
      } catch (cropError) {
        const message =
          cropError instanceof Error
            ? cropError.message
            : "Could not update crop preview."
        setError(message)
      }
    }

    void updateCrop()

    return () => {
      isActive = false
    }
  }, [committedDraft, imageElement, onCroppedImageChange, sourceImageUrl])

  const imageViewport = useMemo(() => {
    if (!imageElement || !stageSize.width || !stageSize.height) {
      return null
    }

    const scale = Math.min(
      stageSize.width / imageElement.width,
      stageSize.height / imageElement.height
    )
    const width = imageElement.width * scale
    const height = imageElement.height * scale

    return {
      scale,
      width,
      height,
      left: (stageSize.width - width) / 2,
      top: (stageSize.height - height) / 2,
    }
  }, [imageElement, stageSize.height, stageSize.width])

  const draftCropStyle =
    imageViewport && draft
      ? {
          left: imageViewport.left + draft.rect.x * imageViewport.scale,
          top: imageViewport.top + draft.rect.y * imageViewport.scale,
          width: draft.rect.width * imageViewport.scale,
          height: draft.rect.height * imageViewport.scale,
        }
      : null

  const currentAspectPreset = getAspectPreset(draft?.aspectId ?? "4:5")
  const currentAspectLabel = `${currentAspectPreset.label}${
    currentAspectPreset.recommended ? " Recommended" : ""
  }`

  function resetDraftToCommitted() {
    setDraft(committedDraft)
  }

  function closeModal() {
    resetDraftToCommitted()
    setIsCropModalOpen(false)
  }

  function openModal() {
    resetDraftToCommitted()
    setIsCropModalOpen(true)
  }

  function updateSourceImage(file: File) {
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

    if (croppedObjectUrlRef.current) {
      URL.revokeObjectURL(croppedObjectUrlRef.current)
      croppedObjectUrlRef.current = null
    }

    const objectUrl = URL.createObjectURL(file)
    sourceObjectUrlRef.current = objectUrl
    autoOpenCropperRef.current = true
    setError(null)
    onCroppedImageChange(null)
    onSourceImageChange(objectUrl)
  }

  function handleAspectChange(aspectId: AspectPreset["id"]) {
    if (!imageElement || !draft) {
      return
    }

    const nextPreset = getAspectPreset(aspectId)
    const nextRect =
      aspectId === "free"
        ? clampCropRect(draft.rect, imageElement)
        : normalizeCropRectToAspect(draft.rect, imageElement, nextPreset.ratio)

    setDraft({
      aspectId,
      rect: nextRect,
    })
  }

  function nudgeZoom(scaleDelta: number) {
    if (!draft || !imageElement) {
      return
    }

    setDraft({
      ...draft,
      rect: scaleCropRect(
        draft.rect,
        imageElement,
        scaleDelta,
        getAspectPreset(draft.aspectId).ratio
      ),
    })
  }

  function beginDrag(
    event: ReactPointerEvent<HTMLElement>,
    nextState: DragState
  ) {
    dragStateRef.current = nextState
    if (stageRef.current) {
      stageRef.current.setPointerCapture(event.pointerId)
    }
    event.preventDefault()
    event.stopPropagation()
  }

  function handleStagePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current

    if (!dragState || !draft || !imageElement || !imageViewport) {
      return
    }

    const deltaX = (event.clientX - dragState.startX) / imageViewport.scale
    const deltaY = (event.clientY - dragState.startY) / imageViewport.scale
    const ratio = getAspectPreset(draft.aspectId).ratio

    if (dragState.kind === "move") {
      setDraft({
        ...draft,
        rect: clampCropRect(
          {
            ...dragState.startRect,
            x: dragState.startRect.x + deltaX,
            y: dragState.startRect.y + deltaY,
          },
          imageElement
        ),
      })
      return
    }

    setDraft({
      ...draft,
      rect: ratio
        ? resizeFixedAspectRect(
            dragState.startRect,
            dragState.handle,
            deltaX,
            deltaY,
            imageElement,
            ratio
          )
        : resizeFreeformRect(
            dragState.startRect,
            dragState.handle,
            deltaX,
            deltaY,
            imageElement
          ),
    })
  }

  function handleStagePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragStateRef.current?.pointerId !== event.pointerId) {
      return
    }

    dragStateRef.current = null
    if (stageRef.current?.hasPointerCapture(event.pointerId)) {
      stageRef.current.releasePointerCapture(event.pointerId)
    }
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (!draft || !imageElement) {
      return
    }

    event.preventDefault()
    nudgeZoom(event.deltaY > 0 ? 1.08 : 0.92)
  }

  function applyCrop() {
    if (!draft || !imageElement) {
      return
    }

    setCommittedDraft({
      aspectId: draft.aspectId,
      rect: normalizeCropRectToAspect(
        clampCropRect(draft.rect, imageElement),
        imageElement,
        getAspectPreset(draft.aspectId).ratio
      ),
    })
    setIsCropModalOpen(false)
  }

  const handleMeta: Array<{
    handle: HandleDirection
    className: string
    cursor: string
  }> = [
    {
      handle: "nw",
      className: "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
      cursor: "nwse-resize",
    },
    {
      handle: "ne",
      className: "right-0 top-0 translate-x-1/2 -translate-y-1/2",
      cursor: "nesw-resize",
    },
    {
      handle: "sw",
      className: "left-0 bottom-0 -translate-x-1/2 translate-y-1/2",
      cursor: "nesw-resize",
    },
    {
      handle: "se",
      className: "right-0 bottom-0 translate-x-1/2 translate-y-1/2",
      cursor: "nwse-resize",
    },
  ]

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

          updateSourceImage(file)
          event.target.value = ""
        }}
      />

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={`inline-flex items-center justify-center gap-3 rounded-[14px] border px-4 py-4 text-left transition sm:min-h-[72px] ${
              sourceImageUrl
                ? "min-h-[64px] border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                : "min-h-[120px] border-[#e2ddd4] bg-[#f7f5ef] hover:border-[#cfc8bb] hover:bg-[#f4f1e8] sm:flex-1"
            }`}
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-white text-stone-900 shadow-[0_10px_20px_rgba(15,23,42,0.06)]">
              <Upload className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-stone-950">
                {sourceImageUrl ? "Replace photo" : "Upload photo"}
              </span>
              <span className="mt-1 block text-xs leading-5 text-stone-500">
                JPG, PNG, WEBP
              </span>
            </span>
          </button>

          {sourceImageUrl ? (
            <button
              type="button"
              onClick={openModal}
              className="inline-flex min-h-[64px] items-center justify-center gap-2 rounded-[14px] border border-stone-200 bg-[#faf8f3] px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 sm:min-w-[148px]"
            >
              <Crop className="h-4 w-4" />
              Edit crop
            </button>
          ) : null}
        </div>

        {sourceImageUrl ? (
          <div className="overflow-hidden rounded-[16px] border border-stone-200 bg-[#faf8f3]">
            <div className="flex items-center gap-3 p-3">
              <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[14px] border border-stone-200 bg-white sm:h-20 sm:w-20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={croppedImageUrl || sourceImageUrl}
                  alt="Current crop"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-stone-900">Crop</p>
                <p className="mt-0.5 text-sm text-stone-500">
                  <span className="font-semibold text-stone-700">
                    {currentAspectLabel}
                  </span>
                </p>
              </div>

              {onRemovePhoto ? (
                <button
                  type="button"
                  onClick={onRemovePhoto}
                  className="self-start rounded-[10px] px-2 py-1 text-sm font-medium text-stone-500 transition hover:text-stone-900"
                >
                  Remove
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {isCropModalOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-2 sm:p-4 backdrop-blur-sm">
          <div className="flex max-h-[96svh] w-[calc(100vw-16px)] max-w-[1240px] flex-col overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_35px_120px_rgba(0,0,0,0.28)] sm:max-h-[92vh] sm:w-full sm:rounded-[32px]">
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-4 py-4 sm:px-6 sm:py-5">
              <div>
                <h3 className="text-xl font-semibold text-stone-950 sm:text-2xl">
                  Crop
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 text-stone-600 transition hover:bg-stone-50 hover:text-stone-950"
                aria-label="Close cropper"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="h-[38svh] min-h-[250px] shrink-0 border-b border-stone-200 bg-[#111111] p-3 sm:h-[40svh] sm:min-h-[360px] sm:p-4 lg:h-auto lg:min-h-[300px] lg:border-b-0 lg:border-r lg:p-6">
                <div
                  ref={stageRef}
                  className="relative h-full min-h-[274px] w-full overflow-hidden rounded-[20px] bg-black sm:min-h-[320px] sm:rounded-[24px]"
                  onPointerMove={handleStagePointerMove}
                  onPointerUp={handleStagePointerUp}
                  onPointerCancel={handleStagePointerUp}
                  onWheel={handleWheel}
                >
                  {isImageLoading ? (
                    <div className="flex h-full items-center justify-center text-sm text-stone-300">
                      Loading image...
                    </div>
                  ) : null}

                  {imageViewport && sourceImageUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sourceImageUrl}
                        alt="Crop source"
                        draggable={false}
                        className="pointer-events-none absolute max-w-none select-none"
                        style={{
                          left: `${imageViewport.left}px`,
                          top: `${imageViewport.top}px`,
                          width: `${imageViewport.width}px`,
                          height: `${imageViewport.height}px`,
                        }}
                      />

                      {draftCropStyle ? (
                        <>
                          <div
                            className="pointer-events-none absolute bg-black/58"
                            style={{
                              left: `${imageViewport.left}px`,
                              top: `${imageViewport.top}px`,
                              width: `${imageViewport.width}px`,
                              height: `${Math.max(
                                0,
                                draftCropStyle.top - imageViewport.top
                              )}px`,
                            }}
                          />
                          <div
                            className="pointer-events-none absolute bg-black/58"
                            style={{
                              left: `${imageViewport.left}px`,
                              top: `${
                                draftCropStyle.top + draftCropStyle.height
                              }px`,
                              width: `${imageViewport.width}px`,
                              height: `${Math.max(
                                0,
                                imageViewport.top +
                                  imageViewport.height -
                                  (draftCropStyle.top + draftCropStyle.height)
                              )}px`,
                            }}
                          />
                          <div
                            className="pointer-events-none absolute bg-black/58"
                            style={{
                              left: `${imageViewport.left}px`,
                              top: `${draftCropStyle.top}px`,
                              width: `${Math.max(
                                0,
                                draftCropStyle.left - imageViewport.left
                              )}px`,
                              height: `${draftCropStyle.height}px`,
                            }}
                          />
                          <div
                            className="pointer-events-none absolute bg-black/58"
                            style={{
                              left: `${
                                draftCropStyle.left + draftCropStyle.width
                              }px`,
                              top: `${draftCropStyle.top}px`,
                              width: `${Math.max(
                                0,
                                imageViewport.left +
                                  imageViewport.width -
                                  (draftCropStyle.left + draftCropStyle.width)
                              )}px`,
                              height: `${draftCropStyle.height}px`,
                            }}
                          />
                          <div
                            className="absolute touch-none cursor-move border-[3px] border-white shadow-[0_0_0_1px_rgba(255,255,255,0.2)]"
                            style={draftCropStyle}
                            onPointerDown={(event) => {
                              if (!draft) {
                                return
                              }

                              beginDrag(event, {
                                kind: "move",
                                pointerId: event.pointerId,
                                startX: event.clientX,
                                startY: event.clientY,
                                startRect: draft.rect,
                              })
                            }}
                          >
                            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
                              {Array.from({ length: 9 }).map((_, index) => (
                                <div
                                  key={index}
                                  className="border border-white/30"
                                />
                              ))}
                            </div>
                            {handleMeta.map(({ handle, className, cursor }) => (
                              <span
                                key={handle}
                                className={`absolute h-8 w-8 rounded-full border-2 border-stone-300 bg-white shadow ${className} sm:h-6 sm:w-6 sm:rounded-sm sm:border`}
                                style={{ cursor }}
                                onPointerDown={(event) => {
                                  if (!draft) {
                                    return
                                  }

                                  beginDrag(event, {
                                    kind: "resize",
                                    pointerId: event.pointerId,
                                    startX: event.clientX,
                                    startY: event.clientY,
                                    startRect: draft.rect,
                                    handle,
                                  })
                                }}
                              />
                            ))}
                          </div>
                        </>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain bg-[#fcfbf8] p-4 pb-4 sm:p-5 lg:p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                    Ratio
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ASPECT_PRESETS.map((preset) => {
                      const selected = draft?.aspectId === preset.id
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleAspectChange(preset.id)}
                          className={`rounded-full border px-4 py-2 text-sm transition ${
                            selected
                              ? "border-stone-950 bg-stone-950 text-white"
                              : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
                          }`}
                        >
                          <span className="font-semibold">{preset.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => nudgeZoom(1.08)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition hover:border-stone-400"
                      aria-label="Zoom out"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => nudgeZoom(0.92)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition hover:border-stone-400"
                      aria-label="Zoom in"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!imageElement || !draft) {
                          return
                        }

                        setDraft({
                          aspectId: draft.aspectId,
                          rect: createAspectCropRect(
                            imageElement,
                            getAspectPreset(draft.aspectId).ratio
                          ),
                        })
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-stone-400"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </button>
                  </div>
                </div>

                <div className="rounded-[20px] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-500">
                  Drag to move. Corners resize.
                </div>
              </div>
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-stone-200 bg-white px-4 py-4 sm:flex sm:items-center sm:justify-end sm:px-6 sm:py-5">
              <button
                type="button"
                onClick={closeModal}
                className="w-full rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCrop}
                className="w-full rounded-full bg-[#b33e56] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9d364c] sm:w-auto"
              >
                Apply crop
              </button>
            </div>
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
