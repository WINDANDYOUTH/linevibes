"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { useAnalytics } from "@lib/analytics/provider"
import { addToCart } from "@lib/data/cart"

import { calculateGeneratorPrice } from "../config/pricing"
import { PET_PORTRAIT_STYLES } from "../config/styles"
import type {
  FrameOption,
  GeneratorActions,
  GeneratorComputed,
  GeneratorState,
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
  generatedArtwork: {
    imageUrl: null,
    generatedAt: null,
    sessionId: null,
  },
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

async function blobUrlToFile(blobUrl: string, filename: string) {
  const response = await fetch(blobUrl)
  const blob = await response.blob()
  const ext = blob.type.split("/")[1] || "png"
  return new File([blob], `${filename}.${ext}`, { type: blob.type || "image/png" })
}

function normalizeHexColor(input: string, fallback: string) {
  const normalized = input.trim()
  return /^#([0-9a-fA-F]{6})$/.test(normalized) ? normalized : fallback
}

export function usePetPortraitGenerator(): UsePetPortraitGeneratorReturn {
  const [state, setState] = useState<GeneratorState>(initialState)
  const [templateProducts, setTemplateProducts] = useState<TemplateProductsResponse>({
    digital: null,
    print: null,
  })
  const params = useParams()
  const router = useRouter()
  const { trackAddToCart, trackCustomEvent } = useAnalytics()
  const countryCode = typeof params?.countryCode === "string" ? params.countryCode : "us"

  useEffect(() => {
    let isMounted = true

    async function loadTemplateProducts() {
      try {
        const response = await fetch(
          `/api/pet-line-portrait/products?countryCode=${countryCode}`,
          { cache: "no-store" }
        )
        const data = (await response.json()) as TemplateProductsResponse

        if (!response.ok) {
          throw new Error("Failed to load product templates")
        }

        if (isMounted) {
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
    (state.lastGeneratedInput?.croppedImageUrl !== state.aiInput.croppedImageUrl ||
      state.lastGeneratedInput?.selectedStyleId !== state.aiInput.selectedStyleId)

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
    visibleSizeSection: true,
    price,
  }

  const setSourceImage = useCallback((url: string | null) => {
    setState((current) => ({
      ...current,
      aiInput: {
        ...current.aiInput,
        sourceImageUrl: url,
      },
      generationError: null,
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
        frameOption: type === "digital" ? "none" : current.presentation.frameOption,
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

  const generateArtwork = useCallback(async () => {
      const croppedImageUrl = state.aiInput.croppedImageUrl
      const selectedStyle = PET_PORTRAIT_STYLES.find(
        (style) => style.id === state.aiInput.selectedStyleId
      )

      if (!croppedImageUrl || !selectedStyle) {
        return
      }

      setState((current) => ({
        ...current,
        generationStatus: "generating",
        generationError: null,
      }))

      try {
        const file = await blobUrlToFile(croppedImageUrl, "pet-line-portrait")
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
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Generation failed")
        }

        setState((current) => ({
          ...current,
          generatedArtwork: {
            imageUrl: data.portraitUrl || null,
            generatedAt: new Date().toISOString(),
            sessionId: data.sessionId || null,
          },
          generationStatus: "success",
          generationError: null,
          lastGeneratedInput: {
            croppedImageUrl: current.aiInput.croppedImageUrl,
            selectedStyleId: current.aiInput.selectedStyleId,
          },
        }))

        trackCustomEvent("pet_portrait_preview_ready", {
          style_id: selectedStyle.id,
          session_id: data.sessionId,
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
    }, [state.aiInput.croppedImageUrl, state.aiInput.selectedStyleId, trackCustomEvent])

  const addCurrentConfigToCart = useCallback(async () => {
      const variantId =
        state.presentation.productType === "digital"
          ? templateProducts.digital?.variantId
          : templateProducts.print?.variantId

      if (!variantId || !state.generatedArtwork.imageUrl) {
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
        const metadata = {
          generatorType: "pet-line-portrait",
          generatedArtworkUrl: state.generatedArtwork.imageUrl,
          sourceImageUrl: state.aiInput.sourceImageUrl ?? "",
          croppedImageUrl: state.aiInput.croppedImageUrl ?? "",
          selectedStyleId: state.aiInput.selectedStyleId ?? "",
          customText: state.presentation.customText,
          textFont: state.presentation.textFont,
          textColor: state.presentation.textColor,
          textAlign: state.presentation.textAlign,
          textSize: state.presentation.textSize,
          productType: state.presentation.productType,
          frameOption: state.presentation.frameOption,
          sizeOption: state.presentation.sizeOption,
          portraitSessionId: state.generatedArtwork.sessionId ?? "",
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
        const message = error instanceof Error ? error.message : "Unable to add item to cart."

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
      state.presentation.textAlign,
      state.presentation.textColor,
      state.presentation.textFont,
      state.presentation.frameOption,
      state.presentation.productType,
      state.presentation.sizeOption,
      state.presentation.textSize,
      templateProducts.digital?.variantId,
      templateProducts.print?.variantId,
      trackAddToCart,
    ])

  const replacePhoto = useCallback(() => {
    setState((current) => ({
      ...current,
      aiInput: {
        ...current.aiInput,
        sourceImageUrl: null,
        croppedImageUrl: null,
      },
      generatedArtwork: {
        imageUrl: null,
        generatedAt: null,
        sessionId: null,
      },
      generationStatus: "idle",
      generationError: null,
      cartError: null,
      lastGeneratedInput: null,
    }))
  }, [])

  const resetGenerator = useCallback(() => {
    setState(initialState)
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
      setCroppedImage,
      setCustomText,
      setTextAlign,
      setTextColor,
      setTextFont,
      setFrameOption,
      setProductType,
      setSelectedStyle,
      setSizeOption,
      setSourceImage,
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
