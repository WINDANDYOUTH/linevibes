// Filter configuration for BetterKnitwear
// These filters are designed to be user-friendly and avoid overwhelming complexity

export type FilterOption = {
  value: string
  label: string
  count?: number // Optional: show how many products match
}

export type FilterGroup = {
  id: string
  title: string
  type: "single" | "multiple" // single = radio, multiple = checkbox
  options: FilterOption[]
  collapsed?: boolean // Whether to show collapsed by default
}

// Tag-based filters - these map to product tags in Medusa
export const FILTER_GROUPS: FilterGroup[] = [
  {
    id: "style",
    title: "Style",
    type: "multiple",
    options: [
      { value: "crewneck", label: "Crewneck" },
      { value: "v-neck", label: "V-Neck" },
      { value: "half-zip", label: "Half Zip" },
      { value: "full-zip", label: "Full Zip" },
      { value: "cardigan", label: "Cardigan" },
      { value: "polo-knit", label: "Polo Knit" },
    ],
  },
  {
    id: "warmth",
    title: "Warmth Level",
    type: "multiple",
    options: [
      { value: "light", label: "Light" },
      { value: "medium", label: "Medium" },
      { value: "warm", label: "Warm" },
      { value: "extra-warm", label: "Extra Warm" },
    ],
  },
  {
    id: "material",
    title: "Material",
    type: "multiple",
    options: [
      { value: "merino-wool", label: "Merino Wool" },
      { value: "lambswool", label: "Lambswool" },
      { value: "wool-blend", label: "Wool Blend" },
      { value: "cotton-blend", label: "Cotton Blend" },
      { value: "cashmere-blend", label: "Cashmere Blend" },
    ],
  },
  {
    id: "gauge",
    title: "Gauge / Weight",
    type: "multiple",
    collapsed: true, // Less commonly used, collapse by default
    options: [
      { value: "fine-gauge", label: "Fine Gauge" },
      { value: "mid-gauge", label: "Mid Gauge" },
      { value: "chunky", label: "Chunky" },
    ],
  },
  {
    id: "season",
    title: "Season",
    type: "multiple",
    collapsed: true,
    options: [
      { value: "fall", label: "Fall" },
      { value: "winter", label: "Winter" },
      { value: "transitional", label: "Transitional" },
    ],
  },
  {
    id: "color",
    title: "Color",
    type: "multiple",
    options: [
      { value: "navy", label: "Navy" },
      { value: "charcoal", label: "Charcoal" },
      { value: "burgundy", label: "Burgundy" },
      { value: "forest-green", label: "Forest Green" },
      { value: "cream", label: "Cream" },
      { value: "camel", label: "Camel" },
      { value: "grey", label: "Grey" },
      { value: "black", label: "Black" },
    ],
  },
]

// Helper to get a filter group by ID
export const getFilterGroup = (id: string): FilterGroup | undefined => {
  return FILTER_GROUPS.find((group) => group.id === id)
}

// Helper to get all filter IDs
export const getAllFilterIds = (): string[] => {
  return FILTER_GROUPS.map((group) => group.id)
}

// Parse filter query params from URL
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

// Serialize filter state to query string
export const serializeFilters = (filters: FilterState): string => {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, values]) => {
    if (values && values.length > 0) {
      params.set(key, values.join(","))
    }
  })
  
  return params.toString()
}

// Check if any filters are active
export const hasActiveFilters = (filters: FilterState): boolean => {
  return Object.values(filters).some((values) => values && values.length > 0)
}

// Get count of active filters
export const getActiveFilterCount = (filters: FilterState): number => {
  return Object.values(filters).reduce((count, values) => count + (values?.length || 0), 0)
}
