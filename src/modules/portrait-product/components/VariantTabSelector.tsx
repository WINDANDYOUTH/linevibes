"use client"

import React from "react"
import { VARIANT_TABS, VariantType } from "../data/portrait-data"

type VariantTabSelectorProps = {
  activeTab: VariantType
  onTabChange: (tab: VariantType) => void
}

export default function VariantTabSelector({
  activeTab,
  onTabChange,
}: VariantTabSelectorProps) {
  return (
    <div className="w-full" data-testid="variant-tab-selector">
      {/* Tab buttons */}
      <div className="flex border-b border-gray-200">
        {VARIANT_TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex-1 relative py-3.5 px-2 text-center transition-all duration-200 group
                ${isActive ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}
              `}
              data-testid={`variant-tab-${tab.id}`}
            >
              {/* Icon + Label */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg leading-none">{tab.icon}</span>
                <span className={`text-xs font-semibold tracking-wide uppercase ${isActive ? "text-gray-900" : ""}`}>
                  {tab.label}
                </span>
              </div>

              {/* Active indicator line */}
              <div
                className={`
                  absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full transition-all duration-300
                  ${isActive
                    ? "bg-linevibes-blue scale-x-100"
                    : "bg-transparent scale-x-0 group-hover:scale-x-50 group-hover:bg-gray-300"
                  }
                `}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
