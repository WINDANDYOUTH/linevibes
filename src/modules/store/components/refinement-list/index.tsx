"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"

import SortProducts, { SortOptions } from "./sort-products"
import ProductFilters from "../product-filters"
import MobileFilters from "../mobile-filters"
import {
  FILTER_GROUPS,
  FilterState,
  parseFilterParams,
} from "@lib/config/filters"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  "data-testid"?: string
}

const RefinementList = ({
  sortBy,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Parse current filters from URL
  const filters = useMemo(
    () => parseFilterParams(searchParams),
    [searchParams]
  )

  // Calculate active filter count
  const activeFilterCount = useMemo(
    () =>
      Object.values(filters).reduce(
        (count, values) => count + (values?.length || 0),
        0
      ),
    [filters]
  )

  // Update URL with new filters
  const updateFilters = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams(searchParams)

      // Remove all filter params first
      FILTER_GROUPS.forEach((group) => {
        params.delete(group.id)
      })

      // Add new filter values
      Object.entries(newFilters).forEach(([key, values]) => {
        if (values && values.length > 0) {
          params.set(key, values.join(","))
        }
      })

      // Reset to page 1 when filters change
      params.delete("page")

      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams)

    // Remove all filter params
    FILTER_GROUPS.forEach((group) => {
      params.delete(group.id)
    })

    // Reset to page 1
    params.delete("page")

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  // Handle sort change
  const setQueryParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  return (
    <>
      {/* Desktop Sidebar Filters */}
      <div className="hidden small:block small:min-w-[280px] small:max-w-[280px] small:pr-8 sticky top-24">
        <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-5">
          {/* Sort Options */}
          <div className="mb-6 pb-4 border-b border-stone-100">
            <SortProducts
              sortBy={sortBy}
              setQueryParams={setQueryParams}
              data-testid={dataTestId}
            />
          </div>

          {/* Product Filters */}
          <ProductFilters
            groups={FILTER_GROUPS}
            filters={filters}
            onFilterChange={updateFilters}
            onClearAll={clearAllFilters}
          />
        </div>
      </div>

      {/* Mobile Filter Bar */}
      <div className="small:hidden flex items-center justify-between gap-4 mb-6 px-4">
        <MobileFilters
          groups={FILTER_GROUPS}
          filters={filters}
          onFilterChange={updateFilters}
          onClearAll={clearAllFilters}
          activeCount={activeFilterCount}
        />

        {/* Mobile Sort (simplified) */}
        <select
          value={sortBy}
          onChange={(e) => setQueryParams("sortBy", e.target.value)}
          className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 appearance-none cursor-pointer"
        >
          <option value="created_at">Latest Arrivals</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>
      </div>
    </>
  )
}

export default RefinementList
