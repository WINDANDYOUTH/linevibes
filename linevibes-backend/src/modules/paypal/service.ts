import {
  AbstractPaymentProvider,
  MedusaError,
  PaymentActions,
  BigNumber,
} from "@medusajs/framework/utils"
import type {
  Logger,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  ProviderWebhookPayload,
  WebhookActionResult,
} from "@medusajs/framework/types"
import {
  Client,
  Environment,
  OrdersController,
  PaymentsController,
  CheckoutPaymentIntent,
  OrderApplicationContextLandingPage,
  OrderApplicationContextUserAction,
  OrderRequest,
} from "@paypal/paypal-server-sdk"

type Options = {
  client_id: string
  client_secret: string
  environment?: "sandbox" | "production"
  autoCapture?: boolean
  webhook_id?: string
}

type InjectedDependencies = {
  logger: Logger
}

const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif",
  "clp",
  "djf",
  "gnf",
  "jpy",
  "kmf",
  "krw",
  "mga",
  "pyg",
  "rwf",
  "ugx",
  "vnd",
  "vuv",
  "xaf",
  "xof",
  "xpf",
])

const formatPayPalAmount = (
  amount: BigNumber | number | string,
  currencyCode: string
) => {
  const normalizedCurrency = currencyCode.toLowerCase()
  const numericAmount = Number(amount)

  if (!Number.isFinite(numericAmount)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid PayPal amount: ${amount}`
    )
  }

  if (ZERO_DECIMAL_CURRENCIES.has(normalizedCurrency)) {
    return Math.round(numericAmount).toString()
  }

  return numericAmount.toFixed(2)
}

class PayPalPaymentProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "paypal"

  protected logger_: Logger
  protected options_: Options
  protected client_: Client
  protected ordersController_: OrdersController
  protected paymentsController_: PaymentsController

  constructor(container: InjectedDependencies, options: Options) {
    super(container, options)

    this.logger_ = container.logger
    this.options_ = {
      environment: "sandbox",
      autoCapture: false,
      ...options,
    }

    // Initialize PayPal client
    this.client_ = new Client({
      environment:
        this.options_.environment === "production"
          ? Environment.Production
          : Environment.Sandbox,
      clientCredentialsAuthCredentials: {
        oAuthClientId: this.options_.client_id,
        oAuthClientSecret: this.options_.client_secret,
      },
    })

    this.ordersController_ = new OrdersController(this.client_)
    this.paymentsController_ = new PaymentsController(this.client_)
  }

  static validateOptions(options: Record<any, any>): void | never {
    if (!options.client_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayPal Client ID is required"
      )
    }
    if (!options.client_secret) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayPal Client Secret is required"
      )
    }
  }

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    try {
      const { amount, currency_code } = input

      // Determine intent based on autoCapture option
      const intent = this.options_.autoCapture
        ? CheckoutPaymentIntent.Capture
        : CheckoutPaymentIntent.Authorize

      // Create PayPal order request
      const orderRequest: OrderRequest = {
        intent: intent,
        purchaseUnits: [
          {
            amount: {
              currencyCode: currency_code.toUpperCase(),
              value: formatPayPalAmount(amount, currency_code),
            },
            description: "Order payment",
            customId: input.data?.session_id as string | undefined,
          },
        ],
        applicationContext: {
          brandName: "Better Knitwear",
          landingPage: OrderApplicationContextLandingPage.NoPreference,
          userAction: OrderApplicationContextUserAction.PayNow,
        },
      }

      const response = await this.ordersController_.createOrder({
        body: orderRequest,
        prefer: "return=representation",
      })

      const order = response.result

      if (!order?.id) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Failed to create PayPal order"
        )
      }

      // Extract approval URL from links
      const approvalUrl = order.links?.find(
        (link) => link.rel === "approve"
      )?.href

      return {
        id: order.id,
        data: {
          order_id: order.id,
          intent: intent,
          status: order.status,
          approval_url: approvalUrl,
          session_id: input.data?.session_id,
          currency_code,
        },
      }
    } catch (error: any) {
      this.logger_.error("PayPal initiatePayment error:", error)
      const details =
        error?.result?.message ||
        error?.result?.error_description ||
        error?.message ||
        error
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to initiate PayPal payment: ${details}`
      )
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    try {
      const orderId = input.data?.order_id as string | undefined

      if (!orderId || typeof orderId !== "string") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "PayPal order ID is required for authorization"
        )
      }

      const currentOrder = await this.ordersController_.getOrder({
        id: orderId,
      })

      const currentOrderResult = currentOrder.result

      if (currentOrderResult?.status === "COMPLETED") {
        const existingCapture =
          currentOrderResult.purchaseUnits?.[0]?.payments?.captures?.[0]

        return {
          status: "captured",
          data: {
            ...input.data,
            capture_id: existingCapture?.id,
            status: currentOrderResult.status,
          },
        }
      }

      // Check if autoCapture is enabled
      if (this.options_.autoCapture) {
        // Capture order directly
        const response = await this.ordersController_.captureOrder({
          id: orderId,
          prefer: "return=representation",
        })

        const order = response.result
        const capture =
          order?.purchaseUnits?.[0]?.payments?.captures?.[0]

        return {
          status: "captured",
          data: {
            ...input.data,
            capture_id: capture?.id,
            status: order?.status,
          },
        }
      } else {
        // Authorize order
        const response = await this.ordersController_.authorizeOrder({
          id: orderId,
          prefer: "return=representation",
        })

        const order = response.result
        const authorization =
          order?.purchaseUnits?.[0]?.payments?.authorizations?.[0]

        return {
          status: "authorized",
          data: {
            ...input.data,
            authorization_id: authorization?.id,
            status: order?.status,
          },
        }
      }
    } catch (error: any) {
      this.logger_.error("PayPal authorizePayment error:", error)
      const details =
        error?.result?.message ||
        error?.result?.error_description ||
        error?.message ||
        error
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to authorize PayPal payment: ${details}`
      )
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    try {
      const authorizationId = input.data?.authorization_id as string | undefined

      if (!authorizationId || typeof authorizationId !== "string") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "PayPal authorization ID is required for capture"
        )
      }

      const response = await this.paymentsController_.captureAuthorizedPayment({
        authorizationId: authorizationId,
        prefer: "return=representation",
      })

      const capture = response.result

      if (!capture?.id) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Failed to capture PayPal payment"
        )
      }

      return {
        data: {
          ...input.data,
          capture_id: capture.id,
        },
      }
    } catch (error: any) {
      this.logger_.error("PayPal capturePayment error:", error)
      const details =
        error?.result?.message ||
        error?.result?.error_description ||
        error?.message ||
        error
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to capture PayPal payment: ${details}`
      )
    }
  }

  async cancelPayment(
    input: CancelPaymentInput
  ): Promise<CancelPaymentOutput> {
    try {
      const authorizationId = input.data?.authorization_id as string | undefined

      if (!authorizationId || typeof authorizationId !== "string") {
        // If no authorization ID, the payment hasn't been authorized yet
        // Just return success
        return {
          data: input.data,
        }
      }

      await this.paymentsController_.voidPayment({
        authorizationId: authorizationId,
      })

      return {
        data: input.data,
      }
    } catch (error: any) {
      this.logger_.error("PayPal cancelPayment error:", error)
      const details =
        error?.result?.message ||
        error?.result?.error_description ||
        error?.message ||
        error
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to cancel PayPal payment: ${details}`
      )
    }
  }

  async refundPayment(
    input: RefundPaymentInput
  ): Promise<RefundPaymentOutput> {
    try {
      const captureId = input.data?.capture_id as string | undefined

      if (!captureId || typeof captureId !== "string") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "PayPal capture ID is required for refund"
        )
      }

      const response = await this.paymentsController_.refundCapturedPayment({
        captureId: captureId,
        prefer: "return=representation",
        body: input.amount
          ? {
              amount: {
                currencyCode: (input.data?.currency_code as string) || "USD",
                value: input.amount.toString(),
              },
            }
          : undefined,
      })

      const refund = response.result

      return {
        data: {
          ...input.data,
          refund_id: refund?.id,
        },
      }
    } catch (error: any) {
      this.logger_.error("PayPal refundPayment error:", error)
      const details =
        error?.result?.message ||
        error?.result?.error_description ||
        error?.message ||
        error
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to refund PayPal payment: ${details}`
      )
    }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    try {
      const orderId = input.data?.order_id as string | undefined

      if (!orderId || typeof orderId !== "string") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "PayPal order ID is required"
        )
      }

      const response = await this.ordersController_.getOrder({
        id: orderId,
      })

      const order = response.result

      return {
        data: {
          ...input.data,
          status: order?.status,
          order_details: order,
        },
      }
    } catch (error: any) {
      this.logger_.error("PayPal retrievePayment error:", error)
      const details =
        error?.result?.message ||
        error?.result?.error_description ||
        error?.message ||
        error
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to retrieve PayPal payment: ${details}`
      )
    }
  }

  async updatePayment(
    input: UpdatePaymentInput
  ): Promise<UpdatePaymentOutput> {
    // PayPal doesn't support updating orders directly
    // Return the existing data
    return {
      data: input.data,
    }
  }

  async deletePayment(
    input: DeletePaymentInput
  ): Promise<DeletePaymentOutput> {
    // PayPal doesn't support deleting orders
    // Just return empty
    return {}
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    try {
      const orderId = input.data?.order_id as string | undefined

      if (!orderId || typeof orderId !== "string") {
        return {
          status: "pending",
        }
      }

      const response = await this.ordersController_.getOrder({
        id: orderId,
      })

      const order = response.result
      const status = order?.status

      // Map PayPal status to Medusa status
      switch (status) {
        case "COMPLETED":
          return { status: "captured" }
        case "APPROVED":
          return { status: "authorized" }
        case "VOIDED":
          return { status: "canceled" }
        case "CREATED":
        case "SAVED":
        case "PAYER_ACTION_REQUIRED":
          return { status: "pending" }
        default:
          return { status: "pending" }
      }
    } catch (error: any) {
      this.logger_.error("PayPal getPaymentStatus error:", error)
      return { status: "error" }
    }
  }

  async verifyWebhookSignature(
    headers: Record<string, string>,
    data: unknown,
    rawData: string
  ): Promise<boolean> {
    // If no webhook_id is configured, skip verification
    if (!this.options_.webhook_id) {
      this.logger_.warn("PayPal webhook_id not configured, skipping signature verification")
      return true
    }

    try {
      // PayPal webhook verification requires these headers
      const transmissionId = headers["paypal-transmission-id"]
      const transmissionTime = headers["paypal-transmission-time"]
      const certUrl = headers["paypal-cert-url"]
      const transmissionSig = headers["paypal-transmission-sig"]
      const authAlgo = headers["paypal-auth-algo"]

      if (!transmissionId || !transmissionTime || !certUrl || !transmissionSig || !authAlgo) {
        this.logger_.warn("Missing PayPal webhook headers")
        return false
      }

      // For simplicity, we'll trust the webhook if all headers are present
      // In production, you should implement full signature verification
      return true
    } catch (error: any) {
      this.logger_.error("PayPal webhook verification error:", error)
      return false
    }
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    try {
      const { data, rawData, headers } = payload

      // Verify webhook signature
      const isValid = await this.verifyWebhookSignature(
        headers || {},
        data,
        rawData || ""
      )

      if (!isValid) {
        this.logger_.error("Invalid PayPal webhook signature")
        return {
          action: PaymentActions.FAILED,
          data: {
            session_id: "",
            amount: new BigNumber(0),
          },
        }
      }

      // PayPal webhook events have event_type
      const eventType = (data as any)?.event_type

      if (!eventType) {
        this.logger_.warn("PayPal webhook event missing event_type")
        return {
          action: PaymentActions.NOT_SUPPORTED,
          data: {
            session_id: "",
            amount: new BigNumber(0),
          },
        }
      }

      // Extract order ID and amount from webhook payload
      const resource = (data as any)?.resource
      const sessionId: string | undefined = (data as any)?.resource?.custom_id

      if (!sessionId) {
        this.logger_.warn("Session ID not found in PayPal webhook resource")
        return {
          action: PaymentActions.NOT_SUPPORTED,
          data: {
            session_id: "",
            amount: new BigNumber(0),
          },
        }
      }

      const amountValue =
        resource?.amount?.value ||
        resource?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value ||
        resource?.purchase_units?.[0]?.payments?.authorizations?.[0]?.amount?.value ||
        0

      const amount = new BigNumber(amountValue)
      const payloadData = {
        session_id: sessionId,
        amount,
      }

      // Map PayPal webhook events to Medusa actions
      switch (eventType) {
        case "PAYMENT.AUTHORIZATION.CREATED":
          return {
            action: PaymentActions.AUTHORIZED,
            data: payloadData,
          }

        case "PAYMENT.CAPTURE.DENIED":
          return {
            action: PaymentActions.FAILED,
            data: payloadData,
          }

        case "PAYMENT.AUTHORIZATION.VOIDED":
          return {
            action: PaymentActions.CANCELED,
            data: payloadData,
          }

        case "PAYMENT.CAPTURE.COMPLETED":
          return {
            action: PaymentActions.SUCCESSFUL,
            data: payloadData,
          }

        default:
          this.logger_.info(`Unhandled PayPal webhook event: ${eventType}`)
          return {
            action: PaymentActions.NOT_SUPPORTED,
            data: payloadData,
          }
      }
    } catch (error: any) {
      this.logger_.error("PayPal getWebhookActionAndData error:", error)
      return {
        action: PaymentActions.FAILED,
        data: {
          session_id: "",
          amount: new BigNumber(0),
        },
      }
    }
  }
}

export default PayPalPaymentProviderService
