"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"
import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const { promotions = [] } = cart

  const removePromotionCode = async (code: string) => {
    setIsLoading(true)
    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    await applyPromotions(
      validPromotions.filter((p) => p.code !== undefined).map((p) => p.code!)
    )
    setIsLoading(false)
  }

  const addPromotionCode = async (formData: FormData) => {
    setErrorMessage("")
    setIsLoading(true)

    const code = formData.get("code")
    if (!code) {
      setIsLoading(false)
      return
    }
    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = promotions
      .filter((p) => p.code !== undefined)
      .map((p) => p.code!)
    codes.push(code.toString())

    try {
      await applyPromotions(codes)
      setIsOpen(false)
    } catch (e: any) {
      setErrorMessage(e.message)
    }
    
    setIsLoading(false)
    if (input) {
      input.value = ""
    }
  }

  return (
    <div className="w-full flex flex-col">
      <div className="txt-medium">
        {!isOpen && promotions.length === 0 ? (
          <button
            onClick={() => setIsOpen(true)}
            className="checkout-discount-btn w-full"
            data-testid="add-discount-button"
          >
            Add Gift Card or Discount Code
          </button>
        ) : (
          <form action={addPromotionCode} className="w-full mb-4">
            <div className="checkout-discount-input-wrapper">
              <input
                className="checkout-discount-input"
                id="promotion-input"
                name="code"
                type="text"
                autoFocus
                placeholder="Discount code or gift card"
                data-testid="discount-input"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="checkout-discount-btn"
                data-testid="discount-apply-button"
                disabled={isLoading}
              >
                {isLoading ? "Using..." : "Apply"}
              </button>
            </div>
            <ErrorMessage
              error={errorMessage}
              data-testid="discount-error-message"
            />
          </form>
        )}

        {promotions.length > 0 && (
          <div className="w-full flex flex-col gap-2 mt-2">
            
            {promotions.map((promotion) => (
              <div
                key={promotion.id}
                className="flex items-center justify-between p-2 bg-neutral-50 rounded-md border border-neutral-200"
                data-testid="discount-row"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-900 bg-neutral-200 px-2 py-1 rounded" data-testid="discount-code">
                    {promotion.code}
                  </span>
                  
                  {promotion.application_method?.value && (
                    <span className="text-xs text-neutral-500">
                      ({promotion.application_method.type === "percentage"
                        ? `${promotion.application_method.value}% off`
                        : `${convertToLocale({
                            amount: +promotion.application_method.value,
                            currency_code: promotion.application_method.currency_code || cart.currency_code,
                          })} off`})
                    </span>
                  )}
                </div>

                {!promotion.is_automatic && (
                  <button
                    className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                    onClick={() => {
                      if (promotion.code) {
                        removePromotionCode(promotion.code)
                      }
                    }}
                    type="button"
                    disabled={isLoading}
                    data-testid="remove-discount-button"
                  >
                    <Trash className="w-4 h-4" />
                    <span className="sr-only">Remove code</span>
                  </button>
                )}
              </div>
            ))}
            
            {/* Toggle button to show input again if user wants to add more */}
            {!isOpen && (
               <button
                onClick={() => setIsOpen(true)}
                className="mt-2 text-left text-sm font-medium text-black transition-opacity hover:opacity-70"
              >
                + Add another code
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountCode
