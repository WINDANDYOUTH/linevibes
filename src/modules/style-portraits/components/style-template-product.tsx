"use client"

import { useEffect, useRef, useState, type MutableRefObject } from "react"
import { useRouter } from "next/navigation"

import { addToCart } from "@lib/data/cart"
import { getHistory, saveToHistory } from "@lib/portrait-history"
import { imageUrlToFile } from "@lib/util/image-url-to-file"
import type { PortraitTemplateProductMap } from "@lib/portrait/template-products"
import type { PortraitStyleTemplate } from "@lib/portrait/style-template"
import type { HttpTypes } from "@medusajs/types"
import ImageUploadCropper from "@modules/pet-line-portrait/components/GeneratorWorkspace/controls/ImageUploadCropper"

import {
  clearStyleTemplateDraft,
  readStyleTemplateDraft,
  saveStyleTemplateDraft,
} from "../lib/style-template-draft-storage"

type ActiveOutput = "digital" | "print" | "canvas"

type StyleTemplateProductProps = {
  countryCode: string
  product: HttpTypes.StoreProduct
  images: HttpTypes.StoreProductImage[]
  template: PortraitStyleTemplate
  templateProducts: PortraitTemplateProductMap
}

function getAspectClass(aspectRatio: string) {
  switch (aspectRatio) {
    case "1:1":
      return "aspect-square"
    case "4:5":
      return "aspect-[4/5]"
    case "16:9":
      return "aspect-[16/9]"
    case "3:4":
    default:
      return "aspect-[3/4]"
  }
}

type SerializedImageCache = {
  originalUrl: string | null
  serializedUrl: string | null
}

async function serializeImageUrlForDraft(
  imageUrl: string | null,
  cacheRef: MutableRefObject<SerializedImageCache>
) {
  if (!imageUrl) {
    cacheRef.current = {
      originalUrl: null,
      serializedUrl: null,
    }
    return null
  }

  if (cacheRef.current.originalUrl === imageUrl) {
    return cacheRef.current.serializedUrl
  }

  if (imageUrl.startsWith("data:") || /^https?:\/\//.test(imageUrl)) {
    cacheRef.current = {
      originalUrl: imageUrl,
      serializedUrl: imageUrl,
    }
    return imageUrl
  }

  const response = await fetch(imageUrl)
  const blob = await response.blob()
  const serializedUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
        return
      }

      reject(new Error("Could not serialize style template image draft"))
    }

    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })

  cacheRef.current = {
    originalUrl: imageUrl,
    serializedUrl,
  }

  return serializedUrl
}

