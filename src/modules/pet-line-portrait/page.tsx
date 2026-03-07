"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowRight,
  Check,
  ChevronDown,
  Crop,
  ImagePlus,
  LayoutGrid,
  Menu,
  MoveRight,
  PawPrint,
  RefreshCcw,
  Sparkles,
  Square,
  Upload,
  WandSparkles,
  X,
} from "lucide-react"

import { useAnalytics } from "@lib/analytics/provider"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type StyleId = "minimalist" | "simple-line" | "playful"
type CompositionId = "head" | "full-body"
type FrameRatio = "square" | "portrait"
type WorkspaceState =
  | "idle"
  | "image-uploaded"
  | "ready-to-generate"
  | "generating"
  | "preview-ready"
  | "error"

type GalleryItem = {
  id: string
  title: string
  animal: "Dogs" | "Cats"
  composition: "Head Portrait" | "Full Body"
  style: "Minimalist" | "Simple Line" | "Playful"
  image: string
}

const pageLinks = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#styles", label: "Styles" },
  { href: "#gallery", label: "Gallery" },
  { href: "#faq", label: "FAQ" },
]

const styleCards = [
  {
    id: "minimalist" as StyleId,
    title: "Minimalist",
    subtitle: "Clean, elegant, modern",
    description:
      "A refined line-art look with fewer interior details and stronger emphasis on silhouette and shape.",
    bestFor: "Best for fluffy pets and modern wall art",
    badge: "Popular",
    image: "/images/line-portrait/style-continuous-line.png",
  },
  {
    id: "simple-line" as StyleId,
    title: "Simple Line",
    subtitle: "Clear, balanced, timeless",
    description:
      "A classic pet line portrait with clean contours and enough detail to stay recognizable.",
    bestFor: "Best for dogs and cats with strong facial features",
    image: "/images/line-portrait/style-faceless.png",
  },
  {
    id: "playful" as StyleId,
    title: "Playful",
    subtitle: "Cute, lively, gift-friendly",
    description:
      "A more expressive style that highlights your pet's charm while keeping the artwork neat and clean.",
    bestFor: "Best for fun gifts and expressive pets",
    image: "/images/line-portrait/style-bold-outline.png",
  },
]

const galleryItems: GalleryItem[] = [
  {
    id: "gallery-1",
    title: "Winston",
    animal: "Dogs",
    composition: "Head Portrait",
    style: "Minimalist",
    image: "/images/line-portrait/gallery-pet.png",
  },
  {
    id: "gallery-2",
    title: "Mochi",
    animal: "Cats",
    composition: "Head Portrait",
    style: "Simple Line",
    image: "/images/line-portrait/portrait-after.png",
  },
  {
    id: "gallery-3",
    title: "Poppy",
    animal: "Dogs",
    composition: "Full Body",
    style: "Playful",
    image: "/images/line-portrait/style-bold-outline.png",
  },
  {
    id: "gallery-4",
    title: "Louie",
    animal: "Cats",
    composition: "Full Body",
    style: "Minimalist",
    image: "/images/line-portrait/style-continuous-line.png",
  },
  {
    id: "gallery-5",
    title: "Nala",
    animal: "Dogs",
    composition: "Head Portrait",
    style: "Simple Line",
    image: "/images/line-portrait/style-faceless.png",
  },
  {
    id: "gallery-6",
    title: "Bean",
    animal: "Cats",
    composition: "Head Portrait",
    style: "Playful",
    image: "/images/line-portrait/portrait-before.png",
  },
]

const filters = [
  "All",
  "Dogs",
  "Cats",
  "Head Portrait",
  "Full Body",
  "Minimalist",
  "Simple Line",
  "Playful",
]

const benefits = [
  {
    title: "Clean Black-and-White Style",
    text: "A simple monochrome look that feels modern and timeless.",
    icon: WandSparkles,
  },
  {
    title: "Recognizable Pet Features",
    text: "Keeps your pet's key identity while simplifying the image into elegant line work.",
    icon: PawPrint,
  },
  {
    title: "Head or Full Body Options",
    text: "Choose the composition that works best for your photo.",
    icon: Crop,
  },
  {
    title: "Style-Controlled Results",
    text: "Minimalist, simple, or playful without cluttered AI noise.",
    icon: Sparkles,
  },
  {
    title: "Preview Before Ordering",
    text: "See the direction before checkout and continue with the version you prefer.",
    icon: Check,
  },
  {
    title: "Perfect for Gifts and Decor",
    text: "A keepsake piece for pet lovers, prints, and personal wall art.",
    icon: LayoutGrid,
  },
]

