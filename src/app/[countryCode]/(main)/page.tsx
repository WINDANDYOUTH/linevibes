import { Metadata } from "next"

import HeroUploadSection from "@modules/line-portrait/hero-upload-section"
import StyleSelectorSection from "@modules/line-portrait/style-selector-section"
import GalleryInspirationSection from "@modules/line-portrait/gallery-inspiration-section"
import HowItWorksSection from "@modules/line-portrait/how-it-works-section"
import KeyFeaturesSection from "@modules/line-portrait/key-features-section"
import ProductUpsellSection from "@modules/line-portrait/product-upsell-section"
import TestimonialsSection from "@modules/line-portrait/testimonials-section"
import FAQSection from "@modules/line-portrait/faq-section"
import FinalCTASection from "@modules/line-portrait/final-cta-section"

export const metadata: Metadata = {
  title: "LineVibes | AI Line Portrait Generator – Turn Photos into Art",
  description:
    "Transform your photos into stunning minimalist line art portraits. Choose from 5 unique styles, preview instantly, and download or order canvas prints. AI-powered, private, and print-ready.",
  keywords: [
    "line art",
    "portrait generator",
    "AI art",
    "line drawing",
    "minimalist portrait",
    "canvas print",
    "photo to art",
    "line portrait",
  ],
  openGraph: {
    title: "LineVibes | AI Line Portrait Generator",
    description:
      "Turn any photo into a timeless line portrait. Upload, choose a style, download or print.",
    type: "website",
  },
}

export default function Home() {
  return (
    <>
      <HeroUploadSection />
      <StyleSelectorSection />
      <GalleryInspirationSection />
      <HowItWorksSection />
      <KeyFeaturesSection />
      <ProductUpsellSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </>
  )
}
