import { nanoid } from "nanoid"
import type { NextRequest, NextResponse } from "next/server"
import type { PoolClient } from "pg"

export const PORTRAIT_ANONYMOUS_OWNER_COOKIE = "lv_portrait_owner"

const OWNER_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30
const USER_AGENT_MAX_LENGTH = 512

type UsageCounts = {
  dayCount: number
  hourCount: number
}

type PortraitRateLimits = {
  concurrent: number
  perDay: number
  perHour: number
}

type TrackableActorField =
  | "anonymous_owner_token"
  | "customer_id"
  | "request_ip"

export type PortraitGenerationAction = "generate" | "regenerate"

export type PortraitOwnerContext = {
  anonymousOwnerToken: string | null
  customerId: string | null
  isNewAnonymousOwnerToken: boolean
  requestIp: string | null
  userAgent: string | null
}

export type StoredPortraitOwner = {
  anonymousOwnerToken: string | null
  customerId: string | null
  requestIp: string | null
}

export class PortraitGuardError extends Error {
  retryAfterSeconds?: number
  status: number

  constructor(message: string, status = 400, retryAfterSeconds?: number) {
    super(message)
    this.name = "PortraitGuardError"
    this.retryAfterSeconds = retryAfterSeconds
    this.status = status
  }
}

function parsePositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function getPortraitRateLimits(customerId: string | null): PortraitRateLimits {
  if (customerId) {
    return {
      concurrent: parsePositiveInteger(
        process.env.PORTRAIT_RATE_LIMIT_AUTH_CONCURRENT,
        2
      ),
      perDay: parsePositiveInteger(
        process.env.PORTRAIT_RATE_LIMIT_AUTH_PER_DAY,
        30
      ),
      perHour: parsePositiveInteger(
        process.env.PORTRAIT_RATE_LIMIT_AUTH_PER_HOUR,
        10
      ),
    }
  }

  return {
    concurrent: parsePositiveInteger(
      process.env.PORTRAIT_RATE_LIMIT_ANON_CONCURRENT,
      1
    ),
    perDay: parsePositiveInteger(
      process.env.PORTRAIT_RATE_LIMIT_ANON_PER_DAY,
      10
    ),
    perHour: parsePositiveInteger(
      process.env.PORTRAIT_RATE_LIMIT_ANON_PER_HOUR,
      4
    ),
  }
}

function normalizeHeaderValue(value: string | null | undefined) {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

function extractIpFromHeader(value: string | null | undefined) {
  const normalized = normalizeHeaderValue(value)
  if (!normalized) {
    return null
  }

  const firstCandidate = normalized.split(",")[0]?.trim()
  return firstCandidate || null
}

async function getUsageCountsForField(
  client: PoolClient,
  field: TrackableActorField,
  value: string,
  extraWhereClause = ""
): Promise<UsageCounts> {
  const result = await client.query<{
    dayCount: number
    hourCount: number
  }>(
    `SELECT
       COUNT(*) FILTER (
         WHERE created_at >= NOW() - INTERVAL '1 hour'
       )::int AS "hourCount",
       COUNT(*) FILTER (
         WHERE created_at >= NOW() - INTERVAL '1 day'
       )::int AS "dayCount"
     FROM portrait_generation_events
     WHERE ${field} = $1 ${extraWhereClause}`,
    [value]
  )

  return result.rows[0] ?? { dayCount: 0, hourCount: 0 }
}

async function getGeneratingCountForField(
  client: PoolClient,
  field: TrackableActorField,
  value: string,
  extraWhereClause = ""
) {
  const result = await client.query<{ generatingCount: number }>(
    `SELECT COUNT(*)::int AS "generatingCount"
     FROM portrait_sessions
     WHERE status = 'generating'
       AND ${field} = $1 ${extraWhereClause}`,
    [value]
  )

  return result.rows[0]?.generatingCount ?? 0
}

function enforceRateLimits(
  limits: PortraitRateLimits,
  usage: UsageCounts,
  generatingCount: number,
  isAuthenticated: boolean
) {
  if (generatingCount >= limits.concurrent) {
    throw new PortraitGuardError(
      "A portrait preview is already generating for this session. Please wait for it to finish before trying again.",
      429,
      30
    )
  }

  if (usage.dayCount >= limits.perDay) {
    throw new PortraitGuardError(
      isAuthenticated
        ? "You've reached today's portrait preview limit. Please try again tomorrow."
        : "You've reached today's portrait preview limit. Please try again tomorrow or sign in for a higher limit.",
      429,
      60 * 60 * 24
    )
  }

  if (usage.hourCount >= limits.perHour) {
    throw new PortraitGuardError(
      "You've reached the hourly portrait preview limit. Please wait a bit before generating another preview.",
      429,
      60 * 60
    )
  }
}

export function getPortraitOwnerContext(
  request: NextRequest,
  customerId: string | null
): PortraitOwnerContext {
  const requestIp = getRequestIp(request)
  const existingAnonymousOwnerToken = normalizeHeaderValue(
    request.cookies.get(PORTRAIT_ANONYMOUS_OWNER_COOKIE)?.value
  )
  const userAgent =
    normalizeHeaderValue(request.headers.get("user-agent"))?.slice(
      0,
      USER_AGENT_MAX_LENGTH
    ) ?? null

  if (customerId) {
    return {
      anonymousOwnerToken: existingAnonymousOwnerToken,
      customerId,
      isNewAnonymousOwnerToken: false,
      requestIp,
      userAgent,
    }
  }

  return {
    anonymousOwnerToken: existingAnonymousOwnerToken ?? nanoid(24),
    customerId: null,
    isNewAnonymousOwnerToken: !existingAnonymousOwnerToken,
    requestIp,
    userAgent,
  }
}

export function getRequestIp(request: NextRequest): string | null {
  const forwardedFor = extractIpFromHeader(request.headers.get("x-forwarded-for"))
  if (forwardedFor) {
    return forwardedFor
  }

  const fallbackHeaderNames = [
    "cf-connecting-ip",
    "x-real-ip",
    "x-client-ip",
    "x-vercel-forwarded-for",
    "fastly-client-ip",
  ]

  for (const headerName of fallbackHeaderNames) {
    const candidate = extractIpFromHeader(request.headers.get(headerName))
    if (candidate) {
      return candidate
    }
  }

  return null
}

export function applyPortraitOwnerCookie(
  response: NextResponse,
  owner: PortraitOwnerContext
) {
  if (owner.customerId || !owner.anonymousOwnerToken) {
    return
  }

  response.cookies.set({
    httpOnly: true,
    maxAge: OWNER_COOKIE_MAX_AGE_SECONDS,
    name: PORTRAIT_ANONYMOUS_OWNER_COOKIE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    value: owner.anonymousOwnerToken,
  })
}

export async function acquirePortraitActorLock(
  client: PoolClient,
  owner: PortraitOwnerContext,
  sessionId?: string
) {
  const lockKey = owner.customerId
    ? `portrait:customer:${owner.customerId}`
    : owner.anonymousOwnerToken
    ? `portrait:anon:${owner.anonymousOwnerToken}`
    : owner.requestIp
    ? `portrait:ip:${owner.requestIp}`
    : sessionId
    ? `portrait:session:${sessionId}`
    : "portrait:global"

  await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [lockKey])
}

