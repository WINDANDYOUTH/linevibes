"use client"

import type {
  GeneratorActions,
  GeneratorComputed,
  GeneratorState,
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
  return (
    <section id="generator" className="bg-white py-20 md:py-28">
      <div className="content-container">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">
            Create Your Portrait
          </p>
          <h2 className="mt-4 font-[family-name:Georgia,_Times_New_Roman,_serif] text-3xl leading-tight text-stone-950 md:text-5xl">
            Build Your Pet Portrait Before You Order
          </h2>
          <p className="mt-4 text-base leading-7 text-stone-600 md:text-lg">
            Upload a photo, crop the artwork area, choose a style, generate the
            preview, then configure the final product without retriggering AI for
            presentation-only changes.
          </p>
        </div>

        <GeneratorWorkspaceLayout
          preview={
            <PreviewPanel
              sourceImageUrl={state.aiInput.sourceImageUrl}
              artworkUrl={state.generatedArtwork.imageUrl}
              croppedImageUrl={state.aiInput.croppedImageUrl}
              customText={state.presentation.customText}
              productType={state.presentation.productType}
              frameOption={state.presentation.frameOption}
              sizeOption={state.presentation.sizeOption}
              generationStatus={state.generationStatus}
              needsRegeneration={computed.needsRegeneration}
              generationError={state.generationError}
            />
          }
          configurator={
            <ConfiguratorPanel
              state={state}
              actions={actions}
              computed={computed}
              styles={styles}
            />
          }
          purchaseBar={
            <PurchaseBar
              price={computed.price}
              canAddToCart={computed.canAddToCart}
              cartStatus={state.cartStatus}
              generationStatus={state.generationStatus}
              cartError={state.cartError}
              onAddToCart={actions.addToCart}
            />
          }
        />
      </div>
    </section>
  )
}
