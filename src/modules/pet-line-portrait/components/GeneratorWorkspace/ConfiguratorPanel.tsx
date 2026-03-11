import { useEffect, useMemo } from "react"

import {
  FRAME_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
  SIZE_OPTIONS,
} from "../../config/product-options"
import type {
  GeneratorActions,
  GeneratorComputed,
  GeneratorTabId,
  GeneratorState,
  PortraitStyle,
} from "../../types/generator"
import FrameSection from "./sections/FrameSection"
import ProductTypeSection from "./sections/ProductTypeSection"
import ResultsSection from "./sections/ResultsSection"
import SizeSection from "./sections/SizeSection"
import StyleSection from "./sections/StyleSection"
import TextSection from "./sections/TextSection"
import UploadSection from "./sections/UploadSection"

function getOptionLabel<T extends string>(
  options: Array<{ value: T; label: string }>,
  value: T
) {
  return options.find((option) => option.value === value)?.label ?? value
}

export default function ConfiguratorPanel({
  state,
  actions,
  computed,
  styles,
  activeTab,
  onActiveTabChange,
}: {
  state: GeneratorState
  actions: GeneratorActions
  computed: GeneratorComputed
  styles: PortraitStyle[]
  activeTab: GeneratorTabId
  onActiveTabChange: (tab: GeneratorTabId) => void
}) {
  const tabs = useMemo(
    () =>
      [
        { id: "upload", label: "Upload" },
        { id: "style", label: "Style" },
        ...(computed.visibleResultsSection
          ? [{ id: "results", label: "Portraits" }]
          : []),
        ...(state.activePortraitSessionId
          ? [{ id: "text", label: "Text" }]
          : []),
        ...(state.activePortraitSessionId
          ? [{ id: "format", label: "Delivery Format" }]
          : []),
        ...(computed.visibleSizeSection && state.activePortraitSessionId
          ? [{ id: "size", label: "Size" }]
          : []),
        ...(computed.visibleFrameSection
          ? state.activePortraitSessionId
            ? [{ id: "frame", label: "Frame" }]
            : []
          : []),
      ] as Array<{ id: GeneratorTabId; label: string }>,
    [
      computed.visibleFrameSection,
      computed.visibleResultsSection,
      computed.visibleSizeSection,
      state.activePortraitSessionId,
    ]
  )

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeTab)) {
      onActiveTabChange(tabs[0]?.id ?? "upload")
    }
  }, [activeTab, onActiveTabChange, tabs])

  const selectedStyleName =
    styles.find((style) => style.id === state.aiInput.selectedStyleId)?.name ??
    "Line Art"
  const productTypeName = getOptionLabel(
    PRODUCT_TYPE_OPTIONS,
    state.presentation.productType
  )
  const sizeName = getOptionLabel(SIZE_OPTIONS, state.presentation.sizeOption)
  const frameName = getOptionLabel(
    FRAME_OPTIONS,
    state.presentation.frameOption
  )

  const activePanel = (() => {
    switch (activeTab) {
      case "style":
        return (
          <StyleSection
            styles={styles}
            selectedStyleId={state.aiInput.selectedStyleId}
            onSelectStyle={actions.setSelectedStyle}
            canGenerate={computed.canGenerate}
            isGenerating={state.generationStatus === "generating"}
            hasGeneratedResult={!!state.generatedArtwork.imageUrl}
            needsRegeneration={computed.needsRegeneration}
            generationError={state.generationError}
            onGenerate={() => {
              void actions.generateArtwork()
            }}
          />
        )
      case "text":
        return (
          <TextSection
            value={state.presentation.customText}
            font={state.presentation.textFont}
            color={state.presentation.textColor}
            align={state.presentation.textAlign}
            productType={state.presentation.productType}
            maxLength={20}
            onChange={actions.setCustomText}
            onFontChange={actions.setTextFont}
            onColorChange={actions.setTextColor}
            onAlignChange={actions.setTextAlign}
          />
        )
      case "results":
        return computed.visibleResultsSection ? (
          <ResultsSection
            portraits={state.generatedPortraits}
            activePortraitSessionId={state.activePortraitSessionId}
            canGenerate={computed.canGenerate}
            isGenerating={state.generationStatus === "generating"}
            onGenerateAnother={() => {
              void actions.generateArtwork()
            }}
            onSelectPortrait={(sessionId) => {
              actions.selectPortrait(sessionId)
              onActiveTabChange("text")
            }}
            onTryAnotherStyle={() => onActiveTabChange("style")}
          />
        ) : null
      case "format":
        return (
          <ProductTypeSection
            value={state.presentation.productType}
            onChange={actions.setProductType}
          />
        )
      case "size":
        return computed.visibleSizeSection ? (
          <SizeSection
            value={state.presentation.sizeOption}
            onChange={actions.setSizeOption}
          />
        ) : null
      case "frame":
        return computed.visibleFrameSection ? (
          <FrameSection
            value={state.presentation.frameOption}
            onChange={actions.setFrameOption}
          />
        ) : null
      case "upload":
      default:
        return (
          <UploadSection
            sourceImageUrl={state.aiInput.sourceImageUrl}
            croppedImageUrl={state.aiInput.croppedImageUrl}
            onSourceImageChange={actions.setSourceImage}
            onCroppedImageChange={actions.setCroppedImage}
            onReplacePhoto={actions.replacePhoto}
          />
        )
    }
  })()

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-6">
      <div className="min-w-0 rounded-[22px] border border-[#e8e8e8] bg-white">
        <div className="overflow-x-auto border-b border-[#ececeb] px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-5">
          <div className="flex min-w-max items-center gap-5">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onActiveTabChange(tab.id)}
                  className={`relative whitespace-nowrap px-0 py-4 text-[13px] font-medium transition ${
                    isActive ? "text-[#2f80ed]" : "text-stone-500"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full transition ${
                      isActive ? "bg-[#2f80ed]" : "bg-transparent"
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-3 md:p-5">{activePanel}</div>
      </div>

      <aside className="hidden rounded-[22px] border border-[#e8e8e8] bg-[linear-gradient(180deg,#ffffff_0%,#faf8f3_100%)] p-4 shadow-[0_20px_44px_rgba(15,23,42,0.06)] xl:block xl:sticky xl:top-[calc(var(--pet-portrait-header-height,0px)+var(--pet-portrait-preview-gap,24px))] xl:self-start">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400">
              Summary
            </p>
            <h3 className="mt-1 text-xl font-semibold text-stone-950">
              Summary & Price
            </h3>
          </div>
          <div className="flex aspect-[4/5] w-24 shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-stone-200 bg-[#f2f1ed] p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                state.generatedArtwork.imageUrl ||
                state.aiInput.croppedImageUrl ||
                state.aiInput.sourceImageUrl ||
                "/images/line-portrait/style-continuous-line.png"
              }
              alt="Current portrait summary preview"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex items-start justify-between gap-4">
            <dt className="text-stone-500">Style</dt>
            <dd className="text-right font-medium text-stone-950">
              {selectedStyleName}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="text-stone-500">Delivery Format</dt>
            <dd className="text-right font-medium text-stone-950">
              {productTypeName}
            </dd>
          </div>
          {computed.visibleSizeSection ? (
            <div className="flex items-start justify-between gap-4">
              <dt className="text-stone-500">Size</dt>
              <dd className="text-right font-medium text-stone-950">
                {sizeName}
              </dd>
            </div>
          ) : null}
          {computed.visibleFrameSection ? (
            <div className="flex items-start justify-between gap-4">
              <dt className="text-stone-500">Frame</dt>
              <dd className="text-right font-medium text-stone-950">
                {frameName}
              </dd>
            </div>
          ) : null}
          {state.generatedArtwork.provider ? (
            <div className="flex items-start justify-between gap-4">
              <dt className="text-stone-500">AI Engine</dt>
              <dd className="text-right font-medium text-stone-950">
                {state.generatedArtwork.provider}
              </dd>
            </div>
          ) : null}
          {state.generatedArtwork.model ? (
            <div className="flex items-start justify-between gap-4">
              <dt className="text-stone-500">Model</dt>
              <dd className="text-right font-medium text-stone-950 break-all">
                {state.generatedArtwork.model}
              </dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-5 rounded-[18px] border border-[#ebe8df] bg-white/80 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
            Total Price
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
            {computed.price.formatted}
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            {computed.needsRegeneration
              ? "Generate the latest style or crop before checkout."
              : "Your preview and configuration are ready for purchase."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            void actions.addToCart()
          }}
          disabled={!computed.canAddToCart || state.cartStatus === "adding"}
          className={`mt-5 inline-flex w-full items-center justify-center rounded-[12px] px-4 py-3.5 text-sm font-semibold transition ${
            !computed.canAddToCart || state.cartStatus === "adding"
              ? "cursor-not-allowed bg-[#cfd8e6] text-white/90"
              : "bg-[#2f80ed] text-white hover:bg-[#226fd7]"
          }`}
        >
          {state.cartStatus === "adding" ? "Adding to Cart..." : "Add to Cart"}
        </button>

        {state.cartError ? (
          <p className="mt-3 text-sm text-red-600">{state.cartError}</p>
        ) : null}
      </aside>
    </div>
  )
}
