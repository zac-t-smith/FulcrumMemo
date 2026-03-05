// Iran Conflict Data - Living Data Layer
// This file contains all time-series and reference data used by charts across the site.
// Designed to support Field Notes updates with timestamped scenario probability revisions.

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface TimeSeriesEntry {
  date: string;
  timestamp: number; // Unix timestamp for sorting
}

export interface HormuzTransitEntry extends TimeSeriesEntry {
  tankerCount: number;
  vlccRate: number;
  event?: string;
}

export interface CasualtyEntry extends TimeSeriesEntry {
  iranianKilled: number;
  iranianCivilian: number;
  usKilled: number;
  gccCivilian: number;
  note?: string;
}

export interface MarketEntry extends TimeSeriesEntry {
  brentCrude: number;
  wti: number;
  naturalGas: number;
  goldSpot: number;
  spx?: number;
  vix?: number;
  hySpread?: number;
  event?: string;
}

export interface GasPriceEntry extends TimeSeriesEntry {
  usAverage: number;
  california: number;
  change?: number;
  note?: string;
}

export interface AsianMarketEntry extends TimeSeriesEntry {
  nikkei: number;
  nikkeiChange: number;
  hangseng: number;
  hangsengChange: number;
  kospi: number;
  kospiChange: number;
  sensex: number;
  sensexChange: number;
  note?: string;
}

export interface InterceptorStatusEntry extends TimeSeriesEntry {
  patriotPac3Remaining: number;
  sm3Remaining: number;
  thaadRemaining: number;
  arrowRemaining: number;
  totalExpenditure: number;
  note?: string;
}

export interface ConflictGeographyEntry {
  location: string;
  lat: number;
  lng: number;
  type: 'strike' | 'damage' | 'shipping' | 'naval' | 'base';
  date: string;
  description: string;
}

export interface ScenarioProbability {
  scenario: string;
  probability: number;
}

export interface ScenarioUpdate {
  date: string;
  timestamp: number;
  day: number;
  probabilities: ScenarioProbability[];
  rationale: string;
  keyDevelopments: string[];
}

export interface CostAsymmetryItem {
  name: string;
  shortName: string;
  iranCost: number;
  interceptorCost: number;
  ratio: number;
  category: 'drone' | 'missile';
  iranLabel: string;
  interceptorLabel: string;
}

export interface SectorVulnerabilityItem {
  sector: string;
  leverage: number;
  refinancingExposure: number;
  oilSensitivity: number;
  consumerDependence: number;
  currentSpread: number;
  notes: string;
  color: string;
}

export interface HySpreadHistoryEntry {
  date: string;
  spread: number;
  event?: string;
  isCurrent?: boolean;
}

export interface ThesisScorecard {
  thesis: string;
  initialConfidence: number;
  currentConfidence: number;
  status: 'confirmed' | 'developing' | 'challenged' | 'invalidated';
  evidence: string[];
}

export interface FieldNoteDay {
  day: number;
  date: string;
  title: string;
  summary: string;
  thesisScorecard: ThesisScorecard[];
  scenarioUpdate: ScenarioUpdate;
  keyDevelopments: {
    category: string;
    items: string[];
  }[];
  marketSnapshot: {
    brentCrude: number;
    vlccRate: number;
    hySpread: number;
    vix: number;
    usGas: number;
  };
  tradingImplications: string[];
}

// =============================================================================
// TIME SERIES DATA
// =============================================================================

export const hormuzTimeline: HormuzTransitEntry[] = [
  { date: 'Feb 27', timestamp: Date.parse('2026-02-27'), tankerCount: 95, vlccRate: 78000, event: 'Pre-conflict normal' },
  { date: 'Feb 28', timestamp: Date.parse('2026-02-28'), tankerCount: 100, vlccRate: 85000, event: 'Operation Epic Fury begins' },
  { date: 'Mar 1', timestamp: Date.parse('2026-03-01'), tankerCount: 18, vlccRate: 280000, event: 'Insurance withdrawal begins' },
  { date: 'Mar 2', timestamp: Date.parse('2026-03-02'), tankerCount: 7, vlccRate: 423736, event: "Lloyd's cancellation announced" },
  { date: 'Mar 3', timestamp: Date.parse('2026-03-03'), tankerCount: 5, vlccRate: 445200, event: 'Trump announces naval escorts' },
  { date: 'Mar 4', timestamp: Date.parse('2026-03-04'), tankerCount: 4, vlccRate: 445200, event: 'P&I coverage expires midnight Mar 5' },
  { date: 'Mar 5', timestamp: Date.parse('2026-03-05'), tankerCount: 3, vlccRate: 460000, event: 'Post-P&I expiration' },
];