const deliverables = [
  "A custom black-and-white pet line portrait",
  "Head or full body composition based on your selection",
  "A style preset chosen by you",
  "A clean modern artwork suitable for print or display",
  "A refined final version prepared after purchase",
]

const testimonials = [
  {
    quote:
      "It looked so much like my dog, but in a much cleaner and more elegant style.",
    name: "Emily R.",
  },
  {
    quote:
      "I loved how simple it felt. It was modern, personal, and giftable at the same time.",
    name: "Jason M.",
  },
  {
    quote:
      "The preview made it easy to choose the style I wanted before ordering.",
    name: "Natalie T.",
  },
  {
    quote:
      "It captured my cat's personality without looking overworked or messy.",
    name: "Sophie L.",
  },
]

const faqs = [
  {
    question: "What kind of pet photos work best?",
    answer:
      "Clear single-pet photos work best, especially when the face or full body is visible.",
  },
  {
    question: "Can I choose head only or full body?",
    answer:
      "Yes. You can select your preferred composition and adjust the crop before generating the preview.",
  },
  {
    question: "Which pets are supported?",
    answer: "The first version is best suited for dogs and cats.",
  },
  {
    question: "Will the result still look like my pet?",
    answer:
      "Yes. The portrait is designed to preserve your pet's key visual identity while simplifying the image into clean line work.",
  },
  {
    question: "Is the background included?",
    answer:
      "No. The portrait focuses on the pet only and is designed as a clean subject-centered artwork.",
  },
  {
    question: "Can I preview before ordering?",
    answer:
      "Yes. You can generate a preview first, then continue with the version you want to order.",
  },
  {
    question: "Can I change the style after uploading?",
    answer:
      "Yes. You can switch styles, re-crop the photo, and generate again before checkout.",
  },
  {
    question: "Can I upload more than one pet?",
    answer:
      "For the best result, this version is designed for one pet per portrait.",
  },
]

const steps = [
  {
    title: "Upload a Pet Photo",
    text: "Start with a clear photo of your dog or cat.",
    icon: Upload,
  },
  {
    title: "Crop Head or Full Body",
    text: "Choose the framing that fits your image best.",
    icon: Crop,
  },
  {
    title: "Pick a Style",
    text: "Select minimalist, simple line, or playful.",
    icon: Sparkles,
  },
  {
    title: "Generate Preview and Order",
    text: "Preview first, then continue with the version you like.",
    icon: ArrowRight,
  },
]

function SectionIntro({
  eyebrow,
  title,
  body,
  centered = true,
}: {
  eyebrow: string
  title: string
  body: string
  centered?: boolean
}) {
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-[family-name:Georgia,_Times_New_Roman,_serif] text-3xl leading-tight text-stone-950 md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-stone-600 md:text-lg">{body}</p>
    </div>
  )
}

function PageHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#f6f1e8]/90 backdrop-blur">
      <div className="content-container">
        <div className="flex items-center justify-between gap-6 py-4">
          <a
            href="#top"
            className="font-[family-name:Georgia,_Times_New_Roman,_serif] text-2xl text-stone-950"
          >
            LineVibes
          </a>

          <nav className="hidden items-center gap-8 text-sm text-stone-700 lg:flex">
            {pageLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-stone-950">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <a
              href="#generator"
              className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Upload Photo
              <MoveRight className="h-4 w-4" />
            </a>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 text-stone-800 lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-stone-200 py-4 lg:hidden">
            <div className="flex flex-col gap-4 text-sm text-stone-700">
              {pageLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-stone-950"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#generator"
                className="inline-flex items-center justify-center rounded-full bg-stone-950 px-5 py-3 font-semibold text-white"
                onClick={() => setMenuOpen(false)}
              >
                Start
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-stone-200 bg-[#f6f1e8] py-16 md:py-24"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, rgba(255,255,255,0.9), transparent 35%), linear-gradient(rgba(120,113,108,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(120,113,108,0.08) 1px, transparent 1px)",
          backgroundSize: "auto, 28px 28px, 28px 28px",
        }}
      />

      <div className="content-container relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-500">
              Custom Pet Portraits from Your Photo
            </p>
            <h1 className="mt-6 font-[family-name:Georgia,_Times_New_Roman,_serif] text-4xl leading-tight text-stone-950 md:text-6xl">
              Turn Your Pet Photo into Clean Black-and-White Line Art
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
              Upload a photo of your dog or cat and transform it into a clean,
              modern pet line portrait for gifts, wall art, and keepsakes.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Black and White Line Art",
                "Head or Full Body",
                "Preview Before Ordering",
                "Clean Modern Style",
              ].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-stone-300 bg-white/80 px-4 py-2 text-sm text-stone-700 shadow-sm"
                >
                  {pill}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#generator"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-stone-800"
              >
                Upload Your Pet Photo
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#styles"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 px-6 py-4 text-sm font-semibold text-stone-800 transition hover:bg-white"
              >
                Explore Styles
              </a>
            </div>

            <p className="mt-4 text-sm text-stone-500">
              Best results come from clear single-pet photos with a visible face
              or full body.
            </p>
          </div>

          <div className="relative">
            <div className="rounded-[32px] border border-stone-300 bg-white p-5 shadow-[0_25px_80px_rgba(28,25,23,0.08)]">
              <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
                <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-3">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
                    Original Photo
                  </p>
                  <div className="overflow-hidden rounded-[20px]">
                    <Image
                      src="/images/line-portrait/portrait-before.png"
                      alt="Original pet photo"
                      width={900}
                      height={1100}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center text-stone-400">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-stone-300 bg-[#f6f1e8]">
                    <MoveRight className="h-5 w-5" />
                  </div>
                </div>

                <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-3">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
                    Line Portrait
                  </p>
                  <div className="overflow-hidden rounded-[20px] bg-[#f7f7f5]">
                    <Image
                      src="/images/line-portrait/portrait-after.png"
                      alt="Pet line portrait preview"
                      width={900}
                      height={1100}
                      className="h-full w-full object-cover grayscale"
                    />
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-sm text-stone-500">
                From photo to line portrait in just a few steps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white py-20 md:py-28">
      <div className="content-container">
        <SectionIntro
          eyebrow="How It Works"
          title="Create Your Pet Portrait in 4 Simple Steps"
          body="A fast and guided process designed to keep the result clean, recognizable, and easy to love."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <div
                key={step.title}
                className="rounded-[28px] border border-stone-200 bg-[#faf8f3] p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-stone-900 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
                  Step {index + 1}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-stone-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{step.text}</p>
              </div>
            )
          })}
        </div>

        <p className="mt-8 text-center text-sm text-stone-500">
          You can re-crop and switch styles before ordering.
        </p>
      </div>
    </section>
  )
}

function StylesSection() {
  return (
    <section id="styles" className="border-y border-stone-200 bg-[#f8f5ee] py-20 md:py-28">
      <div className="content-container">
        <SectionIntro
          eyebrow="Try a Style"
          title="Choose the Portrait Style That Fits Your Pet"
          body="Each style is designed to stay clean, readable, and visually consistent from your photo."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {styleCards.map((card) => (
            <article
              key={card.id}
              className="overflow-hidden rounded-[30px] border border-stone-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover grayscale"
                />
                {card.badge && (
                  <span className="absolute left-5 top-5 rounded-full bg-stone-950 px-3 py-1 text-xs font-semibold text-white">
                    {card.badge}
                  </span>
                )}
              </div>

              <div className="p-7">
                <h3 className="text-2xl font-semibold text-stone-950">{card.title}</h3>
                <p className="mt-2 text-sm uppercase tracking-[0.24em] text-stone-400">
                  {card.subtitle}
                </p>
                <p className="mt-5 text-sm leading-7 text-stone-600">
                  {card.description}
                </p>
                <p className="mt-5 rounded-2xl bg-[#f6f1e8] px-4 py-3 text-sm text-stone-700">
                  {card.bestFor}
                </p>
                <a
                  href="#generator"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                >
                  Try {card.title}
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-stone-500">
          Not sure where to start? Pick the style that feels closest to your
          pet's personality.
        </p>
      </div>
    </section>
  )
}

function GallerySection() {
  const [activeFilter, setActiveFilter] = useState("All")

  const items = useMemo(() => {
    if (activeFilter === "All") {
      return galleryItems
    }

    return galleryItems.filter(
      (item) =>
        item.animal === activeFilter ||
        item.composition === activeFilter ||
        item.style === activeFilter
    )
  }, [activeFilter])

  return (
    <section id="gallery" className="bg-white py-20 md:py-28">
      <div className="content-container">
        <SectionIntro
          eyebrow="Inspiration Gallery"
          title="See What Pet Line Portraits Can Look Like"
          body="Browse different compositions and styles to get inspired before you upload your own photo."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                activeFilter === filter
                  ? "border-stone-950 bg-stone-950 text-white"
                  : "border-stone-300 bg-white text-stone-700 hover:border-stone-500"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-[28px] border border-stone-200 bg-[#faf8f3]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover grayscale transition duration-500 hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-stone-950">{item.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[item.animal, item.composition, item.style].map((tag) => (
                    <span
                      key={`${item.id}-${tag}`}
                      className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs text-stone-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#generator"
            className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Start Your Pet Portrait
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

function BenefitsSection() {
  return (
    <section className="border-y border-stone-200 bg-[#f8f5ee] py-20 md:py-28">
      <div className="content-container">
        <SectionIntro
          eyebrow="Why Choose LineVibes"
          title="Made for Clean, Personalized Pet Art"
          body="This is a controlled portrait experience designed around clarity, simplicity, and visual consistency."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <article
                key={benefit.title}
                className="rounded-[28px] border border-stone-200 bg-white p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6f1e8] text-stone-900">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-stone-950">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  {benefit.text}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function WorkspaceStateBadge({ state }: { state: WorkspaceState }) {
  const labels: Record<WorkspaceState, string> = {
    idle: "State A: Idle",
    "image-uploaded": "State B: Image Uploaded",
    "ready-to-generate": "State C: Ready to Generate",
    generating: "State D: Generating",
    "preview-ready": "State E: Preview Ready",
    error: "State F: Error",
  }

  return (
    <span className="inline-flex rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
      {labels[state]}
    </span>
  )
}

function GeneratorWorkspace() {
  const { trackCustomEvent } = useAnalytics()
  const inputRef = useRef<HTMLInputElement>(null)
  const readyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const generateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState>("idle")
  const [style, setStyle] = useState<StyleId>("minimalist")
  const [composition, setComposition] = useState<CompositionId>("head")
  const [frameRatio, setFrameRatio] = useState<FrameRatio>("square")
  const [zoom, setZoom] = useState(28)
  const [uploadName, setUploadName] = useState("")
  const [uploadUrl, setUploadUrl] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [recommendation, setRecommendation] = useState(
    "Head Portrait is recommended for this image because the face is clear and centered."
  )

  useEffect(() => {
    return () => {
      if (readyTimerRef.current) {
        clearTimeout(readyTimerRef.current)
      }
      if (generateTimerRef.current) {
        clearTimeout(generateTimerRef.current)
      }
      if (uploadUrl) {
        URL.revokeObjectURL(uploadUrl)
      }
    }
  }, [uploadUrl])

  const canGenerate =
    (workspaceState === "ready-to-generate" ||
      workspaceState === "image-uploaded" ||
      workspaceState === "preview-ready") &&
    Boolean(uploadUrl)

  const isBusy = workspaceState === "generating"
  const styleCopy = styleCards.find((item) => item.id === style)

  const previewTone = {
    minimalist: "contrast-[0.9] grayscale brightness-[1.12]",
    "simple-line": "grayscale contrast-125",
    playful: "grayscale contrast-[1.05] brightness-[1.04] saturate-0",
  }[style]

  const uploadFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload a JPG, PNG, or WEBP image.")
      setWorkspaceState("error")
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("Please keep uploads under 15MB.")
      setWorkspaceState("error")
      return
    }

    const nextUrl = URL.createObjectURL(file)
    const image = new window.Image()

    image.onload = () => {
      if (uploadUrl) {
        URL.revokeObjectURL(uploadUrl)
      }

      const isPortrait = image.height > image.width * 1.15
      setUploadName(file.name)
      setUploadUrl(nextUrl)
      setFrameRatio(isPortrait ? "portrait" : "square")
      setComposition(isPortrait ? "full-body" : "head")
      setRecommendation(
        isPortrait
          ? "Full Body is recommended for this image because the pose and outline are fully visible."
          : "Head Portrait is recommended for this image because the face is clear and centered."
      )
      setErrorMessage("")
      setWorkspaceState("image-uploaded")
      trackCustomEvent("pet_portrait_upload_success", { file_name: file.name })

      if (readyTimerRef.current) {
        clearTimeout(readyTimerRef.current)
      }

      readyTimerRef.current = setTimeout(() => {
        setWorkspaceState("ready-to-generate")
      }, 250)
    }

    image.onerror = () => {
      URL.revokeObjectURL(nextUrl)
      setErrorMessage("We could not read that file. Please try another image.")
      setWorkspaceState("error")
    }

    image.src = nextUrl
  }

  const handleGenerate = () => {
    if (!canGenerate) {
      return
    }

    setWorkspaceState("generating")
    trackCustomEvent("pet_portrait_preview_requested", {
      style,
      composition,
      frame_ratio: frameRatio,
    })

    if (generateTimerRef.current) {
      clearTimeout(generateTimerRef.current)
    }

    generateTimerRef.current = setTimeout(() => {
      setWorkspaceState("preview-ready")
      trackCustomEvent("pet_portrait_preview_ready", {
        style,
        composition,
        frame_ratio: frameRatio,
      })
    }, 1600)
  }

  const resetError = () => {
    setErrorMessage("")
    setWorkspaceState(uploadUrl ? "ready-to-generate" : "idle")
  }

  const openFileDialog = () => {
    if (!isBusy) {
      inputRef.current?.click()
    }
  }

  return (
    <section id="generator" className="bg-white py-20 md:py-28">
      <div className="content-container">
        <SectionIntro
          eyebrow="Create Your Portrait"
          title="Upload, Crop, Style, Preview"
          body="Build your pet portrait in a guided workspace before you continue to order."
          centered={false}
        />

        <div className="mt-8">
          <WorkspaceStateBadge state={workspaceState} />
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-5">
            <div className="rounded-[30px] border border-stone-200 bg-[#faf8f3] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
                    Upload
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-stone-950">
                    Upload Your Pet Photo
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    Choose a clear photo of one dog or cat with a visible face
                    or full body.
                  </p>
                </div>
                <ImagePlus className="h-5 w-5 text-stone-400" />
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) {
                    uploadFile(file)
                  }
                }}
              />

              <button
                type="button"
                onClick={openFileDialog}
                disabled={isBusy}
                className={`mt-6 flex min-h-[240px] w-full flex-col items-center justify-center rounded-[28px] border border-dashed px-6 text-center transition ${
                  uploadUrl
                    ? "border-stone-300 bg-white"
                    : "border-stone-300 bg-white hover:border-stone-500"
                } ${isBusy ? "cursor-not-allowed opacity-60" : ""}`}
              >
                {uploadUrl ? (
                  <div className="w-full">
                    <div className="relative mx-auto aspect-[4/3] max-w-md overflow-hidden rounded-[22px]">
                      <img
                        src={uploadUrl}
                        alt="Uploaded pet"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-stone-900">
                      {uploadName}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.24em] text-stone-400">
                      Click to replace photo
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f6f1e8] text-stone-900">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="mt-5 text-lg font-semibold text-stone-900">
                      Drag and drop your image here
                    </p>
                    <p className="mt-2 text-sm text-stone-500">
                      or click to upload
                    </p>
                    <p className="mt-4 text-xs uppercase tracking-[0.24em] text-stone-400">
                      JPG, PNG, WEBP
                    </p>
                  </>
                )}
              </button>

              <ul className="mt-5 space-y-2 text-sm text-stone-500">
                <li>Single pet photos work best.</li>
                <li>Clear lighting is recommended.</li>
                <li>Avoid crowded backgrounds if possible.</li>
              </ul>

              {workspaceState === "error" && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                  <p>{errorMessage}</p>
                  <button
                    type="button"
                    onClick={resetError}
                    className="mt-3 inline-flex items-center gap-2 font-semibold text-red-800"
                  >
                    Retry
                    <RefreshCcw className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {uploadUrl && (
              <div className="rounded-[30px] border border-stone-200 bg-[#faf8f3] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
                  Smart Recommendation
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-stone-950">
                  Recommended Composition
                </h3>
                <p className="mt-4 rounded-[22px] border border-stone-200 bg-white px-4 py-4 text-sm leading-7 text-stone-700">
                  {recommendation}
                </p>
                <p className="mt-3 text-sm text-stone-500">
                  You can keep the recommended option or choose a different crop.
                </p>
              </div>
            )}

            {uploadUrl && (
              <div className="rounded-[30px] border border-stone-200 bg-[#faf8f3] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
                      Crop
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-stone-950">
                      Choose Your Composition
                    </h3>
                  </div>
                  <Crop className="h-5 w-5 text-stone-400" />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {[
                    { id: "head" as CompositionId, label: "Head Portrait" },
                    { id: "full-body" as CompositionId, label: "Full Body" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setComposition(option.id)
                        if (workspaceState !== "preview-ready") {
                          setWorkspaceState("ready-to-generate")
                        }
                      }}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        composition === option.id
                          ? "border-stone-950 bg-stone-950 text-white"
                          : "border-stone-300 bg-white text-stone-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 rounded-[24px] border border-stone-200 bg-white p-4">
                  <div
                    className={`relative mx-auto overflow-hidden rounded-[20px] bg-stone-100 ${
                      frameRatio === "square"
                        ? "aspect-square max-w-[340px]"
                        : "aspect-[4/5] max-w-[300px]"
                    }`}
                  >
                    <img
                      src={uploadUrl}
                      alt="Crop preview"
                      className="h-full w-full object-cover"
                      style={{ transform: `scale(${1 + zoom / 100})` }}
                    />
                    <div className="absolute inset-[10%] rounded-[18px] border border-dashed border-white/90 shadow-[0_0_0_999px_rgba(28,25,23,0.18)]" />
                    <div className="absolute inset-4 rounded-[18px] border border-white/70" />
                  </div>

                  <div className="mt-5">
                    <label className="text-sm font-medium text-stone-700">
                      Zoom
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={zoom}
                      onChange={(event) => {
                        setZoom(Number(event.target.value))
                        if (workspaceState !== "preview-ready") {
                          setWorkspaceState("ready-to-generate")
                        }
                      }}
                      className="mt-3 w-full"
                    />
                  </div>
                </div>

                <p className="mt-4 text-sm text-stone-600">
                  Adjust the crop to keep your pet clearly framed inside the
                  artwork area.
                </p>
                <p className="mt-2 text-sm text-stone-500">
                  For the cleanest result, keep the ears, outline, and body
                  shape fully inside the crop.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {[
                    { id: "square" as FrameRatio, label: "Square", icon: Square },
                    {
                      id: "portrait" as FrameRatio,
                      label: "Portrait",
                      icon: LayoutGrid,
                    },
                  ].map((option) => {
                    const Icon = option.icon

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setFrameRatio(option.id)
                          if (workspaceState !== "preview-ready") {
                            setWorkspaceState("ready-to-generate")
                          }
                        }}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          frameRatio === option.id
                            ? "border-stone-950 bg-stone-950 text-white"
                            : "border-stone-300 bg-white text-stone-700"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {uploadUrl && (
              <div className="rounded-[30px] border border-stone-200 bg-[#faf8f3] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
                  Style
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-stone-950">
                  Choose a Style
                </h3>

                <div className="mt-6 space-y-3">
                  {styleCards.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setStyle(option.id)
                        if (workspaceState !== "preview-ready") {
                          setWorkspaceState("ready-to-generate")
                        }
                      }}
                      className={`w-full rounded-[24px] border px-5 py-4 text-left transition ${
                        style === option.id
                          ? "border-stone-950 bg-white shadow-sm"
                          : "border-stone-200 bg-white/70"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold text-stone-950">
                            {option.title}
                          </p>
                          <p className="mt-2 text-sm text-stone-600">
                            {option.id === "minimalist" &&
                              "Elegant and reduced, with fewer internal details."}
                            {option.id === "simple-line" &&
                              "Balanced and recognizable, with clean contour lines."}
                            {option.id === "playful" &&
                              "Cute and expressive, with a more lively feel."}
                          </p>
                        </div>
                        <span
                          className={`mt-1 h-5 w-5 rounded-full border ${
                            style === option.id
                              ? "border-stone-950 bg-stone-950"
                              : "border-stone-300"
                          }`}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="sticky bottom-4 rounded-[30px] border border-stone-200 bg-stone-950 p-6 text-white shadow-[0_20px_60px_rgba(28,25,23,0.15)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-300">
                    Generate
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">
                    Generate Preview
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-300">
                    Preview the artistic direction before continuing to checkout.
                  </p>
                </div>
                <WandSparkles className="h-5 w-5 text-stone-300" />
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={!canGenerate || isBusy}
                className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold transition ${
                  !canGenerate || isBusy
                    ? "cursor-not-allowed bg-white/20 text-stone-300"
                    : "bg-white text-stone-950 hover:bg-stone-100"
                }`}
              >
                {isBusy ? "Generating Preview..." : "Generate Preview"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div>
            <div className="rounded-[34px] border border-stone-200 bg-[#f3efe6] p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
                    Preview
                  </p>
                  <h3 className="mt-2 font-[family-name:Georgia,_Times_New_Roman,_serif] text-3xl text-stone-950">
                    Preview
                  </h3>
                </div>
                {styleCopy && workspaceState === "preview-ready" && (
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    <span className="rounded-full border border-stone-300 bg-white px-3 py-2">
                      Style: {styleCopy.title}
                    </span>
                    <span className="rounded-full border border-stone-300 bg-white px-3 py-2">
                      Composition:{" "}
                      {composition === "head" ? "Head Portrait" : "Full Body"}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6">
                {workspaceState === "idle" && (
                  <div className="flex min-h-[560px] flex-col items-center justify-center rounded-[30px] border border-dashed border-stone-300 bg-white px-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f6f1e8] text-stone-700">
                      <PawPrint className="h-7 w-7" />
                    </div>
                    <h4 className="mt-6 text-2xl font-semibold text-stone-950">
                      Your Portrait Preview Will Appear Here
                    </h4>
                    <p className="mt-4 max-w-md text-sm leading-7 text-stone-500">
                      Upload a pet photo, crop the composition, and choose a
                      style to generate your preview.
                    </p>
                  </div>
                )}

                {(workspaceState === "image-uploaded" ||
                  workspaceState === "ready-to-generate") && (
                  <div className="flex min-h-[560px] flex-col items-center justify-center rounded-[30px] border border-stone-300 bg-white px-8 text-center">
                    <div className="relative aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[28px] border border-stone-200 bg-stone-100">
                      <img
                        src={uploadUrl}
                        alt="Pre-generation preview"
                        className="h-full w-full object-cover opacity-95"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.55))]" />
                    </div>
                    <h4 className="mt-6 text-2xl font-semibold text-stone-950">
                      Preview Staging Area
                    </h4>
                    <p className="mt-4 max-w-md text-sm leading-7 text-stone-500">
                      Your uploaded photo is ready. Generate the preview to see a
                      clean black-and-white portrait direction.
                    </p>
                  </div>
                )}

                {workspaceState === "generating" && (
                  <div className="flex min-h-[560px] flex-col items-center justify-center rounded-[30px] border border-stone-300 bg-white px-8 text-center">
                    <div className="h-[420px] w-full max-w-[420px] animate-pulse rounded-[28px] bg-[linear-gradient(110deg,#f5f5f4_8%,#e7e5e4_18%,#f5f5f4_33%)] bg-[length:200%_100%]" />
                    <h4 className="mt-6 text-2xl font-semibold text-stone-950">
                      Generating your portrait preview...
                    </h4>
                    <p className="mt-4 max-w-md text-sm leading-7 text-stone-500">
                      Controls are temporarily locked while we build the preview
                      direction.
                    </p>
                  </div>
                )}

                {workspaceState === "preview-ready" && (
                  <div className="rounded-[30px] border border-stone-300 bg-white p-5">
                    <div className="relative min-h-[620px] overflow-hidden rounded-[28px] bg-[#fcfbf8] p-6">
                      <div className="absolute inset-0 opacity-70">
                        <div
                          className="h-full w-full"
                          style={{
                            backgroundImage:
                              "linear-gradient(rgba(120,113,108,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120,113,108,0.06) 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                          }}
                        />
                      </div>

                      <div className="relative mx-auto flex h-full max-w-[520px] flex-col items-center">
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[30px] border border-stone-200 bg-white shadow-[0_20px_50px_rgba(28,25,23,0.08)]">
                          <img
                            src={uploadUrl}
                            alt="Generated portrait preview"
                            className={`h-full w-full object-cover ${previewTone}`}
                            style={{ transform: `scale(${1 + zoom / 120})` }}
                          />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.45),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.45))]" />
                          <svg
                            viewBox="0 0 500 700"
                            className="absolute inset-0 h-full w-full opacity-80"
                            aria-hidden="true"
                          >
                            <path
                              d="M122 180C145 110 218 88 280 104C337 118 384 166 383 235C381 300 334 331 303 352C281 367 262 386 254 421C241 479 273 540 336 572"
                              fill="none"
                              stroke="#111111"
                              strokeWidth="4"
                              strokeLinecap="round"
                            />
                            <path
                              d="M121 182C96 214 87 266 100 323C113 381 150 410 186 435C218 457 235 489 238 543"
                              fill="none"
                              stroke="#111111"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                            <path
                              d="M185 238C200 221 231 210 265 216C297 223 324 243 334 270"
                              fill="none"
                              stroke="#111111"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                            <path
                              d="M203 313C228 332 281 336 315 315"
                              fill="none"
                              stroke="#111111"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>

                        <div className="mt-6 flex w-full flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={handleGenerate}
                            className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                          >
                            <RefreshCcw className="h-4 w-4" />
                            Regenerate
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setWorkspaceState("ready-to-generate")
                              setStyle("simple-line")
                            }}
                            className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                          >
                            Change Style
                          </button>
                          <button
                            type="button"
                            onClick={() => setWorkspaceState("ready-to-generate")}
                            className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                          >
                            Re-crop Photo
                          </button>
                          <LocalizedClientLink
                            href="/custom"
                            className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                          >
                            Continue to Order
                            <ArrowRight className="h-4 w-4" />
                          </LocalizedClientLink>
                        </div>

                        <p className="mt-4 text-sm text-stone-500">
                          This is a preview version to show the style direction
                          before purchase.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {workspaceState === "error" && !uploadUrl && (
                  <div className="flex min-h-[560px] flex-col items-center justify-center rounded-[30px] border border-red-200 bg-red-50 px-8 text-center">
                    <h4 className="text-2xl font-semibold text-red-900">
                      Upload issue
                    </h4>
                    <p className="mt-4 max-w-md text-sm leading-7 text-red-700">
                      {errorMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DeliverablesSection() {
  return (
    <section className="border-y border-stone-200 bg-[#f8f5ee] py-20 md:py-28">
      <div className="content-container">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionIntro
              eyebrow="What You Get"
              title="A Personalized Pet Portrait Designed from Your Photo"
              body="Your final artwork is created around the crop and style you choose during preview."
              centered={false}
            />
            <ul className="mt-8 space-y-4">
              {deliverables.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-[20px] border border-stone-200 bg-white px-4 py-4 text-sm leading-7 text-stone-700"
                >
                  <Check className="mt-1 h-4 w-4 flex-none text-stone-900" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[34px] border border-stone-200 bg-white p-5 shadow-sm">
            <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-[#faf8f3] p-4">
              <Image
                src="/images/line-portrait/gallery-pet.png"
                alt="Framed pet portrait mockup"
                width={1400}
                height={1000}
                className="h-full w-full rounded-[22px] object-cover grayscale"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function OrderOptionsSection() {
  return (
    <section id="order-options" className="bg-white py-20 md:py-28">
      <div className="content-container">
        <SectionIntro
          eyebrow="Order Options"
          title="Choose How You Want to Receive Your Portrait"
          body="Start with a preview, then continue with the format that fits your needs."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {[
            {
              title: "Digital Portrait",
              description:
                "A high-resolution artwork file based on your chosen preview direction.",
              button: "Choose Digital",
            },
            {
              title: "Print-Ready Artwork",
              description:
                "A refined final artwork prepared for printing, framing, or personal display.",
              button: "Choose Print-Ready",
            },
          ].map((option) => (
            <div
              key={option.title}
              className="rounded-[30px] border border-stone-200 bg-[#faf8f3] p-8"
            >
              <h3 className="text-2xl font-semibold text-stone-950">
                {option.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-stone-600">
                {option.description}
              </p>
              <LocalizedClientLink
                href="/custom"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
              >
                {option.button}
                <ArrowRight className="h-4 w-4" />
              </LocalizedClientLink>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-stone-500">
          More fulfillment options can be added over time.
        </p>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="border-y border-stone-200 bg-[#f8f5ee] py-20 md:py-28">
      <div className="content-container">
        <SectionIntro
          eyebrow="What Pet Lovers Say"
          title="Loved for Its Clean Look and Personal Feel"
          body="A pet portrait should feel simple, recognizable, and worth keeping."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-[28px] border border-stone-200 bg-white p-6"
            >
              <p className="text-base leading-8 text-stone-700">
                "{testimonial.quote}"
              </p>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-stone-400">
                {testimonial.name}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const [openItem, setOpenItem] = useState(0)

  return (
    <section id="faq" className="bg-white py-20 md:py-28">
      <div className="content-container">
        <SectionIntro
          eyebrow="FAQ"
          title="Questions Before You Upload?"
          body="Here are the most common things people want to know before generating their pet portrait."
        />

        <div className="mx-auto mt-14 max-w-4xl space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openItem === index

            return (
              <article
                key={faq.question}
                className="rounded-[24px] border border-stone-200 bg-[#faf8f3]"
              >
                <button
                  type="button"
                  onClick={() => setOpenItem(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-lg font-semibold text-stone-950">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-none text-stone-500 transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm leading-7 text-stone-600">
                    {faq.answer}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FinalCTASection() {
  return (
    <section className="border-t border-stone-200 bg-[#1f1b18] py-20 text-white md:py-24">
      <div className="content-container">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-[family-name:Georgia,_Times_New_Roman,_serif] text-4xl leading-tight md:text-5xl">
            Turn Your Favorite Pet Photo into Timeless Line Art
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-stone-300">
            Upload a clear photo, choose your style, and preview your portrait
            before ordering.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="#generator"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-stone-950 transition hover:bg-stone-100"
            >
              Start with Your Pet Photo
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#gallery"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View Example Portraits
            </a>
          </div>
          <p className="mt-5 text-sm uppercase tracking-[0.3em] text-stone-400">
            Simple. Personal. Cleanly designed for pet lovers.
          </p>
        </div>
      </div>
    </section>
  )
}

export default function PetLinePortraitPage() {
  return (
    <div className="bg-white text-stone-950">
      <PageHeader />
      <HeroSection />
      <HowItWorksSection />
      <StylesSection />
      <GallerySection />
      <BenefitsSection />
      <GeneratorWorkspace />
      <DeliverablesSection />
      <OrderOptionsSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  )
}
