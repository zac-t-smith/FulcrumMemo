// Iran Conflict Data - Living Data Layer
// This file contains all time-series and reference data used by charts across the site.
// Designed to support Field Notes updates with timestamped scenario probability revisions.

// =============================================================================
// METADATA
// =============================================================================

export const conflictMetadata = {
  lastUpdated: '2026-03-09T12:00:00Z',
  conflictDay: 10,
  conflictStartDate: '2026-02-28',
};

// Helper to format date for display (e.g., "Mar 5")
export const formatShortDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Helper to format full date (e.g., "March 5, 2026")
export const formatFullDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

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

export interface ConflictEvent {
  date: string;
  day: number;
  lat: number;
  lng: number;
  type: 'strike_us' | 'strike_iran' | 'strike_israel' | 'shipping' | 'infrastructure_energy' | 'infrastructure_water' | 'naval' | 'ground_offensive' | 'interception';
  target: string;
  description: string;
  impact?: string;
  status?: 'confirmed' | 'reported' | 'unconfirmed';
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
  { date: 'Feb 27', timestamp: Date.parse('2026-02-27'), tankerCount: 120, vlccRate: 170000, event: 'Pre-conflict normal' },
  { date: 'Feb 28', timestamp: Date.parse('2026-02-28'), tankerCount: 17, vlccRate: 218000, event: 'Operation Epic Fury begins' },
  { date: 'Mar 1', timestamp: Date.parse('2026-03-01'), tankerCount: 4, vlccRate: 300000, event: 'Insurance withdrawal begins' },
  { date: 'Mar 2', timestamp: Date.parse('2026-03-02'), tankerCount: 0, vlccRate: 424000, event: "Zero transits. Lloyd's cancellation announced. VLCC record" },
  { date: 'Mar 3', timestamp: Date.parse('2026-03-03'), tankerCount: 0, vlccRate: 445000, event: 'Zero transits continue. Trump announces naval escorts' },
  { date: 'Mar 4', timestamp: Date.parse('2026-03-04'), tankerCount: 5, vlccRate: 315000, event: '5 transits (3 outbound only). P&I coverage expires midnight Mar 5' },
  { date: 'Mar 5', timestamp: Date.parse('2026-03-05'), tankerCount: 0, vlccRate: 460000, event: "Lloyd's war risk cancellation takes effect. ~200 tankers stranded. 60 VLCCs trapped (8% of global fleet)" },
  { date: 'Mar 6', timestamp: Date.parse('2026-03-06'), tankerCount: 3, vlccRate: 445000, event: 'Selective transit emerges — China/Iran-linked vessels only. Israel launches broad wave on Tehran' },
  { date: 'Mar 7', timestamp: Date.parse('2026-03-07'), tankerCount: 3, vlccRate: 440000, event: '3 transits (Palau, Iran, Liberia flagged). GPS jamming affects 1,650+ ships' },
  { date: 'Mar 8', timestamp: Date.parse('2026-03-08'), tankerCount: 2, vlccRate: 450000, event: 'Selective access continuing. Mojtaba Khamenei named Supreme Leader' },
  { date: 'Mar 9', timestamp: Date.parse('2026-03-09'), tankerCount: 1, vlccRate: 455000, event: 'Near-zero Western transits. Oil breaches $100, hits $119 intraday' },
];

export const casualtyTimeline: CasualtyEntry[] = [
  { date: 'Feb 28', timestamp: Date.parse('2026-02-28'), iranianKilled: 0, iranianCivilian: 0, usKilled: 0, gccCivilian: 0, note: 'Operation begins' },
  { date: 'Mar 1', timestamp: Date.parse('2026-03-01'), iranianKilled: 245, iranianCivilian: 87, usKilled: 2, gccCivilian: 34, note: 'Initial strikes' },
  { date: 'Mar 2', timestamp: Date.parse('2026-03-02'), iranianKilled: 520, iranianCivilian: 156, usKilled: 4, gccCivilian: 89, note: 'Hezbollah enters' },
  { date: 'Mar 3', timestamp: Date.parse('2026-03-03'), iranianKilled: 780, iranianCivilian: 268, usKilled: 6, gccCivilian: 145, note: 'Minab school incident' },
  { date: 'Mar 4', timestamp: Date.parse('2026-03-04'), iranianKilled: 1045, iranianCivilian: 380, usKilled: 6, gccCivilian: 178, note: 'Naval losses' },
  { date: 'Mar 5', timestamp: Date.parse('2026-03-05'), iranianKilled: 1230, iranianCivilian: 420, usKilled: 6, gccCivilian: 195, note: 'Azerbaijan airport struck. WHO: 13 attacks on Iranian health infrastructure' },
  { date: 'Mar 6', timestamp: Date.parse('2026-03-06'), iranianKilled: 1400, iranianCivilian: 480, usKilled: 6, gccCivilian: 210, note: 'Tehran residential areas hit overnight. Beirut evacuation ordered (500K+ people)' },
  { date: 'Mar 7', timestamp: Date.parse('2026-03-07'), iranianKilled: 1650, iranianCivilian: 550, usKilled: 6, gccCivilian: 225, note: 'Israel hits 400+ targets, 1,465 munitions. Mehrabad Airport destroyed. PRIMA tanker struck' },
  { date: 'Mar 8', timestamp: Date.parse('2026-03-08'), iranianKilled: 1900, iranianCivilian: 620, usKilled: 7, gccCivilian: 245, note: 'Oil infrastructure targeted. Saudi first fatalities (2 dead, 12 injured). Bahrain desalination plant hit' },
  { date: 'Mar 9', timestamp: Date.parse('2026-03-09'), iranianKilled: 2150, iranianCivilian: 690, usKilled: 8, gccCivilian: 260, note: '8th US soldier killed. Oil breaches $100. Iran nationwide allegiance gathering' },
];

export const marketTimeline: MarketEntry[] = [
  { date: 'Feb 27', timestamp: Date.parse('2026-02-27'), brentCrude: 72.50, wti: 68.45, naturalGas: 2.85, goldSpot: 2845, spx: 5980, vix: 15.2, hySpread: 281 },
  { date: 'Feb 28', timestamp: Date.parse('2026-02-28'), brentCrude: 78.50, wti: 74.23, naturalGas: 2.95, goldSpot: 2912, spx: 5820, vix: 24.5, hySpread: 295, event: 'Op begins' },
  { date: 'Mar 1', timestamp: Date.parse('2026-03-01'), brentCrude: 82.45, wti: 78.12, naturalGas: 3.15, goldSpot: 2978, spx: 5645, vix: 32.1, hySpread: 325 },
  { date: 'Mar 2', timestamp: Date.parse('2026-03-02'), brentCrude: 85.80, wti: 81.55, naturalGas: 3.35, goldSpot: 3045, spx: 5520, vix: 38.4, hySpread: 358 },
  { date: 'Mar 3', timestamp: Date.parse('2026-03-03'), brentCrude: 88.20, wti: 84.85, naturalGas: 3.55, goldSpot: 3089, spx: 5480, vix: 35.8, hySpread: 372 },
  { date: 'Mar 4', timestamp: Date.parse('2026-03-04'), brentCrude: 90.45, wti: 86.80, naturalGas: 3.70, goldSpot: 3125, spx: 5395, vix: 41.2, hySpread: 395 },
  { date: 'Mar 5', timestamp: Date.parse('2026-03-05'), brentCrude: 85.41, wti: 81.01, naturalGas: 3.85, goldSpot: 5121, spx: 5830.71, vix: 26.5, hySpread: 410, event: 'WTI +8.5% biggest single-day gain since May 2020. Dow wiped out 2026 gains' },
  { date: 'Mar 6', timestamp: Date.parse('2026-03-06'), brentCrude: 88.50, wti: 84.50, naturalGas: 3.95, goldSpot: 5180, spx: 5750, vix: 27.0, hySpread: 425, event: 'Selective Hormuz transit emerges. Israel broad wave on Tehran' },
  { date: 'Mar 7', timestamp: Date.parse('2026-03-07'), brentCrude: 91.20, wti: 87.80, naturalGas: 4.10, goldSpot: 5050, spx: 5680, vix: 27.5, hySpread: 435, event: 'Israel hits 400+ targets, 1,465 munitions. GPS jamming spreads' },
  { date: 'Mar 8', timestamp: Date.parse('2026-03-08'), brentCrude: 92.69, wti: 89.20, naturalGas: 4.25, goldSpot: 5085, spx: 5620, vix: 28.0, hySpread: 450, event: 'Mojtaba Khamenei named Supreme Leader. Israel strikes oil infrastructure' },
  { date: 'Mar 9', timestamp: Date.parse('2026-03-09'), brentCrude: 108.75, wti: 108.62, naturalGas: 4.50, goldSpot: 5100, spx: 5480, vix: 29.48, hySpread: 475, event: 'Oil breaches $100, hits $119 intraday. Largest single-day $ gain since 1988. Asia crashes' },
];

