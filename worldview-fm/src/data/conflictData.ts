import type { ConflictEvent, VesselData, MarketData, ScenarioProbability, Prediction, DataSource } from '../types';

// Conflict Events - Operation Epic Fury
export const conflictEvents: ConflictEvent[] = [
  {
    id: 'hormuz-chokepoint',
    name: 'Strait of Hormuz',
    category: 'chokepoint',
    coordinates: [26.5, 56.2],
    description: 'Critical chokepoint - 21% of global oil transit. ZERO Western transits since Day 1.',
    status: 'confirmed'
  },
  {
    id: 'bahrain-desal',
    name: 'Bahrain Desalination Strike',
    category: 'strike',
    coordinates: [26.2285, 50.5860],
    day: 9,
    description: 'Iranian strike on Bahrain desalination infrastructure. Critical water supply disruption.',
    status: 'confirmed'
  },
  {
    id: 'iris-jamaran',
    name: 'IRIS Jamaran Sinking',
    category: 'naval',
    coordinates: [26.8, 55.5],
    description: 'Iranian frigate IRIS Jamaran sunk by US naval forces.',
    status: 'confirmed'
  },
  {
    id: 'iris-dena',
    name: 'IRIS Dena Sinking',
    category: 'naval',
    coordinates: [26.6, 55.8],
    description: 'Iranian frigate IRIS Dena sunk by US naval forces.',
    status: 'confirmed'
  },
  {
    id: 'iris-bushehr',
    name: 'IRIS Bushehr Internment',
    category: 'naval',
    coordinates: [6.9271, 79.8612], // Colombo, Sri Lanka
    description: 'Iranian vessel IRIS Bushehr interned at Colombo, Sri Lanka.',
    status: 'confirmed'
  },
  {
    id: 'azerbaijan-strike',
    name: 'Azerbaijan Strike',
    category: 'strike',
    coordinates: [40.4093, 49.8671],
    description: 'Israeli strike on Iranian assets in Azerbaijan.',
    status: 'confirmed'
  },
  {
    id: 'uae-desal',
    name: 'UAE Desalination Infrastructure',
    category: 'infrastructure',
    coordinates: [24.4539, 54.3773],
    description: 'Critical GCC desalination infrastructure - potential target.',
    status: 'tracking'
  },
  {
    id: 'qatar-desal',
    name: 'Qatar Desalination Infrastructure',
    category: 'infrastructure',
    coordinates: [25.2854, 51.5310],
    description: 'Critical GCC desalination infrastructure - potential target.',
    status: 'tracking'
  },
  {
    id: 'kuwait-desal',
    name: 'Kuwait Desalination Infrastructure',
    category: 'infrastructure',
    coordinates: [29.3759, 47.9774],
    description: 'Critical GCC desalination infrastructure - potential target.',
    status: 'tracking'
  },
  {
    id: 'iran-oil-kharg',
    name: 'Kharg Island Oil Terminal',
    category: 'infrastructure',
    coordinates: [29.2333, 50.3167],
    description: 'Iranian oil export terminal - 90% of Iranian oil exports. Israeli strike target Day 9.',
    status: 'confirmed'
  },
  {
    id: 'iran-oil-bandar',
    name: 'Bandar Abbas Refinery',
    category: 'infrastructure',
    coordinates: [27.1832, 56.2666],
    description: 'Major Iranian refinery complex.',
    status: 'tracking'
  },
  {
    id: 'us-bases-strike',
    name: 'US Regional Bases (27 locations)',
    category: 'strike',
    coordinates: [25.4052, 55.5136], // UAE - representative marker
    day: 1,
    description: 'Day 1: Iranian ballistic missile strikes on 27 US military installations across the region.',
    status: 'confirmed'
  },
  {
    id: 'al-udeid',
    name: 'Al Udeid Air Base',
    category: 'strike',
    coordinates: [25.1173, 51.3150],
    day: 1,
    description: 'US Air Force base in Qatar - Iranian strike target Day 1.',
    status: 'confirmed'
  },
  {
    id: 'al-dhafra',
    name: 'Al Dhafra Air Base',
    category: 'strike',
    coordinates: [24.2481, 54.5475],
    day: 1,
    description: 'US Air Force base in UAE - Iranian strike target Day 1.',
    status: 'confirmed'
  }
];

