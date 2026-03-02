"use client"

import { Popover, PopoverPanel, Transition, Disclosure } from "@headlessui/react"
import { ArrowRightMini, XMark, ChevronDown } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

// ============================================
// LineVibes Mobile Navigation Data Structure
// Focused on Line Portraits
// ============================================

const mobileMenuItems = [
  { 
    name: "Line Portraits", 
    href: "/",
    isExpandable: false,
    icon: "✨",
    isHighlighted: true
  },
  { 
    name: "Shop All", 
    href: "/store",
    isExpandable: false,
    icon: "🎨"
  },
  { 
    name: "By Subject", 
    href: "/categories",
    isExpandable: true,
    icon: "📂",
    subItems: [
      { group: "Portrait Types", items: [
        { name: "People", href: "/categories/people", icon: "👤" },
        { name: "Pets", href: "/categories/pets", icon: "🐾" },
        { name: "Couples", href: "/categories/couples", icon: "💑" },
        { name: "Family & Groups", href: "/categories/family-groups", icon: "👨‍👩‍👧‍👦" },
      ]},
    ]
  },
  { 
    name: "By Style", 
    href: "/collections",
    isExpandable: true,
    icon: "✏️",
    subItems: [
      { group: "Art Styles", items: [
        { name: "Minimalist", href: "/collections/minimalist" },
        { name: "Detailed", href: "/collections/detailed" },
        { name: "Bold Stroke", href: "/collections/bold-stroke" },
        { name: "Sketch", href: "/collections/sketch" },
      ]},
    ]
  },
  { 
    name: "Occasions", 
    href: "/collections/occasions",
    isExpandable: true,
    icon: "🎁",
    subItems: [
      { group: "Gift Ideas", items: [
        { name: "Anniversary Gifts", href: "/collections/anniversary", icon: "💕" },
        { name: "Memorial Tributes", href: "/collections/memorial", icon: "🕊️" },
        { name: "Wedding Gifts", href: "/collections/wedding", icon: "💒" },
        { name: "Birthday Gifts", href: "/collections/birthday", icon: "🎂" },
      ]},
      { group: "Gift For", items: [
        { name: "Gift for Him", href: "/collections/gift-for-him" },
        { name: "Gift for Her", href: "/collections/gift-for-her" },
        { name: "Gift for Dad", href: "/collections/gift-for-dad" },
        { name: "Gift for Mom", href: "/collections/gift-for-mom" },
      ]},
    ]
  },
]

const secondaryMenuItems = [
  { name: "Our Story", href: "/about" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
  { name: "Account", href: "/account" },
  { name: "Cart", href: "/cart" },
]

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex lg:hidden">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
                >
                  Menu
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/50 pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <PopoverPanel className="fixed left-0 top-0 bottom-0 w-full max-w-sm z-[51] bg-white overflow-y-auto">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🖋️</span>
                        <span className="text-lg font-semibold text-stone-900">LineVibes</span>
                      </div>
                      <button
                        data-testid="close-menu-button"
                        onClick={close}
                        className="p-2 hover:bg-white/50 rounded-full transition-colors"
                      >
                        <XMark className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Main Navigation */}
                    <div className="flex-1 overflow-y-auto">
                      <nav className="py-4">
                        {mobileMenuItems.map((item) => (
                          <div key={item.name} className="border-b border-stone-50">
                            {item.isExpandable ? (
                              <Disclosure>
                                {({ open: disclosureOpen }) => (
                                  <>
                                    <Disclosure.Button className="w-full flex items-center justify-between px-6 py-4 text-left">
                                      <div className="flex items-center gap-3">
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="text-base font-medium text-stone-900">
                                          {item.name}
                                        </span>
                                      </div>
                                      <ChevronDown
                                        className={clx(
                                          "w-5 h-5 text-stone-400 transition-transform duration-200",
                                          disclosureOpen && "rotate-180"
                                        )}
                                      />
                                    </Disclosure.Button>
                                    <Disclosure.Panel className="bg-stone-50 pb-4">
                                      {item.subItems?.map((group) => (
                                        <div key={group.group} className="px-6 py-3">
                                          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                                            {group.group}
                                          </p>
                                          <ul className="space-y-2">
                                            {group.items.map((subItem) => (
                                              <li key={subItem.name}>
                                                <LocalizedClientLink
                                                  href={subItem.href}
                                                  onClick={close}
                                                  className="flex items-center gap-2 text-sm text-stone-700 hover:text-indigo-600 py-1.5"
                                                >
                                                  {'icon' in subItem && subItem.icon && (
                                                    <span className="text-base">{subItem.icon}</span>
                                                  )}
                                                  <span>{subItem.name}</span>
                                                </LocalizedClientLink>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                      <div className="px-6 pt-2">
                                        <LocalizedClientLink
                                          href={item.href}
                                          onClick={close}
                                          className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
                                        >
                                          View All →
                                        </LocalizedClientLink>
                                      </div>
                                    </Disclosure.Panel>
                                  </>
                                )}
                              </Disclosure>
                            ) : (
                              <LocalizedClientLink
                                href={item.href}
                                onClick={close}
                                className={clx(
                                  "flex items-center gap-3 px-6 py-4 text-base font-medium transition-colors",
                                  item.isHighlighted 
                                    ? "text-indigo-600 bg-gradient-to-r from-indigo-50/50 to-transparent hover:from-indigo-100/50"
                                    : "text-stone-900 hover:bg-stone-50"
                                )}
                              >
                                <span className="text-lg">{item.icon}</span>
                                {item.name}
                                {item.isHighlighted && (
                                  <span className="ml-auto text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                                    New
                                  </span>
                                )}
                              </LocalizedClientLink>
                            )}
                          </div>
                        ))}
                      </nav>

                      {/* Secondary Links */}
                      <div className="px-6 py-4 border-t border-stone-100">
                        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                          More
                        </p>
                        <ul className="space-y-2">
                          {secondaryMenuItems.map((item) => (
                            <li key={item.name}>
                              <LocalizedClientLink
                                href={item.href}
                                onClick={close}
                                className="text-sm text-stone-600 hover:text-indigo-600 block py-1"
                              >
                                {item.name}
                              </LocalizedClientLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Footer - Region/Language Selectors */}
                    <div className="border-t border-stone-100 p-4 bg-stone-50">
                      <div className="space-y-4">
                        {!!locales?.length && (
                          <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={languageToggleState.toggle}
                          >
                            <LanguageSelect
                              toggleState={languageToggleState}
                              locales={locales}
                              currentLocale={currentLocale}
                            />
                            <ArrowRightMini
                              className={clx(
                                "transition-transform duration-150",
                                languageToggleState.state ? "-rotate-90" : ""
                              )}
                            />
                          </div>
                        )}
                        <div
                          className="flex justify-between items-center cursor-pointer"
                          onClick={countryToggleState.toggle}
                        >
                          {regions && (
                            <CountrySelect
                              toggleState={countryToggleState}
                              regions={regions}
                            />
                          )}
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150",
                              countryToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      </div>
                      <Text className="text-xs text-stone-400 mt-4 text-center">
                        © {new Date().getFullYear()} LineVibes
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
