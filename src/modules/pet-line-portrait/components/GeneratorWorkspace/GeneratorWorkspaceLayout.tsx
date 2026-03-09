import type { ReactNode } from "react"

export default function GeneratorWorkspaceLayout({
  preview,
  configurator,
  purchaseBar,
}: {
  preview: ReactNode
  configurator: ReactNode
  purchaseBar: ReactNode
}) {
  return (
    <div className="mt-12 grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
      <div className="xl:sticky xl:top-28 xl:self-start">{preview}</div>
      <div className="space-y-6">
        {configurator}
        {purchaseBar}
      </div>
    </div>
  )
}
