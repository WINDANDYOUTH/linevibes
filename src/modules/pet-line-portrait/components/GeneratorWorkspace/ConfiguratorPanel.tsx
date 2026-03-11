import { useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"

import { FRAME_OPTIONS, PRODUCT_TYPE_OPTIONS, SIZE_OPTIONS } from "../../config/product-options"
import type {
  GeneratorActions,
  GeneratorComputed,
  GeneratorState,
  PortraitStyle,
} from "../../types/generator"
import FrameSection from "./sections/FrameSection"
import GenerateSection from "./sections/GenerateSection"
import ProductTypeSection from "./sections/ProductTypeSection"
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
  purchaseBar,
}: {
  state: GeneratorState
  actions: GeneratorActions
  computed: GeneratorComputed
  styles: PortraitStyle[]
  purchaseBar?: ReactNode
}) {
  const selectedStyleName =
    styles.find((style) => style.id === state.aiInput.selectedStyleId)?.name ?? "Not selected"
  const productTypeName = getOptionLabel(PRODUCT_TYPE_OPTIONS, state.presentation.productType)
  const sizeName = computed.visibleSizeSection
    ? getOptionLabel(SIZE_OPTIONS, state.presentation.sizeOption)
    : "Included"
  const frameName = computed.visibleFrameSection
    ? getOptionLabel(FRAME_OPTIONS, state.presentation.frameOption)
    : "None"

  const mobileTabs = useMemo(
    () =>
      [
        { id: "upload", label: "Upload" },
        { id: "style", label: "Style" },
        { id: "text", label: "Text" },
        { id: "format", label: "Delivery Format" },
        ...(computed.visibleSizeSection ? [{ id: "size", label: "Size" }] : []),
        ...(computed.visibleFrameSection ? [{ id: "frame", label: "Frame" }] : []),
      ] as Array<{ id: string; label: string }>,
    [computed.visibleFrameSection, computed.visibleSizeSection]
  )
  const [activeMobileTab, setActiveMobileTab] = useState(mobileTabs[0]?.id ?? "upload")

  useEffect(() => {
    if (!mobileTabs.some((tab) => tab.id === activeMobileTab)) {
      setActiveMobileTab(mobileTabs[0]?.id ?? "upload")
    }
  }, [activeMobileTab, mobileTabs])

  const mobilePanel = (() => {
    switch (activeMobileTab) {
      case "style":
        return (
          <StyleSection
            styles={styles}
            selectedStyleId={state.aiInput.selectedStyleId}
            onSelectStyle={actions.setSelectedStyle}
          />
        )
      case "text":
        return (
          <TextSection
            value={state.presentation.customText}
            font={state.presentation.textFont}
            color={state.presentation.textColor}
            align={state.presentation.textAlign}
            size={state.presentation.textSize}
            onChange={actions.setCustomText}
            onFontChange={actions.setTextFont}
            onColorChange={actions.setTextColor}
            onAlignChange={actions.setTextAlign}
            onSizeChange={actions.setTextSize}
          />
        )
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
    <>
      <div className="xl:hidden">
        <div className="overflow-x-auto border-b border-stone-200/90 pb-1">
          <div className="flex min-w-max items-center gap-4 px-1">
            {mobileTabs.map((tab) => {
              const isActive = tab.id === activeMobileTab

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveMobileTab(tab.id)}
                  className={`relative whitespace-nowrap pb-2 pt-1 text-[13px] font-medium transition ${
                    isActive ? "text-stone-950" : "text-stone-500"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full transition ${
                      isActive ? "bg-[#2f80d1]" : "bg-transparent"
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </div>

        <div className="pt-4">{mobilePanel}</div>

        <div className="space-y-4 pt-4">
          <GenerateSection
            canGenerate={computed.canGenerate}
            isGenerating={state.generationStatus === "generating"}
            hasGeneratedResult={!!state.generatedArtwork.imageUrl}
            needsRegeneration={computed.needsRegeneration}
            error={state.generationError}
            onGenerate={() => {
              void actions.generateArtwork()
            }}
          />
          <div className="rounded-[24px] border border-stone-200 bg-white p-4 shadow-[0_12px_30px_rgba(28,25,23,0.06)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400">
                  Summary
                </p>
                <h3 className="mt-1 text-xl font-semibold text-stone-950">
                  Summary & Price
                </h3>
              </div>
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-stone-200 bg-[#f5f1e8]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    state.generatedArtwork.imageUrl ||
                    state.aiInput.croppedImageUrl ||
                    "/images/line-portrait/style-continuous-line.png"
                  }
                  alt="Current portrait summary preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <dl className="mt-4 space-y-2 text-sm text-stone-600">
              <div className="flex items-center justify-between gap-4">
                <dt>Style</dt>
                <dd className="text-right font-medium text-stone-950">{selectedStyleName}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Delivery</dt>
                <dd className="text-right font-medium text-stone-950">{productTypeName}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Size</dt>
                <dd className="text-right font-medium text-stone-950">{sizeName}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Frame</dt>
                <dd className="text-right font-medium text-stone-950">{frameName}</dd>
              </div>
            </dl>

            <div className="mt-4 border-t border-stone-200 pt-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-lg font-semibold text-stone-950">Total Price</p>
                <p className="text-2xl font-semibold text-stone-950">{computed.price.formatted}</p>
              </div>
            </div>
          </div>
          {purchaseBar}
        </div>
      </div>

      <div className="hidden space-y-5 xl:block">
        <UploadSection
          sourceImageUrl={state.aiInput.sourceImageUrl}
          croppedImageUrl={state.aiInput.croppedImageUrl}
          onSourceImageChange={actions.setSourceImage}
          onCroppedImageChange={actions.setCroppedImage}
          onReplacePhoto={actions.replacePhoto}
        />

        <StyleSection
          styles={styles}
          selectedStyleId={state.aiInput.selectedStyleId}
          onSelectStyle={actions.setSelectedStyle}
        />

        <GenerateSection
          canGenerate={computed.canGenerate}
          isGenerating={state.generationStatus === "generating"}
          hasGeneratedResult={!!state.generatedArtwork.imageUrl}
          needsRegeneration={computed.needsRegeneration}
          error={state.generationError}
          onGenerate={() => {
            void actions.generateArtwork()
          }}
        />

        <TextSection
          value={state.presentation.customText}
          font={state.presentation.textFont}
          color={state.presentation.textColor}
          align={state.presentation.textAlign}
          size={state.presentation.textSize}
          onChange={actions.setCustomText}
          onFontChange={actions.setTextFont}
          onColorChange={actions.setTextColor}
          onAlignChange={actions.setTextAlign}
          onSizeChange={actions.setTextSize}
        />

        <ProductTypeSection
          value={state.presentation.productType}
          onChange={actions.setProductType}
        />

        {computed.visibleFrameSection ? (
          <FrameSection
            value={state.presentation.frameOption}
            onChange={actions.setFrameOption}
          />
        ) : null}

        {computed.visibleSizeSection ? (
          <SizeSection
            value={state.presentation.sizeOption}
            onChange={actions.setSizeOption}
          />
        ) : null}
      </div>
    </>
  )
}
