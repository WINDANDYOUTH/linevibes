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

function normalizeAnonymousId(value: unknown) {
  if (typeof value === "string") {
    return value
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toString()
  }

  return undefined
}

function normalizeTraits(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, any>
  }

  return undefined
}

function buildSegmentIdentity(
  userId: string | undefined,
  anonymousId: unknown
) {
  const normalizedAnonymousId = normalizeAnonymousId(anonymousId)

  if (userId && normalizedAnonymousId) {
    return {
      userId,
      anonymousId: normalizedAnonymousId,
    }
  }

  if (userId) {
    return {
      userId,
    }
  }

  if (normalizedAnonymousId) {
    return {
      anonymousId: normalizedAnonymousId,
    }
  }

  return null
}

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
    const identity = buildSegmentIdentity(data.actor_id, anonymousId)

    if (!identity) {
      return
    }

    if ("group" in data) {
      this.client.group({
        groupId: data.group.id,
        ...identity,
        traits: normalizeTraits(traits),
        context: data.properties,
      })
    } else {
      this.client.identify({
        ...identity,
        traits: normalizeTraits(traits),
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
    const identity = buildSegmentIdentity(userId, anonymousId)

    if (!identity) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA, 
        `Actor or group ID is required for event ${data.event}`
      )
    }

    this.client.track({
      ...identity,
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