export const casualtyTimeline: CasualtyEntry[] = [
  { date: 'Feb 28', timestamp: Date.parse('2026-02-28'), iranianKilled: 0, iranianCivilian: 0, usKilled: 0, gccCivilian: 0, note: 'Operation begins' },
  { date: 'Mar 1', timestamp: Date.parse('2026-03-01'), iranianKilled: 245, iranianCivilian: 87, usKilled: 2, gccCivilian: 34, note: 'Initial strikes' },
  { date: 'Mar 2', timestamp: Date.parse('2026-03-02'), iranianKilled: 520, iranianCivilian: 156, usKilled: 4, gccCivilian: 89, note: 'Hezbollah enters' },
  { date: 'Mar 3', timestamp: Date.parse('2026-03-03'), iranianKilled: 780, iranianCivilian: 268, usKilled: 6, gccCivilian: 145, note: 'Minab school incident' },
  { date: 'Mar 4', timestamp: Date.parse('2026-03-04'), iranianKilled: 1045, iranianCivilian: 380, usKilled: 6, gccCivilian: 178, note: 'Naval losses' },
  { date: 'Mar 5', timestamp: Date.parse('2026-03-05'), iranianKilled: 1320, iranianCivilian: 445, usKilled: 8, gccCivilian: 212, note: 'Day 6 escalation' },
];

export const marketTimeline: MarketEntry[] = [
  { date: 'Feb 27', timestamp: Date.parse('2026-02-27'), brentCrude: 77.52, wti: 73.45, naturalGas: 3.12, goldSpot: 2845, spx: 5980, vix: 15.2, hySpread: 281 },
  { date: 'Feb 28', timestamp: Date.parse('2026-02-28'), brentCrude: 83.58, wti: 79.23, naturalGas: 3.45, goldSpot: 2912, spx: 5820, vix: 24.5, hySpread: 295, event: 'Op begins' },
  { date: 'Mar 1', timestamp: Date.parse('2026-03-01'), brentCrude: 89.45, wti: 85.12, naturalGas: 3.78, goldSpot: 2978, spx: 5645, vix: 32.1, hySpread: 325 },
  { date: 'Mar 2', timestamp: Date.parse('2026-03-02'), brentCrude: 94.80, wti: 90.55, naturalGas: 4.02, goldSpot: 3045, spx: 5520, vix: 38.4, hySpread: 358 },
  { date: 'Mar 3', timestamp: Date.parse('2026-03-03'), brentCrude: 98.20, wti: 93.85, naturalGas: 4.15, goldSpot: 3089, spx: 5480, vix: 35.8, hySpread: 372 },
  { date: 'Mar 4', timestamp: Date.parse('2026-03-04'), brentCrude: 102.45, wti: 97.80, naturalGas: 4.28, goldSpot: 3125, spx: 5395, vix: 41.2, hySpread: 395 },
  { date: 'Mar 5', timestamp: Date.parse('2026-03-05'), brentCrude: 108.20, wti: 103.45, naturalGas: 4.52, goldSpot: 3178, spx: 5280, vix: 45.8, hySpread: 425 },
];

export const gasPrices: GasPriceEntry[] = [
  { date: 'Feb 27', timestamp: Date.parse('2026-02-27'), usAverage: 3.12, california: 4.85 },
  { date: 'Feb 28', timestamp: Date.parse('2026-02-28'), usAverage: 3.18, california: 4.92, change: 0.06, note: 'Initial reaction' },
  { date: 'Mar 1', timestamp: Date.parse('2026-03-01'), usAverage: 3.45, california: 5.28, change: 0.27, note: 'Biggest jump since Ukraine' },
  { date: 'Mar 2', timestamp: Date.parse('2026-03-02'), usAverage: 3.68, california: 5.55, change: 0.23 },
  { date: 'Mar 3', timestamp: Date.parse('2026-03-03'), usAverage: 3.89, california: 5.78, change: 0.21 },
  { date: 'Mar 4', timestamp: Date.parse('2026-03-04'), usAverage: 4.12, california: 6.05, change: 0.23 },
  { date: 'Mar 5', timestamp: Date.parse('2026-03-05'), usAverage: 4.38, california: 6.35, change: 0.26, note: 'Approaching 2022 highs' },
];

export const asianMarkets: AsianMarketEntry[] = [
  { date: 'Mar 1', timestamp: Date.parse('2026-03-01'), nikkei: 38245, nikkeiChange: -3.2, hangseng: 19845, hangsengChange: -2.8, kospi: 2456, kospiChange: -2.5, sensex: 72450, sensexChange: -2.1 },
  { date: 'Mar 2', timestamp: Date.parse('2026-03-02'), nikkei: 37120, nikkeiChange: -2.9, hangseng: 19125, hangsengChange: -3.6, kospi: 2378, kospiChange: -3.2, sensex: 70890, sensexChange: -2.2 },
  { date: 'Mar 3', timestamp: Date.parse('2026-03-03'), nikkei: 36580, nikkeiChange: -1.5, hangseng: 18890, hangsengChange: -1.2, kospi: 2345, kospiChange: -1.4, sensex: 70120, sensexChange: -1.1, note: 'Naval escort announcement stabilizes' },
  { date: 'Mar 4', timestamp: Date.parse('2026-03-04'), nikkei: 35890, nikkeiChange: -1.9, hangseng: 18420, hangsengChange: -2.5, kospi: 2289, kospiChange: -2.4, sensex: 69450, sensexChange: -1.0 },
  { date: 'Mar 5', timestamp: Date.parse('2026-03-05'), nikkei: 34980, nikkeiChange: -2.5, hangseng: 17850, hangsengChange: -3.1, kospi: 2212, kospiChange: -3.4, sensex: 68780, sensexChange: -1.0, note: 'P&I expiration impact' },
];

