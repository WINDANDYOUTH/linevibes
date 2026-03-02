"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { XCircle, AlertCircle, Info } from "lucide-react"

interface ErrorMessageProps {
  message: string
  type?: "error" | "warning" | "info"
  onDismiss?: () => void
  className?: string
}

export function ErrorMessage({
  message,
  type = "error",
  onDismiss,
  className = "",
}: ErrorMessageProps) {
  const styles = {
    error:
      "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300",
    warning:
      "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300",
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300",
  }

  const icons = {
    error: <XCircle className="h-5 w-5 flex-shrink-0" />,
    warning: <AlertCircle className="h-5 w-5 flex-shrink-0" />,
    info: <Info className="h-5 w-5 flex-shrink-0" />,
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`flex items-start gap-3 p-4 rounded-lg border-2 ${styles[type]} ${className}`}
      >
        {icons[type]}

        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
            aria-label="Dismiss"
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// Inline error for form fields
export function FieldError({ message }: { message: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="text-sm text-red-600 dark:text-red-400 mt-1"
    >
      {message}
    </motion.p>
  )
}