export default function StyleTemplateProduct({
  countryCode,
  product,
  images,
  template,
  templateProducts,
}: StyleTemplateProductProps) {
  const router = useRouter()
  const sourceDraftCacheRef = useRef<SerializedImageCache>({
    originalUrl: null,
    serializedUrl: null,
  })
  const croppedDraftCacheRef = useRef<SerializedImageCache>({
    originalUrl: null,
    serializedUrl: null,
  })
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(null)
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null)
  const [generatedPortraitUrl, setGeneratedPortraitUrl] = useState<string | null>(
    null
  )
  const [sourceUploadUrl, setSourceUploadUrl] = useState<string | null>(null)
  const [croppedUploadUrl, setCroppedUploadUrl] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [status, setStatus] = useState<"idle" | "generating" | "success" | "error">(
    "idle"
  )
  const [error, setError] = useState<string | null>(null)
  const [activeOutput, setActiveOutput] = useState<ActiveOutput>("digital")
  const [isAdding, setIsAdding] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [activeGalleryImage, setActiveGalleryImage] = useState(
    template.previewImageUrl ?? images[0]?.url ?? product.thumbnail ?? null
  )

  const activeOutputProduct = templateProducts[activeOutput]
  const galleryImages = images.length > 0 ? images : []
  const bestPracticeTips = [
    "Use one clear face photo with good light.",
    "Front-facing or slight 3/4 angles work best.",
    "Avoid heavy filters, sunglasses, and group photos.",
  ]
  const inputPreviewUrl = croppedImageUrl ?? sourceImageUrl
  const outputAspectClass = getAspectClass(template.aspectRatio)

  useEffect(() => {
    let isMounted = true

    async function hydrateDraft() {
      try {
        const draft = await readStyleTemplateDraft(template.handle)

        if (!isMounted) {
          return
        }

        if (draft) {
          setSourceImageUrl(draft.sourceUploadUrl ?? draft.sourceImageUrl)
          setCroppedImageUrl(
            draft.croppedUploadUrl ??
              draft.croppedImageUrl ??
              draft.sourceUploadUrl ??
              draft.sourceImageUrl
          )
          setGeneratedPortraitUrl(draft.generatedPortraitUrl)
          setSourceUploadUrl(draft.sourceUploadUrl)
          setCroppedUploadUrl(draft.croppedUploadUrl)
          setSessionId(draft.sessionId)
          setActiveOutput(draft.activeOutput)
          setStatus(
            draft.generatedPortraitUrl && draft.sessionId ? "success" : "idle"
          )
          setError(null)
          return
        }

        const latestHistoryEntry = getHistory().find(
          (entry) => entry.style === template.templateId
        )

        if (!latestHistoryEntry) {
          return
        }

        setSourceImageUrl(
          latestHistoryEntry.originalUrl ?? latestHistoryEntry.croppedUrl ?? null
        )
        setCroppedImageUrl(
          latestHistoryEntry.croppedUrl ?? latestHistoryEntry.originalUrl ?? null
        )
        setGeneratedPortraitUrl(latestHistoryEntry.portraitUrl)
        setSourceUploadUrl(latestHistoryEntry.originalUrl ?? null)
        setCroppedUploadUrl(
          latestHistoryEntry.croppedUrl ?? latestHistoryEntry.originalUrl ?? null
        )
        setSessionId(latestHistoryEntry.sessionId)
        setStatus("success")
        setError(null)
      } catch (hydrateError) {
        console.warn("[StylePortrait] Failed to hydrate draft", hydrateError)
      } finally {
        if (isMounted) {
          setIsHydrated(true)
        }
      }
    }

    void hydrateDraft()

    return () => {
      isMounted = false
    }
  }, [template.handle, template.templateId])

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    let cancelled = false

    async function persistDraft() {
      try {
        const [serializedSourceImageUrl, serializedCroppedImageUrl] =
          await Promise.all([
            serializeImageUrlForDraft(sourceImageUrl, sourceDraftCacheRef),
            serializeImageUrlForDraft(croppedImageUrl, croppedDraftCacheRef),
          ])

        if (cancelled) {
          return
        }

        const shouldClearDraft =
          !serializedSourceImageUrl &&
          !serializedCroppedImageUrl &&
          !generatedPortraitUrl &&
          !sessionId

        if (shouldClearDraft) {
          await clearStyleTemplateDraft(template.handle)
          return
        }

        await saveStyleTemplateDraft({
          activeOutput,
          croppedImageUrl: serializedCroppedImageUrl,
          croppedUploadUrl,
          generatedPortraitUrl,
          sessionId,
          sourceImageUrl: serializedSourceImageUrl,
          sourceUploadUrl,
          templateHandle: template.handle,
          templateId: template.templateId,
          updatedAt: new Date().toISOString(),
        })
      } catch (persistError) {
        console.warn("[StylePortrait] Failed to persist draft", persistError)
      }
    }

    void persistDraft()

    return () => {
      cancelled = true
    }
  }, [
    activeOutput,
    croppedImageUrl,
    croppedUploadUrl,
    generatedPortraitUrl,
    isHydrated,
    sessionId,
    sourceImageUrl,
    sourceUploadUrl,
    template.handle,
    template.templateId,
  ])

  async function handleGenerate() {
    if (!inputPreviewUrl) {
      setError("Upload one portrait photo before generating.")
      return
    }

    setStatus("generating")
    setError(null)

    try {
      const file = await imageUrlToFile(inputPreviewUrl, template.handle)
      const originalFile =
        sourceImageUrl && sourceImageUrl !== inputPreviewUrl
          ? await imageUrlToFile(sourceImageUrl, `${template.handle}-original`)
          : null
      const formData = new FormData()
      formData.append("photo", file)
      if (originalFile) {
        formData.append("originalPhoto", originalFile)
      }
      formData.append("templateHandle", product.handle ?? template.handle)
      formData.append("countryCode", countryCode)

      const response = await fetch("/api/portrait/generate", {
        method: "POST",
        body: formData,
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          data?.error || "The portrait could not be generated for this style."
        )
      }

      setGeneratedPortraitUrl(data?.portraitUrl ?? null)
      setSourceUploadUrl(data?.originalUrl ?? null)
      setCroppedUploadUrl(data?.croppedUrl ?? data?.originalUrl ?? null)
      setSourceImageUrl(data?.originalUrl ?? sourceImageUrl)
      setCroppedImageUrl(
        data?.croppedUrl ?? data?.originalUrl ?? inputPreviewUrl
      )
      setSessionId(data?.sessionId ?? null)
      setStatus("success")

      if (data?.sessionId && data?.portraitUrl) {
        saveToHistory({
          sessionId: data.sessionId,
          portraitUrl: data.portraitUrl,
          originalUrl: data.originalUrl ?? undefined,
          croppedUrl: data.croppedUrl ?? data.originalUrl ?? undefined,
          style: template.templateId,
          createdAt: new Date().toISOString(),
        })
      }
    } catch (nextError) {
      setStatus("error")
      setError(
        nextError instanceof Error
          ? nextError.message
          : "The portrait could not be generated for this style."
      )
    }
  }

  function resetGeneratedState() {
    setGeneratedPortraitUrl(null)
    setSessionId(null)
    setSourceUploadUrl(null)
    setCroppedUploadUrl(null)
    setStatus("idle")
    setError(null)
  }

  function handleSourceImageChange(url: string | null) {
    setSourceImageUrl(url)
    resetGeneratedState()
  }

  function handleCroppedImageChange(url: string | null) {
    setCroppedImageUrl(url)
    resetGeneratedState()
  }

  function handleRemovePhoto() {
    setSourceImageUrl(null)
    setCroppedImageUrl(null)
    resetGeneratedState()
  }

  async function handleAddToCart() {
    if (!sessionId || !generatedPortraitUrl || !activeOutputProduct?.variantId) {
      setError("Generate a preview before adding this portrait to the cart.")
      return
    }

    setIsAdding(true)
    setError(null)

    try {
      await addToCart({
        variantId: activeOutputProduct.variantId,
        quantity: 1,
        countryCode,
        metadata: {
          generator_type: "style-template-portrait",
          portrait_session_id: sessionId,
          portrait_image_url: generatedPortraitUrl,
          portrait_style: template.title,
          source_image_url: sourceUploadUrl ?? "",
          cropped_image_url: croppedUploadUrl ?? sourceUploadUrl ?? "",
          template_handle: template.handle,
          template_id: template.templateId,
          template_group: template.group,
          template_family: template.family ?? "",
          reference_image_url: template.referenceImageUrl ?? "",
          variant_type: activeOutput,
          includes_digital_download: "true",
        },
      })

      router.push(`/${countryCode}/cart`)
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Unable to add this portrait to the cart."
      )
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-[#f6f1ea] text-stone-950">
      <div className="content-container py-8 md:py-12">
        <div className="mb-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div
              className={`overflow-hidden rounded-[32px] border border-stone-200 bg-white ${getAspectClass(
                template.aspectRatio
              )}`}
            >
              {activeGalleryImage ? (
                <img
                  src={activeGalleryImage}
                  alt={template.title}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            {galleryImages.length > 1 ? (
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.slice(0, 4).map((image) => {
                  const isActive = image.url === activeGalleryImage

                  return (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setActiveGalleryImage(image.url)}
                      className={`overflow-hidden rounded-2xl border bg-white ${
                        isActive
                          ? "border-stone-900"
                          : "border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      <div className="aspect-[3/4]">
                        <img
                          src={image.url}
                          alt={template.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-600">
                  {template.groupLabel}
                </span>
                {template.familyLabel ? (
                  <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                    {template.familyLabel}
                  </span>
                ) : null}
                {template.badge ? (
                  <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-900">
                    {template.badge}
                  </span>
                ) : null}
              </div>

              <div>
                <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                  {product.title}
                </h1>
                <p className="mt-4 max-w-xl text-base leading-8 text-stone-600">
                  {template.subtitle ??
                    product.description ??
                    "Upload one portrait photo and generate this exact scene direction with the same style, wardrobe, and mood."}
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
                    How It Works
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-stone-950">
                    Upload, crop, and generate
                  </h2>
                </div>
                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
                  1 photo
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <ImageUploadCropper
                  sourceImageUrl={sourceImageUrl}
                  croppedImageUrl={croppedImageUrl}
                  onSourceImageChange={handleSourceImageChange}
                  onCroppedImageChange={handleCroppedImageChange}
                  onRemovePhoto={handleRemovePhoto}
                  defaultAspectId="free"
                />

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                      Your Photo
                    </p>
                    <div
                      className={`mt-3 overflow-hidden rounded-[20px] bg-white ${outputAspectClass}`}
                    >
                      {inputPreviewUrl ? (
                        <img
                          src={inputPreviewUrl}
                          alt="Uploaded source preview"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-6 text-center text-sm text-stone-400">
                          Upload one portrait photo to preview it here.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                      Generated Preview
                    </p>
                    <div
                      className={`mt-3 overflow-hidden rounded-[20px] bg-white ${outputAspectClass}`}
                    >
                      {generatedPortraitUrl ? (
                        <img
                          src={generatedPortraitUrl}
                          alt="Generated portrait preview"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-6 text-center text-sm text-stone-400">
                          Your styled portrait preview appears here after generation.
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-xs leading-6 text-stone-500">
                      Preview images include a watermark. Purchased files are
                      delivered in higher resolution without the watermark.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!inputPreviewUrl || status === "generating"}
                  className="inline-flex w-full items-center justify-center rounded-full bg-stone-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                  {status === "generating" ? "Generating preview..." : "Create my portrait"}
                </button>

                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <div className="rounded-[24px] bg-[#f7f0e5] px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                    Best photo input
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-stone-600">
                    {bestPracticeTips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm text-stone-500">
                    Adjust the crop first if you want a tighter face framing or
                    more full-body composition.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
                    Purchase Options
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-stone-950">
                    Choose your preferred format
                  </h2>
                </div>
                {sessionId ? (
                  <span className="text-xs text-stone-400">
                    Session {sessionId.slice(0, 8)}
                  </span>
                ) : null}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {(
                  ["digital", "print", "canvas"] as ActiveOutput[]
                ).map((output) => {
                  const option = templateProducts[output]
                  const isActive = activeOutput === output

                  return (
                    <button
                      key={output}
                      type="button"
                      onClick={() => setActiveOutput(output)}
                      className={`rounded-[24px] border px-4 py-4 text-left transition ${
                        isActive
                          ? "border-stone-950 bg-stone-950 text-white"
                          : "border-stone-200 bg-stone-50 hover:border-stone-400"
                      }`}
                    >
                      <div className="text-xs font-semibold uppercase tracking-[0.24em]">
                        {output}
                      </div>
                      <div className="mt-2 text-lg font-semibold">
                        {option?.price || "Unavailable"}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-6 rounded-[24px] bg-stone-50 px-5 py-5">
                <h3 className="text-lg font-semibold text-stone-950">
                  {activeOutputProduct?.title ?? "Portrait option unavailable"}
                </h3>
                <p className="mt-2 text-sm leading-7 text-stone-600">
                  {activeOutput === "digital"
                    ? "Watermarked preview now, then a high-resolution watermark-free download after purchase."
                    : activeOutput === "print"
                    ? "Printed portrait plus the high-resolution watermark-free digital file after checkout."
                    : "Canvas-ready wall art plus the high-resolution watermark-free digital file after checkout."}
                </p>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={
                    !generatedPortraitUrl ||
                    !sessionId ||
                    !activeOutputProduct?.variantId ||
                    isAdding
                  }
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#9a2f45] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#84273a] disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                  {isAdding ? "Adding to cart..." : "Add this portrait to cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
