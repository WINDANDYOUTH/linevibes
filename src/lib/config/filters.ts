// Filter configuration for the LineVibes storefront
// These filters are designed to stay broad and easy to scan

export type FilterOption = {
  value: string
  label: string
  count?: number
}

export type FilterGroup = {
  id: string
  title: string
  type: "single" | "multiple"
  options: FilterOption[]
  collapsed?: boolean
}

export const FILTER_GROUPS: FilterGroup[] = [
  {
    id: "category",
    title: "Category",
    type: "multiple",
    options: [
      { value: "line-art", label: "Line Art" },
      { value: "portraits", label: "Portraits" },
      { value: "blueprints", label: "Blueprints" },
      { value: "wall-decor", label: "Wall Decor" },
      { value: "giftable", label: "Giftable" },
    ],
  },
  {
    id: "format",
    title: "Format",
    type: "multiple",
    options: [
      { value: "digital", label: "Digital" },
      { value: "print", label: "Print" },
      { value: "framed", label: "Framed" },
      { value: "canvas", label: "Canvas" },
    ],
  },
  {
    id: "room",
    title: "Room",
    type: "multiple",
    options: [
      { value: "living-room", label: "Living Room" },
      { value: "bedroom", label: "Bedroom" },
      { value: "office", label: "Office" },
      { value: "studio", label: "Studio" },
    ],
  },
  {
    id: "orientation",
    title: "Orientation",
    type: "multiple",
    collapsed: true,
    options: [
      { value: "portrait", label: "Portrait" },
      { value: "landscape", label: "Landscape" },
      { value: "square", label: "Square" },
    ],
  },
  {
    id: "collection",
    title: "Collection",
    type: "multiple",
    collapsed: true,
    options: [
      { value: "signature", label: "Signature" },
      { value: "minimal", label: "Minimal" },
      { value: "architectural", label: "Architectural" },
      { value: "occasion", label: "Occasion" },
    ],
  },
  {
    id: "color",
    title: "Color",
    type: "multiple",
    options: [
      { value: "black", label: "Black" },
      { value: "white", label: "White" },
      { value: "natural", label: "Natural" },
      { value: "oak", label: "Oak" },
      { value: "walnut", label: "Walnut" },
      { value: "blue", label: "Blue" },
      { value: "green", label: "Green" },
    ],
  },
]

export const getFilterGroup = (id: string): FilterGroup | undefined => {
  return FILTER_GROUPS.find((group) => group.id === id)
}

export const getAllFilterIds = (): string[] => {
  return FILTER_GROUPS.map((group) => group.id)
}

export type FilterState = Record<string, string[]>

export const parseFilterParams = (searchParams: URLSearchParams): FilterState => {
  const filters: FilterState = {}

  FILTER_GROUPS.forEach((group) => {
    const values = searchParams.get(group.id)
    if (values) {
      filters[group.id] = values.split(",").filter(Boolean)
    }
  })

  return filters
}

export const serializeFilters = (filters: FilterState): string => {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, values]) => {
    if (values && values.length > 0) {
      params.set(key, values.join(","))
    }
  })

  return params.toString()
}

export const hasActiveFilters = (filters: FilterState): boolean => {
  return Object.values(filters).some((values) => values && values.length > 0)
}

export const getActiveFilterCount = (filters: FilterState): number => {
  return Object.values(filters).reduce((count, values) => count + (values?.length || 0), 0)
}