// Static vessel positions near Hormuz (stub data for AIS)
export const vesselData: VesselData[] = [
  {
    mmsi: '538006789',
    name: 'PACIFIC VOYAGER',
    type: 'VLCC',
    coordinates: [26.3, 56.8],
    heading: 270,
    speed: 0,
    destination: 'HOLDING',
    flag: 'Marshall Islands'
  },
  {
    mmsi: '477123456',
    name: 'OCEAN TITAN',
    type: 'VLCC',
    coordinates: [25.8, 57.2],
    heading: 315,
    speed: 0,
    destination: 'HOLDING',
    flag: 'Hong Kong'
  },
  {
    mmsi: '636091234',
    name: 'ENERGY SPIRIT',
    type: 'LNG Carrier',
    coordinates: [26.7, 56.0],
    heading: 180,
    speed: 0,
    destination: 'HOLDING',
    flag: 'Liberia'
  },
  {
    mmsi: '215678901',
    name: 'GOLDEN CROWN',
    type: 'VLCC',
    coordinates: [25.5, 57.5],
    heading: 90,
    speed: 0,
    destination: 'FUJAIRAH',
    flag: 'Malta'
  },
  {
    mmsi: '311234567',
    name: 'IRGC PATROL 1',
    type: 'Military',
    coordinates: [26.5, 56.3],
    heading: 45,
    speed: 12,
    flag: 'Iran'
  }
];

// Conflict start date
export const CONFLICT_START = new Date('2026-02-28T00:00:00Z');

// Calculate current conflict day dynamically
export function getConflictDay(): number {
  const now = new Date();
  const diffMs = now.getTime() - CONFLICT_START.getTime();
  return Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);
}

// Market snapshot data - conflictDay is now a getter
export const marketData: MarketData = {
  brent: 108.75,
  brentHigh: 119.50,
  wti: 108.62,
  tenYearYield: 4.13,
  vix: 29.48,
  hySpread: 470,
  hySpreadBaseline: 281,
  vlccRate: '$440-460K/day',
  hormuzTransits: 0,
  get conflictDay() { return getConflictDay(); },
  lastUpdated: new Date().toISOString()
};

// Scenario probabilities
export const scenarios: ScenarioProbability[] = [
  {
    name: 'Quick Resolution',
    probability: 2,
    description: 'Diplomatic off-ramp within 30 days'
  },
  {
    name: 'Protracted Attrition',
    probability: 45,
    description: 'Extended standoff, gradual de-escalation over 3-6 months'
  },
  {
    name: 'Full Escalation',
    probability: 53,
    description: 'Expanded conflict, regional involvement, sustained disruption'
  }
];

// Predictions scorecard - base definitions
// Status is evaluated dynamically based on events
export interface PredictionRule {
  id: string;
  prediction: string;
  // Function to check if prediction is confirmed based on events
  checkFn: (events: AgentEventLike[]) => { confirmed: boolean; date?: string };
}

// Simplified event interface for prediction checking
interface AgentEventLike {
  id: string;
  timestamp: string;
  eventType: string;
  location?: string;
  summary?: string;
  lat?: number | null;
  lon?: number | null;
}

// Helper to get day number from event timestamp
function getDayFromTimestamp(timestamp: string): number {
  const eventDate = new Date(timestamp);
  const diffMs = eventDate.getTime() - CONFLICT_START.getTime();
  return Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);
}

