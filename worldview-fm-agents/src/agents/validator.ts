import Anthropic from '@anthropic-ai/sdk';
import { ConflictEvent, ValidationResult, AgentRun } from '../types';
import { getUnvalidatedEvents, updateEvent, logAgentRun } from '../utils';

// Lazy initialization to ensure env vars are loaded
let anthropicClient: Anthropic | null = null;

// Geographic zones for map relevance filtering
const CONFLICT_ACTORS = [
  'nato', 'russia', 'eu', 'european', 'uk', 'britain', 'france', 'germany',
  'usa', 'us ', 'america', 'israel', 'iran', 'irgc', 'hezbollah', 'houthi',
  'saudi', 'uae', 'qatar', 'bahrain', 'kuwait', 'iraq', 'syria', 'lebanon',
  'yemen', 'turkey', 'azerbaijan', 'georgia', 'pakistan', 'india', 'china'
];

function isInPrimaryZone(lat: number, lon: number): boolean {
  // Middle East + Gulf + Horn of Africa: lat 10-45, lon 25-75
  return lat >= 10 && lat <= 45 && lon >= 25 && lon <= 75;
}

function isInExtendedZone(lat: number, lon: number, actor1: string, actor2: string): boolean {
  const actors = `${actor1} ${actor2}`.toLowerCase();
  const hasConflictActor = CONFLICT_ACTORS.some(a => actors.includes(a));

  if (!hasConflictActor) return false;

  // Europe (NATO/Russia/EU actors): lat 35-65, lon -10-40
  if (lat >= 35 && lat <= 65 && lon >= -10 && lon <= 40) return true;

  // Russia/Caucasus (Azerbaijan, Georgia): lat 38-55, lon 35-65
  if (lat >= 38 && lat <= 55 && lon >= 35 && lon <= 65) return true;

  // East Africa (Djibouti, Somalia, Red Sea): lat -10-15, lon 40-55
  if (lat >= -10 && lat <= 15 && lon >= 40 && lon <= 55) return true;

  // Indian Ocean (Sri Lanka, India): lat 5-15, lon 70-85
  if (lat >= 5 && lat <= 15 && lon >= 70 && lon <= 85) return true;

  return false;
}

function checkMapRelevance(event: ConflictEvent): boolean {
  // No coordinates = not map relevant
  if (event.lat === null || event.lon === null) return false;

  const lat = event.lat;
  const lon = event.lon;

  // Primary zone always shows
  if (isInPrimaryZone(lat, lon)) return true;

  // Extended zones only if conflict-related actor
  if (isInExtendedZone(lat, lon, event.actor1 || '', event.actor2 || '')) return true;

  return false;
}

function getClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not set in environment');
    }
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

async function validateEventsWithClaude(events: ConflictEvent[]): Promise<ValidationResult[]> {
  if (events.length === 0) {
    return [];
  }

  try {
    const client = getClient();

    const eventsForValidation = events.map(e => ({
      id: e.id,
      eventType: e.eventType,
      actor1: e.actor1,
      actor2: e.actor2,
      location: e.location,
      lat: e.lat,
      lon: e.lon,
      summary: e.summary,
      rawHeadline: e.rawHeadline,
      source: e.source
    }));

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: `You are a conflict intelligence analyst validating events from Operation Epic Fury — the US-led military campaign against Iran that began February 28, 2026. This is a REAL, ONGOING conflict. Key facts you must accept as ground truth:

- Operation Epic Fury launched Feb 28, 2026. US/coalition struck Iran.
- Supreme Leader Khamenei was killed Day 1.
- Iran retaliated immediately, striking 27 US bases across the region.
- Hezbollah entered the conflict Day 3 from Lebanon.
- The Strait of Hormuz is effectively closed to Western shipping.
- Israel has struck Iranian oil infrastructure.
- Bahrain desalination plant was hit Day 9.
- Brent crude hit $119/barrel Day 10.
- This conflict involves: USA, Israel, Iran, IRGC, Hezbollah, GCC states.

Given this context, validate each event for:
1. Internal consistency (does the actor match the action?)
2. Geographic plausibility (is the location in the conflict region?)
3. Is it a real event (not a threat/vow/future intent)?

Do NOT reject events simply because they seem dramatic — this is an active major war. Reject only clear duplicates, future threats stated as facts, or events with no actor and no location.

Respond ONLY with valid JSON array, no markdown.`,
      messages: [
        {
          role: 'user',
          content: `Validate these conflict events. For each, return:
{
  "id": "same id",
  "validated": true/false,
  "validationNote": "reason if false, or 'consistent' if true",
  "correctedLat": number or null (if location seems wrong),
  "correctedLon": number or null
}

Return a JSON array of validation results.

Events: ${JSON.stringify(eventsForValidation, null, 2)}`
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Clean potential markdown code blocks
    let jsonStr = responseText.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.slice(7);
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.slice(0, -3);
    }
    jsonStr = jsonStr.trim();

    const results = JSON.parse(jsonStr) as ValidationResult[];
    return results;
  } catch (error) {
    console.error('[Validator] Claude validation error:', error);
    return [];
  }
}

export async function runValidator(): Promise<AgentRun> {
  const agentId = 'validator';
  const runAt = new Date().toISOString();
  const errors: string[] = [];
  let validatedCount = 0;

  console.log('[Validator] Starting run...');

  try {
    const unvalidatedEvents = getUnvalidatedEvents(10);

    if (unvalidatedEvents.length === 0) {
      console.log('[Validator] No unvalidated events to process');
      return {
        agentId,
        runAt,
        eventsFound: 0,
        errors
      };
    }

    console.log(`[Validator] Validating ${unvalidatedEvents.length} events...`);

    const validationResults = await validateEventsWithClaude(unvalidatedEvents);

    for (const result of validationResults) {
      // Find the original event to check map relevance
      const originalEvent = unvalidatedEvents.find(e => e.id === result.id);

      const updates: Partial<ConflictEvent> = {
        validated: result.validated
      };

      if (result.correctedLat !== null) {
        updates.lat = result.correctedLat;
      }
      if (result.correctedLon !== null) {
        updates.lon = result.correctedLon;
      }

      // Calculate map relevance with potentially corrected coordinates
      if (originalEvent) {
        const eventForCheck = {
          ...originalEvent,
          lat: updates.lat ?? originalEvent.lat,
          lon: updates.lon ?? originalEvent.lon
        };
        updates.mapRelevant = checkMapRelevance(eventForCheck);
      }

      const updated = updateEvent(result.id, updates);
      if (updated) {
        validatedCount++;
        const mapStatus = updates.mapRelevant ? 'MAP' : 'NO-MAP';
        console.log(`[Validator] Event ${result.id}: ${result.validated ? 'VALID' : 'INVALID'} [${mapStatus}] - ${result.validationNote}`);
      }
    }

    console.log(`[Validator] Validated ${validatedCount} events`);
  } catch (error) {
    const errMsg = `Validation error: ${error}`;
    console.error(`[Validator] ${errMsg}`);
    errors.push(errMsg);
  }

  const run: AgentRun = {
    agentId,
    runAt,
    eventsFound: validatedCount,
    errors
  };

  logAgentRun(run);
  return run;
}