export const interceptorStatus: InterceptorStatusEntry[] = [
  { date: 'Feb 28', timestamp: Date.parse('2026-02-28'), patriotPac3Remaining: 100, sm3Remaining: 100, thaadRemaining: 100, arrowRemaining: 100, totalExpenditure: 0 },
  { date: 'Mar 1', timestamp: Date.parse('2026-03-01'), patriotPac3Remaining: 92, sm3Remaining: 94, thaadRemaining: 97, arrowRemaining: 88, totalExpenditure: 450000000 },
  { date: 'Mar 2', timestamp: Date.parse('2026-03-02'), patriotPac3Remaining: 83, sm3Remaining: 86, thaadRemaining: 93, arrowRemaining: 75, totalExpenditure: 1200000000 },
  { date: 'Mar 3', timestamp: Date.parse('2026-03-03'), patriotPac3Remaining: 74, sm3Remaining: 78, thaadRemaining: 88, arrowRemaining: 62, totalExpenditure: 2100000000 },
  { date: 'Mar 4', timestamp: Date.parse('2026-03-04'), patriotPac3Remaining: 65, sm3Remaining: 71, thaadRemaining: 84, arrowRemaining: 51, totalExpenditure: 3100000000, note: 'Heritage warning threshold' },
  { date: 'Mar 5', timestamp: Date.parse('2026-03-05'), patriotPac3Remaining: 55, sm3Remaining: 63, thaadRemaining: 79, arrowRemaining: 42, totalExpenditure: 4200000000, note: 'Approaching critical levels' },
];

export const conflictGeography: ConflictGeographyEntry[] = [
  { location: 'Tehran', lat: 35.6892, lng: 51.3890, type: 'strike', date: 'Feb 28', description: 'Initial decapitation strikes' },
  { location: 'Natanz Nuclear Facility', lat: 33.7249, lng: 51.7274, type: 'strike', date: 'Feb 28', description: 'Nuclear facility strikes' },
  { location: 'Ras Laffan, Qatar', lat: 25.9264, lng: 51.5308, type: 'damage', date: 'Mar 1', description: 'LNG facility damaged, production suspended' },
  { location: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, type: 'damage', date: 'Mar 1', description: 'Jebel Ali port fire, Burj Al Arab hit' },
  { location: 'Strait of Hormuz', lat: 26.5667, lng: 56.2500, type: 'shipping', date: 'Mar 2', description: '81% transit collapse' },
  { location: 'Bandar Abbas', lat: 27.1865, lng: 56.2808, type: 'strike', date: 'Mar 2', description: 'Naval base strikes' },
  { location: 'Indian Ocean (S of Sri Lanka)', lat: 5.5000, lng: 79.5000, type: 'naval', date: 'Mar 4', description: 'IRIS Jamaran & Dena sunk' },
  { location: 'Kuwait (Camp Arifjan)', lat: 28.9167, lng: 48.1333, type: 'base', date: 'Mar 2', description: '6 U.S. troops killed' },
  { location: 'Minab, Iran', lat: 27.1500, lng: 57.0833, type: 'damage', date: 'Mar 3', description: 'School strike, ~180 children killed' },
];

// =============================================================================
// SCENARIO PROBABILITY UPDATES (Timestamped for Field Notes)
// =============================================================================

