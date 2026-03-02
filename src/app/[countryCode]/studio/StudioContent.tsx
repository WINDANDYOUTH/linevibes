"use client"

import React from "react"
import { useStudio } from "./components/StudioProvider"
import { motion, AnimatePresence } from "framer-motion"

// Import step components
import UploadStep from "./components/steps/UploadStep"
import CustomizeStep from "./components/steps/CustomizeStep"
import GeneratingStep from "./components/steps/GeneratingStep"
import PreviewStep from "./components/steps/PreviewStep"

export default function StudioContent() {
  const { state } = useStudio()

  return (
    <div className="relative min-h-[600px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {state.currentStep === 1 && <UploadStep />}
          {state.currentStep === 2 && <CustomizeStep />}
          {state.currentStep === 3 && <GeneratingStep />}
          {state.currentStep === 4 && <PreviewStep />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
