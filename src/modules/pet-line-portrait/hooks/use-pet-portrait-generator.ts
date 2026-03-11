"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react"
import { useParams, useRouter } from "next/navigation"

import { useAnalytics } from "@lib/analytics/provider"
import { addToCart } from "@lib/data/cart"
import { getHistory, saveToHistory } from "@lib/portrait-history"

import { calculateGeneratorPrice } from "../config/pricing"
import { PET_PORTRAIT_STYLES } from "../config/styles"
import {
  clearGeneratorDraft,
  readGeneratorDraft,
  saveGeneratorDraft,
} from "../lib/generator-draft-storage"
import type {
  FrameOption,
  GeneratedArtwork,
  GeneratedPortrait,
  GeneratorActions,
  GeneratorComputed,
  GeneratorState,
  LastGeneratedInput,
  PortraitStyle,
  ProductType,
  SizeOption,
  TextAlignOption,
  TextFontOption,
} from "../types/generator"

type TemplateProductsResponse = {
  digital: { variantId: string; price: string } | null
  print: { variantId: string; price: string } | null
}

type AccountPortraitResponse = {
  sessionId: string
  style: string
  originalUrl: string | null
  portraitUrl: string | null
  createdAt: string
}

type SerializedImageCache = {
  originalUrl: string | null
  serializedUrl: string | null
}

const ALLOWED_TEXT_COLORS = new Set(["#111111", "#dc2626", "#2563eb"])
const PORTRAIT_RETENTION_WINDOW_MS = 7 * 24 * 60 * 60 * 1000

const emptyGeneratedArtwork: GeneratedArtwork = {
  imageUrl: null,
  originalUrl: null,
  generatedAt: null,
  sessionId: null,
  styleId: null,
  stylePromptKey: null,
  provider: null,
  model: null,
}

const initialState: GeneratorState = {
  aiInput: {
    sourceImageUrl: null,
    croppedImageUrl: null,
    selectedStyleId: PET_PORTRAIT_STYLES[0]?.id ?? null,
  },
  presentation: {
    customText: "",
    textFont: "sans",
    textColor: "#111111",
    textAlign: "center",
    textSize: 26,
    productType: "digital",
    frameOption: "none",
    sizeOption: "medium",
  },
  generatedArtwork: emptyGeneratedArtwork,
  generatedPortraits: [],
  activePortraitSessionId: null,
  generationStatus: "idle",
  cartStatus: "idle",
  generationError: null,
  cartError: null,
  lastGeneratedInput: null,
}

export type UsePetPortraitGeneratorReturn = {
  state: GeneratorState
  actions: GeneratorActions
  computed: GeneratorComputed
  styles: PortraitStyle[]
}

async function readJsonOrText(response: Response) {
  const raw = await response.text()

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    return { error: raw }
  }
}

async function imageUrlToFile(imageUrl: string, filename: string) {
  const response = await fetch(imageUrl)
  const blob = await response.blob()
  const ext = blob.type.split("/")[1] || "png"
  return new File([blob], `${filename}.${ext}`, {
    type: blob.type || "image/png",
  })
}

function normalizeHexColor(input: string, fallback: string) {
  const normalized = input.trim()
  const normalizedLower = normalized.toLowerCase()
  return ALLOWED_TEXT_COLORS.has(normalizedLower) ? normalizedLower : fallback
}

function isWithinRetentionWindow(createdAt: string) {
  const createdAtMs = new Date(createdAt).getTime()

  if (!Number.isFinite(createdAtMs)) {
    return false
  }

  return Date.now() - createdAtMs <= PORTRAIT_RETENTION_WINDOW_MS
}

function getStyleById(styleId: string | null) {
  return PET_PORTRAIT_STYLES.find((style) => style.id === styleId) ?? null
}

function getStyleByPromptKey(promptKey: string | null) {
  return (
    PET_PORTRAIT_STYLES.find((style) => style.promptKey === promptKey) ?? null
  )
}