export const gasPrices: GasPriceEntry[] = [
  { date: 'Feb 27', timestamp: Date.parse('2026-02-27'), usAverage: 2.98, california: 4.50 },
  { date: 'Feb 28', timestamp: Date.parse('2026-02-28'), usAverage: 3.02, california: 4.58, change: 0.04, note: 'Initial reaction' },
  { date: 'Mar 1', timestamp: Date.parse('2026-03-01'), usAverage: 3.08, california: 4.68, change: 0.06 },
  { date: 'Mar 2', timestamp: Date.parse('2026-03-02'), usAverage: 3.14, california: 4.78, change: 0.06 },
  { date: 'Mar 3', timestamp: Date.parse('2026-03-03'), usAverage: 3.20, california: 4.88, change: 0.06 },
  { date: 'Mar 4', timestamp: Date.parse('2026-03-04'), usAverage: 3.26, california: 4.98, change: 0.06 },
  { date: 'Mar 5', timestamp: Date.parse('2026-03-05'), usAverage: 3.30, california: 5.05, change: 0.04, note: 'Trump refuses to tap SPR' },
  { date: 'Mar 6', timestamp: Date.parse('2026-03-06'), usAverage: 3.34, california: 5.12, change: 0.04 },
  { date: 'Mar 7', timestamp: Date.parse('2026-03-07'), usAverage: 3.38, california: 5.20, change: 0.04 },
  { date: 'Mar 8', timestamp: Date.parse('2026-03-08'), usAverage: 3.42, california: 5.28, change: 0.04 },
  { date: 'Mar 9', timestamp: Date.parse('2026-03-09'), usAverage: 3.478, california: 5.40, change: 0.058, note: 'AAA confirmed. Up $0.50 in one week. Experts project $4.00 by end of March' },
];