export async function assertPortraitGenerationAllowed(
  client: PoolClient,
  owner: PortraitOwnerContext
) {
  const limits = getPortraitRateLimits(owner.customerId)

  if (owner.customerId) {
    const usage = await getUsageCountsForField(
      client,
      "customer_id",
      owner.customerId
    )
    const generatingCount = await getGeneratingCountForField(
      client,
      "customer_id",
      owner.customerId
    )

    enforceRateLimits(limits, usage, generatingCount, true)
    return
  }

  const usageResults: UsageCounts[] = []
  const generatingResults: number[] = []

  if (owner.anonymousOwnerToken) {
    usageResults.push(
      await getUsageCountsForField(
        client,
        "anonymous_owner_token",
        owner.anonymousOwnerToken
      )
    )
    generatingResults.push(
      await getGeneratingCountForField(
        client,
        "anonymous_owner_token",
        owner.anonymousOwnerToken
      )
    )
  }

  if (owner.requestIp) {
    usageResults.push(
      await getUsageCountsForField(
        client,
        "request_ip",
        owner.requestIp,
        "AND customer_id IS NULL"
      )
    )
    generatingResults.push(
      await getGeneratingCountForField(
        client,
        "request_ip",
        owner.requestIp,
        "AND customer_id IS NULL"
      )
    )
  }

  const usage = usageResults.reduce<UsageCounts>(
    (current, next) => ({
      dayCount: Math.max(current.dayCount, next.dayCount),
      hourCount: Math.max(current.hourCount, next.hourCount),
    }),
    { dayCount: 0, hourCount: 0 }
  )
  const generatingCount = generatingResults.reduce(
    (current, next) => Math.max(current, next),
    0
  )

  enforceRateLimits(limits, usage, generatingCount, false)
}

export function assertPortraitOwnership(
  owner: PortraitOwnerContext,
  storedOwner: StoredPortraitOwner
) {
  if (storedOwner.customerId) {
    if (owner.customerId === storedOwner.customerId) {
      return
    }

    throw new PortraitGuardError(
      "You do not have permission to regenerate this portrait.",
      403
    )
  }

  if (storedOwner.anonymousOwnerToken) {
    if (owner.anonymousOwnerToken === storedOwner.anonymousOwnerToken) {
      return
    }

    throw new PortraitGuardError(
      "This portrait belongs to a different browser session. Please generate a new preview instead.",
      403
    )
  }

  if (storedOwner.requestIp) {
    if (owner.requestIp === storedOwner.requestIp) {
      return
    }

    throw new PortraitGuardError(
      "This portrait can no longer be regenerated from this session. Please generate a new preview instead.",
      403
    )
  }

  throw new PortraitGuardError(
    "This portrait was created before ownership tracking was enabled and can no longer be regenerated. Please generate a new preview instead.",
    403
  )
}

export async function recordPortraitGenerationEvent(
  client: PoolClient,
  params: {
    action: PortraitGenerationAction
    owner: PortraitOwnerContext
    sessionId: string
  }
) {
  await client.query(
    `INSERT INTO portrait_generation_events (
       session_id,
       event_type,
       customer_id,
       anonymous_owner_token,
       request_ip
     ) VALUES ($1, $2, $3, $4, $5)`,
    [
      params.sessionId,
      params.action,
      params.owner.customerId,
      params.owner.anonymousOwnerToken,
      params.owner.requestIp,
    ]
  )
}

export function isPortraitGuardError(
  error: unknown
): error is PortraitGuardError {
  return error instanceof PortraitGuardError
}
