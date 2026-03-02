import React from "react"
import { Metadata } from "next"
import { StudioProvider } from "./components/StudioProvider"
import { StepperNav } from "./components/StepperNav"
import { ErrorBoundary } from "./components/shared/ErrorBoundary"
import StudioContent from "./StudioContent"

export const metadata: Metadata = {
  title: "Create Custom Blueprint Art | LineVibes Studio",
  description:
    "Transform your photos into stunning machine-drawn blueprint art. Upload, customize, and order premium prints with AI-powered line art generation.",
  openGraph: {
    title: "LineVibes Studio - Custom Blueprint Creator",
    description:
      "Create unique blueprint-style art from your photos with AI. Customize colors, add legends, and order beautiful prints.",
    type: "website",
  },
}

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ErrorBoundary>
        <StudioProvider>
          {/* Header */}
          <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    LineVibes Studio
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Transform photos into blueprint art
                  </p>
                </div>

                <a
                  href="/"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  ← Back to Home
                </a>
              </div>
            </div>
          </header>

          {/* Stepper Navigation */}
          <StepperNav />

          {/* Main Content */}
          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <StudioContent />
          </main>

          {/* Footer */}
          <footer className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  © 2026 LineVibes. All rights reserved.
                </p>

                <div className="flex items-center gap-6 text-sm">
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    How it works
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Examples
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Support
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </StudioProvider>
      </ErrorBoundary>
    </div>
  )
}
