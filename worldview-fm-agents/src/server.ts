import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { getEvents, getEventsSince, getEventsByType, getValidatedEvents, getAgentLog } from './utils';
import { SystemStatus, AgentStatus } from './types';
import { initializeAgents } from './orchestrator';

dotenv.config();

// Cache for market data (refresh every 5 minutes)
let marketCache: {
  data: { brent: number; wti: number; brentChange: number; wtiChange: number; timestamp: string } | null;
  fetchedAt: number;
} = { data: null, fetchedAt: 0 };

// Cache for SITREP (refresh every 30 minutes)
let sitrepCache: {
  data: { summary: string; generatedAt: string } | null;
  fetchedAt: number;
} = { data: null, fetchedAt: 0 };

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - allow localhost and GitHub Pages
const ALLOWED_ORIGINS = [
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,  // Any localhost port
  /^https:\/\/zac-t-smith\.github\.io$/,          // GitHub Pages
  /^https:\/\/.*\.github\.io$/                     // Any GitHub Pages subdomain
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    // Check against allowed patterns
    if (ALLOWED_ORIGINS.some(pattern => pattern.test(origin))) {
      return callback(null, true);
    }
    console.log('[CORS] Blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// GET /api/events - Returns all events with optional filters
app.get('/api/events', (req: Request, res: Response) => {
  try {
    let events = getEvents();

    // Filter by since date
    if (req.query.since) {
      const sinceDate = new Date(req.query.since as string);
      events = events.filter(e => new Date(e.timestamp) >= sinceDate);
    }

    // Filter by event type
    if (req.query.type) {
      events = events.filter(e => e.eventType === req.query.type);
    }

    // Filter by validated status
    if (req.query.validated !== undefined) {
      const validated = req.query.validated === 'true';
      events = events.filter(e => e.validated === validated);
    }

    // Sort by timestamp descending (newest first)
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error('[Server] Error fetching events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
});

// GET /api/events/latest - Returns events from last 2 hours only
app.get('/api/events/latest', (_req: Request, res: Response) => {
  try {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const events = getEventsSince(twoHoursAgo);

    // Sort by timestamp descending (newest first)
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error('[Server] Error fetching latest events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest events'
    });
  }
});

// GET /api/status - Returns system status
app.get('/api/status', (_req: Request, res: Response) => {
  try {
    const events = getEvents();
    const agentLog = getAgentLog();

    const getAgentStatus = (agentId: string): AgentStatus => {
      const runs = agentLog.filter(r => r.agentId === agentId);
      const lastRun = runs[runs.length - 1];

      return {
        lastRun: lastRun?.runAt || null,
        isRunning: false,
        lastError: lastRun?.errors[0] || null
      };
    };

    const status: SystemStatus = {
      lastRun: agentLog[agentLog.length - 1]?.runAt || new Date().toISOString(),
      eventCount: events.length,
      agentStatus: {
        newsScanner: getAgentStatus('newsScanner'),
        osintMonitor: getAgentStatus('osintMonitor'),
        shippingMonitor: getAgentStatus('shippingMonitor'),
        validator: getAgentStatus('validator'),
        geocoder: getAgentStatus('geocoder')
      }
    };

    res.json({
      success: true,
      status
    });
  } catch (error) {
    console.error('[Server] Error fetching status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch status'
    });
  }
});

// GET /api/shipping - Returns shipping-specific events
app.get('/api/shipping', (_req: Request, res: Response) => {
  try {
    const events = getEvents().filter(
      e => e.source === 'shippingMonitor' ||
           e.eventType === 'naval' ||
           e.eventType === 'economic'
    );

    // Sort by timestamp descending
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error('[Server] Error fetching shipping events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch shipping events'
    });
  }
});

// GET /api/market - Proxy for oil prices (avoids CORS)
app.get('/api/market', async (_req: Request, res: Response) => {
  try {
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    // Return cached data if still fresh
    if (marketCache.data && Date.now() - marketCache.fetchedAt < CACHE_TTL) {
      return res.json({ success: true, ...marketCache.data, cached: true });
    }

    // Fetch fresh data from Yahoo Finance with 8 second timeout and proper headers
    const fetchOptions = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(8000)
    };

    const [brentRes, wtiRes] = await Promise.all([
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/BZ=F?interval=1d&range=1d', fetchOptions),
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/CL=F?interval=1d&range=1d', fetchOptions)
    ]);

    const brentData = await brentRes.json() as { chart?: { result?: Array<{ meta?: { regularMarketPrice?: number; previousClose?: number } }> } };
    const wtiData = await wtiRes.json() as { chart?: { result?: Array<{ meta?: { regularMarketPrice?: number; previousClose?: number } }> } };

    const brentMeta = brentData?.chart?.result?.[0]?.meta;
    const wtiMeta = wtiData?.chart?.result?.[0]?.meta;

    if (!brentMeta?.regularMarketPrice || !wtiMeta?.regularMarketPrice) {
      throw new Error('Invalid market data response');
    }

    const brent = brentMeta.regularMarketPrice;
    const brentPrev = brentMeta.previousClose || brent;
    const wti = wtiMeta.regularMarketPrice;
    const wtiPrev = wtiMeta.previousClose || wti;

    const data = {
      brent,
      wti,
      brentChange: ((brent - brentPrev) / brentPrev) * 100,
      wtiChange: ((wti - wtiPrev) / wtiPrev) * 100,
      timestamp: new Date().toISOString()
    };

    // Update cache
    marketCache = { data, fetchedAt: Date.now() };

    console.log(`[Server] Market data: Brent $${brent.toFixed(2)}, WTI $${wti.toFixed(2)}`);
    res.json({ success: true, ...data, cached: false });
  } catch (error) {
    console.error('[Server] Error fetching market data:', error);
    // Return cached data if available, even if stale
    if (marketCache.data) {
      return res.json({ success: true, ...marketCache.data, cached: true, stale: true });
    }
    // Return static fallback if no cache available
    console.log('[Server] Using static fallback market data');
    res.json({
      success: true,
      brent: 108.75,
      wti: 108.62,
      brentChange: 0,
      wtiChange: 0,
      timestamp: new Date().toISOString(),
      cached: true,
      static: true
    });
  }
});

