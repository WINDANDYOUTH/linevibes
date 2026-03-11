import type { PresentationConfig } from "../types/generator"

const DB_NAME = "linevibes-pet-line-portrait"
const STORE_NAME = "generator-drafts"
const DRAFT_KEY = "workspace-v1"
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000

export type StoredGeneratorDraft = {
  activePortraitSessionId: string | null
  croppedImageUrl: string | null
  selectedStyleId: string | null
  sourceImageUrl: string | null
  presentation: PresentationConfig
  updatedAt: string
}

let dbPromise: Promise<IDBDatabase> | null = null

function openDraftDatabase() {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return Promise.resolve(null)
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, 1)

      request.onupgradeneeded = () => {
        const database = request.result

        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME)
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  return dbPromise
}

export async function readGeneratorDraft() {
  const database = await openDraftDatabase()

  if (!database) {
    return null
  }

  return new Promise<StoredGeneratorDraft | null>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(DRAFT_KEY)

    request.onsuccess = () => {
      const draft = (request.result as StoredGeneratorDraft | undefined) ?? null

      if (!draft) {
        resolve(null)
        return
      }

      const updatedAt = new Date(draft.updatedAt).getTime()

      if (
        !Number.isFinite(updatedAt) ||
        Date.now() - updatedAt > DRAFT_TTL_MS
      ) {
        void clearGeneratorDraft().finally(() => resolve(null))
        return
      }

      resolve(draft)
    }

    request.onerror = () => reject(request.error)
  })
}

export async function saveGeneratorDraft(draft: StoredGeneratorDraft) {
  const database = await openDraftDatabase()

  if (!database) {
    return
  }

  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(draft, DRAFT_KEY)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function clearGeneratorDraft() {
  const database = await openDraftDatabase()

  if (!database) {
    return
  }

  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(DRAFT_KEY)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
