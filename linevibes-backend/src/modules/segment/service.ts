import { 
  AbstractAnalyticsProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import { Analytics } from "@segment/analytics-node"
import { ProviderIdentifyAnalyticsEventDTO, ProviderTrackAnalyticsEventDTO } from "@medusajs/types"

type Options = {
  writeKey: string
}

type InjectedDependencies = {}

class SegmentAnalyticsProviderService extends AbstractAnalyticsProviderService {
  private client?: Analytics
  static identifier = "segment"

  constructor(container: InjectedDependencies, options: Options) {
    super()
    if (!options.writeKey) {
      // Log warning but don't crash
      console.warn("Segment write key not found. Analytics will be disabled.")
      return
    }
    this.client = new Analytics({ writeKey: options.writeKey })
  }

  async identify(data: ProviderIdentifyAnalyticsEventDTO): Promise<void> {
    if (!this.client) return

    const anonymousId = data.properties && "anonymousId" in data.properties ? 
      data.properties.anonymousId : undefined
    const traits = data.properties && "traits" in data.properties ? 
      data.properties.traits : undefined

    if ("group" in data) {
      this.client.group({
        groupId: data.group.id,
        userId: data.actor_id,
        anonymousId: typeof anonymousId === 'string' || typeof anonymousId === 'number' ? anonymousId : undefined,
        traits: traits as Record<string, any>,
        context: data.properties,
      })
    } else {
      this.client.identify({
        userId: data.actor_id,
        anonymousId: typeof anonymousId === 'string' || typeof anonymousId === 'number' ? anonymousId : undefined,
        traits: traits as Record<string, any>,
        context: data.properties,
      })
    }
  }

  async track(data: ProviderTrackAnalyticsEventDTO): Promise<void> {
    if (!this.client) return

    const userId = "group" in data ? 
      data.actor_id || data.group?.id : data.actor_id
    const anonymousId = data.properties && "anonymousId" in data.properties ? 
      data.properties.anonymousId : undefined

    if (!userId && !anonymousId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA, 
        `Actor or group ID is required for event ${data.event}`
      )
    }

    this.client.track({
      userId,
      anonymousId: typeof anonymousId === 'string' || typeof anonymousId === 'number' ? anonymousId : undefined,
      event: data.event,
      properties: data.properties,
      timestamp: data.properties && "timestamp" in data.properties ? 
        new Date(data.properties.timestamp as string | number | Date) : undefined,
    })
  }

  async shutdown(): Promise<void> {
    if (!this.client) return
    await this.client.flush({
      close: true,
    })
  }
}

export default SegmentAnalyticsProviderService
