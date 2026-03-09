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
}: {
  state: GeneratorState
  actions: GeneratorActions
  computed: GeneratorComputed
  styles: PortraitStyle[]
}) {
  return (
    <div className="space-y-5">
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
        <SizeSection value={state.presentation.sizeOption} onChange={actions.setSizeOption} />
      ) : null}
    </div>
  )
}