export const scenarioUpdates: ScenarioUpdate[] = [
  {
    date: 'Feb 28, 2026',
    timestamp: Date.parse('2026-02-28'),
    day: 1,
    probabilities: [
      { scenario: 'Quick Resolution', probability: 25 },
      { scenario: 'Protracted Attrition', probability: 50 },
      { scenario: 'Full Escalation', probability: 25 },
    ],
    rationale: 'Initial assessment. Khamenei death creates regime uncertainty but also potential for rapid resolution if successor seeks de-escalation.',
    keyDevelopments: [
      'Operation Epic Fury launches',
      'Khamenei killed in initial strikes',
      'Iran retaliates against 27 U.S. bases',
    ],
  },
  {
    date: 'Mar 1, 2026',
    timestamp: Date.parse('2026-03-01'),
    day: 2,
    probabilities: [
      { scenario: 'Quick Resolution', probability: 22 },
      { scenario: 'Protracted Attrition', probability: 48 },
      { scenario: 'Full Escalation', probability: 30 },
    ],
    rationale: 'GCC infrastructure targeting indicates Iran prioritizing economic leverage over military confrontation. This is sophisticated asymmetric strategy.',
    keyDevelopments: [
      'Iran targets GCC civilian infrastructure',
      'Insurance withdrawal begins',
      'Interim Leadership Council formed',
    ],
  },
  {
    date: 'Mar 2, 2026',
    timestamp: Date.parse('2026-03-02'),
    day: 3,
    probabilities: [
      { scenario: 'Quick Resolution', probability: 18 },
      { scenario: 'Protracted Attrition', probability: 47 },
      { scenario: 'Full Escalation', probability: 35 },
    ],
    rationale: 'Hezbollah entry expands conflict geography. Trump 4-5 week estimate suggests administration preparing public for extended campaign.',
    keyDevelopments: [
      'Hezbollah enters from Lebanon',
      'U.S. death toll reaches 6',
      'Trump says campaign could last 4-5 weeks',
      "Lloyd's P&I cancellation announced",
    ],
  },
  {
    date: 'Mar 3, 2026',
    timestamp: Date.parse('2026-03-03'),
    day: 4,
    probabilities: [
      { scenario: 'Quick Resolution', probability: 15 },
      { scenario: 'Protracted Attrition', probability: 50 },
      { scenario: 'Full Escalation', probability: 35 },
    ],
    rationale: 'Insurance mechanism working as Iran intended. Naval escorts announcement is stopgap - won\'t restore full commercial confidence.',
    keyDevelopments: [
      "Lloyd's coverage cancellation effective Mar 5",
      'Trump announces naval escorts',
      'QatarEnergy suspends all LNG production',
      'Iraq announces 1.5M bpd production cuts',
    ],
  },
  {
    date: 'Mar 4, 2026',
    timestamp: Date.parse('2026-03-04'),
    day: 5,
    probabilities: [
      { scenario: 'Quick Resolution', probability: 20 },
      { scenario: 'Protracted Attrition', probability: 45 },
      { scenario: 'Full Escalation', probability: 35 },
    ],
    rationale: 'Part I Memo published. Iranian casualty asymmetry reaching politically significant levels, but economic leverage thesis validated.',
    keyDevelopments: [
      'Iranian casualties exceed 1,045',
      'IRIS Jamaran and Dena sunk in Indian Ocean',
      'Tanker transits collapse to ~4/day',
      'Part I Memo published',
    ],
  },
  {
    date: 'Mar 5, 2026',
    timestamp: Date.parse('2026-03-05'),
    day: 6,
    probabilities: [
      { scenario: 'Quick Resolution', probability: 18 },
      { scenario: 'Protracted Attrition', probability: 47 },
      { scenario: 'Full Escalation', probability: 35 },
    ],
    rationale: 'P&I expiration creating anticipated chokepoint. Oil above $100 validates transmission mechanism thesis. Interceptor depletion accelerating.',
    keyDevelopments: [
      'P&I coverage expires at midnight',
      'Brent crude exceeds $100/bbl',
      'Interceptor stockpiles approaching Heritage warning thresholds',
      'Congressional war powers debate intensifies',
    ],
  },
];

// =============================================================================
// REFERENCE DATA
// =============================================================================

export const costAsymmetry: CostAsymmetryItem[] = [
  {
    name: 'Shahed Drone',
    shortName: 'Shahed Drone',
    iranCost: 35000,
    interceptorCost: 3700000,
    ratio: Math.round(3700000 / 35000),
    category: 'drone',
    iranLabel: '$35K',
    interceptorLabel: '$3.7M',
  },
  {
    name: 'Ballistic Missile (low)',
    shortName: 'Missile (low)',
    iranCost: 200000,
    interceptorCost: 9700000,
    ratio: Math.round(9700000 / 200000),
    category: 'missile',
    iranLabel: '$200K',
    interceptorLabel: '$9.7M',
  },
  {
    name: 'Ballistic Missile (high)',
    shortName: 'Missile (high)',
    iranCost: 500000,
    interceptorCost: 27900000,
    ratio: Math.round(27900000 / 500000),
    category: 'missile',
    iranLabel: '$500K',
    interceptorLabel: '$27.9M',
  },
];

