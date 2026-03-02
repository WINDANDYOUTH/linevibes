"use client"

import { useState } from "react"
import { ChevronDown, XMark } from "@medusajs/icons"
import { clx, Text, Checkbox, Label } from "@medusajs/ui"
import { FilterGroup, FilterState } from "@lib/config/filters"

type FilterCheckboxGroupProps = {
  group: FilterGroup
  selectedValues: string[]
  onToggle: (groupId: string, value: string) => void
}

const FilterCheckboxGroup = ({
  group,
  selectedValues,
  onToggle,
}: FilterCheckboxGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(!group.collapsed)

  const selectedCount = selectedValues.length

  return (
    <div className="border-b border-stone-100 last:border-b-0">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-3 text-left group"
      >
        <div className="flex items-center gap-2">
          <Text className="txt-compact-small-plus text-stone-900 group-hover:text-amber-700 transition-colors">
            {group.title}
          </Text>
          {selectedCount > 0 && (
            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {selectedCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={clx(
            "w-4 h-4 text-stone-400 transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {/* Options */}
      {isExpanded && (
        <div className="pb-4 space-y-2">
          {group.options.map((option) => {
            const isChecked = selectedValues.includes(option.value)
            const inputId = `${group.id}-${option.value}`

            return (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={inputId}
                  checked={isChecked}
                  onCheckedChange={() => onToggle(group.id, option.value)}
                  className="border-stone-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                />
                <Label
                  htmlFor={inputId}
                  className={clx(
                    "txt-compact-small cursor-pointer transition-colors",
                    isChecked ? "text-stone-900 font-medium" : "text-stone-600 hover:text-stone-900"
                  )}
                >
                  {option.label}
                  {option.count !== undefined && (
                    <span className="text-stone-400 ml-1">({option.count})</span>
                  )}
                </Label>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

type ProductFiltersProps = {
  groups: FilterGroup[]
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onClearAll: () => void
  className?: string
}

const ProductFilters = ({
  groups,
  filters,
  onFilterChange,
  onClearAll,
  className,
}: ProductFiltersProps) => {
  const handleToggle = (groupId: string, value: string) => {
    const currentValues = filters[groupId] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]

    onFilterChange({
      ...filters,
      [groupId]: newValues,
    })
  }

  const activeFilterCount = Object.values(filters).reduce(
    (count, values) => count + (values?.length || 0),
    0
  )

  return (
    <div className={className}>
      {/* Header with Clear All */}
      <div className="flex items-center justify-between mb-4">
        <Text className="txt-medium-plus text-stone-900 font-semibold">Filters</Text>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-amber-700 transition-colors"
          >
            <XMark className="w-3 h-3" />
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Filter Groups */}
      <div className="divide-y divide-stone-100">
        {groups.map((group) => (
          <FilterCheckboxGroup
            key={group.id}
            group={group}
            selectedValues={filters[group.id] || []}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductFilters
