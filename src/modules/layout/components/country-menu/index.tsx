"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import ReactCountryFlag from "react-country-flag"
import { HttpTypes } from "@medusajs/types"
import { updateRegion } from "@lib/data/cart"
import { ChevronDown } from "@medusajs/icons"
import { clx } from "@medusajs/ui"

type CountryOption = {
  country: string
  region: string
  label: string
}

type CountryMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
}

export default function CountryMenu({ regions }: CountryMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [current, setCurrent] = useState<CountryOption | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  
  const { countryCode } = useParams()
  const currentPath = usePathname().split(`/${countryCode}`)[1]

  // Build options from regions
  const options: CountryOption[] = regions
    ?.flatMap((r) =>
      r.countries?.map((c) => ({
        country: c.iso_2 || "",
        region: r.id,
        label: c.display_name || "",
      })) || []
    )
    .sort((a, b) => a.label.localeCompare(b.label)) || []

  // Set current country on mount
  useEffect(() => {
    if (countryCode) {
      const option = options.find((o) => o.country === countryCode)
      if (option) {
        setCurrent(option)
      }
    }
  }, [countryCode, options])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (option: CountryOption) => {
    updateRegion(option.country, currentPath)
    setIsOpen(false)
  }

  if (!regions || regions.length === 0) return null

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-x-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
      >
        {current && (
          <>
            {/* @ts-ignore */}
            <ReactCountryFlag
              svg
              style={{ width: "16px", height: "12px" }}
              countryCode={current.country.toUpperCase()}
            />
            <span className="hidden xl:inline">{current.label}</span>
          </>
        )}
        <ChevronDown
          className={clx(
            "w-3.5 h-3.5 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-stone-100 py-2 min-w-[180px] z-50">
          <p className="px-4 py-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Shipping to
          </p>
          <div className="max-h-[300px] overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.country}
                onClick={() => handleSelect(option)}
                className={clx(
                  "w-full flex items-center gap-x-3 px-4 py-2 text-sm text-left hover:bg-stone-50 transition-colors",
                  current?.country === option.country
                    ? "text-amber-700 bg-amber-50"
                    : "text-stone-700"
                )}
              >
                {/* @ts-ignore */}
                <ReactCountryFlag
                  svg
                  style={{ width: "16px", height: "12px" }}
                  countryCode={option.country.toUpperCase()}
                />
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
