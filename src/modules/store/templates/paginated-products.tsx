import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"

const PRODUCT_LIMIT = 12

type FilterValues = Record<string, string[]>

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  tag_id?: string[]
}

// Helper function to filter products by tags on the client side
// Since Medusa API may not support direct tag filtering, we filter after fetching
function filterProductsByTags(
  products: HttpTypes.StoreProduct[],
  filters: FilterValues
): HttpTypes.StoreProduct[] {
  // If no filters, return all products
  if (Object.keys(filters).length === 0) {
    return products
  }

  return products.filter((product) => {
    // Get product tags as lowercase strings
    const productTags = (product.tags || []).map((tag) => 
      tag.value?.toLowerCase().replace(/\s+/g, "-")
    )

    // Check each filter group
    for (const [filterGroup, filterValues] of Object.entries(filters)) {
      if (!filterValues || filterValues.length === 0) continue

      // Check if product has at least one matching tag for this filter group
      const hasMatch = filterValues.some((filterValue) =>
        productTags.includes(filterValue.toLowerCase())
      )

      if (!hasMatch) {
        return false
      }
    }

    return true
  })
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  filters = {},
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  filters?: FilterValues
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 100, // Fetch more to allow client-side filtering
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page: 1, // Get all products first for filtering
    queryParams,
    sortBy,
    countryCode,
  })

  // Apply tag-based filters
  const hasFilters = Object.values(filters).some(
    (values) => values && values.length > 0
  )

  if (hasFilters) {
    products = filterProductsByTags(products, filters)
    count = products.length
  }

  // Manual pagination after filtering
  const totalPages = Math.ceil(count / PRODUCT_LIMIT)
  const offset = (page - 1) * PRODUCT_LIMIT
  const paginatedProducts = products.slice(offset, offset + PRODUCT_LIMIT)

  // No products found
  if (paginatedProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-stone-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-stone-900 mb-2">
          No products found
        </h3>
        <p className="text-stone-500 mb-6">
          Try adjusting your filters to find what you&apos;re looking for.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Results count */}
      <div className="mb-4 text-sm text-stone-500">
        Showing {offset + 1}-{Math.min(offset + PRODUCT_LIMIT, count)} of {count} products
      </div>

      {/* Product Grid */}
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {paginatedProducts.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          )
        })}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
