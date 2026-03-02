"use client"

import { useState } from "react"
import { ChevronDown } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@medusajs/ui"

// ============================================
// LineVibes Navigation Data Structure
// Focused on Line Portraits
// ============================================

// Shop Mega Menu - organized by Subject, Style, and Format
const shopMegaMenu = {
  bySubject: {
    title: "By Subject",
    items: [
      { name: "People", href: "/categories/people", icon: "👤", description: "Individual portraits" },
      { name: "Pets", href: "/categories/pets", icon: "🐾", description: "Pet line portraits" },
      { name: "Couples", href: "/categories/couples", icon: "💑", description: "Couple & partner portraits" },
      { name: "Family & Groups", href: "/categories/family-groups", icon: "👨‍👩‍👧‍👦", description: "Family & group portraits" },
    ],
  },
  byStyle: {
    title: "By Style",
    items: [
      { name: "Minimalist", href: "/collections/minimalist", description: "Clean, simple lines" },
      { name: "Detailed", href: "/collections/detailed", description: "Intricate line work" },
      { name: "Bold Stroke", href: "/collections/bold-stroke", description: "Expressive & dramatic" },
      { name: "Sketch", href: "/collections/sketch", description: "Hand-drawn feel" },
    ],
  },
  byFormat: {
    title: "By Format",
    items: [
      { name: "Digital Download", href: "/collections/digital", description: "Instant delivery" },
      { name: "Printed Poster", href: "/collections/printed", description: "Museum-quality paper" },
      { name: "Framed Art", href: "/collections/framed", description: "Ready to hang" },
      { name: "Canvas", href: "/collections/canvas", description: "Gallery wrapped" },
    ],
  },
}

// Occasions Mega Menu - organized by Gift Purpose and Recipient
const occasionsMegaMenu = {
  giftIdeas: {
    title: "Gift Ideas",
    items: [
      { name: "Anniversary Gifts", href: "/collections/anniversary", icon: "💕" },
      { name: "Memorial Tributes", href: "/collections/memorial", icon: "🕊️" },
      { name: "Wedding Gifts", href: "/collections/wedding", icon: "💒" },
      { name: "Birthday Gifts", href: "/collections/birthday", icon: "🎂" },
      { name: "Father's Day", href: "/collections/fathers-day", icon: "👔" },
      { name: "Mother's Day", href: "/collections/mothers-day", icon: "💐" },
    ],
  },
  giftFor: {
    title: "Gift For",
    items: [
      { name: "Gift for Him", href: "/collections/gift-for-him" },
      { name: "Gift for Her", href: "/collections/gift-for-her" },
      { name: "Gift for Dad", href: "/collections/gift-for-dad" },
      { name: "Gift for Mom", href: "/collections/gift-for-mom" },
      { name: "Gift for Couples", href: "/collections/gift-for-couples" },
    ],
  },
}

// Navigation items for desktop header
const navItems = [
  { name: "Line Portraits", href: "/", megaMenuKey: null, isHighlighted: true },
  { name: "Shop", href: "/store", megaMenuKey: "shop" },
  { name: "Occasions", href: "/collections/occasions", megaMenuKey: "occasions" },
  { name: "Our Story", href: "/about", megaMenuKey: null },
]