export const sectorVulnerability: SectorVulnerabilityItem[] = [
  {
    sector: 'Retail',
    leverage: 85,
    refinancingExposure: 90,
    oilSensitivity: 70,
    consumerDependence: 95,
    currentSpread: 75,
    notes: 'Already distressed subsectors face accelerating consumer pullback',
    color: '#ef4444',
  },
  {
    sector: 'Commercial RE',
    leverage: 90,
    refinancingExposure: 95,
    oilSensitivity: 40,
    consumerDependence: 60,
    currentSpread: 85,
    notes: 'Office, mall, and hotel REITs face distressed refinancings',
    color: '#f97316',
  },
  {
    sector: 'Airlines',
    leverage: 80,
    refinancingExposure: 70,
    oilSensitivity: 95,
    consumerDependence: 85,
    currentSpread: 70,
    notes: 'Double hit: fuel costs spike while Middle East routes shut',
    color: '#eab308',
  },
  {
    sector: 'Cruise Lines',
    leverage: 95,
    refinancingExposure: 85,
    oilSensitivity: 80,
    consumerDependence: 100,
    currentSpread: 90,
    notes: 'Most leveraged consumer discretionary subsector',
    color: '#22c55e',
  },
  {
    sector: 'Speculative Tech',
    leverage: 60,
    refinancingExposure: 80,
    oilSensitivity: 20,
    consumerDependence: 40,
    currentSpread: 65,
    notes: 'Pre-revenue companies burning cash faster than they can raise it',
    color: '#06b6d4',
  },
  {
    sector: 'Energy E&P',
    leverage: 50,
    refinancingExposure: 45,
    oilSensitivity: 30,
    consumerDependence: 15,
    currentSpread: 40,
    notes: 'Short-term windfall, long-term policy headwind',
    color: '#8b5cf6',
  },
  {
    sector: 'Healthcare',
    leverage: 35,
    refinancingExposure: 40,
    oilSensitivity: 25,
    consumerDependence: 50,
    currentSpread: 30,
    notes: 'Economic stress + Democratic trifecta = expanded coverage',
    color: '#ec4899',
  },
];

export const hySpreadHistory: HySpreadHistoryEntry[] = [
  { date: '2008', spread: 1800, event: 'Financial Crisis Peak' },
  { date: '2009', spread: 800, event: 'Recovery begins' },
  { date: '2010', spread: 600 },
  { date: '2011', spread: 700, event: 'European debt crisis' },
  { date: '2012', spread: 550 },
  { date: '2013', spread: 400 },
  { date: '2014', spread: 350 },
  { date: '2015', spread: 650, event: 'Oil crash / China fears' },
  { date: '2016', spread: 700, event: 'Energy defaults peak' },
  { date: '2017', spread: 350 },
  { date: '2018', spread: 400, event: 'Q4 selloff' },
  { date: '2019', spread: 350 },
  { date: '2020', spread: 1100, event: 'COVID-19 shock' },
  { date: '2021', spread: 300, event: 'Easy money peak' },
  { date: '2022', spread: 500, event: 'Russia-Ukraine / Fed hikes' },
  { date: '2023', spread: 400 },
  { date: '2024', spread: 320 },
  { date: '2025', spread: 281, event: 'Historic lows' },
  { date: 'Mar 2026', spread: 425, event: 'Iran conflict', isCurrent: true },
];

// =============================================================================
// FIELD NOTES DATA
// =============================================================================

