"use client"

import GeneratorWorkspace from "./GeneratorWorkspace"
import { usePetPortraitGenerator } from "../hooks/use-pet-portrait-generator"

export default function PetLinePortraitGeneratorSection() {
  const { state, actions, computed, styles } = usePetPortraitGenerator()

  return (
    <GeneratorWorkspace
      state={state}
      actions={actions}
      computed={computed}
      styles={styles}
    />
  )
}
