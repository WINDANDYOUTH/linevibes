import { useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"

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
            onChange={actions.setCustomText}
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
                  className={`relative whitespace-nowrap pb-2 pt-1 text-sm font-medium transition ${
                    isActive ? "text-stone-950" : "text-stone-500"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full transition ${
                      isActive ? "bg-sky-500" : "bg-transparent"
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

        <TextSection value={state.presentation.customText} onChange={actions.setCustomText} />

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
