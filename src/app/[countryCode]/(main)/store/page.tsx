import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Store | LineVibes",
  description:
    "Browse the LineVibes catalog of design-forward products and discover new arrivals with refined filters.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    category?: string
    format?: string
    room?: string
    orientation?: string
    collection?: string
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
