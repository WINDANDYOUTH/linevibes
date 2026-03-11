"use client"

import { useAnalytics } from "@lib/analytics/provider"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Table, Text, clx } from "@medusajs/ui"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"
import { getPortraitLineItemMetadata } from "@lib/util/portrait-line-item-metadata"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const { trackAddToCart, trackRemoveFromCart } = useAnalytics()
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Portrait item detection
  const metadata = (item as any).metadata as Record<string, unknown> | undefined
  const portraitMeta = getPortraitLineItemMetadata(metadata)

  // Use portrait image as thumbnail if available, otherwise fall back to product thumbnail
  const effectiveThumbnail = portraitMeta.portraitImageUrl || item.thumbnail

  // Link to portrait result page for portrait items, product page for regular items
  const itemHref =
    portraitMeta.isPortraitItem && portraitMeta.portraitSessionId
      ? `/portrait/result?sid=${portraitMeta.portraitSessionId}`
      : `/products/${item.product_handle}`

  const getAnalyticsItemBase = () => ({
    id: item.variant_id || item.variant?.id || item.id,
    name: item.product_title || item.title || "Unknown Product",
    price: item.unit_price || 0,
    currency: (currencyCode || "USD").toUpperCase(),
  })

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    const previousQuantity = item.quantity || 1

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .then(() => {
        if (quantity > previousQuantity) {
          trackAddToCart({
            ...getAnalyticsItemBase(),
            quantity: quantity - previousQuantity,
          })
        }

        if (quantity < previousQuantity) {
          trackRemoveFromCart({
            ...getAnalyticsItemBase(),
            quantity: previousQuantity - quantity,
          })
        }
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  const handleDeleteTracked = () => {
    trackRemoveFromCart({
      ...getAnalyticsItemBase(),
      quantity: item.quantity || 1,
    })
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="!pl-0 p-4 w-24">
        <LocalizedClientLink
          href={itemHref}
          className={clx("flex", {
            "w-16": type === "preview",
            "small:w-24 w-12": type === "full",
          })}
        >
          <Thumbnail
            thumbnail={effectiveThumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-title"
        >
          {item.product_title}
        </Text>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
      </Table.Cell>

      {type === "full" && (
        <Table.Cell>
          <div className="flex gap-2 items-center w-28">
            <DeleteButton
              id={item.id}
              onDeleted={handleDeleteTracked}
              data-testid="product-delete-button"
            />
            <CartItemSelect
              value={item.quantity}
              onChange={(value) => changeQuantity(parseInt(value.target.value))}
              className="w-14 h-10 p-4"
              data-testid="product-select-button"
            >
              {Array.from(
                {
                  length: Math.min(maxQuantity, 10),
                },
                (_, i) => (
                  <option value={i + 1} key={i}>
                    {i + 1}
                  </option>
                )
              )}

              <option value={1} key={1}>
                1
              </option>
            </CartItemSelect>
            {updating && <Spinner />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
