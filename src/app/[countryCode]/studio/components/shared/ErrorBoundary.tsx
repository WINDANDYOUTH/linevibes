"use client"

import React, { Component, ReactNode } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "./Button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    // Optionally reset the studio state
    if (typeof window !== "undefined") {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[500px] flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Oops! Something went wrong
              </h2>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We encountered an unexpected error. Don't worry, your progress has
                been saved.
              </p>

              {this.state.error && (
                <details className="text-left w-full mb-6">
                  <summary className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                    Error details
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto max-h-32">
                    {this.state.error.message}
                  </pre>
                </details>
              )}

              <Button
                variant="primary"
                size="lg"
                onClick={this.handleReset}
                className="w-full"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Reload Studio
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                If this problem persists, please contact support
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
