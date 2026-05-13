/**
 * Umami Analytics API client for Umami Cloud
 * Base URL: https://api.umami.is/v1
 * Auth: x-umami-api-key header
 *
 * Env vars are read inside each function (not at module level)
 * so they are always fresh after a server restart.
 */

async function umamiRequest<T>(path: string, params?: Record<string, string>): Promise<T | null> {
  // Read inside function — not at module level — so restarts pick up new values
  const apiKey = process.env.UMAMI_API_KEY
  const websiteId = process.env.UMAMI_WEBSITE_ID
  const baseUrl = (process.env.UMAMI_API_URL || 'https://api.umami.is/v1').replace(/\/$/, '')

  if (!apiKey || !websiteId) {
    return null
  }

  const url = new URL(`${baseUrl}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-umami-api-key': apiKey,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error(`[Umami] ${res.status} ${res.statusText} — ${url.pathname} — ${text.slice(0, 200)}`)
      return null
    }

    return res.json() as Promise<T>
  } catch (err) {
    console.error('[Umami] Fetch error:', err)
    return null
  }
}

function defaultRange() {
  const end = Date.now()
  const start = end - 30 * 24 * 60 * 60 * 1000
  return {
    startAt: String(start),
    endAt: String(end),
  }
}

function websiteId() {
  return process.env.UMAMI_WEBSITE_ID || ''
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UmamiStats {
  pageviews: number
  visitors: number
  visits: number
  bounces: number
  totaltime: number
  comparison?: {
    pageviews: number
    visitors: number
    visits: number
    bounces: number
    totaltime: number
  }
}

export interface UmamiPageview {
  x: string
  y: number
}

export interface UmamiMetric {
  x: string
  y: number
}

// ─── API calls ────────────────────────────────────────────────────────────────

export async function getStats(): Promise<UmamiStats | null> {
  return umamiRequest<UmamiStats>(
    `/websites/${websiteId()}/stats`,
    defaultRange()
  )
}

export async function getPageviews(): Promise<{ pageviews: UmamiPageview[]; sessions: UmamiPageview[] } | null> {
  return umamiRequest(
    `/websites/${websiteId()}/pageviews`,
    { ...defaultRange(), unit: 'day', timezone: 'UTC' }
  )
}

export async function getTopPages(): Promise<UmamiMetric[] | null> {
  const data = await umamiRequest<{ data: UmamiMetric[] }>(
    `/websites/${websiteId()}/metrics`,
    { ...defaultRange(), type: 'path', limit: '10' }
  )
  return data?.data ?? null
}

export async function getTopReferrers(): Promise<UmamiMetric[] | null> {
  const data = await umamiRequest<{ data: UmamiMetric[] }>(
    `/websites/${websiteId()}/metrics`,
    { ...defaultRange(), type: 'referrer', limit: '10' }
  )
  return data?.data ?? null
}

export async function getTopCountries(): Promise<UmamiMetric[] | null> {
  const data = await umamiRequest<{ data: UmamiMetric[] }>(
    `/websites/${websiteId()}/metrics`,
    { ...defaultRange(), type: 'country', limit: '10' }
  )
  return data?.data ?? null
}

export async function getTopBrowsers(): Promise<UmamiMetric[] | null> {
  const data = await umamiRequest<{ data: UmamiMetric[] }>(
    `/websites/${websiteId()}/metrics`,
    { ...defaultRange(), type: 'browser', limit: '8' }
  )
  return data?.data ?? null
}

export async function getTopDevices(): Promise<UmamiMetric[] | null> {
  const data = await umamiRequest<{ data: UmamiMetric[] }>(
    `/websites/${websiteId()}/metrics`,
    { ...defaultRange(), type: 'device', limit: '5' }
  )
  return data?.data ?? null
}