export default function DesktopNav() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  return (
    <nav className="hidden lg:flex items-center gap-x-6">
      {navItems.map((item) => (
        <div
          key={item.name}
          className="relative"
          onMouseEnter={() => item.megaMenuKey && setActiveMenu(item.megaMenuKey)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <LocalizedClientLink
            href={item.href}
            className={clx(
              "flex items-center gap-x-1 py-4 text-sm font-medium transition-colors whitespace-nowrap",
              item.isHighlighted 
                ? "text-indigo-600 hover:text-indigo-700" 
                : "text-stone-700 hover:text-stone-900",
              activeMenu === item.megaMenuKey && "text-stone-900"
            )}
          >
            {item.name}
            {item.megaMenuKey && (
              <ChevronDown
                className={clx(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  activeMenu === item.megaMenuKey && "rotate-180"
                )}
              />
            )}
          </LocalizedClientLink>

          {/* Shop Mega Menu */}
          {item.megaMenuKey === "shop" && activeMenu === "shop" && (
            <div className="absolute top-full left-0 pt-2 z-50">
              <div className="bg-white rounded-xl shadow-2xl border border-stone-100 p-6 w-[700px] max-w-[calc(100vw-2rem)]">
                {/* Mega Menu Header */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-stone-100">
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900">
                      Explore Line Portraits
                    </h3>
                    <p className="text-sm text-stone-500 mt-0.5">Transform your photos into timeless line art</p>
                  </div>
                  <LocalizedClientLink
                    href="/store"
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                  >
                    View All 
                    <span className="text-lg">→</span>
                  </LocalizedClientLink>
                </div>

                {/* Three Column Layout */}
                <div className="grid grid-cols-3 gap-8">
                  {/* By Subject */}
                  <div>
                    <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                      {shopMegaMenu.bySubject.title}
                    </h4>
                    <ul className="space-y-2.5">
                      {shopMegaMenu.bySubject.items.map((subItem) => (
                        <li key={subItem.name}>
                          <LocalizedClientLink
                            href={subItem.href}
                            className="group flex items-start gap-2.5 text-sm text-stone-600 hover:text-indigo-600 transition-colors"
                          >
                            <span className="text-base">{subItem.icon}</span>
                            <div>
                              <span className="font-medium block">{subItem.name}</span>
                              <span className="text-xs text-stone-400 group-hover:text-stone-500">{subItem.description}</span>
                            </div>
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* By Style */}
                  <div>
                    <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                      {shopMegaMenu.byStyle.title}
                    </h4>
                    <ul className="space-y-2.5">
                      {shopMegaMenu.byStyle.items.map((subItem) => (
                        <li key={subItem.name}>
                          <LocalizedClientLink
                            href={subItem.href}
                            className="group block text-sm text-stone-600 hover:text-indigo-600 transition-colors"
                          >
                            <span className="font-medium">{subItem.name}</span>
                            <span className="text-xs text-stone-400 group-hover:text-stone-500 block">{subItem.description}</span>
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* By Format */}
                  <div>
                    <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                      {shopMegaMenu.byFormat.title}
                    </h4>
                    <ul className="space-y-2.5">
                      {shopMegaMenu.byFormat.items.map((subItem) => (
                        <li key={subItem.name}>
                          <LocalizedClientLink
                            href={subItem.href}
                            className="group block text-sm text-stone-600 hover:text-indigo-600 transition-colors"
                          >
                            <span className="font-medium">{subItem.name}</span>
                            <span className="text-xs text-stone-400 group-hover:text-stone-500 block">{subItem.description}</span>
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Featured Banner */}
                <div className="mt-6 pt-5 border-t border-stone-100">
                  <LocalizedClientLink 
                    href="/"
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg hover:from-indigo-100 hover:to-purple-100 transition-all group"
                  >
                    <div>
                      <span className="font-semibold text-stone-900">✨ AI Line Portrait Generator</span>
                      <p className="text-sm text-stone-600 mt-0.5">Upload your photo and get a stunning line portrait</p>
                    </div>
                    <span className="text-indigo-600 font-medium group-hover:translate-x-1 transition-transform">
                      Try Now →
                    </span>
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          )}

          {/* Occasions Mega Menu */}
          {item.megaMenuKey === "occasions" && activeMenu === "occasions" && (
            <div className="absolute top-full left-0 pt-2 z-50">
              <div className="bg-white rounded-xl shadow-2xl border border-stone-100 p-6 w-[480px] max-w-[calc(100vw-2rem)]">
                {/* Mega Menu Header */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-stone-100">
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900">
                      Perfect for Every Moment
                    </h3>
                    <p className="text-sm text-stone-500 mt-0.5">Art that captures emotions</p>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Gift Ideas */}
                  <div>
                    <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                      {occasionsMegaMenu.giftIdeas.title}
                    </h4>
                    <ul className="space-y-2.5">
                      {occasionsMegaMenu.giftIdeas.items.map((subItem) => (
                        <li key={subItem.name}>
                          <LocalizedClientLink
                            href={subItem.href}
                            className="flex items-center gap-2 text-sm text-stone-600 hover:text-indigo-600 transition-colors"
                          >
                            <span>{subItem.icon}</span>
                            <span className="font-medium">{subItem.name}</span>
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gift For */}
                  <div>
                    <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                      {occasionsMegaMenu.giftFor.title}
                    </h4>
                    <ul className="space-y-2.5">
                      {occasionsMegaMenu.giftFor.items.map((subItem) => (
                        <li key={subItem.name}>
                          <LocalizedClientLink
                            href={subItem.href}
                            className="text-sm text-stone-600 hover:text-indigo-600 transition-colors font-medium"
                          >
                            {subItem.name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Memorial Highlight */}
                <div className="mt-6 pt-5 border-t border-stone-100">
                  <LocalizedClientLink 
                    href="/collections/memorial"
                    className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg hover:bg-stone-100 transition-all"
                  >
                    <span className="text-2xl">🕊️</span>
                    <div>
                      <span className="font-semibold text-stone-900 block">Memorial Tributes</span>
                      <p className="text-sm text-stone-600">Honor loved ones with timeless artwork</p>
                    </div>
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}
