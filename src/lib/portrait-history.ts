/**
 * Portrait History – localStorage Manager
 *
 * Stores recent portrait sessions in the browser so users can
 * find their way back to a generated portrait even after leaving the page.
 *
 * Data is stored as a JSON array under the key "linevibes_portrait_history".
 * Maximum 10 entries are kept, oldest dropped first.
 */

const STORAGE_KEY = "linevibes_portrait_history"
const MAX_ENTRIES = 10

export type PortraitHistoryEntry = {
  sessionId: string
  portraitUrl: string
  originalUrl?: string
  croppedUrl?: string
  style: string
  createdAt: string // ISO string
}

/**
 * Save a session to portrait history (de-duped by sessionId).
 */
export function saveToHistory(entry: PortraitHistoryEntry): void {
  if (typeof window === "undefined") return

  try {
    const history = getHistory()

    // Remove duplicate if exists
    const filtered = history.filter((h) => h.sessionId !== entry.sessionId)

    // Add new entry at the beginning
    filtered.unshift(entry)

    // Trim to max entries
    const trimmed = filtered.slice(0, MAX_ENTRIES)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // localStorage might be full or disabled
    console.warn("[Portrait History] Failed to save to localStorage")
  }
}

/**
 * Get all saved portrait sessions, newest first.
 */
export function getHistory(): PortraitHistoryEntry[] {
  if (typeof window === "undefined") return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Remove a specific session from history.
 */
export function removeFromHistory(sessionId: string): void {
  if (typeof window === "undefined") return

  try {
    const history = getHistory()
    const filtered = history.filter((h) => h.sessionId !== sessionId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch {
    // noop
  }
}

/**
 * Clear all portrait history.
 */
export function clearHistory(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // noop
  }
}