export const fieldNotes: Record<number, FieldNoteDay> = {
  6: {
    day: 6,
    date: 'March 5, 2026',
    title: 'P&I Expiration Day: The Insurance Chokepoint Arrives',
    summary: "Lloyd's P&I coverage expires at midnight. The insurance-driven leverage mechanism we outlined in Part I is now fully operational. Oil breaks $100, validating our transmission thesis. Interceptor depletion accelerating toward Heritage Foundation warning thresholds.",
    thesisScorecard: [
      {
        thesis: 'Insurance mechanism as primary leverage tool',
        initialConfidence: 75,
        currentConfidence: 92,
        status: 'confirmed',
        evidence: [
          "Lloyd's unprecedented P&I cancellation",
          '81% transit collapse without single mine',
          'Naval escorts insufficient to restore confidence',
        ],
      },
      {
        thesis: 'GCC infrastructure targeting over military',
        initialConfidence: 70,
        currentConfidence: 88,
        status: 'confirmed',
        evidence: [
          'Ras Laffan, Mesaieed, Dubai systematically hit',
          'Desalination plants prioritized',
          'Pattern consistent with economic coercion',
        ],
      },
      {
        thesis: 'Interceptor cost asymmetry unsustainable',
        initialConfidence: 80,
        currentConfidence: 85,
        status: 'developing',
        evidence: [
          'Est. $4.2B in interceptors expended',
          'Heritage warning threshold approaching',
          'Production cannot match expenditure rate',
        ],
      },
      {
        thesis: 'Credit market transmission mechanism',
        initialConfidence: 65,
        currentConfidence: 78,
        status: 'developing',
        evidence: [
          'HY spreads widen 144bps to 425bps',
          'ISM Prices Paid spike confirms inflation path',
          'Refinancing wall exposure validated',
        ],
      },
    ],
    scenarioUpdate: scenarioUpdates[5], // Day 6 update
    keyDevelopments: [
      {
        category: 'Insurance & Shipping',
        items: [
          "Lloyd's P&I coverage expires at midnight",
          'Only 3 tankers attempted transit today',
          'VLCC rates holding at $460K/day',
          'Dark fleet night transits increasing',
        ],
      },
      {
        category: 'Energy Markets',
        items: [
          'Brent crude breaks $100, closes at $108.20',
          'U.S. gas prices approach $4.40 national average',
          'Iraq production cuts now at 1.5M bpd',
          'Qatar LNG remains suspended',
        ],
      },
      {
        category: 'Military Situation',
        items: [
          'Iranian casualties now exceed 1,320',
          'U.S. casualties at 8',
          'Hezbollah rocket attacks intensify',
          'Congress war powers debate continues',
        ],
      },
      {
        category: 'Credit Markets',
        items: [
          'HY spreads at 425bps (up from 281 pre-conflict)',
          'VIX at 45.8',
          'S&P 500 down 11.7% from pre-conflict',
          'CDS on distressed retail widening rapidly',
        ],
      },
    ],
    marketSnapshot: {
      brentCrude: 108.20,
      vlccRate: 460000,
      hySpread: 425,
      vix: 45.8,
      usGas: 4.38,
    },
    tradingImplications: [
      'Long oil thesis validated but entry increasingly expensive',
      'Distressed credit opportunities emerging in retail, CRE',
      'Airlines facing double squeeze - fuel + route closures',
      'GCC sovereign CDS worth monitoring for reconstruction plays',
      'Interceptor manufacturers (RTX, LMT, NOC) benefiting but priced in',
    ],
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the latest entry from any time series
 */
export function getLatest<T extends TimeSeriesEntry>(series: T[]): T {
  return series.reduce((latest, entry) =>
    entry.timestamp > latest.timestamp ? entry : latest
  );
}

/**
 * Get the most recent scenario probabilities
 */
export function getLatestScenario(): ScenarioUpdate {
  return scenarioUpdates.reduce((latest, update) =>
    update.timestamp > latest.timestamp ? update : latest
  );
}

/**
 * Get scenario probability by name from the latest update
 */
export function getScenarioProbability(scenarioName: string): number {
  const latest = getLatestScenario();
  const scenario = latest.probabilities.find(p => p.scenario === scenarioName);
  return scenario?.probability ?? 0;
}

/**
 * Get field note by day number
 */
export function getFieldNote(day: number): FieldNoteDay | undefined {
  return fieldNotes[day];
}

/**
 * Get all available field note days
 */
export function getAvailableFieldNoteDays(): number[] {
  return Object.keys(fieldNotes).map(Number).sort((a, b) => a - b);
}

/**
 * Get market data for a specific date
 */
export function getMarketDataByDate(date: string): MarketEntry | undefined {
  return marketTimeline.find(entry => entry.date === date);
}

/**
 * Calculate percent change between two values
 */
export function percentChange(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}

// =============================================================================
// RE-EXPORTS FOR BACKWARD COMPATIBILITY
// =============================================================================

// These maintain compatibility with existing chart imports from iranMemoData
export { costAsymmetry as costAsymmetryData };
export { sectorVulnerability as sectorVulnerabilityData };

export const scenarioData = scenarioUpdates[4].probabilities.map((p, index) => {
  const descriptions = [
    'Trump redefines objectives: "We eliminated Khamenei, destroyed the nuclear program, degraded the military. Mission accomplished." U.S. withdraws within 2-4 weeks.',
    'Iran sustains asymmetric campaign for 4-12 weeks. Strait of Hormuz remains contested. GCC infrastructure damage compounds. Oil exceeds $100/bbl.',
    'Air campaign fails to achieve regime change. Trump commits ground troops. Multi-year occupation in mountainous terrain against 90M-person nation.',
  ];
  const colors = ['#22c55e', '#eab308', '#ef4444'];
  const oilRanges = ['$70-80/bbl', '$90-120/bbl', '$100-150/bbl'];
  const gccDamage = ['$10-50B', '$50-200B', '$200B+'];
  const iranLeverage = ['Moderate (proven capability)', 'Strong (negotiated concessions)', 'Strong (insurgency leverage)'];

  return {
    name: p.scenario,
    probability: p.probability,
    oilPriceRange: oilRanges[index],
    gccDamage: gccDamage[index],
    iranLeverage: iranLeverage[index],
    description: descriptions[index],
    color: colors[index],
    isBaseCase: index === 1,
  };
});

export const creditMarketData = {
  hySpread: {
    current: getLatest(marketTimeline).hySpread ?? 425,
    thirtyYearAverage: 525,
    unit: 'bps',
    note: 'Entered crisis at historic lows - maximum widening potential',
  },
  tenYearYield: {
    value: 4.117,
    unit: '%',
  },
  ismPricesPaid: {
    value: 70.5,
    jump: 11.5,
    note: 'Jumped 11.5 points to 70.5',
  },
  gasPriceJump: 'Biggest single-day jump since Ukraine invasion',
  leveragedLoanDefaultRate: {
    current: 7.5,
    projected: 7.9,
    unit: '%',
  },
};

export const shippingDisruptionData = {
  tankerTransits: hormuzTimeline.map(h => ({
    date: h.date,
    count: h.tankerCount,
    event: h.event,
  })),
  vlccRates: hormuzTimeline.map(h => ({
    date: h.date,
    rate: h.vlccRate,
    event: h.event,
  })),
  events: [
    { date: 'Mar 1', title: 'Insurance Withdrawal Begins', description: 'Major war risk insurers begin withdrawing coverage for Hormuz transits' },
    { date: 'Mar 2', title: 'QatarEnergy Suspends LNG', description: 'All LNG production suspended after drone attack on Ras Laffan facility' },
    { date: 'Mar 3', title: "Lloyd's P&I Cancellation", description: "Lloyd's-linked P&I clubs cancelling war risk coverage effective midnight March 5" },
    { date: 'Mar 3', title: 'Trump Naval Escorts', description: 'Trump announces naval escorts for tankers and U.S. political risk insurance guarantees' },
    { date: 'Mar 3', title: 'Iraq Production Cuts', description: 'Iraq announces forced production cuts of 1.5M bpd due to storage saturation' },
  ],
  keyMetrics: {
    transitCollapsePercent: 81,
    tankersStranded: '150-200+',
    shipsUnableToExit: '700+',
    crudeBoundForIndia: '12 million barrels',
    minervaFixture: { rate: 436000, vessel: 'Pantanassa', charterer: 'GS Caltex' },
  },
};

// Casualty data derived from casualtyTimeline
export const casualtyData = {
  iranianKilled: {
    count: getLatest(casualtyTimeline).iranianKilled,
    asOf: `Day ${casualtyTimeline.length}`,
    note: `${getLatest(casualtyTimeline).iranianKilled.toLocaleString()}+ killed`,
  },
  minabSchool: {
    deaths: 180,
    description: 'Minab school death toll',
    note: '~180 children',
  },
  navalLosses: [
    {
      vessel: 'IRIS Jamaran',
      type: 'Frigate',
      location: 'Indian Ocean, ~40 nautical miles south of Sri Lanka',
      personnelUnaccounted: '50+',
      note: 'Not sunk in Strait of Hormuz - reinforces insurance-driven leverage thesis',
    },
    {
      vessel: 'IRIS Dena',
      type: 'Frigate',
      location: 'Indian Ocean, ~40 nautical miles south of Sri Lanka',
      personnelUnaccounted: '50+',
      note: 'Not sunk in Strait of Hormuz - reinforces insurance-driven leverage thesis',
    },
  ],
  usKilled: getLatest(casualtyTimeline).usKilled,
};

export const gccWaterData = [
  { country: 'Saudi Arabia', gdp: '~$1.1T', desalinationDependency: '~60%', waterReserves: 'Days-weeks', damage: 'Riyadh and Eastern Province targeted' },
  { country: 'UAE', gdp: '~$500B', desalinationDependency: '90%+', waterReserves: '2-5 days', damage: 'Amazon data center burning, Jebel Ali port fire, Burj Al Arab hit, Dubai airport 70% canceled' },
  { country: 'Qatar', gdp: '~$250B', desalinationDependency: '90%+', waterReserves: '2-5 days', damage: 'Ras Laffan energy facility, Mesaieed water/power plant hit; all flights grounded' },
  { country: 'Kuwait', gdp: '~$160B', desalinationDependency: '90%+', waterReserves: '2-5 days', damage: '6 U.S. troops killed at base; air raid sirens active' },
  { country: 'Bahrain', gdp: '~$45B', desalinationDependency: '90%+', waterReserves: '2-3 days', damage: 'U.S. Naval base targeted; commercial district hit' },
];

export const conflictTimeline = [
  { date: 'January 13, 2026', event: 'Iranian officials warn they are "ready for war"; U.S. begins largest Middle East military buildup since 2003 Iraq invasion' },
  { date: 'February 24, 2026', event: 'Trump\'s State of the Union accuses Iran of reviving nuclear weapons program, warns U.S. "prepared to act"' },
  { date: 'February 28, 2026', event: 'U.S. and Israel launch "Operation Epic Fury"—joint strikes across Iran. Supreme Leader Khamenei killed. Iran launches retaliatory strikes on 27 U.S. bases and Israeli targets within hours' },
  { date: 'March 1, 2026', event: 'Iran targets GCC civilian infrastructure: energy facilities in Qatar\'s Ras Laffan and Mesaieed, Dubai hotels and ports, Amazon data centers in UAE and Bahrain. Interim Leadership Council formed. Iran rejects U.S. ceasefire proposal via Italian mediator' },
  { date: 'March 2, 2026', event: 'U.S. death toll rises to 6. Trump says campaign could last 4-5 weeks. Hezbollah enters conflict from Lebanon. Strait of Hormuz shipping halted. Congress begins war powers resolution proceedings' },
  { date: 'March 3, 2026', event: 'Lloyd\'s P&I clubs announce coverage cancellation effective midnight March 5. Trump announces naval escorts and political risk insurance guarantees. QatarEnergy suspends all LNG production.' },
  { date: 'March 4, 2026', event: 'Iranian casualties exceed 1,045. IRIS Jamaran and IRIS Dena sunk in Indian Ocean. Tanker transits collapse to ~4/day. Iraq announces 1.5M bpd forced production cuts.' },
  { date: 'March 5, 2026', event: 'P&I coverage expires at midnight. Brent crude exceeds $108. Iranian casualties exceed 1,320. Congressional war powers debate intensifies.' },
];

export const macroTransmissionChain = [
  {
    id: 'energy-shock',
    label: 'Energy Shock',
    description: 'Strait of Hormuz closure, 20% global oil disrupted',
    metrics: [`Brent +${((getLatest(marketTimeline).brentCrude - 77.52) / 77.52 * 100).toFixed(1)}% to $${getLatest(marketTimeline).brentCrude}`, `VLCC rates $${(getLatest(hormuzTimeline).vlccRate / 1000).toFixed(0)}K/day`, '81% transit collapse'],
    color: '#ef4444',
  },
  {
    id: 'inflation',
    label: 'Inflation',
    description: 'Energy costs propagate through economy',
    metrics: ['ISM Prices Paid: 70.5 (+11.5 pts)', 'Gas: biggest jump since Ukraine', '$14B annualized per $10/bbl'],
    color: '#f97316',
  },
  {
    id: 'fed-constraint',
    label: 'Fed Constraint',
    description: 'Rate cuts blocked by inflation spike',
    metrics: ['10Y yield: 4.117%', 'Cutting cycle disrupted', 'Stagflation risk'],
    color: '#eab308',
  },
  {
    id: 'spread-widening',
    label: 'Spread Widening',
    description: 'Credit markets reprice risk',
    metrics: [`HY OAS: ${getLatest(marketTimeline).hySpread} bps`, '30-yr avg: 525 bps', 'Max widening potential'],
    color: '#84cc16',
  },
  {
    id: 'defaults',
    label: 'Defaults',
    description: 'Zombie companies hit refinancing wall',
    metrics: ['Leveraged loan default: 7.9%', '2026-27 maturity wall', 'Zombie company population'],
    color: '#06b6d4',
  },
  {
    id: 'restructuring',
    label: 'Restructuring Cycle',
    description: 'Largest since 2008-2009',
    metrics: ['Retail, CRE, Airlines', 'Cruise, Speculative Tech', 'Advisory mandates surge'],
    color: '#8b5cf6',
  },
];

export const glossaryTerms: Record<string, { term: string; definition: string; category: string }> = {
  'vlcc': {
    term: 'VLCC',
    definition: 'Very Large Crude Carrier - tankers capable of carrying 200,000+ deadweight tons of crude oil. The workhorses of global oil transport.',
    category: 'shipping',
  },
  'pni': {
    term: 'P&I Insurance',
    definition: 'Protection & Indemnity insurance - maritime liability coverage that protects shipowners against third-party claims. Without P&I, ships cannot legally operate.',
    category: 'insurance',
  },
  'hyspread': {
    term: 'HY Spread (OAS)',
    definition: 'High-Yield Option-Adjusted Spread - the yield premium investors demand for holding high-yield (junk) bonds over risk-free Treasuries. Wider spreads = higher perceived risk.',
    category: 'credit',
  },
  'refinancingwall': {
    term: 'Refinancing Wall',
    definition: 'The cluster of debt maturities coming due in a specific period. Companies that borrowed at low rates in 2020-2021 face much higher rates when refinancing in 2026-2027.',
    category: 'credit',
  },
  'zombiecompany': {
    term: 'Zombie Company',
    definition: 'A firm whose interest costs exceed its operating income - surviving only through continued access to cheap debt. Rising rates make refinancing impossible.',
    category: 'credit',
  },
  'desalination': {
    term: 'Desalination',
    definition: 'The process of removing salt from seawater to produce drinking water. GCC states depend on coastal desalination plants for 90%+ of potable water.',
    category: 'infrastructure',
  },
  'blockingposition': {
    term: 'Blocking Position',
    definition: 'In restructuring, holding enough debt to veto a plan of reorganization (typically 33%+ of a class). Iran\'s control of Hormuz gives it a "blocking position" on global energy.',
    category: 'restructuring',
  },
  'irgc': {
    term: 'IRGC',
    definition: 'Islamic Revolutionary Guard Corps - Iran\'s parallel military force responsible for asymmetric warfare, missile programs, and regional proxy operations.',
    category: 'military',
  },
  'ism': {
    term: 'ISM Prices Paid',
    definition: 'A component of the ISM Manufacturing Index measuring input price inflation. Readings above 50 indicate rising prices; 70.5 signals significant inflationary pressure.',
    category: 'macro',
  },
};