function buildGeneratedArtwork(
  portrait: GeneratedPortrait | null
): GeneratedArtwork {
  if (!portrait) {
    return emptyGeneratedArtwork
  }

  return {
    imageUrl: portrait.imageUrl,
    originalUrl: portrait.originalUrl,
    generatedAt: portrait.generatedAt,
    sessionId: portrait.sessionId,
    styleId: portrait.styleId,
    stylePromptKey: portrait.stylePromptKey,
    provider: portrait.provider,
    model: portrait.model,
  }
}

function buildLastGeneratedInput(
  portrait: GeneratedPortrait | null
): LastGeneratedInput | null {
  if (!portrait) {
    return null
  }

  return {
    croppedImageUrl: portrait.originalUrl,
    selectedStyleId: portrait.styleId,
  }
}

function mapHistoryEntryToPortrait(entry: {
  sessionId: string
  portraitUrl: string
  originalUrl?: string
  style: string
  createdAt: string
}): GeneratedPortrait | null {
  if (
    !entry.sessionId ||
    !entry.portraitUrl ||
    !isWithinRetentionWindow(entry.createdAt)
  ) {
    return null
  }

  const style = getStyleByPromptKey(entry.style)

  return {
    sessionId: entry.sessionId,
    imageUrl: entry.portraitUrl,
    originalUrl: entry.originalUrl ?? null,
    generatedAt: entry.createdAt,
    styleId: style?.id ?? null,
    stylePromptKey: entry.style || style?.promptKey || null,
    provider: null,
    model: null,
  }
}

function mapAccountPortraitToGeneratedPortrait(
  portrait: AccountPortraitResponse
): GeneratedPortrait | null {
  if (
    !portrait.sessionId ||
    !portrait.portraitUrl ||
    !isWithinRetentionWindow(portrait.createdAt)
  ) {
    return null
  }

  const style = getStyleByPromptKey(portrait.style)

  return {
    sessionId: portrait.sessionId,
    imageUrl: portrait.portraitUrl,
    originalUrl: portrait.originalUrl,
    generatedAt: portrait.createdAt,
    styleId: style?.id ?? null,
    stylePromptKey: portrait.style || style?.promptKey || null,
    provider: null,
    model: null,
  }
}