// Prediction rules with event-based evaluation
export const predictionRules: PredictionRule[] = [
  {
    id: 'pred-1',
    prediction: 'Hormuz closure within 72h of conflict initiation',
    checkFn: (events) => {
      const hormuzEvent = events.find(e =>
        e.eventType === 'naval' &&
        e.location?.toLowerCase().includes('hormuz') &&
        getDayFromTimestamp(e.timestamp) <= 3
      );
      return hormuzEvent
        ? { confirmed: true, date: `Day ${getDayFromTimestamp(hormuzEvent.timestamp)}` }
        : { confirmed: false };
    }
  },
  {
    id: 'pred-2',
    prediction: 'Brent spike above $100/bbl',
    checkFn: (events) => {
      // Check for economic event mentioning oil price spike
      const oilEvent = events.find(e =>
        e.eventType === 'economic' &&
        (e.summary?.includes('$1') || e.summary?.toLowerCase().includes('spike') || e.summary?.toLowerCase().includes('brent'))
      );
      return oilEvent
        ? { confirmed: true, date: `Day ${getDayFromTimestamp(oilEvent.timestamp)}` }
        : { confirmed: false };
    }
  },
  {
    id: 'pred-3',
    prediction: 'GCC desalination infrastructure targeted',
    checkFn: (events) => {
      const desalEvent = events.find(e =>
        (e.eventType === 'infrastructure' || e.eventType === 'strike') &&
        (e.summary?.toLowerCase().includes('desal') || e.location?.toLowerCase().includes('bahrain'))
      );
      return desalEvent
        ? { confirmed: true, date: `Day ${getDayFromTimestamp(desalEvent.timestamp)}` }
        : { confirmed: false };
    }
  },
  {
    id: 'pred-4',
    prediction: 'VLCC rates exceed $400K/day',
    checkFn: (events) => {
      // Check for economic event mentioning VLCC or tanker rates
      const vlccEvent = events.find(e =>
        e.eventType === 'economic' &&
        (e.summary?.toLowerCase().includes('vlcc') || e.summary?.toLowerCase().includes('tanker'))
      );
      return vlccEvent
        ? { confirmed: true, date: `Day ${getDayFromTimestamp(vlccEvent.timestamp)}` }
        : { confirmed: false };
    }
  },
  {
    id: 'pred-5',
    prediction: 'HY spreads widen 150+ bps',
    checkFn: (events) => {
      // Check for economic/market event
      const spreadEvent = events.find(e =>
        e.eventType === 'economic' &&
        getDayFromTimestamp(e.timestamp) >= 5
      );
      return spreadEvent
        ? { confirmed: true, date: `Day ${getDayFromTimestamp(spreadEvent.timestamp)}` }
        : { confirmed: false };
    }
  },
  {
    id: 'pred-6',
    prediction: 'Iranian naval assets neutralized',
    checkFn: (events) => {
      const navalEvents = events.filter(e =>
        e.eventType === 'naval' &&
        (e.summary?.toLowerCase().includes('iran') || e.summary?.toLowerCase().includes('iris'))
      );
      if (navalEvents.length >= 2) {
        const days = navalEvents.map(e => getDayFromTimestamp(e.timestamp));
        return { confirmed: true, date: `Day ${Math.min(...days)}-${Math.max(...days)}` };
      }
      return { confirmed: false };
    }
  },
  {
    id: 'pred-7',
    prediction: 'Saudi infrastructure strike attempt',
    checkFn: (events) => {
      const saudiEvent = events.find(e =>
        (e.eventType === 'strike' || e.eventType === 'infrastructure') &&
        e.location?.toLowerCase().includes('saudi')
      );
      return saudiEvent
        ? { confirmed: true, date: `Day ${getDayFromTimestamp(saudiEvent.timestamp)}` }
        : { confirmed: false };
    }
  },
  {
    id: 'pred-8',
    prediction: 'China diplomatic intervention',
    checkFn: (events) => {
      const chinaEvent = events.find(e =>
        e.eventType === 'diplomatic' &&
        e.summary?.toLowerCase().includes('china')
      );
      return chinaEvent
        ? { confirmed: true, date: `Day ${getDayFromTimestamp(chinaEvent.timestamp)}` }
        : { confirmed: false };
    }
  }
];

// Evaluate predictions based on events and return Prediction[] format
export function evaluatePredictions(events: AgentEventLike[]): Prediction[] {
  return predictionRules.map(rule => {
    const result = rule.checkFn(events);
    return {
      id: rule.id,
      prediction: rule.prediction,
      status: result.confirmed ? 'confirmed' : 'tracking',
      date: result.date
    };
  });
}

// Legacy static predictions (fallback when no events available)
export const predictions: Prediction[] = predictionRules.map(rule => ({
  id: rule.id,
  prediction: rule.prediction,
  status: 'tracking' as const
}));

// Data sources configuration
export const dataSources: DataSource[] = [
  {
    name: 'AISStream',
    type: 'websocket',
    endpoint: 'wss://stream.aisstream.io/v0/stream',
    status: 'offline' // Stubbed for MVP
  },
  {
    name: 'OpenSky Network',
    type: 'rest',
    endpoint: 'https://opensky-network.org/api/states/all',
    updateInterval: 60000,
    status: 'offline' // Stubbed for MVP
  },
  {
    name: 'Oil Price (Alpha Vantage)',
    type: 'rest',
    endpoint: 'https://www.alphavantage.co/query',
    updateInterval: 300000,
    status: 'offline' // Stubbed for MVP
  },
  {
    name: 'Tanker Rates',
    type: 'manual',
    status: 'live'
  },
  {
    name: 'Insurance/P&I Status',
    type: 'manual',
    status: 'live'
  }
];

// Category colors for map markers
export const categoryColors: Record<string, string> = {
  strike: '#ef4444',      // Red
  naval: '#3b82f6',       // Blue
  infrastructure: '#f59e0b', // Amber
  insurance: '#8b5cf6',   // Purple
  chokepoint: '#F96302'   // Fulcrum Orange
};

// Category icons
export const categoryIcons: Record<string, string> = {
  strike: '💥',
  naval: '⚓',
  infrastructure: '🏭',
  insurance: '📋',
  chokepoint: '⚠️'
};
