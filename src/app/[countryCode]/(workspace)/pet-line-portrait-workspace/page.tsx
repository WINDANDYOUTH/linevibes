import type { Metadata } from "next"

import PetLinePortraitGeneratorSection from "@modules/pet-line-portrait/components/PetLinePortraitGeneratorSection"

export const metadata: Metadata = {
  title: "Pet Line Portrait Workspace | LineVibes",
  description:
    "Standalone workspace page for testing the pet line portrait generator layout and styling.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function PetLinePortraitWorkspacePage() {
  return (
    <main className="min-h-screen bg-[#f8f5ee]">
      <PetLinePortraitGeneratorSection />
    </main>
  )
}
