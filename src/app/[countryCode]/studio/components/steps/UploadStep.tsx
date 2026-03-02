"use client"

import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Image as ImageIcon, X, CheckCircle } from "lucide-react"
import { useStudio } from "../StudioProvider"
import { Button } from "../shared/Button"
import { ErrorMessage } from "../shared/ErrorMessage"
import { VALIDATION_RULES } from "@/types/studio"

export default function UploadStep() {
  const { state, dispatch } = useStudio()
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null)

      if (acceptedFiles.length === 0) {
        setError("Please select a valid image file")
        return
      }

      const file = acceptedFiles[0]

      // Validate file size
      const maxSizeBytes = VALIDATION_RULES.uploadedImage.maxSizeMB * 1024 * 1024
      if (file.size > maxSizeBytes) {
        setError(
          `File too large. Maximum size is ${VALIDATION_RULES.uploadedImage.maxSizeMB}MB`
        )
        return
      }

      // Validate file type
      if (!VALIDATION_RULES.uploadedImage.acceptedFormats.includes(file.type)) {
        setError("Invalid file type. Please upload JPG, PNG, or WebP")
        return
      }

      try {
        setIsUploading(true)

        // Create FormData for file upload
        const uploadFormData = new FormData()
        uploadFormData.append("file", file)

        // Upload to R2 via our API
        const response = await fetch("/api/studio/upload", {
          method: "POST",
          body: uploadFormData,
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Upload failed")
        }

        // Use the uploaded URL from R2
        dispatch({
          type: "SET_UPLOADED_IMAGE",
          payload: {
            url: data.url,
            file: file,
          },
        })

        dispatch({
          type: "MARK_STEP_COMPLETED",
          payload: { step: 1 },
        })
      } catch (err) {
        setError("Failed to upload image. Please try again.")
        console.error("Upload error:", err)
      } finally {
        setIsUploading(false)
      }
    },
    [dispatch]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    disabled: isUploading,
  })

  const handleRemoveImage = () => {
    if (state.uploadedImageUrl) {
      URL.revokeObjectURL(state.uploadedImageUrl)
    }
    dispatch({
      type: "SET_UPLOADED_IMAGE",
      payload: {
        url: null,
        file: null,
      },
    })
    setError(null)
  }

  const handleContinue = () => {
    dispatch({ type: "SET_STEP", payload: { step: 2 } })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Upload Your Photo
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a clear photo that you want to transform into blueprint art
          </p>
        </div>

        {/* Upload or Preview */}
        <AnimatePresence mode="wait">
          {!state.uploadedImageUrl ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`
                  relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                  transition-all duration-200
                  ${
                    isDragActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
                  }
                  ${isUploading ? "pointer-events-none opacity-50" : ""}
                `}
              >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center gap-4">
                  <div
                    className={`
                    p-4 rounded-full transition-colors
                    ${
                      isDragActive
                        ? "bg-blue-100 dark:bg-blue-900/40"
                        : "bg-gray-100 dark:bg-gray-700"
                    }
                  `}
                  >
                    <Upload
                      className={`h-12 w-12 ${
                        isDragActive
                          ? "text-blue-600"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    />
                  </div>

                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {isDragActive
                        ? "Drop your image here"
                        : "Drag & drop your image here"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      or click to browse
                    </p>
                  </div>

                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    Supports: JPG, PNG, WebP • Max size:{" "}
                    {VALIDATION_RULES.uploadedImage.maxSizeMB}MB
                  </div>
                </div>

                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-xl">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Uploading...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  💡 Tips for best results:
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Use high-contrast photos with clear subjects</li>
                  <li>• Avoid overly busy backgrounds</li>
                  <li>• Portraits, objects, and architectural photos work great</li>
                  <li>• Square or landscape orientation recommended</li>
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Image Preview */}
              <div className="relative">
                <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={state.uploadedImageUrl}
                    alt="Uploaded preview"
                    className="w-full h-auto max-h-[500px] object-contain"
                  />

                  {/* Remove button */}
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                  >
                    <X className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-red-600" />
                  </button>

                  {/* Success indicator */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-full shadow-lg">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Upload successful</span>
                  </div>
                </div>

                {/* File info */}
                {state.uploadedImageFile && (
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span>{state.uploadedImageFile.name}</span>
                    </div>
                    <span>
                      {(state.uploadedImageFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                )}

                {/* Continue button */}
                <div className="mt-6">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleContinue}
                    className="w-full"
                  >
                    Continue to Customize →
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <div className="mt-6">
            <ErrorMessage
              message={error}
              type="error"
              onDismiss={() => setError(null)}
            />
          </div>
        )}
      </motion.div>
    </div>
  )
}
