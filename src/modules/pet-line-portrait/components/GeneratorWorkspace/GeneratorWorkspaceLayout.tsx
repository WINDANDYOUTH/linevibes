import type { ReactNode } from "react"

export default function GeneratorWorkspaceLayout({
  hasStartedEditing,
  preview,
  configurator,
  purchaseBar,
}: {
  hasStartedEditing: boolean
  preview: ReactNode
  configurator: ReactNode
  purchaseBar: ReactNode
}) {
  return (
    <div
      className={`mt-6 grid gap-4 xl:mt-12 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] xl:gap-6 ${
        hasStartedEditing ? "xl:pt-0" : ""
      }`}
    >
      <div
        className={`min-w-0 self-start z-30 ${
          hasStartedEditing ? "xl:sticky xl:inset-x-auto" : "xl:sticky"
        }`}
        style={{
          top: "calc(var(--pet-portrait-header-height, 76px) + var(--pet-portrait-preview-gap, 12px))",
        }}
      >
        {preview}
      </div>
      <div className="min-w-0">
        <div className="relative z-40 rounded-[28px] border border-stone-200 bg-white p-3 shadow-[0_18px_40px_rgba(28,25,23,0.08)] xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none">
          {configurator}
        </div>
        <div className="hidden xl:block xl:pt-6">{purchaseBar}</div>
      </div>
    </div>
  )
}
