"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowRight,
  Check,
  ChevronDown,
  Crop,
  LayoutGrid,
  Menu,
  MoveRight,
  PawPrint,
  Sparkles,
  Upload,
  WandSparkles,
  X,
} from "lucide-react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PetLinePortraitGeneratorSection from "@modules/pet-line-portrait/components/PetLinePortraitGeneratorSection"

type StyleId = "minimalist" | "simple-line" | "playful"

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
  const [workspaceActive, setWorkspaceActive] = useState(false)
  const headerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = document.documentElement
    const syncWorkspaceState = () => {
      setWorkspaceActive(root.classList.contains("pet-portrait-workspace-active"))
    }

    syncWorkspaceState()

    const observer = new MutationObserver(() => {
      syncWorkspaceState()
    })

    observer.observe(root, { attributes: true, attributeFilter: ["class"] })

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const header = headerRef.current

    if (!header) {
      return
    }

    const root = document.documentElement
    const syncHeaderHeight = () => {
      const hideMobileHeader = workspaceActive && window.innerWidth < 768
      root.style.setProperty(
        "--pet-portrait-header-height",
        hideMobileHeader ? "0px" : `${header.offsetHeight}px`
      )
      root.style.setProperty("--pet-portrait-preview-gap", window.innerWidth >= 1280 ? "24px" : "12px")
    }

    syncHeaderHeight()

    const resizeObserver = new ResizeObserver(() => {
      syncHeaderHeight()
    })

    resizeObserver.observe(header)
    window.addEventListener("resize", syncHeaderHeight)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", syncHeaderHeight)
      root.style.removeProperty("--pet-portrait-header-height")
      root.style.removeProperty("--pet-portrait-preview-gap")
    }
  }, [workspaceActive])

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 border-b border-stone-200/80 bg-[#f6f1e8]/90 backdrop-blur transition-transform duration-300 ${
        workspaceActive ? "-translate-y-full md:translate-y-0" : "translate-y-0"
      }`}
    >
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
      <PetLinePortraitGeneratorSection />
      <DeliverablesSection />
      <OrderOptionsSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  )
}
