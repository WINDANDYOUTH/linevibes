import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

type FilterValues = Record<string, string[]>

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  filters = {},
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  filters?: FilterValues
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const activeFilterCount = Object.values(filters).reduce(
    (count, values) => count + (values?.length || 0),
    0
  )

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} />

      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900" data-testid="store-page-title">
            Shop LineVibes
          </h1>
          <p className="text-stone-500 mt-1">
            Design-led pieces with clean aesthetics and lasting quality
            {activeFilterCount > 0 && (
              <span className="text-amber-700 ml-2">
                {`(${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} applied)`}
              </span>
            )}
          </p>
        </div>

        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            filters={filters}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
