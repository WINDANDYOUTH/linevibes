"use client"

import { useEffect, useMemo, useState } from "react"
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

type DesktopCountrySelectProps = {
  regions: HttpTypes.StoreRegion[]
}

export default function DesktopCountrySelect({ regions }: DesktopCountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [current, setCurrent] = useState<CountryOption | undefined>(undefined)
  
  const { countryCode } = useParams()
  const currentPath = usePathname().split(`/${countryCode}`)[1]

  // Build options from regions
  const options = useMemo(() => {
    return regions
      ?.map((r) => {
        return r.countries?.map((c) => ({
          country: c.iso_2,
          region: r.id,
          label: c.display_name,
        }))
      })
      .flat()
      .filter((o): o is CountryOption => o !== undefined)
      .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))
  }, [regions])

  // Set current country on mount and when countryCode changes
  useEffect(() => {
    if (countryCode) {
      const option = options?.find((o) => o?.country === countryCode)
      setCurrent(option)
    }
  }, [options, countryCode])

  const handleSelect = (option: CountryOption) => {
    updateRegion(option.country, currentPath)
    setIsOpen(false)
  }

  if (!regions || regions.length === 0) return null

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-x-2 text-sm text-stone-600 hover:text-stone-900 transition-colors py-4"
      >
        {current && (
          <>
            {/* @ts-ignore */}
            <ReactCountryFlag
              svg
              style={{ width: "16px", height: "12px" }}
              countryCode={current.country?.toUpperCase() ?? ""}
            />
            <span className="hidden xl:inline text-xs">{current.label}</span>
          </>
        )}
        <ChevronDown
          className={clx(
            "w-3 h-3 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown - hover triggered */}
      {isOpen && (
        <div className="absolute top-full right-0 pt-1 z-50">
          <div className="bg-white rounded-lg shadow-xl border border-stone-100 py-2 min-w-[160px]">
            <p className="px-3 py-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Ship to
            </p>
            <div className="max-h-[280px] overflow-y-auto">
              {options?.map((option) => (
                <button
                  key={option.country}
                  onClick={() => handleSelect(option)}
                  className={clx(
                    "w-full flex items-center gap-x-2 px-3 py-2 text-sm text-left hover:bg-stone-50 transition-colors",
                    current?.country === option.country
                      ? "text-amber-700 bg-amber-50"
                      : "text-stone-700"
                  )}
                >
                  {/* @ts-ignore */}
                  <ReactCountryFlag
                    svg
                    style={{ width: "16px", height: "12px" }}
                    countryCode={option.country?.toUpperCase() ?? ""}
                  />
                  <span className="text-xs">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
