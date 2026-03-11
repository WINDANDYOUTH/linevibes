"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import type {
  GeneratorActions,
  GeneratorComputed,
  GeneratorState,
  GeneratorTabId,
  PortraitStyle,
} from "../../types/generator"
import ConfiguratorPanel from "./ConfiguratorPanel"
import GeneratorWorkspaceLayout from "./GeneratorWorkspaceLayout"
import PreviewPanel from "./PreviewPanel"
import PurchaseBar from "./PurchaseBar"

export type GeneratorWorkspaceProps = {
  state: GeneratorState
  actions: GeneratorActions
  computed: GeneratorComputed
  styles: PortraitStyle[]
}

export default function GeneratorWorkspace({
  state,
  actions,
  computed,
  styles,
}: GeneratorWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<GeneratorTabId>("upload")
  const previousPortraitCountRef = useRef(state.generatedPortraits.length)
  const showMobilePurchaseBar =
    !!state.aiInput.sourceImageUrl ||
    !!state.aiInput.croppedImageUrl ||
    !!state.generatedArtwork.imageUrl

  useEffect(() => {
    const root = document.documentElement
    const isWorkspaceActive = !!state.aiInput.sourceImageUrl

    root.classList.toggle("pet-portrait-workspace-active", isWorkspaceActive)

    return () => {
      root.classList.remove("pet-portrait-workspace-active")
    }
  }, [state.aiInput.sourceImageUrl])

  useEffect(() => {
    if (state.generatedPortraits.length > previousPortraitCountRef.current) {
      setActiveTab("results")
    }

    previousPortraitCountRef.current = state.generatedPortraits.length
  }, [state.generatedPortraits.length])

  useEffect(() => {
    if (!state.aiInput.sourceImageUrl && activeTab !== "upload") {
      setActiveTab("upload")
      return
    }

    if (
      state.aiInput.sourceImageUrl &&
      state.generatedPortraits.length === 0 &&
      activeTab === "results"
    ) {
      setActiveTab("style")
    }
  }, [activeTab, state.aiInput.sourceImageUrl, state.generatedPortraits.length])

  const previewAction = useMemo(() => {
    const hasCurrentPortrait = !!state.generatedArtwork.imageUrl

    if (state.generationStatus === "generating") {
      return null
    }

    if (!state.aiInput.sourceImageUrl) {
      return {
        label: "Upload Photo",
        onClick: () => setActiveTab("upload"),
      }
    }

    if (!state.aiInput.croppedImageUrl) {
      return {
        label: "Edit Crop",
        onClick: () => setActiveTab("upload"),
      }
    }

    if (!hasCurrentPortrait || computed.needsRegeneration) {
      if (activeTab !== "style") {
        return {
          label: "Choose Style",
          onClick: () => setActiveTab("style"),
        }
      }

      return {
        label: "Generate Portrait",
        onClick: () => {
          void actions.generateArtwork()
        },
        disabled: !computed.canGenerate,
      }
    }

    if (!state.activePortraitSessionId) {
      return {
        label: "Choose Portrait",
        onClick: () => setActiveTab("results"),
      }
    }

    return null
  }, [
    actions,
    activeTab,
    computed.canGenerate,
    computed.needsRegeneration,
    state.activePortraitSessionId,
    state.aiInput.croppedImageUrl,
    state.aiInput.sourceImageUrl,
    state.generatedArtwork.imageUrl,
    state.generationStatus,
  ])

  return (
    <section id="generator" className="bg-[#f4f4f2] py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6 xl:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">
            Create Your Portrait
          </p>
          <h2 className="mt-4 font-[family-name:Georgia,_Times_New_Roman,_serif] text-3xl leading-tight text-stone-950 md:text-5xl">
            Build Your Pet Portrait Before You Order
          </h2>
          <p className="mt-4 text-base leading-7 text-stone-600 md:text-lg">
            Upload a photo, crop it, choose a style, personalize the final
            artwork, then review the price before checkout.
          </p>
        </div>

        <GeneratorWorkspaceLayout
          preview={
            <PreviewPanel
              sourceImageUrl={state.aiInput.sourceImageUrl}
              artworkUrl={state.generatedArtwork.imageUrl}
              croppedImageUrl={state.aiInput.croppedImageUrl}
              customText={state.presentation.customText}
              textFont={state.presentation.textFont}
              textColor={state.presentation.textColor}
              textAlign={state.presentation.textAlign}
              textSize={state.presentation.textSize}
              productType={state.presentation.productType}
              frameOption={state.presentation.frameOption}
              sizeOption={state.presentation.sizeOption}
              generationStatus={state.generationStatus}
              needsRegeneration={computed.needsRegeneration}
              generationError={state.generationError}
              portraitCount={state.generatedPortraits.length}
              primaryAction={previewAction}
            />
          }
          configurator={
            <ConfiguratorPanel
              state={state}
              actions={actions}
              computed={computed}
              styles={styles}
              activeTab={activeTab}
              onActiveTabChange={setActiveTab}
            />
          }
          purchaseBar={
            showMobilePurchaseBar ? (
              <PurchaseBar
                price={computed.price}
                canAddToCart={computed.canAddToCart}
                cartStatus={state.cartStatus}
                generationStatus={state.generationStatus}
                cartError={state.cartError}
                onAddToCart={() => {
                  void actions.addToCart()
                }}
              />
            ) : null
          }
        />
      </div>
    </section>
  )
}
