import * as fs from 'fs';
import * as path from 'path';
import { ConflictEvent, AgentRun } from '../types';

const DATA_DIR = path.join(__dirname, '..', 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const EVENTS_SEED_FILE = path.join(__dirname, '..', 'data', 'events-seed.json');
const AGENT_LOG_FILE = path.join(DATA_DIR, 'agentLog.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function safeReadJSON<T>(filePath: string, defaultValue: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`[EventStore] Error reading ${filePath}, reinitializing:`, error);
    return defaultValue;
  }
}

function safeWriteJSON<T>(filePath: string, data: T): void {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function getEvents(): ConflictEvent[] {
  return safeReadJSON<ConflictEvent[]>(EVENTS_FILE, []);
}

export function saveEvents(events: ConflictEvent[]): void {
  safeWriteJSON(EVENTS_FILE, events);
}

export function addEvents(newEvents: ConflictEvent[]): number {
  const existing = getEvents();
  const existingIds = new Set(existing.map(e => e.id));

  const uniqueNew = newEvents.filter(e => !existingIds.has(e.id));

  if (uniqueNew.length > 0) {
    saveEvents([...existing, ...uniqueNew]);
  }

  return uniqueNew.length;
}

export function updateEvent(id: string, updates: Partial<ConflictEvent>): boolean {
  const events = getEvents();
  const index = events.findIndex(e => e.id === id);

  if (index === -1) {
    return false;
  }

  events[index] = { ...events[index], ...updates };
  saveEvents(events);
  return true;
}

export function getUnvalidatedEvents(limit: number = 10): ConflictEvent[] {
  return getEvents()
    .filter(e => !e.validated)
    .slice(-limit);
}

export function getEventsNeedingGeocoding(): ConflictEvent[] {
  return getEvents().filter(e => e.lat === null || e.lon === null);
}

export function getEventsSince(since: Date): ConflictEvent[] {
  return getEvents().filter(e => new Date(e.timestamp) >= since);
}

export function getEventsByType(eventType: string): ConflictEvent[] {
  return getEvents().filter(e => e.eventType === eventType);
}

export function getValidatedEvents(): ConflictEvent[] {
  return getEvents().filter(e => e.validated);
}

export function getAgentLog(): AgentRun[] {
  return safeReadJSON<AgentRun[]>(AGENT_LOG_FILE, []);
}

export function logAgentRun(run: AgentRun): void {
  const logs = getAgentLog();
  logs.push(run);

  // Keep only last 100 runs
  const trimmed = logs.slice(-100);
  safeWriteJSON(AGENT_LOG_FILE, trimmed);
}

export function eventExists(id: string): boolean {
  const events = getEvents();
  return events.some(e => e.id === id);
}

export function seedEventsIfNeeded(): boolean {
  const events = getEvents();

  // If we have more than 10 events, no need to seed
  if (events.length > 10) {
    console.log(`[EventStore] Found ${events.length} events, skipping seed`);
    return false;
  }

  // Try to load seed file
  try {
    if (!fs.existsSync(EVENTS_SEED_FILE)) {
      console.log('[EventStore] No seed file found at', EVENTS_SEED_FILE);
      return false;
    }

    const seedContent = fs.readFileSync(EVENTS_SEED_FILE, 'utf-8');
    const seedEvents = JSON.parse(seedContent) as ConflictEvent[];

    if (!Array.isArray(seedEvents) || seedEvents.length === 0) {
      console.log('[EventStore] Seed file is empty or invalid');
      return false;
    }

    // Merge seed events with existing (seed events won't overwrite existing)
    const existingIds = new Set(events.map(e => e.id));
    const newFromSeed = seedEvents.filter(e => !existingIds.has(e.id));

    if (newFromSeed.length > 0) {
      saveEvents([...events, ...newFromSeed]);
      console.log(`[EventStore] Seeded ${newFromSeed.length} baseline events (total: ${events.length + newFromSeed.length})`);
      return true;
    }

    console.log('[EventStore] All seed events already exist');
    return false;
  } catch (error) {
    console.error('[EventStore] Error seeding events:', error);
    return false;
  }
}