function mergePortraitLibraries(...libraries: GeneratedPortrait[][]) {
  const portraitMap = new Map<string, GeneratedPortrait>()

  for (const library of libraries) {
    for (const portrait of library) {
      const existing = portraitMap.get(portrait.sessionId)

      if (!existing) {
        portraitMap.set(portrait.sessionId, portrait)
        continue
      }

      const existingDate = new Date(existing.generatedAt).getTime()
      const nextDate = new Date(portrait.generatedAt).getTime()

      if (!Number.isFinite(existingDate) || nextDate >= existingDate) {
        portraitMap.set(portrait.sessionId, portrait)
      }
    }
  }

  return Array.from(portraitMap.values()).sort((left, right) => {
    const leftDate = new Date(left.generatedAt).getTime()
    const rightDate = new Date(right.generatedAt).getTime()

    if (!Number.isFinite(leftDate) && !Number.isFinite(rightDate)) {
      return 0
    }

    if (!Number.isFinite(leftDate)) {
      return 1
    }

    if (!Number.isFinite(rightDate)) {
      return -1
    }

    return rightDate - leftDate
  })
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

      reject(new Error("Could not serialize image draft"))
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

function isDefaultPresentation(state: GeneratorState) {
  return (
    state.presentation.customText === initialState.presentation.customText &&
    state.presentation.textFont === initialState.presentation.textFont &&
    state.presentation.textColor === initialState.presentation.textColor &&
    state.presentation.textAlign === initialState.presentation.textAlign &&
    state.presentation.textSize === initialState.presentation.textSize &&
    state.presentation.productType === initialState.presentation.productType &&
    state.presentation.frameOption === initialState.presentation.frameOption &&
    state.presentation.sizeOption === initialState.presentation.sizeOption &&
    state.aiInput.selectedStyleId === initialState.aiInput.selectedStyleId
  )
}

export function usePetPortraitGenerator(): UsePetPortraitGeneratorReturn {
  const [state, setState] = useState<GeneratorState>(initialState)
  const [templateProducts, setTemplateProducts] =
    useState<TemplateProductsResponse>({
      digital: null,
      print: null,
    })
  const [isHydrated, setIsHydrated] = useState(false)
  const params = useParams()
  const router = useRouter()
  const { trackAddToCart, trackCustomEvent } = useAnalytics()
  const sourceDraftCacheRef = useRef<SerializedImageCache>({
    originalUrl: null,
    serializedUrl: null,
  })
  const croppedDraftCacheRef = useRef<SerializedImageCache>({
    originalUrl: null,
    serializedUrl: null,
  })
  const countryCode =
    typeof params?.countryCode === "string" ? params.countryCode : "us"

  useEffect(() => {
    let isMounted = true

    async function loadTemplateProducts() {
      try {
        const response = await fetch(
          `/api/pet-line-portrait/products?countryCode=${countryCode}`,
          { cache: "no-store" }
        )
        const data = (await readJsonOrText(
          response
        )) as TemplateProductsResponse | null

        if (!response.ok) {
          throw new Error("Failed to load product templates")
        }

        if (isMounted && data) {
          setTemplateProducts(data)
        }
      } catch (error) {
        console.error("[PetPortrait] Failed to load template products", error)
      }
    }

    void loadTemplateProducts()

    return () => {
      isMounted = false
    }
  }, [countryCode])

  useEffect(() => {
    let isMounted = true

    async function hydrateGenerator() {
      try {
        const localHistoryPortraits = getHistory()
          .map(mapHistoryEntryToPortrait)
          .filter(
            (portrait): portrait is GeneratedPortrait => portrait !== null
          )

        const [draft, accountPortraits] = await Promise.all([
          readGeneratorDraft().catch((error) => {
            console.warn("[PetPortrait] Failed to read draft", error)
            return null
          }),
          (async () => {
            try {
              const response = await fetch("/api/portrait/my-portraits", {
                cache: "no-store",
              })

              if (response.status === 401) {
                return []
              }

              if (!response.ok) {
                throw new Error("Failed to load account portraits")
              }

              const data = (await readJsonOrText(response)) as {
                portraits?: AccountPortraitResponse[]
              } | null

              return (data?.portraits ?? [])
                .map(mapAccountPortraitToGeneratedPortrait)
                .filter(
                  (portrait): portrait is GeneratedPortrait => portrait !== null
                )
            } catch (error) {
              console.warn(
                "[PetPortrait] Failed to load account portraits",
                error
              )
              return []
            }
          })(),
        ])

        if (!isMounted) {
          return
        }

        const generatedPortraits = mergePortraitLibraries(
          localHistoryPortraits,
          accountPortraits
        )
        const fallbackPortrait = generatedPortraits[0] ?? null
        const hasDraftInProgress = !!(
          draft?.sourceImageUrl || draft?.croppedImageUrl
        )
        const activePortraitSessionId =
          draft?.activePortraitSessionId &&
          generatedPortraits.some(
            (portrait) => portrait.sessionId === draft.activePortraitSessionId
          )
            ? draft.activePortraitSessionId
            : hasDraftInProgress
            ? null
            : fallbackPortrait?.sessionId ?? null
        const activePortrait =
          generatedPortraits.find(
            (portrait) => portrait.sessionId === activePortraitSessionId
          ) ?? null

        setState((current) => ({
          ...current,
          aiInput: {
            sourceImageUrl:
              draft?.sourceImageUrl ?? activePortrait?.originalUrl ?? null,
            croppedImageUrl:
              draft?.croppedImageUrl ?? activePortrait?.originalUrl ?? null,
            selectedStyleId:
              draft?.selectedStyleId ??
              activePortrait?.styleId ??
              current.aiInput.selectedStyleId,
          },
          presentation: draft?.presentation ?? current.presentation,
          generatedArtwork: buildGeneratedArtwork(activePortrait),
          generatedPortraits,
          activePortraitSessionId,
          generationStatus: activePortrait ? "success" : "idle",
          generationError: null,
          lastGeneratedInput: buildLastGeneratedInput(activePortrait),
        }))
      } finally {
        if (isMounted) {
          setIsHydrated(true)
        }
      }
    }

    void hydrateGenerator()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    let cancelled = false

    async function persistDraft() {
      try {
        const [sourceImageUrl, croppedImageUrl] = await Promise.all([
          serializeImageUrlForDraft(
            state.aiInput.sourceImageUrl,
            sourceDraftCacheRef
          ),
          serializeImageUrlForDraft(
            state.aiInput.croppedImageUrl,
            croppedDraftCacheRef
          ),
        ])

        if (cancelled) {
          return
        }

        const shouldClearDraft =
          !sourceImageUrl &&
          !croppedImageUrl &&
          !state.activePortraitSessionId &&
          isDefaultPresentation(state)

        if (shouldClearDraft) {
          await clearGeneratorDraft()
          return
        }

        await saveGeneratorDraft({
          activePortraitSessionId: state.activePortraitSessionId,
          croppedImageUrl,
          selectedStyleId: state.aiInput.selectedStyleId,
          sourceImageUrl,
          presentation: state.presentation,
          updatedAt: new Date().toISOString(),
        })
      } catch (error) {
        console.warn("[PetPortrait] Failed to persist draft", error)
      }
    }

    void persistDraft()

    return () => {
      cancelled = true
    }
  }, [
    isHydrated,
    state.activePortraitSessionId,
    state.aiInput.croppedImageUrl,
    state.aiInput.selectedStyleId,
    state.aiInput.sourceImageUrl,
    state.presentation,
  ])

  const price = useMemo(
    () =>
      calculateGeneratorPrice(
        state.presentation.productType,
        state.presentation.sizeOption,
        state.presentation.frameOption
      ),
    [
      state.presentation.frameOption,
      state.presentation.productType,
      state.presentation.sizeOption,
    ]
  )

  const canGenerate =
    !!state.aiInput.croppedImageUrl &&
    !!state.aiInput.selectedStyleId &&
    state.generationStatus !== "generating"

  const needsRegeneration =
    !!state.generatedArtwork.imageUrl &&
    (state.lastGeneratedInput?.croppedImageUrl !==
      state.aiInput.croppedImageUrl ||
      state.lastGeneratedInput?.selectedStyleId !==
        state.aiInput.selectedStyleId)

  const canAddToCart =
    !!state.generatedArtwork.imageUrl &&
    !needsRegeneration &&
    state.generationStatus !== "generating" &&
    state.cartStatus !== "adding" &&
    !!(state.presentation.productType === "digital"
      ? templateProducts.digital?.variantId
      : templateProducts.print?.variantId)

  const computed: GeneratorComputed = {
    needsRegeneration,
    canGenerate,
    canAddToCart,
    visibleFrameSection: state.presentation.productType === "print",
    visibleResultsSection: state.generatedPortraits.length > 0,
    visibleSizeSection: state.presentation.productType === "print",
    price,
  }

  const setSourceImage = useCallback((url: string | null) => {
    setState((current) => ({
      ...current,
      aiInput: {
        ...current.aiInput,
        sourceImageUrl: url,
      },
      generatedArtwork: url ? emptyGeneratedArtwork : current.generatedArtwork,
      activePortraitSessionId: url ? null : current.activePortraitSessionId,
      generationStatus: url ? "idle" : current.generationStatus,
      generationError: null,
      cartError: null,
      lastGeneratedInput: url ? null : current.lastGeneratedInput,
    }))
  }, [])

  const setCroppedImage = useCallback((url: string | null) => {
    setState((current) => ({
      ...current,
      aiInput: {
        ...current.aiInput,
        croppedImageUrl: url,
      },
      generationError: null,
    }))
  }, [])

  const setSelectedStyle = useCallback((styleId: string) => {
    setState((current) => ({
      ...current,
      aiInput: {
        ...current.aiInput,
        selectedStyleId: styleId,
      },
      generationError: null,
    }))
  }, [])

  const setCustomText = useCallback((text: string) => {
    setState((current) => ({
      ...current,
      presentation: {
        ...current.presentation,
        customText: text,
      },
    }))
  }, [])

  const setTextFont = useCallback((font: TextFontOption) => {
    setState((current) => ({
      ...current,
      presentation: {
        ...current.presentation,
        textFont: font,
      },
    }))
  }, [])

  const setTextColor = useCallback((color: string) => {
    setState((current) => ({
      ...current,
      presentation: {
        ...current.presentation,
        textColor: normalizeHexColor(color, current.presentation.textColor),
      },
    }))
  }, [])

  const setTextAlign = useCallback((align: TextAlignOption) => {
    setState((current) => ({
      ...current,
      presentation: {
        ...current.presentation,
        textAlign: align,
      },
    }))
  }, [])

  const setTextSize = useCallback((size: number) => {
    setState((current) => ({
      ...current,
      presentation: {
        ...current.presentation,
        textSize: Math.max(18, Math.min(42, Math.round(size))),
      },
    }))
  }, [])

  const setProductType = useCallback((type: ProductType) => {
    setState((current) => ({
      ...current,
      presentation: {
        ...current.presentation,
        productType: type,
        frameOption:
          type === "digital" ? "none" : current.presentation.frameOption,
        sizeOption:
          type === "digital" ? "medium" : current.presentation.sizeOption,
      },
    }))
  }, [])

  const setFrameOption = useCallback((frame: FrameOption) => {
    setState((current) => ({
      ...current,
      presentation: {
        ...current.presentation,
        frameOption: frame,
      },
    }))
  }, [])

  const setSizeOption = useCallback((size: SizeOption) => {
    setState((current) => ({
      ...current,
      presentation: {
        ...current.presentation,
        sizeOption: size,
      },
    }))
  }, [])

  const selectPortrait = useCallback((sessionId: string) => {
    setState((current) => {
      const portrait = current.generatedPortraits.find(
        (entry) => entry.sessionId === sessionId
      )

      if (!portrait) {
        return current
      }

      return {
        ...current,
        aiInput: {
          ...current.aiInput,
          sourceImageUrl:
            portrait.originalUrl ?? current.aiInput.sourceImageUrl,
          croppedImageUrl:
            portrait.originalUrl ?? current.aiInput.croppedImageUrl,
          selectedStyleId: portrait.styleId ?? current.aiInput.selectedStyleId,
        },
        generatedArtwork: buildGeneratedArtwork(portrait),
        activePortraitSessionId: portrait.sessionId,
        generationStatus: "success",
        generationError: null,
        lastGeneratedInput: buildLastGeneratedInput(portrait),
      }
    })
  }, [])

  const generateArtwork = useCallback(async () => {
    const croppedImageUrl = state.aiInput.croppedImageUrl
    const selectedStyle = getStyleById(state.aiInput.selectedStyleId)

    if (!croppedImageUrl || !selectedStyle) {
      return
    }

    setState((current) => ({
      ...current,
      generationStatus: "generating",
      generationError: null,
    }))

    try {
      const file = await imageUrlToFile(croppedImageUrl, "pet-line-portrait")
      const formData = new FormData()
      formData.append("photo", file)
      formData.append("style", selectedStyle.promptKey)

      trackCustomEvent("pet_portrait_preview_requested", {
        style_id: selectedStyle.id,
        prompt_key: selectedStyle.promptKey,
      })

      const response = await fetch("/api/portrait/generate", {
        method: "POST",
        body: formData,
      })
      const data = await readJsonOrText(response)

      if (!response.ok) {
        throw new Error(
          (data &&
          typeof data === "object" &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : null) || "Generation failed"
        )
      }

      const portrait: GeneratedPortrait = {
        sessionId:
          data && typeof data === "object" && "sessionId" in data
            ? (data.sessionId as string)
            : "",
        imageUrl:
          data && typeof data === "object" && "portraitUrl" in data
            ? (data.portraitUrl as string | null) ?? ""
            : "",
        originalUrl:
          data && typeof data === "object" && "originalUrl" in data
            ? (data.originalUrl as string | null) ?? null
            : croppedImageUrl,
        generatedAt: new Date().toISOString(),
        styleId: selectedStyle.id,
        stylePromptKey: selectedStyle.promptKey,
        provider:
          data && typeof data === "object" && "provider" in data
            ? (data.provider as string | null) ?? null
            : null,
        model:
          data && typeof data === "object" && "model" in data
            ? (data.model as string | null) ?? null
            : null,
      }

      if (!portrait.sessionId || !portrait.imageUrl) {
        throw new Error("Portrait generation returned an incomplete result")
      }

      saveToHistory({
        sessionId: portrait.sessionId,
        portraitUrl: portrait.imageUrl,
        originalUrl: portrait.originalUrl ?? undefined,
        style: portrait.stylePromptKey ?? selectedStyle.promptKey,
        createdAt: portrait.generatedAt,
      })

      setState((current) => {
        const generatedPortraits = mergePortraitLibraries(
          [portrait],
          current.generatedPortraits
        )
        const restoredSourceUrl =
          portrait.originalUrl ?? current.aiInput.sourceImageUrl
        const restoredCroppedUrl =
          portrait.originalUrl ?? current.aiInput.croppedImageUrl

        return {
          ...current,
          aiInput: {
            ...current.aiInput,
            sourceImageUrl: restoredSourceUrl,
            croppedImageUrl: restoredCroppedUrl,
            selectedStyleId: selectedStyle.id,
          },
          generatedArtwork: buildGeneratedArtwork(portrait),
          generatedPortraits,
          activePortraitSessionId: portrait.sessionId,
          generationStatus: "success",
          generationError: null,
          lastGeneratedInput: {
            croppedImageUrl: restoredCroppedUrl,
            selectedStyleId: selectedStyle.id,
          },
        }
      })

      trackCustomEvent("pet_portrait_preview_ready", {
        style_id: selectedStyle.id,
        session_id: portrait.sessionId,
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to generate preview."

      setState((current) => ({
        ...current,
        generationStatus: "error",
        generationError: message,
      }))

      trackCustomEvent("pet_portrait_preview_error", {
        error_message: message,
      })
    }
  }, [
    state.aiInput.croppedImageUrl,
    state.aiInput.selectedStyleId,
    trackCustomEvent,
  ])

  const addCurrentConfigToCart = useCallback(async () => {
    const selectedStyle = getStyleById(state.aiInput.selectedStyleId)
    const portraitImageUrl = state.generatedArtwork.imageUrl
    const variantId =
      state.presentation.productType === "digital"
        ? templateProducts.digital?.variantId
        : templateProducts.print?.variantId

    if (!variantId || !portraitImageUrl) {
      setState((current) => ({
        ...current,
        cartStatus: "error",
        cartError: "This product is not ready to purchase yet.",
      }))
      return
    }

    setState((current) => ({
      ...current,
      cartStatus: "adding",
      cartError: null,
    }))

    try {
      const metadata: Record<string, string> = {
        generator_type: "pet-line-portrait",
        portrait_image_url: portraitImageUrl,
        source_image_url: state.aiInput.sourceImageUrl ?? "",
        cropped_image_url: state.aiInput.croppedImageUrl ?? "",
        selected_style_id: state.aiInput.selectedStyleId ?? "",
        custom_text: state.presentation.customText,
        text_font: state.presentation.textFont,
        text_color: state.presentation.textColor,
        text_align: state.presentation.textAlign,
        text_size: String(state.presentation.textSize),
        product_type: state.presentation.productType,
        frame_option: state.presentation.frameOption,
        size_option: state.presentation.sizeOption,
        portrait_session_id: state.generatedArtwork.sessionId ?? "",
        portrait_style: selectedStyle?.name ?? "",
        variant_type: state.presentation.productType,
        includes_digital_download: "true",
      }

      await addToCart({
        variantId,
        quantity: 1,
        countryCode,
        metadata,
      })

      trackAddToCart({
        id: variantId,
        name:
          state.presentation.productType === "digital"
            ? "Pet Line Portrait Digital"
            : "Pet Line Portrait Print",
        price: price.amount,
        currency: price.currency,
        quantity: 1,
        category: "Custom Portraits",
      })

      setState((current) => ({
        ...current,
        cartStatus: "success",
        cartError: null,
      }))

      router.push(`/${countryCode}/cart`)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to add item to cart."

      setState((current) => ({
        ...current,
        cartStatus: "error",
        cartError: message,
      }))
    }
  }, [
    countryCode,
    price.amount,
    price.currency,
    router,
    state.aiInput.croppedImageUrl,
    state.aiInput.selectedStyleId,
    state.aiInput.sourceImageUrl,
    state.generatedArtwork.imageUrl,
    state.generatedArtwork.sessionId,
    state.presentation.customText,
    state.presentation.frameOption,
    state.presentation.productType,
    state.presentation.sizeOption,
    state.presentation.textAlign,
    state.presentation.textColor,
    state.presentation.textFont,
    state.presentation.textSize,
    templateProducts.digital?.variantId,
    templateProducts.print?.variantId,
    trackAddToCart,
  ])

  const replacePhoto = useCallback(() => {
    sourceDraftCacheRef.current = {
      originalUrl: null,
      serializedUrl: null,
    }
    croppedDraftCacheRef.current = {
      originalUrl: null,
      serializedUrl: null,
    }

    setState((current) => ({
      ...current,
      aiInput: {
        ...current.aiInput,
        sourceImageUrl: null,
        croppedImageUrl: null,
      },
      generatedArtwork: emptyGeneratedArtwork,
      activePortraitSessionId: null,
      generationStatus: "idle",
      generationError: null,
      cartError: null,
      lastGeneratedInput: null,
    }))
  }, [])

  const resetGenerator = useCallback(() => {
    sourceDraftCacheRef.current = {
      originalUrl: null,
      serializedUrl: null,
    }
    croppedDraftCacheRef.current = {
      originalUrl: null,
      serializedUrl: null,
    }

    void clearGeneratorDraft()

    setState((current) => ({
      ...initialState,
      generatedPortraits: current.generatedPortraits,
    }))
  }, [])

  const actions: GeneratorActions = useMemo(
    () => ({
      setSourceImage,
      setCroppedImage,
      setSelectedStyle,
      setCustomText,
      setTextFont,
      setTextColor,
      setTextAlign,
      setTextSize,
      setProductType,
      setFrameOption,
      setSizeOption,
      selectPortrait,
      generateArtwork,
      addToCart: addCurrentConfigToCart,
      replacePhoto,
      resetGenerator,
    }),
    [
      addCurrentConfigToCart,
      generateArtwork,
      replacePhoto,
      resetGenerator,
      selectPortrait,
      setCroppedImage,
      setCustomText,
      setFrameOption,
      setProductType,
      setSelectedStyle,
      setSizeOption,
      setSourceImage,
      setTextAlign,
      setTextColor,
      setTextFont,
      setTextSize,
    ]
  )

  return {
    state,
    actions,
    computed,
    styles: PET_PORTRAIT_STYLES,
  }
}
