"use client"

import { useState } from "react"
import { Funnel, XMark } from "@medusajs/icons"
import { clx, Text } from "@medusajs/ui"
import { FilterGroup, FilterState } from "@lib/config/filters"
import ProductFilters from "../product-filters"

type MobileFiltersProps = {
  groups: FilterGroup[]
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onClearAll: () => void
  activeCount: number
}

const MobileFilters = ({
  groups,
  filters,
  onFilterChange,
  onClearAll,
  activeCount,
}: MobileFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Filter Toggle Button for Mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-stone-700 hover:border-amber-500 hover:text-amber-700 transition-colors"
      >
        <Funnel className="w-4 h-4" />
        <span className="text-sm font-medium">Filters</span>
        {activeCount > 0 && (
          <span className="bg-amber-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {activeCount}
          </span>
        )}
      </button>

      {/* Mobile Filter Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 shadow-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Funnel className="w-5 h-5 text-amber-600" />
                <Text className="txt-medium-plus font-semibold text-stone-900">
                  Filter Products
                </Text>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <XMark className="w-5 h-5 text-stone-600" />
              </button>
            </div>

            {/* Scrollable Filter Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <ProductFilters
                groups={groups}
                filters={filters}
                onFilterChange={onFilterChange}
                onClearAll={onClearAll}
              />
            </div>

            {/* Footer with Apply Button */}
            <div className="px-4 py-4 border-t border-stone-100 bg-stone-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
              >
                View Results
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default MobileFilters