export const asianMarkets: AsianMarketEntry[] = [
  { date: 'Mar 1', timestamp: Date.parse('2026-03-01'), nikkei: 38245, nikkeiChange: -3.2, hangseng: 19845, hangsengChange: -2.8, kospi: 2456, kospiChange: -2.5, sensex: 72450, sensexChange: -2.1 },
  { date: 'Mar 2', timestamp: Date.parse('2026-03-02'), nikkei: 37120, nikkeiChange: -2.9, hangseng: 19125, hangsengChange: -3.6, kospi: 2378, kospiChange: -3.2, sensex: 70890, sensexChange: -2.2 },
  { date: 'Mar 3', timestamp: Date.parse('2026-03-03'), nikkei: 36580, nikkeiChange: -1.5, hangseng: 18890, hangsengChange: -1.2, kospi: 2345, kospiChange: -1.4, sensex: 70120, sensexChange: -1.1, note: 'Naval escort announcement stabilizes' },
  { date: 'Mar 4', timestamp: Date.parse('2026-03-04'), nikkei: 35890, nikkeiChange: -1.9, hangseng: 18420, hangsengChange: -2.5, kospi: 2289, kospiChange: -2.4, sensex: 69450, sensexChange: -1.0 },
  { date: 'Mar 5', timestamp: Date.parse('2026-03-05'), nikkei: 36430, nikkeiChange: 1.5, hangseng: 18750, hangsengChange: 1.8, kospi: 2518, kospiChange: 10.0, sensex: 70100, sensexChange: 1.0, note: 'Dead cat bounce after historic crash' },
  { date: 'Mar 6', timestamp: Date.parse('2026-03-06'), nikkei: 35980, nikkeiChange: -1.2, hangseng: 18420, hangsengChange: -1.8, kospi: 2450, kospiChange: -2.7, sensex: 69650, sensexChange: -0.6 },
  { date: 'Mar 7', timestamp: Date.parse('2026-03-07'), nikkei: 35450, nikkeiChange: -1.5, hangseng: 18100, hangsengChange: -1.7, kospi: 2380, kospiChange: -2.9, sensex: 69200, sensexChange: -0.7, note: 'GPS jamming concerns' },
  { date: 'Mar 8', timestamp: Date.parse('2026-03-08'), nikkei: 34980, nikkeiChange: -1.3, hangseng: 17850, hangsengChange: -1.4, kospi: 2320, kospiChange: -2.5, sensex: 68800, sensexChange: -0.6, note: 'New Supreme Leader named' },
  { date: 'Mar 9', timestamp: Date.parse('2026-03-09'), nikkei: 32360, nikkeiChange: -7.5, hangseng: 16950, hangsengChange: -5.0, kospi: 2132, kospiChange: -8.1, sensex: 66500, sensexChange: -3.3, note: 'Oil breaches $100 — Asia crashes. Japan energy crisis escalating' },
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
  { location: 'Strait of Hormuz', lat: 26.5667, lng: 56.2500, type: 'shipping', date: 'Mar 3', description: 'Selective transit only - Western shipping blocked' },
  { location: 'Bandar Abbas', lat: 27.1865, lng: 56.2808, type: 'strike', date: 'Mar 2', description: 'Naval base strikes' },
  { location: 'Indian Ocean (S of Sri Lanka)', lat: 5.5000, lng: 79.5000, type: 'naval', date: 'Mar 4', description: 'IRIS Jamaran & Dena sunk. IRIS Bushehr interned by Sri Lanka' },
  { location: 'Kuwait (Camp Arifjan)', lat: 28.9167, lng: 48.1333, type: 'base', date: 'Mar 2', description: '6 U.S. troops killed' },
  { location: 'Minab, Iran', lat: 27.1500, lng: 57.0833, type: 'damage', date: 'Mar 3', description: 'School strike, ~180 children killed' },
  { location: 'Azerbaijan (Baku Airport)', lat: 40.4675, lng: 50.0467, type: 'damage', date: 'Mar 5', description: 'Airport struck' },
  { location: 'Cyprus (Larnaca)', lat: 34.8751, lng: 33.6263, type: 'base', date: 'Mar 5', description: 'U.S. evacuation operations' },
  { location: 'Turkey (Incirlik)', lat: 37.0022, lng: 35.4258, type: 'base', date: 'Mar 5', description: 'NATO intercepted Iranian missile' },
  { location: 'Pakistan (Karachi)', lat: 24.8607, lng: 67.0011, type: 'base', date: 'Mar 5', description: 'U.S. consulate closed' },
  { location: 'Tehran University', lat: 35.7029, lng: 51.3952, type: 'strike', date: 'Mar 6', description: 'Israel broad wave overnight - residential areas hit' },
  { location: 'Beirut (Southern Suburbs)', lat: 33.8547, lng: 35.4832, type: 'damage', date: 'Mar 6', description: 'Israel orders evacuation - 500K+ people' },
  { location: 'Kurdistan (NW Iran)', lat: 36.6833, lng: 45.0833, type: 'strike', date: 'Mar 6', description: 'Kurdish ground offensive - first ground front' },
  { location: 'Mehrabad Airport, Tehran', lat: 35.6892, lng: 51.3100, type: 'strike', date: 'Mar 7', description: 'IDF destroys 16 Quds Force cargo aircraft' },
  { location: 'IRGC University, Tehran', lat: 35.7100, lng: 51.4200, type: 'strike', date: 'Mar 7', description: '400+ targets hit, 1,465 munitions dropped' },
  { location: 'Strait of Hormuz (PRIMA tanker)', lat: 26.4500, lng: 56.3000, type: 'shipping', date: 'Mar 7', description: 'PRIMA tanker struck by Iranian drone' },
  { location: 'Shahr Rey Oil Depot, Tehran', lat: 35.5900, lng: 51.4400, type: 'strike', date: 'Mar 8', description: 'First Israeli strike on Iranian oil infrastructure' },
  { location: 'Shahran Oil Depot, Tehran', lat: 35.7200, lng: 51.3500, type: 'strike', date: 'Mar 8', description: 'Oil infrastructure targeted' },
  { location: 'Riyadh Province, Saudi Arabia', lat: 24.7136, lng: 46.6753, type: 'damage', date: 'Mar 8', description: 'First Saudi fatalities: 2 killed, 12 injured' },
  { location: 'Bahrain (Desalination Plant)', lat: 26.0275, lng: 50.5500, type: 'damage', date: 'Mar 8', description: 'Iranian drone hits desalination plant' },
  { location: 'Kuwait International Airport', lat: 29.2266, lng: 47.9689, type: 'damage', date: 'Mar 8', description: 'Drones target fuel tanks' },
  { location: 'Beirut (Central)', lat: 33.8938, lng: 35.5018, type: 'strike', date: 'Mar 8', description: 'Israel strikes hotel, killing 4 - first strike on heart of capital' },
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
      'Iraq output down 70% due to storage saturation from Hormuz closure',
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
      { scenario: 'Quick Resolution', probability: 10 },
      { scenario: 'Protracted Attrition', probability: 55 },
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
  {
    date: 'Mar 6, 2026',
    timestamp: Date.parse('2026-03-06'),
    day: 7,
    probabilities: [
      { scenario: 'Quick Resolution', probability: 5 },
      { scenario: 'Protracted Attrition', probability: 60 },
      { scenario: 'Full Escalation', probability: 35 },
    ],
    rationale: 'Both chambers kill war powers resolution. Trump says "no time limits." Hegseth says war "only just begun." Iran FM refuses all negotiation. Zero Hormuz transits for 3+ consecutive days. Kurdish ground offensive opens new front.',
    keyDevelopments: [
      'Both House and Senate kill war powers resolutions — zero legislative off-ramps',
      'Trump: "no time limits." Hegseth: war "only just begun"',
      'Iran FM Araghchi refuses all negotiation on NBC',
      'Zero tanker transits for 3+ consecutive days',
      'Kurdish ground offensive opens new front in northwest Iran',
      'Israel launches broad wave on Tehran overnight',
      'Beirut southern suburbs evacuation ordered (500K+ people)',
      'War costing U.S. $1B/day (NBC sources)',
    ],
  },
  {
    date: 'Mar 7, 2026',
    timestamp: Date.parse('2026-03-07'),
    day: 8,
    probabilities: [
      { scenario: 'Quick Resolution', probability: 5 },
      { scenario: 'Protracted Attrition', probability: 55 },
      { scenario: 'Full Escalation', probability: 40 },
    ],
    rationale: "Israel's weekend bombing campaign (400+ targets, 1,465 munitions) is the most intense since war began. Targeting Mehrabad Airport and IRGC university signals intent to degrade regime infrastructure. Selective transit emerging (China/Iran-linked vessels) creates de facto two-tier Hormuz.",
    keyDevelopments: [
      'Israeli Air Force attacks 400+ targets, drops 1,465 munitions',
      '80+ fighter jets strike Tehran alone with ~230 munitions',
      'IDF destroys 16 Quds Force cargo aircraft at Mehrabad Airport',
      'PRIMA tanker struck by Iranian drone in Hormuz',
      'GPS jamming affects 1,650+ ships in Gulf (up 55%)',
      'Only 3 vessels transit Hormuz (Palau, Iran, Liberia flagged)',
      'Iran confirms Strait closed only to US, Israel, Western allies — selective access for China/others',
      'Kurdish ground offensive continues',
    ],
  },
  {
    date: 'Mar 8, 2026',
    timestamp: Date.parse('2026-03-08'),
    day: 9,
    probabilities: [
      { scenario: 'Quick Resolution', probability: 3 },
      { scenario: 'Protracted Attrition', probability: 50 },
      { scenario: 'Full Escalation', probability: 47 },
    ],
    rationale: "Three escalatory developments in 24 hours. First: Israel strikes Iranian oil infrastructure for first time — Shahr Rey, Shahran, Nobonyad depots. Second: Mojtaba Khamenei named Supreme Leader — regime continuity, no moderation signal. Third: senior Iranian official warns of retaliatory strikes on regional energy infrastructure, calling this a 'new phase.'",
    keyDevelopments: [
      'Mojtaba Khamenei (son) named new Supreme Leader — IRGC pledges allegiance',
      'Israel strikes Iranian oil infrastructure for first time: Shahr Rey, Shahran, Nobonyad oil depots',
      'Senior Iranian official warns war entered "new phase" — threatens retaliatory strikes on regional energy infrastructure',
      'Saudi Arabia first fatalities: 2 killed, 12 injured in Riyadh Province',
      'Bahrain: desalination plant hit by Iranian drone',
      'Kuwait: drones target fuel tanks at Kuwait International Airport',
      'Israel strikes hotel in central Beirut, killing 4 — first strike on heart of capital',
      '7th US service member killed',
      'US State Department orders non-emergency diplomats to leave Saudi Arabia',
      'Trump says he and Israel will set "terms of surrender"',
      'G7 finance ministers discuss coordinated emergency oil stockpile release',
    ],
  },
  {
    date: 'Mar 9, 2026',
    timestamp: Date.parse('2026-03-09'),
    day: 10,
    probabilities: [
      { scenario: 'Quick Resolution', probability: 2 },
      { scenario: 'Protracted Attrition', probability: 45 },
      { scenario: 'Full Escalation', probability: 53 },
    ],
    rationale: 'Full Escalation becomes base case for the first time. Oil breaching $100 transforms this from regional military conflict into global economic event. Brent +23% in single session, largest since 1988. Saudi/Iraq cutting production due to storage constraints. G7 discussing SPR release is governmental equivalent of margin call.',
    keyDevelopments: [
      'Oil surges past $100/barrel — Brent hits $119 intraday before settling ~$108-110',
      'Largest single-day dollar gain in Brent futures since 1988',
      'Crude up ~50% since conflict started',
      'Asian markets crash: Nikkei -7.5%, KOSPI -8.1%, European markets -2-3%',
      'US gas hits $3.478 national average (AAA), up $0.50 in one week',
      '8th US service member killed',
      'Iran announces nationwide gathering to pledge allegiance to new supreme leader',
      'Saudi Arabia production cuts deepening — running out of storage due to Hormuz closure',
      'Iraq output down 70% due to storage saturation',
      'JPMorgan warns Brent could hit $120 if Gulf producers exhaust storage',
      'G7 considering coordinated SPR release',
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
    summary: "Lloyd's P&I coverage officially expires. Zero tanker transits for 3rd consecutive day. 200+ tankers stranded, 60 VLCCs trapped (8% of global fleet). WTI jumps 8.5% - biggest single-day gain since May 2020. Dow wipes out all 2026 gains. War costing U.S. $1B/day.",
    thesisScorecard: [
      {
        thesis: 'Insurance mechanism as primary leverage tool',
        initialConfidence: 75,
        currentConfidence: 95,
        status: 'confirmed',
        evidence: [
          "Lloyd's P&I coverage officially expired",
          'Zero tanker transits for 3 consecutive days',
          '200+ tankers stranded, 60 VLCCs trapped',
          '20,000 seafarers stranded (IMO)',
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
        currentConfidence: 90,
        status: 'confirmed',
        evidence: [
          'War costing U.S. $1B/day (NBC sources)',
          'Iran drone-heavy strategy continues',
          'Heritage warning thresholds reached',
        ],
      },
      {
        thesis: 'Credit market transmission mechanism',
        initialConfidence: 65,
        currentConfidence: 85,
        status: 'confirmed',
        evidence: [
          '10yr yield 4.13% (up 16bps from pre-war)',
          'Fed cuts pushed to summer',
          'AAL downgraded, negative EPS forecast',
          'Airlines down 5%+ in single day',
        ],
      },
    ],
    scenarioUpdate: scenarioUpdates[5], // Day 6 update
    keyDevelopments: [
      {
        category: 'Insurance & Shipping',
        items: [
          "Lloyd's P&I coverage officially expires",
          'Zero tanker transits for 3rd consecutive day',
          '200+ tankers stranded, 60 VLCCs trapped (8% of global fleet)',
          '20,000 seafarers and 15,000 cruise passengers stranded (IMO)',
          'Cape of Good Hope diversions surged 112% in single day',
        ],
      },
      {
        category: 'Energy Markets',
        items: [
          'Brent crude closes at $85.41 (+4.9% on Day 6)',
          'WTI +8.5%, biggest single-day gain since May 2020',
          'Oil up ~20% for the week',
          'Trump refuses to tap Strategic Petroleum Reserve',
          'U.S. gas at $3.26/gal, up 26 cents in one week',
        ],
      },
      {
        category: 'Military Situation',
        items: [
          'Iranian casualties now exceed 1,230',
          'Azerbaijan airport struck',
          'WHO reports 13 attacks on Iranian health infrastructure',
          'Cyprus: U.S. evacuation operations',
          'Turkey: NATO intercepted Iranian missile',
        ],
      },
      {
        category: 'Credit & Equity Markets',
        items: [
          'Dow wipes out all 2026 gains',
          '10-year yield at 4.13% (up from 3.97% pre-war)',
          'Airlines destroyed: AAL -5.4%, UAL -5%, DAL -4%, LUV -6%',
          'AAL downgraded by Rothschild, negative EPS forecast',
          'Fed rate cut expectations pushed to summer',
        ],
      },
    ],
    marketSnapshot: {
      brentCrude: 85.41,
      vlccRate: 460000,
      hySpread: 410,
      vix: 26.5,
      usGas: 3.26,
    },
    tradingImplications: [
      'Long oil thesis validated - WTI +8.5% single day confirms transmission',
      'Airlines now active restructuring candidates - AAL negative EPS forecast',
      'Dow wiped out 2026 gains - systematic risk repricing underway',
      '10yr yield at 4.13% - Fed cuts pushed to summer, stagflation risk rising',
      'War at $1B/day with no off-ramps - protracted attrition confirmed',
    ],
  },
  7: {
    day: 7,
    date: 'March 6, 2026',
    title: "Zero Transits, $1B/Day Burn Rate, and No Off-Ramps",
    summary: "Every off-ramp has been systematically closed. Congress won't act - both chambers killed war powers resolutions. Iran won't negotiate - FM Araghchi refuses all talks. Trump promising open-ended commitment: 'no time limits.' The strait is sealed by insurance, not mines. The macro transmission chain from Part II is running ahead of base case timeline.",
    thesisScorecard: [
      {
        thesis: 'Hormuz closed by insurance, not navy',
        initialConfidence: 75,
        currentConfidence: 98,
        status: 'confirmed',
        evidence: [
          'Zero tanker transits for 4 consecutive days',
          '200+ tankers stranded, 60 VLCCs trapped (8% of global fleet)',
          "P&I coverage officially expired - Lloyd's war risk cancellation in effect",
          '20,000 seafarers and 15,000 cruise passengers stranded (IMO)',
        ],
      },
      {
        thesis: 'Protracted attrition > 4 weeks',
        initialConfidence: 50,
        currentConfidence: 95,
        status: 'confirmed',
        evidence: [
          'Trump: "no time limits"',
          'Hegseth: war "only just begun"',
          'Both House and Senate kill war powers resolutions',
          'Iran FM refuses all negotiation',
        ],
      },
      {
        thesis: 'Iran refuses to negotiate',
        initialConfidence: 60,
        currentConfidence: 95,
        status: 'confirmed',
        evidence: [
          'FM Araghchi on NBC: "no reason to negotiate with those who are not honest"',
          'U.S. attacked during active talks - trust destroyed',
          'Mojtaba Khamenei emerging as next supreme leader',
        ],
      },
      {
        thesis: 'Credit/macro transmission active',
        initialConfidence: 65,
        currentConfidence: 92,
        status: 'confirmed',
        evidence: [
          '10yr yield 4.13% (up 16bps from pre-war)',
          'Fed cuts pushed to summer',
          'AAL downgraded, negative EPS forecast',
          'Dow wiped out all 2026 gains',
        ],
      },
      {
        thesis: 'Cost asymmetry bankrupting defenders',
        initialConfidence: 80,
        currentConfidence: 88,
        status: 'developing',
        evidence: [
          'War costing U.S. $1B/day (NBC sources)',
          'Iran drone-heavy strategy continues',
          'Interceptor stockpiles depleting faster than production',
        ],
      },
      {
        thesis: 'Airlines as restructuring candidates',
        initialConfidence: 55,
        currentConfidence: 85,
        status: 'developing',
        evidence: [
          'AAL downgraded by Rothschild, negative EPS forecast',
          'Sector down 5%+ in single day',
          'Middle East routes closed, fuel costs spiking',
        ],
      },
      {
        thesis: 'Geographic escalation',
        initialConfidence: 70,
        currentConfidence: 95,
        status: 'confirmed',
        evidence: [
          'Now 15+ countries involved',
          'Kurdish ground offensive opens new front',
          'Cyprus: U.S. evacuation',
          'Turkey: NATO missile intercept',
          'Pakistan: U.S. consulate closed',
        ],
      },
    ],
    scenarioUpdate: scenarioUpdates[6], // Day 7 update
    keyDevelopments: [
      {
        category: 'Political/Diplomatic',
        items: [
          'Both House and Senate kill war powers resolutions — zero legislative off-ramps',
          'Trump: "no time limits"',
          'Hegseth: war "only just begun"',
          'Iran FM Araghchi on NBC: refuses all negotiation, says U.S. attacked during active talks',
          'Mojtaba Khamenei (son) emerging as next supreme leader',
          'Trump demands role in choosing next Iranian leader — "unacceptable"',
          'China dispatches special envoy',
        ],
      },
      {
        category: 'Military Escalation',
        items: [
          'Israel launches "broad-scale wave" on Tehran overnight',
          'Tehran residential areas and Tehran University vicinity hit',
          'Israel orders evacuation of ALL southern Beirut — 500K+ people',
          'Kurdish ground offensive in northwest Iran — first ground front',
          'Iran targeting radar systems across Arabian Peninsula to degrade air defenses',
          'IRIS Bushehr interned by Sri Lanka — first warship interned in neutral country since WWII',
        ],
      },
      {
        category: 'Shipping & Trade',
        items: [
          'Zero tanker transits for 4th consecutive day',
          'Strait effectively sealed by insurance mechanism',
          'IMO: 20,000 seafarers + 15,000 cruise passengers stranded',
          'Cape of Good Hope diversions continue surging',
        ],
      },
      {
        category: 'Markets & Economy',
        items: [
          'War costing U.S. $1B/day (NBC sources)',
          'Dow wiped out all 2026 gains',
          'Oil up 20%+ for the week',
          'Airlines getting destroyed — sector down 5%+ in single day',
          'AAL negative EPS forecast — first concrete restructuring signal',
        ],
      },
    ],
    marketSnapshot: {
      brentCrude: 85.41,
      vlccRate: 460000,
      hySpread: 410,
      vix: 26.5,
      usGas: 3.26,
    },
    tradingImplications: [
      'Quick Resolution probability → 5%. All off-ramps systematically closed',
      'Protracted Attrition → 60%. This is now the base case',
      'AAL negative EPS = first concrete company transitioning to restructuring candidate',
      'The macro transmission chain from Part II is running ahead of base case timeline',
      'Insurance thesis fully validated — strait sealed without mines or naval blockade',
      'Every indicator suggests extended conflict with no negotiated resolution',
    ],
  },
  8: {
    day: 8,
    date: 'March 7, 2026',
    title: "1,465 Munitions on Tehran, Selective Transit Emerges, GPS Jamming Spreads",
    summary: "Israel's weekend bombing campaign (400+ targets, 1,465 munitions) is the most intense since war began. Targeting Mehrabad Airport and IRGC university signals intent to degrade regime infrastructure. Selective transit emerging (China/Iran-linked vessels) creates de facto two-tier Hormuz — closed to West, open to strategic allies. This fundamentally changes the conflict economics.",
    thesisScorecard: [
      {
        thesis: 'Insurance mechanism as primary leverage tool',
        initialConfidence: 75,
        currentConfidence: 97,
        status: 'confirmed',
        evidence: [
          "P&I expired, de facto blockade sustained by market forces not navy",
          'Selective transit for China/Iran-linked vessels only',
          '98% transit collapse for Western shipping',
        ],
      },
      {
        thesis: 'GCC infrastructure targeting',
        initialConfidence: 70,
        currentConfidence: 90,
        status: 'confirmed',
        evidence: [
          'Continued strikes on Gulf states',
          'PRIMA tanker struck by Iranian drone',
          'GPS jamming affecting 1,650+ ships',
        ],
      },
      {
        thesis: 'Interceptor cost asymmetry',
        initialConfidence: 80,
        currentConfidence: 92,
        status: 'confirmed',
        evidence: [
          '1,465 munitions in one weekend — Israel burning through stockpiles',
          '400+ targets hit by 80+ fighter jets',
          'War costing U.S. $1B/day continues',
        ],
      },
      {
        thesis: 'Credit market transmission',
        initialConfidence: 65,
        currentConfidence: 88,
        status: 'confirmed',
        evidence: [
          'Oil climbing toward $100',
          'Fed cuts increasingly unlikely',
          'HY spreads at 435 bps',
        ],
      },
      {
        thesis: 'Selective Hormuz access (China/allies)',
        initialConfidence: 80,
        currentConfidence: 85,
        status: 'developing',
        evidence: [
          'Iran allowing Chinese vessels through',
          'Only 3 transits: Palau, Iran, Liberia flagged',
          'Western shipping blocked entirely',
          'If confirmed as policy, most significant geopolitical development of conflict',
        ],
      },
    ],
    scenarioUpdate: scenarioUpdates[7], // Day 8 update
    keyDevelopments: [
      {
        category: 'Military',
        items: [
          'Israeli Air Force attacks 400+ targets, drops 1,465 munitions',
          '80+ fighter jets strike Tehran alone with ~230 munitions',
          'IDF destroys 16 Quds Force cargo aircraft at Mehrabad Airport',
          'IRGC university targeted',
          'Kurdish ground offensive continues',
        ],
      },
      {
        category: 'Shipping',
        items: [
          'Only 3 vessels transit Hormuz (Palau, Iran, Liberia flagged)',
          'PRIMA tanker struck by Iranian drone',
          'GPS jamming affects 1,650+ ships in Gulf (up 55%)',
          'Iran confirms selective access — closed to US/Israel/West, open to China/others',
        ],
      },
      {
        category: 'Energy',
        items: [
          'Oil climbing toward $100',
          'Brent at ~$92+ (WTI closed Friday Mar 7 up +$9.89 / +12.21%)',
          'WTI surged 12.2% on Friday alone — largest single-day percentage gain in months',
          'VLCC rates sustained at $440K/day',
          "Qatar's energy minister told FT the war could 'bring down the economies of the world' — predicted $150/bbl and all Gulf exporters shut down within weeks",
        ],
      },
      {
        category: 'Geopolitical',
        items: [
          'Two-tier Hormuz emerging — fundamental change in energy geopolitics',
          'China gets preferential oil access',
          'Western shipping blocked entirely',
        ],
      },
    ],
    marketSnapshot: {
      brentCrude: 92.0,
      vlccRate: 440000,
      hySpread: 435,
      vix: 27.5,
      usGas: 3.38,
    },
    tradingImplications: [
      'WTI surged 12.2% on Friday alone — largest single-day percentage gain in months',
      'Selective Hormuz access changes energy geopolitics permanently — China gets preferential oil access',
      "Israel's munitions burn rate raises stockpile sustainability questions",
      'GPS jamming affecting 1,650+ ships — maritime insurance costs will stay elevated even after conflict',
      'Oil approaching $100 — credit market transmission accelerating',
    ],
  },
  9: {
    day: 9,
    date: 'March 8, 2026',
    title: "New Supreme Leader, Oil Infrastructure Targeted, War Enters 'New Phase'",
    summary: "Three escalatory developments in 24 hours. First: Israel strikes Iranian oil infrastructure for the first time — Shahr Rey, Shahran, Nobonyad depots. This crosses a threshold that had been avoided for 9 days. Second: Mojtaba Khamenei named Supreme Leader — regime continuity, no moderation signal, IRGC allegiance pledged. Third: senior Iranian official explicitly warns of retaliatory strikes on regional energy infrastructure, calling this a 'new phase.' Both sides are now targeting each other's energy infrastructure.",
    thesisScorecard: [
      {
        thesis: 'Insurance mechanism as primary leverage tool',
        initialConfidence: 75,
        currentConfidence: 97,
        status: 'confirmed',
        evidence: [
          'De facto blockade sustained for 9+ days',
          'Selective transit only for non-Western vessels',
          '250+ tankers now stranded',
        ],
      },
      {
        thesis: 'Protracted attrition confirmed',
        initialConfidence: 50,
        currentConfidence: 96,
        status: 'confirmed',
        evidence: [
          'New Supreme Leader named — no moderation signal',
          'Trump: "terms of surrender"',
          'IRGC pledges allegiance to Mojtaba Khamenei',
        ],
      },
      {
        thesis: 'Credit market transmission',
        initialConfidence: 65,
        currentConfidence: 90,
        status: 'confirmed',
        evidence: [
          'HY spreads at 450 bps',
          'Oil at $93 and climbing',
          'G7 discusses emergency SPR release',
        ],
      },
      {
        thesis: 'Energy infrastructure targeting bilateral',
        initialConfidence: 85,
        currentConfidence: 90,
        status: 'confirmed',
        evidence: [
          'Israel strikes Iranian oil depots for first time',
          'Iran threatens retaliatory strikes on regional energy infrastructure',
          'Senior official declares "new phase"',
          'Escalation spiral toward energy war',
        ],
      },
      {
        thesis: 'Geographic escalation',
        initialConfidence: 70,
        currentConfidence: 97,
        status: 'confirmed',
        evidence: [
          'Saudi Arabia first fatalities (2 dead, 12 injured)',
          'Bahrain desalination plant hit',
          'Kuwait airport fuel tanks targeted',
          'Israel strikes central Beirut hotel',
        ],
      },
      {
        thesis: 'GCC water infrastructure targeted',
        initialConfidence: 70,
        currentConfidence: 95,
        status: 'confirmed',
        evidence: [
          'BILATERAL — U.S. struck Qeshm Island desalination plant (Day 8), cutting water to 30 villages',
          'Iran struck Bahrain desalination plant (Day 9) — first Gulf water infrastructure strike of war',
          'Both sides have now crossed water infrastructure targeting threshold',
          "Part I's 'GCC Water Clock' framework is now live",
          'Chatham House called Bahrain strike a "major escalation"',
        ],
      },
    ],
    scenarioUpdate: scenarioUpdates[8], // Day 9 update
    keyDevelopments: [
      {
        category: 'Leadership',
        items: [
          'Mojtaba Khamenei (son) named new Supreme Leader',
          'IRGC and top leaders pledge allegiance',
          'Trump calls him "lightweight"',
          'No moderation signal from new leadership',
        ],
      },
      {
        category: 'Military',
        items: [
          'Israel strikes Iranian oil infrastructure for first time',
          'Shahr Rey, Shahran, Nobonyad oil depots hit in Tehran',
          'Military refineries and IRGC university targeted',
          'Israel strikes hotel in central Beirut, killing 4',
        ],
      },
      {
        category: 'Regional',
        items: [
          'Saudi Arabia first fatalities: 2 killed, 12 injured in Riyadh Province',
          'Kuwait airport fuel tanks targeted by drones',
          'US orders non-emergency diplomats out of Saudi Arabia',
        ],
      },
      {
        category: 'Water Infrastructure (NEW ESCALATION)',
        items: [
          'Bahrain desalination plant hit by Iranian drone — FIRST Gulf water infrastructure strike of the war',
          "Iran's justification: U.S. struck Qeshm Island desalination plant first (Day 8), cutting water to 30 villages",
          'FM Araghchi on X: "the U.S. set this precedent, not Iran"',
          'Water infrastructure targeting is now BILATERAL — both sides have crossed this line',
          'Chatham House called it a "major escalation" — Iran moving from economic targets to ones affecting "livelihoods of Gulf citizens"',
          '400+ desalination plants in the Gulf produce 40% of world\'s desalinated water',
          'Bahrain has 103 plants, zero natural aquifers, majority of drinking water from desalination',
          'Bahrain, Kuwait, Qatar rank among five most water-stressed countries globally',
          'Bahrain confirmed this specific strike did NOT disrupt operations — but capability and willingness now demonstrated',
          'Deliberate attacks on civilian water infrastructure violate Article 54 of Additional Protocol I to the Geneva Conventions',
        ],
      },
      {
        category: 'Diplomatic',
        items: [
          '7th US service member killed',
          'Trump says he and Israel will set "terms of surrender"',
          'G7 finance ministers discuss coordinated emergency SPR release',
          'Senior Iranian official warns of "new phase" — threatens regional energy infrastructure',
        ],
      },
    ],
    marketSnapshot: {
      brentCrude: 92.69,
      vlccRate: 450000,
      hySpread: 450,
      vix: 28.0,
      usGas: 3.42,
    },
    tradingImplications: [
      'Oil infrastructure targeting is now bilateral — energy war thesis confirmed',
      'New supreme leader = no off-ramp from Iranian side',
      'Saudi fatalities could trigger Saudi response — MBS was already pushing for war',
      '$100/bbl oil now inevitable — question is $120 or $150',
      'G7 SPR release discussion signals panic at governmental level',
      'Water infrastructure targeting introduces risk vector markets haven\'t priced: if desalination capacity degraded 30-50% in any GCC state, potable water exhaustion occurs within 7-14 days (per Part I analysis). This would force evacuation of civilian populations and collapse of economic activity — an outcome that dwarfs oil price impact',
    ],
  },
  10: {
    day: 10,
    date: 'March 9, 2026',
    title: "Oil Breaches $100, Asia Crashes, $119 Intraday — Energy Crisis Arrives",
    summary: "Full Escalation becomes base case for the first time. Oil breaching $100 is the threshold that transforms this from a regional military conflict into a global economic event. The Brent move — 23% in a single session, largest since 1988 — is not a spike, it's a regime change in energy pricing. Saudi Arabia and Iraq cutting production due to storage constraints means supply destruction is now structural. G7 discussing coordinated SPR release is the governmental equivalent of a margin call.",
    thesisScorecard: [
      {
        thesis: 'Insurance mechanism as primary leverage tool',
        initialConfidence: 75,
        currentConfidence: 98,
        status: 'confirmed',
        evidence: [
          'De facto blockade sustained for 10 days',
          'Selective transit only — Western shipping blocked',
          '250+ tankers stranded, 60 VLCCs trapped',
        ],
      },
      {
        thesis: 'Credit market transmission',
        initialConfidence: 65,
        currentConfidence: 93,
        status: 'confirmed',
        evidence: [
          'Oil above $100, VIX approaching 30',
          'Asian markets crash: Nikkei -7.5%, KOSPI -8.1%',
          'HY spreads at 475 bps',
          'G7 discussing SPR release',
        ],
      },
      {
        thesis: 'Cost asymmetry unsustainable',
        initialConfidence: 80,
        currentConfidence: 94,
        status: 'confirmed',
        evidence: [
          'War cost accelerating — $1B/day confirmed',
          'Oil infrastructure damage on both sides',
          'Israel needs 3 more weeks to accomplish goals',
        ],
      },
      {
        thesis: 'Energy infrastructure targeting bilateral',
        initialConfidence: 85,
        currentConfidence: 92,
        status: 'confirmed',
        evidence: [
          'Confirmed — both sides now hitting energy assets',
          'Iranian oil depots struck',
          'Regional GCC infrastructure under attack',
        ],
      },
      {
        thesis: 'Airlines as restructuring candidates',
        initialConfidence: 55,
        currentConfidence: 90,
        status: 'confirmed',
        evidence: [
          'AAL, Spirit already distressed pre-war',
          'Entire sector now in crisis territory',
          'Fuel hedges expiring, ticket demand dropping',
        ],
      },
      {
        thesis: 'Full Escalation becomes base case',
        initialConfidence: 35,
        currentConfidence: 53,
        status: 'confirmed',
        evidence: [
          'Oil above $100 — global economic event',
          'Both sides targeting energy infrastructure',
          'No off-ramps: Congress rejected, Iran refuses negotiation',
          'G7 emergency coordination signals systemic threat',
        ],
      },
    ],
    scenarioUpdate: scenarioUpdates[9], // Day 10 update
    keyDevelopments: [
      {
        category: 'Energy',
        items: [
          'Brent crude hits $119 intraday, settles ~$108-110',
          'WTI $108.62 (+19.4% single session) — largest daily $ gain since 1988',
          'Crude up ~50% since conflict started',
          'First time above $100 since 2022',
          'Trump still refuses to tap Strategic Petroleum Reserve',
        ],
      },
      {
        category: 'Markets',
        items: [
          'Asian markets crash: Nikkei -7.5%, KOSPI -8.1%',
          'European markets down 2-3%',
          'S&P futures -1.7% to -2.1%',
          'VIX 29.48 (+24%), approaching crisis territory (30+)',
          'US gas hits $3.478/gal (AAA), up $0.50 in one week',
        ],
      },
      {
        category: 'Supply',
        items: [
          'Saudi Arabia production cuts deepening — running out of storage',
          'Iraq output down 70% due to storage saturation from Hormuz closure',
          'Bahrain\'s Bapco declared force majeure — analysts expect more Gulf producers to follow as storage fills',
          'JPMorgan warns Brent could hit $120 if Gulf producers exhaust storage',
          'Goldman Sachs warns $140-150 if Hormuz stays disrupted beyond 30 days, potentially triggering synchronized global downturn',
          'G7 considering coordinated SPR release',
        ],
      },
      {
        category: 'Conflict',
        items: [
          '8th US service member killed',
          'Iran announces nationwide gathering to pledge allegiance to new Supreme Leader',
          'Israel says needs 3 more weeks to accomplish goals',
          'Regional energy infrastructure attacks continue',
          'Nearly 3,000 Iranian missiles and drones launched at Gulf states since war began (Arab League figures)',
          'Bahrain alone: intercepted 95 missiles and 164 drones',
          'UAE: 100+ missiles and drones in single barrages',
        ],
      },
      {
        category: 'Rhetoric Divergence (CRITICAL)',
        items: [
          'Trump: war could end "soon," goals "pretty much complete," called it "short-term excursion"',
          'Hegseth on 60 Minutes (same day): plans 500-lb, 1,000-lb, 2,000-lb bombs, says "we haven\'t even really got to start that effort"',
          'IDF says needs 3 more weeks to accomplish goals',
          'This Pentagon vs White House disconnect is significant — markets reacting to rhetoric, not reality',
        ],
      },
      {
        category: 'Oil Price Whiplash',
        items: [
          'Oil hit $119 intraday then dropped sharply toward $80-88 WTI in post-settlement trading after Trump\'s "could end soon" remarks',
          'Brent stayed higher at ~$99 while WTI fell to ~$88 — divergence between U.S. benchmark (reacting to rhetoric) and international benchmarks (pricing physical reality)',
          'This divergence itself is a data point: U.S. markets pricing Trump statements, global markets pricing supply fundamentals',
        ],
      },
      {
        category: 'Intelligence & Geopolitical',
        items: [
          'AP sources: Russia gave Iran information to help hit U.S. military targets — new escalation vector',
          'Araghchi on Meet the Press declined to confirm or deny Russian intelligence sharing',
          'Iran internal rift: Pezeshkian (apologized to neighbors, called for diplomacy) vs hardliners/IRGC (continued strikes)',
          'Mojtaba Khamenei appointment resolved the rift — hardline continuity wins',
        ],
      },
      {
        category: 'U.S. Forces On-Ground (Stars & Stripes)',
        items: [
          'U.S. service members and families in Bahrain relying on local markets — on-base commissaries shuttered',
          'Bahrain government cracking down on price gouging, shut down at least one food store',
          'King Fahd Causeway to Saudi Arabia is primary ground route out of Bahrain',
          'Bahrain airspace remains closed',
        ],
      },
      {
        category: 'Israeli Casualties (Alma Research Center)',
        items: [
          '12 Israeli civilians killed, 2,142 injured since war began',
          '3,000+ Israelis displaced',
          'Hezbollah: 223 attack waves since joining March 2',
          'Iran attack wave frequency declining: peaked 55 on Day 2, down to 9 on Day 9 — confirms missile rationing thesis',
        ],
      },
    ],
    marketSnapshot: {
      brentCrude: 108.75,
      vlccRate: 455000,
      hySpread: 475,
      vix: 29.48,
      usGas: 3.478,
    },
    tradingImplications: [
      '$100 oil is not a ceiling — it\'s a floor if Hormuz stays closed. JPMorgan warns $120 if storage exhausted. Goldman Sachs warns $140-150 if Hormuz stays disrupted beyond 30 days, potentially triggering synchronized global economic downturn',
      'Futures curve sharply backwardated: April WTI $108, May $103, June $95, July $88. Market expects eventual resolution but near-term pricing is crisis-level. The steepness of backwardation signals physical supply panic, not just speculative bidding',
      'G7 SPR release = temporary band-aid. Global SPR covers ~90 days of imports. Hormuz disrupts 20% of supply indefinitely',
      'Asia is the transmission vector — Japan and Korea are Hormuz-dependent. Their market crashes will feed back into global risk-off',
      'Credit spreads about to blow out. HY at 475 with oil above $100 and equity markets crashing',
      'Airline sector now in active distress. Fuel hedges expire. Ticket demand drops. RX pipeline building',
      'The Fed is trapped — inflation surging from energy, but cutting rates would amplify it. Stagflation scenario materializing',
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
    { date: 'Mar 2', title: 'Zero Transits Begin', description: 'First day of zero tanker transits through Strait of Hormuz' },
    { date: 'Mar 3', title: "Lloyd's P&I Cancellation", description: "Lloyd's-linked P&I clubs cancelling war risk coverage effective midnight March 5" },
    { date: 'Mar 3', title: 'Trump Naval Escorts', description: 'Trump announces naval escorts for tankers and U.S. political risk insurance guarantees' },
    { date: 'Mar 3', title: 'Iraq Production Collapse', description: 'Iraq output has dropped 70% due to storage saturation from Hormuz closure' },
    { date: 'Mar 5', title: 'P&I Coverage Expires', description: "Lloyd's war risk cancellation takes effect at midnight. 200+ tankers stranded, 60 VLCCs trapped (8% of global fleet)" },
    { date: 'Mar 5', title: 'IMO Stranded Report', description: '20,000 seafarers and 15,000 cruise passengers stranded across the region' },
    { date: 'Mar 6', title: 'Selective Transit Emerges', description: 'China/Iran-linked vessels begin transiting. Western shipping blocked.' },
    { date: 'Mar 7', title: 'GPS Jamming Spreads', description: 'GPS jamming affects 1,650+ ships in Gulf, up 55% from prior week. PRIMA tanker struck by Iranian drone.' },
    { date: 'Mar 7', title: 'Iran Confirms Two-Tier Hormuz', description: 'Iran confirms Strait closed only to US, Israel, Western allies — selective access for China/others' },
    { date: 'Mar 8', title: 'New Supreme Leader', description: 'Mojtaba Khamenei named Supreme Leader. IRGC pledges allegiance.' },
    { date: 'Mar 8', title: 'Oil Infrastructure Targeted', description: 'Israel strikes Iranian oil infrastructure for first time: Shahr Rey, Shahran, Nobonyad depots' },
    { date: 'Mar 9', title: 'Oil Breaches $100', description: 'Brent hits $119 intraday. Largest single-day dollar gain since 1988. Crude up 50% since conflict started.' },
    { date: 'Mar 9', title: 'Bapco Force Majeure', description: 'Bahrain\'s Bapco declares force majeure. Analysts (Jones Trading) expect more Gulf producers to follow as storage fills.' },
    { date: 'Mar 9', title: 'Goldman Sachs Warning', description: 'Goldman warns $140-150 oil if Hormuz stays disrupted beyond 30 days, potentially triggering synchronized global economic downturn.' },
  ],
  keyMetrics: {
    transitCollapsePercent: 98,
    tankersStranded: '250+',
    shipsUnableToExit: '750+',
    trappedVLCCs: 60,
    percentGlobalVLCCFleet: 8,
    strandedSeafarers: 20000,
    strandedCruisePassengers: 15000,
    commercialShipsAttacked: '8+',
    capeOfGoodHopeDiversions: 'surged 112% in single day',
    crudeBoundForIndia: '12 million barrels',
    minervaFixture: { rate: 436000, vessel: 'Pantanassa', charterer: 'GS Caltex' },
    gpsJammingAffectedShips: 1650,
    selectiveTransitOnly: true,
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
  { date: 'March 2, 2026', event: 'U.S. death toll rises to 6. Trump says campaign could last 4-5 weeks. Hezbollah enters conflict from Lebanon. Zero tanker transits through Hormuz begins. Congress begins war powers resolution proceedings' },
  { date: 'March 3, 2026', event: 'Zero transits continue. Lloyd\'s P&I clubs announce coverage cancellation effective midnight March 5. Trump announces naval escorts. QatarEnergy suspends all LNG production.' },
  { date: 'March 4, 2026', event: 'Iranian casualties exceed 1,045. IRIS Jamaran and IRIS Dena sunk in Indian Ocean. 5 tankers transit (3 outbound only). Iraq output down 70% due to storage saturation from Hormuz closure.' },
  { date: 'March 5, 2026', event: 'P&I coverage officially expires. Zero transits resume. 200+ tankers stranded, 60 VLCCs trapped (8% of global fleet). 20,000 seafarers stranded. WTI +8.5%, biggest single-day gain since May 2020. Dow wipes out 2026 gains. War costing U.S. $1B/day.' },
  { date: 'March 6, 2026', event: 'Both House and Senate kill war powers resolutions. Trump says "no time limits." Iran FM refuses all negotiation. Israel launches broad wave on Tehran overnight. Beirut evacuation ordered (500K+ people). Kurdish ground offensive opens new front. China dispatches special envoy.' },
  { date: 'March 7, 2026', event: 'Israeli Air Force attacks 400+ targets in Iran, dropping 1,465 munitions. 80+ fighter jets strike Tehran with ~230 munitions. IDF destroys 16 Quds Force cargo aircraft at Mehrabad Airport. PRIMA tanker struck by Iranian drone in Hormuz. GPS jamming affects 1,650+ ships (up 55%). Selective transit emerges — only 3 vessels transit (Palau, Iran, Liberia flagged). Iran confirms Strait closed only to US, Israel, Western allies.' },
  { date: 'March 8, 2026', event: 'Mojtaba Khamenei (son) named new Supreme Leader — IRGC pledges allegiance. Israel strikes Iranian oil infrastructure for first time: Shahr Rey, Shahran, Nobonyad depots. Senior Iranian official warns war entered "new phase" — threatens regional energy infrastructure. Saudi Arabia first fatalities: 2 killed, 12 injured. Bahrain desalination plant hit. Kuwait airport fuel tanks targeted. Israel strikes hotel in central Beirut, killing 4. 7th US soldier killed. US orders non-emergency diplomats out of Saudi Arabia. G7 discusses emergency SPR release.' },
  { date: 'March 9, 2026', event: 'Oil surges past $100/barrel — Brent hits $119 intraday. Largest single-day dollar gain since 1988. Crude up 50% since conflict started. Asian markets crash: Nikkei -7.5%, KOSPI -8.1%. US gas hits $3.478 (AAA), up $0.50 in one week. 8th US soldier killed. Mojtaba Khamenei named new Supreme Leader — IRGC and military pledge allegiance. Iran announces nationwide allegiance gathering. Iraq output down 70% due to storage saturation. Bapco (Bahrain) declares force majeure — more expected to follow. Goldman Sachs warns $140-150 oil if Hormuz disrupted beyond 30 days. G7 considering coordinated SPR release.' },
];

// =============================================================================
// NEW DATA ARRAYS - SECTOR IMPACT
// =============================================================================

export interface AirlineImpactEntry extends TimeSeriesEntry {
  americanAirlines: number;
  unitedAirlines: number;
  deltaAirlines: number;
  southwestAirlines: number;
  note?: string;
}

export const airlineImpact: AirlineImpactEntry[] = [
  { date: 'Mar 5', timestamp: Date.parse('2026-03-05'), americanAirlines: -5.4, unitedAirlines: -5.0, deltaAirlines: -3.9, southwestAirlines: -6.0, note: 'AAL downgraded to neutral by Rothschild, negative EPS forecast for 2026' },
];

export interface WarCostEntry extends TimeSeriesEntry {
  dailyCostUSD: number;
  cumulativeCostUSD?: number;
  note?: string;
}

export const warCostEstimate: WarCostEntry[] = [
  { date: 'Mar 5', timestamp: Date.parse('2026-03-05'), dailyCostUSD: 1000000000, note: 'NBC sources: war costing U.S. $1 billion per day' },
];

export const macroTransmissionChain = [
  {
    id: 'energy-shock',
    label: 'Energy Shock',
    description: 'Strait of Hormuz closure, 20% global oil disrupted',
    metrics: [`Brent +${((getLatest(marketTimeline).brentCrude - 77.52) / 77.52 * 100).toFixed(1)}% to $${getLatest(marketTimeline).brentCrude}`, `VLCC rates $${(getLatest(hormuzTimeline).vlccRate / 1000).toFixed(0)}K/day`, '100% transit collapse - zero transits 4 days'],
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
    metrics: ['10Y yield: 4.13% (+16bps from pre-war)', 'Fed cuts pushed to summer', 'Stagflation risk rising'],
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

// =============================================================================
// ADDITIONAL MARKET DATA
// =============================================================================

export const iraqProductionDeclinePercent = 70;

export const forceMajeureDeclarers = [
  { company: 'Bapco Energies', country: 'Bahrain', date: 'Mar 9, 2026', note: 'Storage saturation from Hormuz closure' },
];

export const goldmanSachsProjection = {
  thirtyDayDisruption: '$140-150/bbl',
  trigger: 'synchronized global economic downturn',
  source: 'Goldman Sachs',
  date: 'Mar 9, 2026',
};

export const futuresCurve = [
  { month: 'April', price: 108 },
  { month: 'May', price: 103 },
  { month: 'June', price: 95 },
  { month: 'July', price: 88 },
];

export const waterInfrastructure = [
  {
    date: '2026-03-07',
    day: 8,
    target: 'Qeshm Island desalination plant (Iran)',
    attacker: 'United States',
    impact: 'Water supply cut to 30 villages',
    source: 'FM Araghchi statement on X',
  },
  {
    date: '2026-03-08',
    day: 9,
    target: 'Unnamed desalination plant (Bahrain)',
    attacker: 'Iran (drone)',
    impact: 'Material damage confirmed, operations not disrupted',
    source: 'Bahrain Ministry of Interior',
  },
];

export const gulfStrikeData = {
  totalIranianMissilesAndDrones: '3000+',
  source: 'Arab League figures',
  bahrainIntercepted: { missiles: 95, drones: 164 },
  uaeBarrages: '100+ missiles and drones in single barrages',
};

export const israeliCasualtyData = {
  civiliansKilled: 12,
  civiliansInjured: 2142,
  displaced: 3000,
  hezbollahAttackWaves: 223,
  hezbollahJoinedDate: 'March 2',
  iranAttackWaveFrequency: [
    { day: 2, waves: 55 },
    { day: 9, waves: 9 },
  ],
  note: 'Attack wave decline confirms missile rationing thesis',
  source: 'Alma Research Center',
};

// =============================================================================
// CONFLICT EVENTS MAP DATA
// =============================================================================

export const conflictEvents: ConflictEvent[] = [
  // DAY 1 — Feb 28
  { date: '2026-02-28', day: 1, lat: 35.6892, lng: 51.3890, type: 'strike_us', target: 'Leadership House, Tehran', description: 'Operation Epic Fury opening salvo. Khamenei killed.', status: 'confirmed' },
  { date: '2026-02-28', day: 1, lat: 27.1832, lng: 56.2666, type: 'shipping', target: 'Strait of Hormuz', description: '3 tankers struck near strait. Insurance withdrawal begins.', status: 'confirmed' },
  { date: '2026-02-28', day: 1, lat: 26.2285, lng: 50.5860, type: 'strike_iran', target: 'NSA Bahrain / US 5th Fleet HQ', description: 'Iranian missiles and drones hit US naval base', status: 'confirmed' },
  { date: '2026-02-28', day: 1, lat: 29.3117, lng: 47.4818, type: 'strike_iran', target: 'Kuwait US base', description: '6 US service members killed in drone attack', status: 'confirmed' },
  { date: '2026-02-28', day: 1, lat: 33.7249, lng: 51.7274, type: 'strike_us', target: 'Natanz Nuclear Facility', description: 'Nuclear facility destroyed in initial strikes', status: 'confirmed' },

  // DAY 2 — Mar 1
  { date: '2026-03-01', day: 2, lat: 25.2854, lng: 51.5310, type: 'infrastructure_energy', target: 'Ras Laffan, Qatar', description: 'Iran strikes Qatar energy facility. QatarEnergy suspends LNG production.', status: 'confirmed' },
  { date: '2026-03-01', day: 2, lat: 25.0136, lng: 55.0553, type: 'strike_iran', target: 'Dubai hotels and Jebel Ali port', description: 'Fire at Jebel Ali. Dubai Airport 70% cancelled.', status: 'confirmed' },
  { date: '2026-03-01', day: 2, lat: 24.4539, lng: 54.3773, type: 'infrastructure_energy', target: 'Amazon data center, Abu Dhabi', description: 'AWS data center burning. Still offline.', status: 'confirmed' },
  { date: '2026-03-01', day: 2, lat: 27.1542, lng: 56.2553, type: 'shipping', target: 'Strait of Hormuz', description: 'Tanker transits collapse to 18. VLCC rates $300K/day.', status: 'confirmed' },
  { date: '2026-03-01', day: 2, lat: 25.2797, lng: 51.4935, type: 'infrastructure_energy', target: 'Mesaieed, Qatar', description: 'Water and power plant hit. QatarEnergy suspends all production.', status: 'confirmed' },

  // DAY 3 — Mar 2
  { date: '2026-03-02', day: 3, lat: 33.8938, lng: 35.5018, type: 'strike_israel', target: 'Beirut, Lebanon', description: 'Hezbollah enters conflict. Israel strikes southern suburbs.', status: 'confirmed' },
  { date: '2026-03-02', day: 3, lat: 27.1865, lng: 56.2808, type: 'strike_us', target: 'Bandar Abbas Naval Base', description: 'US strikes Iranian naval base', status: 'confirmed' },
  { date: '2026-03-02', day: 3, lat: 27.1832, lng: 56.2666, type: 'shipping', target: 'Strait of Hormuz', description: 'Zero tanker transits begin. Lloyd\'s P&I cancellation announced.', status: 'confirmed' },

  // DAY 4 — Mar 3
  { date: '2026-03-03', day: 4, lat: 27.1832, lng: 56.2666, type: 'shipping', target: 'Strait of Hormuz', description: 'Zero transits continue. Trump announces naval escorts.', status: 'confirmed' },
  { date: '2026-03-03', day: 4, lat: 27.1500, lng: 57.0833, type: 'strike_us', target: 'Minab, Iran', description: 'School strike kills ~180 children. Major civilian casualty event.', impact: '~180 children killed', status: 'confirmed' },

  // DAY 5 — Mar 4
  { date: '2026-03-04', day: 5, lat: 5.9549, lng: 80.5550, type: 'naval', target: 'Indian Ocean, south of Sri Lanka', description: 'IRIS Jamaran and IRIS Dena sunk by US submarine. 87 bodies recovered, 32 survivors.', status: 'confirmed' },
  { date: '2026-03-04', day: 5, lat: 30.4217, lng: 48.1653, type: 'infrastructure_energy', target: 'Basra, Iraq', description: 'Iraq output down 70% due to storage saturation from Hormuz closure.', impact: '70% production decline', status: 'confirmed' },

  // DAY 6 — Mar 5
  { date: '2026-03-05', day: 6, lat: 40.4675, lng: 50.0467, type: 'strike_iran', target: 'Baku Airport, Azerbaijan', description: 'Iranian drones strike airport terminal. Two civilians injured. Conflict jumps to Caucasus.', status: 'confirmed' },
  { date: '2026-03-05', day: 6, lat: 34.8021, lng: 38.9968, type: 'strike_israel', target: 'Homs/Bekaa, Lebanon', description: 'Israel intensifies Lebanon strikes. 500K+ evacuated from southern Beirut.', status: 'confirmed' },
  { date: '2026-03-05', day: 6, lat: 27.1832, lng: 56.2666, type: 'shipping', target: 'Strait of Hormuz', description: 'P&I coverage expires. 200+ tankers stranded. 60 VLCCs trapped.', impact: '8% of global VLCC fleet trapped', status: 'confirmed' },

  // DAY 7 — Mar 6
  { date: '2026-03-06', day: 7, lat: 35.6892, lng: 51.3890, type: 'strike_us', target: 'Tehran residential areas', description: 'Massive overnight explosions near Tehran University. Jomhuri Avenue hit.', status: 'confirmed' },
  { date: '2026-03-06', day: 7, lat: 33.8547, lng: 35.4832, type: 'strike_israel', target: 'Beirut Southern Suburbs', description: 'Israel orders evacuation of ALL southern Beirut — 500K+ people.', status: 'confirmed' },
  { date: '2026-03-06', day: 7, lat: 36.6833, lng: 45.0833, type: 'ground_offensive', target: 'Kurdistan (NW Iran)', description: 'Kurdish ground offensive begins — first ground front of the war.', status: 'confirmed' },

  // DAY 8 — Mar 7
  { date: '2026-03-07', day: 8, lat: 35.6892, lng: 51.3100, type: 'strike_israel', target: 'Mehrabad Airport, Tehran', description: 'IDF destroys 16 Quds Force cargo aircraft. 400+ targets, 1,465 munitions over weekend.', impact: '1,465 munitions dropped', status: 'confirmed' },
  { date: '2026-03-07', day: 8, lat: 35.7100, lng: 51.4200, type: 'strike_israel', target: 'IRGC University, Tehran', description: '80+ fighter jets strike Tehran with ~230 munitions.', status: 'confirmed' },
  { date: '2026-03-07', day: 8, lat: 26.7606, lng: 56.2808, type: 'shipping', target: 'PRIMA tanker, Hormuz', description: 'Tanker struck by Iranian drone in strait.', status: 'confirmed' },
  { date: '2026-03-07', day: 8, lat: 26.5445, lng: 56.2578, type: 'infrastructure_water', target: 'Qeshm Island, Iran', description: "US strikes desalination plant. Water cut to 30 villages. Araghchi: 'US set this precedent.'", impact: 'Water to 30 villages cut', status: 'confirmed' },
  { date: '2026-03-07', day: 8, lat: 27.1832, lng: 56.2666, type: 'shipping', target: 'Strait of Hormuz', description: 'GPS jamming affects 1,650+ ships (up 55%). Only 3 vessels transit.', status: 'confirmed' },

  // DAY 9 — Mar 8
  { date: '2026-03-08', day: 9, lat: 35.5861, lng: 51.3554, type: 'infrastructure_energy', target: 'Shahr Rey oil depot, Tehran', description: 'Israel strikes Iranian oil infrastructure for first time. Toxic smoke over Tehran.', status: 'confirmed' },
  { date: '2026-03-08', day: 9, lat: 35.7796, lng: 51.4272, type: 'infrastructure_energy', target: 'Shahran oil depot, Tehran', description: 'Major fire visible from highway. Blackened rain reported.', status: 'confirmed' },
  { date: '2026-03-08', day: 9, lat: 26.2285, lng: 50.5500, type: 'infrastructure_water', target: 'Desalination plant, Bahrain', description: 'Iranian drone damages plant. First Gulf water infrastructure strike. Operations not disrupted.', status: 'confirmed' },
  { date: '2026-03-08', day: 9, lat: 24.4100, lng: 47.5800, type: 'strike_iran', target: 'Riyadh Province, Saudi Arabia', description: 'First Saudi fatalities: 2 killed, 12 injured from projectile hitting residential area.', impact: '2 killed, 12 injured', status: 'confirmed' },
  { date: '2026-03-08', day: 9, lat: 29.2266, lng: 47.9689, type: 'infrastructure_energy', target: 'Kuwait International Airport', description: 'Drones target fuel tanks at airport.', status: 'confirmed' },
  { date: '2026-03-08', day: 9, lat: 33.8750, lng: 35.5097, type: 'strike_israel', target: 'Central Beirut hotel', description: 'Israel strikes hotel in heart of capital. 4 killed. First strike on central Beirut.', impact: '4 killed', status: 'confirmed' },

  // DAY 10 — Mar 9
  { date: '2026-03-09', day: 10, lat: 26.2285, lng: 50.6110, type: 'strike_iran', target: 'Sitra Island, Bahrain', description: 'Iranian strike on Bapco refinery. Force majeure declared.', status: 'confirmed' },
  { date: '2026-03-09', day: 10, lat: 26.0667, lng: 50.5577, type: 'strike_iran', target: 'Manama residential, Bahrain', description: '29-year-old woman killed, 8 injured. First Bahraini civilian death.', impact: '1 killed, 8 injured', status: 'confirmed' },
  { date: '2026-03-09', day: 10, lat: 22.7877, lng: 54.7585, type: 'interception', target: 'Shaybah oil field, Saudi Arabia', description: 'Saudi intercepts drone targeting massive oil field.', status: 'confirmed' },
  { date: '2026-03-09', day: 10, lat: 27.1832, lng: 56.2666, type: 'shipping', target: 'Strait of Hormuz', description: 'Oil breaches $100, hits $119 intraday. Near-zero Western transits continue.', impact: 'Oil +50% since conflict start', status: 'confirmed' },
];

// Insurance exclusion zone polygon (for map overlay)
export const insuranceExclusionZone = {
  name: 'P&I War Risk Exclusion Zone (effective Mar 5)',
  coordinates: [
    [22.7083, 59.9083], // Cape al-Hadd, Oman
    [25.175, 61.617],   // Iran-Pakistan border
    [27.25, 57.0],      // Northern Oman Gulf
    [27.0, 52.5],       // Central Gulf
    [29.0, 48.5],       // Kuwait
    [30.5, 48.0],       // Iraq coast
    [29.5, 50.5],       // Saudi coast
    [26.0, 50.0],       // Bahrain
    [24.5, 51.5],       // Qatar
    [24.0, 54.0],       // UAE
    [22.7083, 59.9083], // Close polygon
  ] as [number, number][],
};

// Helper to get events up to a specific day
export function getEventsThrough(day: number): ConflictEvent[] {
  return conflictEvents.filter(e => e.day <= day);
}

// Helper to get events for a specific day
export function getEventsForDay(day: number): ConflictEvent[] {
  return conflictEvents.filter(e => e.day === day);
}

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
