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

const AGENT_API = 'http://localhost:3001'
const STATIC_EVENTS_URL = import.meta.env.BASE_URL + 'events-static.json'

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
  try {
    console.log('[AgentFeed] Attempting static fallback from:', STATIC_EVENTS_URL)
    const res = await fetch(STATIC_EVENTS_URL)
    if (!res.ok) throw new Error(`Static fetch returned ${res.status}`)
    const data = await res.json()

    // Handle both array format and object with events array
    const events = Array.isArray(data) ? data : (data.events || [])

    console.log('[AgentFeed] Static mode: loaded', events.length, 'cached events')
    currentState = {
      status: 'static',
      eventCount: events.length,
      lastUpdated: 'Static snapshot',
      events: events
    }
    return true
  } catch (err) {
    console.warn('[AgentFeed] Static fallback failed:', err)
    return false
  }
}

export async function startAgentFeed() {
  console.log('[AgentFeed] Starting feed, fetching from', AGENT_API)

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
