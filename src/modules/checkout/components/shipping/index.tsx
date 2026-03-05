"use client"

import { Radio, RadioGroup } from "@headlessui/react"
import { useAnalytics } from "@lib/analytics/provider"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, clx, Heading, Text } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import MedusaRadio from "@modules/common/components/radio"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

function formatAddress(address: HttpTypes.StoreCartAddress) {
  if (!address) {
    return ""
  }

  let ret = ""

  if (address.address_1) {
    ret += ` ${address.address_1}`
  }

  if (address.address_2) {
    ret += `, ${address.address_2}`
  }

  if (address.postal_code) {
    ret += `, ${address.postal_code} ${address.city}`
  }

  if (address.country_code) {
    ret += `, ${address.country_code.toUpperCase()}`
  }

  return ret
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const { trackShippingInfo } = useAnalytics()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)

  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const _shippingMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type !== "pickup"
  )

  const _pickupMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type === "pickup"
  )

  const hasPickupOptions = !!_pickupMethods?.length

  useEffect(() => {
    setIsLoadingPrices(true)

    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      } else {
        setIsLoadingPrices(false)
      }
    } else {
      setIsLoadingPrices(false)
    }

    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods])

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    if (cart?.items?.length) {
      const selectedMethod = availableShippingMethods?.find(
        (method) => method.id === shippingMethodId
      )

      trackShippingInfo(
        selectedMethod?.name || cart.shipping_methods?.at(-1)?.name || "shipping",
        cart.items.map((item) => ({
          id: item.variant_id || item.variant?.id || item.id,
          name: item.product_title || item.title || "Unknown Product",
          price: item.unit_price || 0,
          quantity: item.quantity || 1,
        })),
        (cart.currency_code || "USD").toUpperCase(),
        cart.total || 0
      )
    }

    router.push(pathname + "?step=payment", { scroll: false })
  }

  const handleSetShippingMethod = async (
    id: string,
    variant: "shipping" | "pickup"
  ) => {
    setError(null)

    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }

    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId)

        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="checkout-section-wrapper">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-xl font-semibold gap-x-3 items-center text-[#3D3229]",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && cart.shipping_methods?.length === 0,
            }
          )}
        >
          <span className="checkout-section-badge flex items-center justify-center w-7 h-7 rounded-full bg-[#8B4513] text-white text-sm">
            2
          </span>
          Delivery
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
            <CheckCircleSolid className="text-green-600" />
          )}
        </Heading>
        {!isOpen &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <Text>
              <button
                onClick={handleEdit}
                className="text-[#8B4513] hover:text-[#A0522D] font-medium text-sm"
                data-testid="edit-delivery-button"
              >
                Edit
              </button>
            </Text>
          )}
      </div>
      {isOpen ? (
        <>
          <div className="grid">
            <div className="flex flex-col mb-4">
              <span className="font-medium text-[#3D3229]">
                Shipping method
              </span>
              <span className="text-sm text-[#6B5B4F]">
                How would you like your order delivered?
              </span>
            </div>
            <div data-testid="delivery-options-container">
              <div className="pb-6 md:pt-0 pt-2 space-y-3">
                {hasPickupOptions && (
                  <RadioGroup
                    value={showPickupOptions}
                    onChange={(value) => {
                      const id = _pickupMethods.find(
                        (option) => !option.insufficient_inventory
                      )?.id

                      if (id) {
                        handleSetShippingMethod(id, "pickup")
                      }
                    }}
                  >
                    <Radio
                      value={PICKUP_OPTION_ON}
                      data-testid="delivery-option-radio"
                      className={clx(
                        "shipping-option flex items-center justify-between cursor-pointer py-4 border-2 rounded-xl px-4 transition-all",
                        {
                          "border-[#8B4513] bg-[#8B4513]/5":
                            showPickupOptions === PICKUP_OPTION_ON,
                          "border-[#E8E0D4] hover:border-[#D4C4B0]":
                            showPickupOptions !== PICKUP_OPTION_ON,
                        }
                      )}
                    >
                      <div className="flex items-center gap-x-4">
                        <MedusaRadio
                          checked={showPickupOptions === PICKUP_OPTION_ON}
                        />
                        <div>
                          <span className="text-[#3D3229] font-medium">
                            Pick up your order
                          </span>
                          <p className="text-sm text-[#6B5B4F]">
                            Collect from our store
                          </p>
                        </div>
                      </div>
                      <span className="text-[#8B4513] font-semibold">
                        Free
                      </span>
                    </Radio>
                  </RadioGroup>
                )}
                <RadioGroup
                  value={shippingMethodId}
                  onChange={(v) => {
                    if (v) {
                      return handleSetShippingMethod(v, "shipping")
                    }
                  }}
                  className="space-y-3"
                >
                  {_shippingMethods?.map((option) => {
                    const isDisabled =
                      option.price_type === "calculated" &&
                      !isLoadingPrices &&
                      typeof calculatedPricesMap[option.id] !== "number"

                    return (
                      <Radio
                        key={option.id}
                        value={option.id}
                        data-testid="delivery-option-radio"
                        disabled={isDisabled}
                        className={clx(
                          "shipping-option flex items-center justify-between cursor-pointer py-4 border-2 rounded-xl px-4 transition-all",
                          {
                            "border-[#8B4513] bg-[#8B4513]/5":
                              option.id === shippingMethodId,
                            "border-[#E8E0D4] hover:border-[#D4C4B0]":
                              option.id !== shippingMethodId,
                            "opacity-50 cursor-not-allowed": isDisabled,
                          }
                        )}
                      >
                        <div className="flex items-center gap-x-4">
                          <MedusaRadio
                            checked={option.id === shippingMethodId}
                          />
                          <div>
                            <span className="text-[#3D3229] font-medium">
                              {option.name}
                            </span>
                            {option.data?.estimated_days && (
                              <p className="text-sm text-[#6B5B4F]">
                                {option.data.estimated_days} business days
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-[#3D3229] font-semibold">
                          {option.price_type === "flat" ? (
                            option.amount === 0 ? (
                              <span className="text-[#8B4513]">Free</span>
                            ) : (
                              convertToLocale({
                                amount: option.amount!,
                                currency_code: cart?.currency_code,
                              })
                            )
                          ) : calculatedPricesMap[option.id] ? (
                            convertToLocale({
                              amount: calculatedPricesMap[option.id],
                              currency_code: cart?.currency_code,
                            })
                          ) : isLoadingPrices ? (
                            <Loader className="animate-spin" />
                          ) : (
                            "-"
                          )}
                        </span>
                      </Radio>
                    )
                  })}
                </RadioGroup>
              </div>
            </div>
          </div>

          {showPickupOptions === PICKUP_OPTION_ON && (
            <div className="grid mt-4">
              <div className="flex flex-col mb-4">
                <span className="font-medium text-[#3D3229]">
                  Store location
                </span>
                <span className="text-sm text-[#6B5B4F]">
                  Choose a store near you
                </span>
              </div>
              <div data-testid="delivery-options-container">
                <div className="pb-6 md:pt-0 pt-2 space-y-3">
                  <RadioGroup
                    value={shippingMethodId}
                    onChange={(v) => {
                      if (v) {
                        return handleSetShippingMethod(v, "pickup")
                      }
                    }}
                    className="space-y-3"
                  >
                    {_pickupMethods?.map((option) => {
                      return (
                        <Radio
                          key={option.id}
                          value={option.id}
                          disabled={option.insufficient_inventory}
                          data-testid="delivery-option-radio"
                          className={clx(
                            "shipping-option flex items-center justify-between cursor-pointer py-4 border-2 rounded-xl px-4 transition-all",
                            {
                              "border-[#8B4513] bg-[#8B4513]/5":
                                option.id === shippingMethodId,
                              "border-[#E8E0D4] hover:border-[#D4C4B0]":
                                option.id !== shippingMethodId,
                              "opacity-50 cursor-not-allowed":
                                option.insufficient_inventory,
                            }
                          )}
                        >
                          <div className="flex items-start gap-x-4">
                            <MedusaRadio
                              checked={option.id === shippingMethodId}
                            />
                            <div className="flex flex-col">
                              <span className="text-[#3D3229] font-medium">
                                {option.name}
                              </span>
                              <span className="text-sm text-[#6B5B4F]">
                                {formatAddress(
                                  option.service_zone?.fulfillment_set?.location
                                    ?.address
                                )}
                              </span>
                            </div>
                          </div>
                          <span className="text-[#8B4513] font-semibold">
                            {option.amount === 0
                              ? "Free"
                              : convertToLocale({
                                  amount: option.amount!,
                                  currency_code: cart?.currency_code,
                                })}
                          </span>
                        </Radio>
                      )
                    })}
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          <div>
            <ErrorMessage
              error={error}
              data-testid="delivery-option-error-message"
            />
            <Button
              size="large"
              className="mt-4 w-full bg-gradient-to-r from-[#8B4513] to-[#D2691E] hover:from-[#A0522D] hover:to-[#E07020] text-white"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!cart.shipping_methods?.[0]}
              data-testid="submit-delivery-option-button"
            >
              Continue to payment
            </Button>
          </div>
        </>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
              <div className="flex flex-col">
                <Text className="txt-medium-plus text-[#3D3229] mb-1 font-medium">
                  Method
                </Text>
                <Text className="txt-medium text-[#6B5B4F]">
                  {cart.shipping_methods!.at(-1)!.name} •{" "}
                  {cart.shipping_methods!.at(-1)!.amount === 0 ? (
                    <span className="text-[#8B4513]">Free</span>
                  ) : (
                    convertToLocale({
                      amount: cart.shipping_methods!.at(-1)!.amount!,
                      currency_code: cart?.currency_code,
                    })
                  )}
                </Text>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Shipping



