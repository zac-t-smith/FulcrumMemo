# WorldView-FM Agent Swarm

Real-time conflict intelligence extraction system using AI agents.

## Overview

This system runs a swarm of AI agents that:
1. **News Scanner** - Monitors major news RSS feeds every 15 minutes
2. **OSINT Monitor** - Scrapes professional conflict monitoring sites every 20 minutes
3. **Shipping Monitor** - Tracks maritime/shipping news every 30 minutes
4. **Validator** - Uses Claude to validate extracted events for accuracy
5. **Geocoder** - Resolves location names to coordinates via Nominatim

Events are extracted using Google Gemini 2.0 Flash, validated with Claude, and served via a local Express API that the WorldView-FM frontend consumes.

## Setup

### 1. Install Dependencies

```bash
cd worldview-fm-agents
npm install
```

### 2. Configure Environment

The `.env` file should already contain your API keys:

```
GEMINI_API_KEY=your_gemini_key
ANTHROPIC_API_KEY=your_anthropic_key
PORT=3001
```

### 3. Run the Agent Swarm

```bash
npm run dev
```

This starts:
- The Express API server on port 3001
- All agents on their scheduled intervals
- An immediate initial sweep of all agents

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/events` | All events (supports `?since=`, `?type=`, `?validated=`) |
| `GET /api/events/latest` | Events from last 2 hours |
| `GET /api/status` | System and agent status |
| `GET /api/shipping` | Shipping/naval events only |
| `GET /api/health` | Health check |

## Agent Schedule

| Agent | Interval | Sources |
|-------|----------|---------|
| News Scanner | 15 min | Reuters, CNN, Al Jazeera, BBC Middle East |
| OSINT Monitor | 20 min | ISW, ACLED Watchlist |
| Shipping Monitor | 30 min | Hellenic Shipping News, gCaptain, Splash247 |
| Validator | After each agent | Claude API |
| Geocoder | After each agent | Nominatim (OpenStreetMap) |

## Event Types

- `strike` - Military strikes, attacks
- `naval` - Vessel incidents, maritime events
- `diplomatic` - Political/diplomatic developments
- `economic` - Sanctions, trade, rates
- `infrastructure` - Infrastructure damage/changes
- `casualty` - Civilian/military casualties

## Frontend Integration

Import the agent feed in your WorldView-FM frontend:

```tsx
import {
  startAgentFeed,
  subscribeToAgentFeed,
  getGeolocatedAgentEvents,
  agentEventsToMapMarkers
} from './data/feeds/agentFeed';

// Start polling
startAgentFeed();

// Subscribe to updates
subscribeToAgentFeed((state) => {
  if (state.isOnline) {
    const markers = agentEventsToMapMarkers(state.events);
    // Add to map...
  }
});
```

Use the `AgentFeedIndicator` component to show online/offline status:

```tsx
import { AgentFeedIndicator, AgentFeedPanel } from './components/AgentFeedIndicator';

// In header
<AgentFeedIndicator />

// In sidebar
<AgentFeedPanel />
```

## Rate Limits

- **Gemini**: 14 calls/minute (under 15/min free tier limit)
- **Nominatim**: 1 call/second (OSM policy)
- **Claude**: No explicit limit (used sparingly for validation)

## Data Storage

- `src/data/events.json` - All extracted events
- `src/data/agentLog.json` - Last 100 agent runs

## Architecture

```
orchestrator.ts
    │
    ├── newsScanner.ts ──┐
    ├── osintMonitor.ts ──┼──→ Gemini API ──→ events.json
    ├── shippingMonitor.ts┘
    │
    ├── validator.ts ──→ Claude API ──→ updates events.json
    │
    └── geocoder.ts ──→ Nominatim ──→ updates events.json

server.ts ──→ Express API ──→ Frontend
```

## Troubleshooting

**Agent API not reachable:**
- Ensure the agent swarm is running (`npm run dev`)
- Check port 3001 is not in use

**No events appearing:**
- Check API keys in `.env`
- Review console for rate limit warnings
- Events only appear if they match conflict keywords

**Validation failing:**
- Check Anthropic API key
- Claude validates for consistency, may reject low-quality extractions
