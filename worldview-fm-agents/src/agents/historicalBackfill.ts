import fetch from 'node-fetch';
import { ConflictEvent, AgentRun } from '../types';
import { getEvents, addEvents, logAgentRun, createEventId } from '../utils';
import { runNewsScanner } from './newsScanner';

// ACLED API configuration
const ACLED_API_URL = 'https://api.acleddata.com/acled/read';

// Anchor events - verified historical events from Operation Epic Fury
// These are written directly on startup to seed the database
// IDs are unique hashes to prevent collision with extracted events
const ANCHOR_EVENTS: ConflictEvent[] = [
  // Day 1 - Feb 28
  {
    id: 'anchor-d1-khamenei-killed',
    timestamp: '2026-02-28T04:30:00.000Z',
    source: 'anchor-event',
    sourceUrl: 'https://www.reuters.com',
    eventType: 'strike',
    actor1: 'US Air Force',
    actor2: 'Iranian Supreme Leader',
    location: 'Tehran, Iran',
    lat: 35.6892,
    lon: 51.3890,
    summary: 'Operation Epic Fury begins. US precision strike kills Supreme Leader Khamenei in Tehran.',
    confidence: 'high',
    validated: true,
    rawHeadline: 'US launches Operation Epic Fury; Khamenei killed in opening strike'
  },
  {
    id: 'anchor-d1-iran-retaliation-27bases',
    timestamp: '2026-02-28T08:00:00.000Z',
    source: 'anchor-event',
    sourceUrl: 'https://www.reuters.com',
    eventType: 'strike',
    actor1: 'IRGC',
    actor2: 'US Military Bases',
    location: 'Middle East Region',
    lat: 29.3117,
    lon: 47.4818,
    summary: 'Iran retaliates with ballistic missile strikes on 27 US bases across the region.',
    confidence: 'high',
    validated: true,
    rawHeadline: 'Iran launches massive retaliation against US bases'
  },
  {
    id: 'anchor-d1-aludeid-struck',
    timestamp: '2026-02-28T08:15:00.000Z',
    source: 'anchor-event',
    sourceUrl: 'https://www.reuters.com',
    eventType: 'strike',
    actor1: 'Iran/IRGC',
    actor2: 'Al Udeid Air Base',
    location: 'Al Udeid, Qatar',
    lat: 25.1173,
    lon: 51.3147,
    summary: 'Al Udeid Air Base struck — largest US air base in Middle East.',
    confidence: 'high',
    validated: true,
    rawHeadline: 'Al Udeid Air Base hit by Iranian missiles'
  },
  {
    id: 'anchor-d1-nsa-bahrain-struck',
    timestamp: '2026-02-28T08:30:00.000Z',
    source: 'anchor-event',
    sourceUrl: 'https://www.reuters.com',
    eventType: 'strike',
    actor1: 'Iran/IRGC',
    actor2: 'NSA Bahrain',
    location: 'Manama, Bahrain',
    lat: 26.2285,
    lon: 50.6105,
    summary: 'Naval Support Activity Bahrain struck by Iranian missiles Day 1.',
    confidence: 'high',
    validated: true,
    rawHeadline: 'NSA Bahrain hit in Iranian missile barrage'
  },
  // Day 2 - Mar 1
  {
    id: 'anchor-d2-hormuz-mined',
    timestamp: '2026-03-01T06:00:00.000Z',
    source: 'anchor-event',
    sourceUrl: 'https://www.reuters.com',
    eventType: 'naval',
    actor1: 'IRGC Navy',
    actor2: 'Commercial Shipping',
    location: 'Strait of Hormuz',
    lat: 26.5667,
    lon: 56.2500,
    summary: 'IRGC Navy mines Strait of Hormuz. All western-flagged tankers halt transit.',
    confidence: 'high',
    validated: true,
    rawHeadline: 'Strait of Hormuz effectively closed to Western shipping'
  },
  // Day 3 - Mar 2
  {
    id: 'anchor-d3-hezbollah-enters',
    timestamp: '2026-03-02T14:00:00.000Z',
    source: 'anchor-event',
    sourceUrl: 'https://www.aljazeera.com',
    eventType: 'strike',
    actor1: 'Hezbollah',
    actor2: 'Israel',
    location: 'Northern Israel',
    lat: 32.9648,
    lon: 35.4956,
    summary: 'Hezbollah enters conflict from Lebanon. Sustained rocket barrages on Northern Israel begin.',
    confidence: 'high',
    validated: true,
    rawHeadline: 'Hezbollah joins war with massive strike on Israel'
  },
  // Day 5 - Mar 4
  {
    id: 'anchor-d5-bushehr-interned',
    timestamp: '2026-03-04T10:00:00.000Z',
    source: 'anchor-event',
    sourceUrl: 'https://www.reuters.com',
    eventType: 'naval',
    actor1: 'Sri Lanka',
    actor2: 'IRIS Bushehr',
    location: 'Colombo, Sri Lanka',
    lat: 6.9271,
    lon: 79.8612,
    summary: 'IRIS Bushehr interned by Sri Lanka. First warship interned in neutral country since WWII.',
    confidence: 'high',
    validated: true,
    rawHeadline: 'Iranian warship interned in Colombo'
  },
  // Day 6 - Mar 5
  {
    id: 'anchor-d6-kharg-island-strike',
    timestamp: '2026-03-05T10:00:00.000Z',
    source: 'anchor-event',
    sourceUrl: 'https://www.reuters.com',
    eventType: 'strike',
    actor1: 'Israeli Air Force',
    actor2: 'Iranian Oil Infrastructure',
    location: 'Kharg Island, Iran',
    lat: 29.2333,
    lon: 50.3167,
    summary: 'Israeli jets strike Kharg Island oil terminal, Iran\'s main export facility.',
    confidence: 'high',
    validated: true,
    rawHeadline: 'Israel strikes Iranian oil infrastructure at Kharg Island'
  },
  {
    id: 'anchor-d6-pni-expires',
    timestamp: '2026-03-05T23:59:00.000Z',
    source: 'anchor-event',
    sourceUrl: 'https://www.lloydslist.com',
    eventType: 'economic',
    actor1: 'P&I Clubs',
    actor2: 'Shipping Industry',
    location: 'Persian Gulf',
    lat: 26.0,
    lon: 53.0,
    summary: 'War risk P&I coverage expires at midnight. Zero Western tanker transits. 200+ tankers stranded, 60 VLCCs trapped — 8% of global fleet. VLCC rates hit $440-460K/day all-time record.',
    confidence: 'high',
    validated: true,
    rawHeadline: 'P&I coverage expires; tanker fleet stranded'
  },
  {
    id: 'anchor-d6-azerbaijan-struck',
    timestamp: '2026-03-05T18:00:00.000Z',
    source: 'anchor-event',
    sourceUrl: 'https://www.reuters.com',
    eventType: 'strike',
    actor1: 'Iran Proxy',
    actor2: 'Azerbaijan',
    location: 'Baku, Azerbaijan',
    lat: 40.4093,
    lon: 49.8671,
    summary: 'Azerbaijan infrastructure struck. Geographic escalation beyond core Middle East theater.',
    confidence: 'high',
    validated: true,
    rawHeadline: 'Azerbaijan hit as conflict spreads'
  },
  // Day 7 - Mar 6
  {
    id: 'anchor-d7-selective-hormuz',
    timestamp: '2026-03-06T12:00:00.000Z',
    source: 'anchor-event',
    sourceUrl: 'https://www.reuters.com',
    eventType: 'naval',
    actor1: 'Iran/China',
    actor2: 'Western Shipping',
    location: 'Strait of Hormuz',
    lat: 26.5669,
    lon: 56.2526,
    summary: 'Selective Hormuz access emerges. China and Iran-linked vessels transiting while Western shipping blocked. De facto two-tier strait.',
    confidence: 'high',
    validated: true,
    rawHeadline: 'Two-tier Hormuz: Chinese vessels transit while West blocked'
  },
  // Day 8 - Mar 7
  {
    id: 'anchor-d8-israel-400targets',
    timestamp: '2026-03-07T04:00:00.000Z',
    source: 'anchor-event',
    sourceUrl: 'https://www.timesofisrael.com',
    eventType: 'strike',
    actor1: 'Israel',
    actor2: 'Iran',
    location: 'Iran',
    lat: 32.4279,
    lon: 53.6880,
    summary: 'Israel strikes 400+ targets with 1465 munitions. GPS jamming affects 1650+ ships in region.',
    confidence: 'high',
    validated: true,
    rawHeadline: 'Israel launches massive 400-target strike on Iran'
  },
  {
    id: 'anchor-d8-kurdish-offensive',
    timestamp: '2026-03-07T14:00:00.000Z',
    source: 'anchor-event',
    sourceUrl: 'https://www.reuters.com',
    eventType: 'strike',
    actor1: 'Kurdish Forces',
    actor2: 'Iraq/Syria',
    location: 'Kurdistan, Iraq',
    lat: 36.1901,
    lon: 44.0091,
    summary: 'Kurdish ground offensive launches in Northern Iraq. Conflict enters ground phase.',
    confidence: 'high',
    validated: true,
    rawHeadline: 'Kurdish forces launch ground offensive'
  },
  // Day 9 - Mar 8
  {
    id: 'anchor-d9-hidd-desal',
    timestamp: '2026-03-08T03:00:00.000Z',
    source: 'anchor-event',
    sourceUrl: 'https://www.bbc.com',
    eventType: 'infrastructure',
    actor1: 'Iran/IRGC',
    actor2: 'Bahrain',
    location: 'Hidd, Bahrain',
    lat: 26.1696,
    lon: 50.5583,
    summary: 'Bahrain Hidd desalination plant struck. Bapco declares force majeure. First successful strike on GCC water infrastructure.',
    confidence: 'high',
    validated: true,
    rawHeadline: 'Bahrain desalination plant destroyed'
  },
  {
    id: 'anchor-d9-bandarabbas-strike',
    timestamp: '2026-03-08T16:00:00.000Z',
    source: 'anchor-event',
    sourceUrl: 'https://www.reuters.com',
    eventType: 'strike',
    actor1: 'Israel',
    actor2: 'Iranian Oil',
    location: 'Bandar Abbas, Iran',
    lat: 27.1832,
    lon: 56.2666,
    summary: 'Israel strikes Iranian oil infrastructure for first time. Bandar Abbas port and refinery targeted.',
    confidence: 'high',
    validated: true,
    rawHeadline: 'Israel hits Bandar Abbas port and refinery'
  },
  // Day 10 - Mar 9
  {
    id: 'anchor-d10-oil-119',
    timestamp: '2026-03-09T14:00:00.000Z',
    source: 'anchor-event',
    sourceUrl: 'https://www.bloomberg.com',
    eventType: 'economic',
    actor1: 'Oil Markets',
    actor2: 'Global Economy',
    location: 'Dubai, UAE',
    lat: 25.2048,
    lon: 55.2708,
    summary: 'Brent crude hits $119.50 intraday. WTI largest single-day dollar gain since 1988. KOSPI worst day in history -12.1%. G7 emergency session convened.',
    confidence: 'high',
    validated: true,
    rawHeadline: 'Oil surges past $119; global markets crater'
  },
  // Day 11 - Mar 10
  {
    id: 'anchor-d11-beirut-hotel',
    timestamp: '2026-03-10T16:56:00.000Z',
    source: 'anchor-event',
    sourceUrl: 'https://www.bbc.com',
    eventType: 'strike',
    actor1: 'Israeli Air Force',
    actor2: 'IRGC Quds Force',
    location: 'Beirut, Lebanon',
    lat: 33.8938,
    lon: 35.5018,
    summary: 'Israeli airstrike hits luxury hotel in central Beirut targeting IRGC Quds Force meeting.',
    confidence: 'high',
    validated: true,
    rawHeadline: 'Israel strikes Beirut hotel targeting Iranian operatives'
  }
];

