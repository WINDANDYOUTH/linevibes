import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Shop Knitwear | BetterKnitwear",
  description: "Explore our collection of premium wool sweaters and knitwear. Filter by style, material, warmth level and more.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    // Filter params
    style?: string
    warmth?: string
    material?: string
    gauge?: string
    season?: string
    color?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page, ...filterParams } = searchParams

  // Parse filter values from comma-separated strings
  const filters: Record<string, string[]> = {}
  Object.entries(filterParams).forEach(([key, value]) => {
    if (value) {
      filters[key] = value.split(",").filter(Boolean)
    }
  })

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      filters={filters}
    />
  )
}
