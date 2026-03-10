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

// Market snapshot data
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
  conflictDay: 10,
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

// Predictions scorecard
export const predictions: Prediction[] = [
  {
    id: 'pred-1',
    prediction: 'Hormuz closure within 72h of conflict initiation',
    status: 'confirmed',
    date: 'Day 1'
  },
  {
    id: 'pred-2',
    prediction: 'Brent spike above $100/bbl',
    status: 'confirmed',
    date: 'Day 1'
  },
  {
    id: 'pred-3',
    prediction: 'GCC desalination infrastructure targeted',
    status: 'confirmed',
    date: 'Day 9'
  },
  {
    id: 'pred-4',
    prediction: 'VLCC rates exceed $400K/day',
    status: 'confirmed',
    date: 'Day 3'
  },
  {
    id: 'pred-5',
    prediction: 'HY spreads widen 150+ bps',
    status: 'confirmed',
    date: 'Day 5'
  },
  {
    id: 'pred-6',
    prediction: 'Iranian naval assets neutralized',
    status: 'confirmed',
    date: 'Day 2-4'
  },
  {
    id: 'pred-7',
    prediction: 'Saudi infrastructure strike attempt',
    status: 'tracking'
  },
  {
    id: 'pred-8',
    prediction: 'China diplomatic intervention',
    status: 'tracking'
  }
];

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