// Countries relevant to the Iran/Gulf conflict
const CONFLICT_COUNTRIES = [
  'Iran',
  'Iraq',
  'Israel',
  'Lebanon',
  'Syria',
  'Yemen',
  'Saudi Arabia',
  'United Arab Emirates',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Turkey',
  'Azerbaijan',
  'Pakistan'
];

// Map ACLED event types to our event types
function mapACLEDEventType(acledType: string, acledSubType: string): ConflictEvent['eventType'] {
  const type = acledType.toLowerCase();
  const subType = acledSubType.toLowerCase();

  if (type.includes('battle') || type.includes('explosion') || subType.includes('airstrike') || subType.includes('shelling')) {
    return 'strike';
  }
  if (type.includes('violence against civilians') || subType.includes('attack')) {
    return 'casualty';
  }
  if (type.includes('protest') || type.includes('riot')) {
    return 'diplomatic';
  }
  if (subType.includes('mob') || subType.includes('destruction')) {
    return 'infrastructure';
  }
  return 'strike'; // Default to strike for conflict events
}

interface ACLEDEvent {
  event_id_cnty: string;
  event_date: string;
  event_type: string;
  sub_event_type: string;
  actor1: string;
  actor2: string;
  country: string;
  admin1: string;
  location: string;
  latitude: string;
  longitude: string;
  notes: string;
  fatalities: string;
  source: string;
}

