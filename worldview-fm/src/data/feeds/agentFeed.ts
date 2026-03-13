// src/data/feeds/agentFeed.ts

export interface AgentEvent {
  id: string
  timestamp: string
  source: string
  sourceUrl: string
  eventType: 'strike' | 'naval' | 'diplomatic' | 'economic' | 'infrastructure' | 'casualty'
  actor1: string
  actor2: string
  location: string
  lat: number | null
  lon: number | null
  summary: string
  confidence: 'high' | 'medium' | 'low'
  validated: boolean
  rawHeadline: string
  mapRelevant?: boolean
}

export interface AgentFeedState {
  status: 'live' | 'offline' | 'connecting' | 'static'
  eventCount: number
  lastUpdated: string | null
  events: AgentEvent[]
}

// Configurable agent URL - defaults to localhost for dev
const AGENT_API = import.meta.env.VITE_AGENT_URL || 'http://localhost:3001'

// Only use static fallback if NO agent URL is configured AND we're on GitHub Pages
const USE_STATIC_ONLY = !import.meta.env.VITE_AGENT_URL &&
                        window.location.hostname.includes('github.io')

// Build static URL properly
function getStaticEventsUrl(): string {
  const base = import.meta.env.BASE_URL || '/'
  const url = `${base}events-static.json`
  console.log('[AgentFeed] Static URL constructed:', url, 'from BASE_URL:', base)
  return url
}

let currentState: AgentFeedState = {
  status: 'connecting',
  eventCount: 0,
  lastUpdated: null,
  events: []
}

let listeners: Array<(state: AgentFeedState) => void> = []

function notify() {
  listeners.forEach(fn => fn({ ...currentState }))
}

export function subscribeToAgentFeed(fn: (state: AgentFeedState) => void) {
  listeners.push(fn)
  fn({ ...currentState })
  return () => {
    listeners = listeners.filter(l => l !== fn)
  }
}

// Fetch from static fallback (baked events.json for GitHub Pages)
async function fetchStaticEvents(): Promise<boolean> {
  const staticUrl = getStaticEventsUrl()

  try {
    console.log('[AgentFeed] Fetching static from:', staticUrl)
    const res = await fetch(staticUrl)
    console.log('[AgentFeed] Static response status:', res.status)

    if (!res.ok) {
      console.error('[AgentFeed] Static fetch failed:', res.status, res.statusText)
      return false
    }

    const text = await res.text()
    console.log('[AgentFeed] Static raw length:', text.length)

    const data = JSON.parse(text)

    // Handle both array format and object with events array
    const events = Array.isArray(data) ? data : (data.events || [])

    console.log('[AgentFeed] Static parsed events:', events.length)
    currentState = {
      status: 'static',
      eventCount: events.length,
      lastUpdated: 'Static snapshot',
      events: events
    }
    return true
  } catch (err) {
    console.error('[AgentFeed] Static parse error:', err)
    return false
  }
}

export async function startAgentFeed() {
  // Only use static fallback if no agent URL configured and on GitHub Pages
  if (USE_STATIC_ONLY) {
    console.log('[AgentFeed] Static mode: no VITE_AGENT_URL configured')
    const staticLoaded = await fetchStaticEvents()
    if (!staticLoaded) {
      currentState = { ...currentState, status: 'offline' }
    }
    notify()
    return
  }

  // Try live feed from configured agent URL (Railway or localhost)
  console.log('[AgentFeed] Live mode: connecting to', AGENT_API)

  try {
    // Try live agent server first (3 second timeout for fast fallback)
    const res = await fetch(`${AGENT_API}/api/events`, {
      signal: AbortSignal.timeout(3000)
    })
    if (!res.ok) throw new Error(`Feed returned ${res.status}`)
    const data = await res.json()
    console.log('[AgentFeed] Fetched', data.count, 'events,', data.events?.filter((e: AgentEvent) => e.lat && e.lon).length, 'with coords')
    currentState = {
      status: 'live',
      eventCount: data.count ?? 0,
      lastUpdated: new Date().toISOString(),
      events: data.events ?? []
    }
    notify()

    // Set up polling interval for live mode
    setInterval(async () => {
      try {
        const res = await fetch(`${AGENT_API}/api/events`)
        if (!res.ok) throw new Error('Feed offline')
        const data = await res.json()
        currentState = {
          status: 'live',
          eventCount: data.count ?? 0,
          lastUpdated: new Date().toISOString(),
          events: data.events ?? []
        }
      } catch {
        // Don't switch to offline if we have events, just mark status
        currentState = { ...currentState, status: 'offline' }
      }
      notify()
    }, 5 * 60 * 1000)

  } catch (err) {
    console.warn('[AgentFeed] Live feed unavailable:', err)

    // Fall back to static events
    const staticLoaded = await fetchStaticEvents()

    if (!staticLoaded) {
      currentState = { ...currentState, status: 'offline' }
    }

    notify()
  }
}
