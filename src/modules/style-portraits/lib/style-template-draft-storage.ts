const DB_NAME = "linevibes-style-template-drafts"
const STORE_NAME = "style-template-drafts"
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000

export type StoredStyleTemplateDraft = {
  activeOutput: "digital" | "print" | "canvas"
  croppedImageUrl: string | null
  croppedUploadUrl: string | null
  generatedPortraitUrl: string | null
  sessionId: string | null
  sourceImageUrl: string | null
  sourceUploadUrl: string | null
  templateHandle: string
  templateId: string
  updatedAt: string
}

let dbPromise: Promise<IDBDatabase | null> | null = null

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

export async function readStyleTemplateDraft(templateHandle: string) {
  const database = await openDraftDatabase()

  if (!database) {
    return null
  }

  return new Promise<StoredStyleTemplateDraft | null>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(templateHandle)

    request.onsuccess = () => {
      const draft =
        (request.result as StoredStyleTemplateDraft | undefined) ?? null

      if (!draft) {
        resolve(null)
        return
      }

      const updatedAt = new Date(draft.updatedAt).getTime()

      if (
        !Number.isFinite(updatedAt) ||
        Date.now() - updatedAt > DRAFT_TTL_MS
      ) {
        void clearStyleTemplateDraft(templateHandle).finally(() => resolve(null))
        return
      }

      resolve(draft)
    }

    request.onerror = () => reject(request.error)
  })
}

export async function saveStyleTemplateDraft(draft: StoredStyleTemplateDraft) {
  const database = await openDraftDatabase()

  if (!database) {
    return
  }

  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(draft, draft.templateHandle)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function clearStyleTemplateDraft(templateHandle: string) {
  const database = await openDraftDatabase()

  if (!database) {
    return
  }

  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(templateHandle)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
