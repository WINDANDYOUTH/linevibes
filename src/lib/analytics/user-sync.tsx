"use client"

import { useEffect } from "react"
import { useAnalytics } from "./provider"

export function UserAnalyticsSync({ userId }: { userId: string | null }) {
  const { setUserId } = useAnalytics()

  useEffect(() => {
    if (userId) {
      setUserId(userId)
    }
  }, [userId, setUserId])

  return null
}
