import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import GoogleTagManager, { GoogleTagManagerNoScript } from "@modules/common/components/google-tag-manager"
import { AnalyticsProvider } from "@lib/analytics/provider"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "Personalized Plotter Art | LineVibes",
  description: "Discover LineVibes and explore custom machine-drawn artwork and personalized blueprints.",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <head>
        <GoogleTagManager />
      </head>
      <body>
        <GoogleTagManagerNoScript />
        <AnalyticsProvider>
          <main className="relative">{props.children}</main>
        </AnalyticsProvider>
      </body>
    </html>
  )
}
