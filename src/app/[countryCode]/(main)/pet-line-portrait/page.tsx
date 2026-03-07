import type { Metadata } from "next"

import PetLinePortraitPage from "@modules/pet-line-portrait/page"

export const metadata: Metadata = {
  title: "Pet Line Portrait | Preview Custom Pet Art | LineVibes",
  description:
    "Upload a dog or cat photo, choose a portrait style, and preview a clean black-and-white pet line portrait before ordering.",
  keywords: [
    "pet line portrait",
    "custom pet portrait",
    "dog line art",
    "cat line art",
    "pet portrait preview",
    "black and white pet art",
  ],
  openGraph: {
    title: "Pet Line Portrait | LineVibes",
    description:
      "Create a clean, modern pet portrait from your photo and preview the style before ordering.",
    type: "website",
  },
}

export default function Page() {
  return <PetLinePortraitPage />
}