async function fetchACLEDData(): Promise<ACLEDEvent[]> {
  try {
    // Date range: 2026-02-28 to today
    const startDate = '2026-02-28';
    const endDate = new Date().toISOString().split('T')[0];

    const countriesParam = CONFLICT_COUNTRIES.join('|');

    const url = new URL(ACLED_API_URL);
    url.searchParams.set('event_date', `${startDate}|${endDate}`);
    url.searchParams.set('event_date_where', 'BETWEEN');
    url.searchParams.set('country', countriesParam);
    url.searchParams.set('country_where', 'IN');
    url.searchParams.set('limit', '2000');

    console.log(`[HistoricalBackfill] Fetching ACLED data from ${startDate} to ${endDate}...`);
    console.log(`[HistoricalBackfill] URL: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'WorldViewFM-ConflictIntel/1.0'
      },
      timeout: 60000
    });

    if (!response.ok) {
      console.error(`[HistoricalBackfill] ACLED API error: ${response.status}`);
      return [];
    }

    const data = await response.json() as { success: boolean; data: ACLEDEvent[] };

    if (!data.success || !data.data) {
      console.error('[HistoricalBackfill] ACLED API returned unsuccessful response');
      return [];
    }

    console.log(`[HistoricalBackfill] ACLED returned ${data.data.length} events`);
    return data.data;
  } catch (error) {
    console.error('[HistoricalBackfill] Error fetching ACLED data:', error);
    return [];
  }
}

function acledToConflictEvent(acled: ACLEDEvent): ConflictEvent {
  const eventId = createEventId('acled', acled.event_id_cnty);

  // Create summary from notes or construct one
  let summary = acled.notes;
  if (!summary || summary.length < 10) {
    summary = `${acled.event_type} involving ${acled.actor1}${acled.actor2 ? ` and ${acled.actor2}` : ''} in ${acled.location}, ${acled.country}`;
  }
  if (summary.length > 200) {
    summary = summary.substring(0, 197) + '...';
  }

  return {
    id: eventId,
    timestamp: new Date(acled.event_date).toISOString(),
    source: 'acled-backfill',
    sourceUrl: `https://acleddata.com/data-export-tool/`,
    eventType: mapACLEDEventType(acled.event_type, acled.sub_event_type),
    actor1: acled.actor1 || 'Unknown',
    actor2: acled.actor2 || 'Unknown',
    location: `${acled.location}, ${acled.admin1}, ${acled.country}`,
    lat: parseFloat(acled.latitude) || null,
    lon: parseFloat(acled.longitude) || null,
    summary,
    confidence: 'high', // ACLED data is professionally verified
    validated: true, // ACLED is authoritative
    rawHeadline: `${acled.event_type}: ${acled.sub_event_type}`
  };
}

export async function runHistoricalBackfill(): Promise<AgentRun> {
  const agentId = 'historicalBackfill';
  const runAt = new Date().toISOString();
  const errors: string[] = [];
  let totalAdded = 0;

  console.log('[HistoricalBackfill] ========== STARTING HISTORICAL BACKFILL ==========');

  // Always write anchor events first (they dedupe automatically)
  console.log('[HistoricalBackfill] Writing anchor events...');
  const anchorAdded = addEvents(ANCHOR_EVENTS);
  totalAdded += anchorAdded;
  console.log(`[HistoricalBackfill] Added ${anchorAdded} anchor events`);

  // Check if we need more backfill
  const existingEvents = getEvents();
  if (existingEvents.length >= 50) {
    console.log(`[HistoricalBackfill] Already have ${existingEvents.length} events, skipping additional backfill`);
    return {
      agentId,
      runAt,
      eventsFound: totalAdded,
      errors: []
    };
  }

  console.log(`[HistoricalBackfill] Have ${existingEvents.length} events, running additional backfill...`);

  // 1. Fetch ACLED historical data
  try {
    const acledEvents = await fetchACLEDData();

    if (acledEvents.length > 0) {
      const conflictEvents = acledEvents.map(acledToConflictEvent);
      const addedCount = addEvents(conflictEvents);
      totalAdded += addedCount;
      console.log(`[HistoricalBackfill] Added ${addedCount} ACLED events`);
    }
  } catch (error) {
    const errMsg = `ACLED backfill error: ${error}`;
    console.error(`[HistoricalBackfill] ${errMsg}`);
    errors.push(errMsg);
  }

  // 2. Run news scanner with extended time window (480 hours = 20 days)
  try {
    console.log('[HistoricalBackfill] Running extended news scan (20 days)...');
    const newsRun = await runNewsScanner(480);
    totalAdded += newsRun.eventsFound;
    console.log(`[HistoricalBackfill] News scan added ${newsRun.eventsFound} events`);
  } catch (error) {
    const errMsg = `News backfill error: ${error}`;
    console.error(`[HistoricalBackfill] ${errMsg}`);
    errors.push(errMsg);
  }

  console.log(`[HistoricalBackfill] ========== BACKFILL COMPLETE — ${totalAdded} events loaded ==========`);

  const run: AgentRun = {
    agentId,
    runAt,
    eventsFound: totalAdded,
    errors
  };

  logAgentRun(run);
  return run;
}

// Check if backfill is needed
export function needsBackfill(): boolean {
  const events = getEvents();
  return events.length < 50;
}
