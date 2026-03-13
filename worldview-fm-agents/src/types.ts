export interface ConflictEvent {
  id: string;                    // hash of source+headline
  timestamp: string;             // ISO
  source: string;                // which agent found it
  sourceUrl: string;
  eventType: 'strike' | 'naval' | 'diplomatic' | 'economic' | 'infrastructure' | 'casualty';
  actor1: string;                // who did it
  actor2: string;                // who it happened to
  location: string;              // place name
  lat: number | null;            // extracted or null if agent couldn't resolve
  lon: number | null;
  summary: string;               // 1-2 sentence agent summary
  confidence: 'high' | 'medium' | 'low';
  validated: boolean;            // did validator agent confirm?
  rawHeadline: string;
  mapRelevant?: boolean;         // should this event show on the map?
}

export interface AgentRun {
  agentId: string;
  runAt: string;
  eventsFound: number;
  errors: string[];
}

export interface GeminiExtraction {
  eventType: 'strike' | 'naval' | 'diplomatic' | 'economic' | 'infrastructure' | 'casualty';
  actor1: string;
  actor2: string;
  location: string | null;
  lat: number | null;
  lon: number | null;
  summary: string;
  confidence: 'high' | 'medium' | 'low';
  isRelevantToIranConflict: boolean;
}

export interface ValidationResult {
  id: string;
  validated: boolean;
  validationNote: string;
  correctedLat: number | null;
  correctedLon: number | null;
}

export interface FeedItem {
  title: string;
  description: string;
  pubDate: Date;
  link: string;
}

export interface AgentStatus {
  lastRun: string | null;
  isRunning: boolean;
  lastError: string | null;
}

export interface SystemStatus {
  lastRun: string;
  eventCount: number;
  agentStatus: {
    newsScanner: AgentStatus;
    osintMonitor: AgentStatus;
    shippingMonitor: AgentStatus;
    validator: AgentStatus;
    geocoder: AgentStatus;
  };
}