// GET /api/vessels - Vessel position approximations from shipping events
app.get('/api/vessels', (_req: Request, res: Response) => {
  try {
    const events = getEvents().filter(
      e => (e.eventType === 'naval' || e.source === 'shippingMonitor') &&
           e.lat !== null && e.lon !== null
    );

    // Convert events to vessel-like positions
    const vessels = events.slice(0, 50).map((e, i) => ({
      mmsi: `EVENT-${e.id}`,
      name: e.rawHeadline || `Naval Event ${i + 1}`,
      lat: e.lat,
      lon: e.lon,
      speed: 0,
      heading: 0,
      shipType: e.eventType === 'naval' ? 35 : 80, // military or tanker
      lastUpdate: e.timestamp,
      source: 'event-derived'
    }));

    res.json({
      success: true,
      count: vessels.length,
      vessels,
      note: 'Derived from conflict events - not live AIS data'
    });
  } catch (error) {
    console.error('[Server] Error fetching vessels:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch vessels' });
  }
});

// POST /api/sitrep - Generate situation report
app.post('/api/sitrep', async (_req: Request, res: Response) => {
  try {
    const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

    // Return cached SITREP if still fresh
    if (sitrepCache.data && Date.now() - sitrepCache.fetchedAt < CACHE_TTL) {
      return res.json({ success: true, ...sitrepCache.data, cached: true });
    }

    // Get validated events for analysis
    const events = getValidatedEvents().slice(0, 20);

    if (events.length === 0) {
      return res.json({
        success: true,
        summary: 'Insufficient validated events for situation report generation.',
        generatedAt: new Date().toISOString(),
        cached: false
      });
    }

    // Calculate conflict day
    const conflictStart = new Date('2026-02-28T00:00:00Z');
    const now = new Date();
    const conflictDay = Math.max(1, Math.floor((now.getTime() - conflictStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    // Prepare event summary for Claude
    const eventSummary = events.map(e =>
      `- ${e.eventType.toUpperCase()}: ${e.summary} (${e.location}, ${new Date(e.timestamp).toLocaleDateString()})`
    ).join('\n');

    // Count event types
    const typeCounts = events.reduce((acc, e) => {
      acc[e.eventType] = (acc[e.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const anthropic = new Anthropic();

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: `You are an intelligence analyst writing situation reports for The Fulcrum Memo, a conflict analysis publication. Write in clear, direct intelligence memo style. No fluff. Data-driven. Use specific numbers and facts from the events provided.`,
      messages: [{
        role: 'user',
        content: `Generate a 3-paragraph situation report for Day ${conflictDay} of Operation Epic Fury (US-Iran conflict).

Event statistics:
${Object.entries(typeCounts).map(([type, count]) => `- ${type}: ${count} events`).join('\n')}

Recent events:
${eventSummary}

Format as 3 paragraphs:
1. Current operational situation (strikes, naval actions)
2. Economic/infrastructure impact (oil, shipping, insurance)
3. Trajectory assessment (escalation vs de-escalation indicators)

Start with "As of Day ${conflictDay}..."`
      }]
    });

    const summary = message.content[0].type === 'text' ? message.content[0].text : '';

    const data = {
      summary,
      generatedAt: new Date().toISOString(),
      eventCount: events.length,
      conflictDay
    };

    // Update cache
    sitrepCache = { data, fetchedAt: Date.now() };

    console.log('[Server] Generated new SITREP');
    res.json({ success: true, ...data, cached: false });
  } catch (error) {
    console.error('[Server] Error generating SITREP:', error);
    // Return cached data if available
    if (sitrepCache.data) {
      return res.json({ success: true, ...sitrepCache.data, cached: true, stale: true });
    }
    res.status(500).json({ success: false, error: 'Failed to generate SITREP' });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    service: 'worldview-fm-agents'
  });
});

export function startServer(skipAgents = false): void {
  app.listen(PORT, () => {
    console.log(`[Server] Agent API server running on http://localhost:${PORT}`);
    console.log(`[Server] Endpoints available:`);
    console.log(`  GET  /api/events        - All events with filters`);
    console.log(`  GET  /api/events/latest - Events from last 2 hours`);
    console.log(`  GET  /api/status        - System status`);
    console.log(`  GET  /api/shipping      - Shipping events only`);
    console.log(`  GET  /api/market        - Oil prices (proxy)`);
    console.log(`  GET  /api/vessels       - Vessel positions`);
    console.log(`  POST /api/sitrep        - Generate situation report`);
    console.log(`  GET  /api/health        - Health check`);

    // Start agent orchestrator unless skipped (e.g., when called from orchestrator.ts)
    if (!skipAgents) {
      console.log('[Server] Starting agent orchestrator...');
      initializeAgents().catch(err => {
        console.error('[Server] Failed to initialize agents:', err);
      });
    }
  });
}

// Allow running server standalone
if (require.main === module) {
  dotenv.config();
  startServer();
}
