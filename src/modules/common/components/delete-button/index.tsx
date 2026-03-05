"use client"

import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState } from "react"

type DeleteButtonProps = {
  id: string
  children?: React.ReactNode
  className?: string
  onDeleted?: () => void
  "data-testid"?: string
}

const DeleteButton = ({
  id,
  children,
  className,
  onDeleted,
  "data-testid": dataTestId,
}: DeleteButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (lineId: string) => {
    setIsDeleting(true)

    await deleteLineItem(lineId)
      .then(() => {
        onDeleted?.()
      })
      .catch(() => {
        setIsDeleting(false)
      })
  }

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
        onClick={() => handleDelete(id)}
        data-testid={dataTestId}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
      </button>
    </div>
  )
}

export default DeleteButton