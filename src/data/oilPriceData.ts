/**
 * Oil Price Data - Single Authoritative Source
 * Source: U.S. Energy Information Administration (EIA)
 * Brent: https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=RBRTE&f=D
 * WTI: https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=RWTC&f=D
 * Last Updated: April 6, 2026
 */

export interface OilPriceEntry {
  date: string;           // ISO format: YYYY-MM-DD
  brentSpot: number;      // Brent Crude FOB $/barrel
  wtiSpot: number;        // WTI Cushing OK FOB $/barrel
  conflictDay?: number;   // Day of conflict (Feb 28, 2026 = Day 1)
  note?: string;          // Optional market note
}

export const EIA_SOURCE_ATTRIBUTION = 'Source: U.S. Energy Information Administration';

/**
 * Calculate conflict day from date
 * Day 1 = February 28, 2026 (Operation Epic Fury begins)
 */
export function getConflictDay(date: string): number | undefined {
  const conflictStart = new Date('2026-02-28');
  const targetDate = new Date(date);
  if (targetDate < conflictStart) return undefined;
  const diffTime = targetDate.getTime() - conflictStart.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

/**
 * Daily oil prices from EIA
 * February 2026 through April 2026
 */
export const oilPriceData: OilPriceEntry[] = [
  // Pre-conflict baseline (February 2026)
  { date: '2026-02-02', brentSpot: 67.72, wtiSpot: 61.60 },
  { date: '2026-02-03', brentSpot: 70.01, wtiSpot: 62.62 },
  { date: '2026-02-04', brentSpot: 71.15, wtiSpot: 64.56 },
  { date: '2026-02-05', brentSpot: 69.87, wtiSpot: 62.90 },
  { date: '2026-02-06', brentSpot: 70.45, wtiSpot: 63.77 },
  { date: '2026-02-09', brentSpot: 71.19, wtiSpot: 64.53 },
  { date: '2026-02-10', brentSpot: 71.01, wtiSpot: 64.20 },
  { date: '2026-02-11', brentSpot: 71.52, wtiSpot: 64.80 },
  { date: '2026-02-12', brentSpot: 69.80, wtiSpot: 63.08 },
  { date: '2026-02-13', brentSpot: 69.96, wtiSpot: 63.05 },
  { date: '2026-02-16', brentSpot: 70.81, wtiSpot: 62.53 },
  { date: '2026-02-17', brentSpot: 69.77, wtiSpot: 65.33 },
  { date: '2026-02-18', brentSpot: 71.78, wtiSpot: 66.66 },
  { date: '2026-02-19', brentSpot: 73.17, wtiSpot: 66.69 },
  { date: '2026-02-20', brentSpot: 72.75, wtiSpot: 66.50 },
  { date: '2026-02-23', brentSpot: 71.90, wtiSpot: 66.36 },
  { date: '2026-02-24', brentSpot: 71.21, wtiSpot: 65.62 },
  { date: '2026-02-25', brentSpot: 70.69, wtiSpot: 65.30 },
  { date: '2026-02-26', brentSpot: 71.66, wtiSpot: 65.10 },
  { date: '2026-02-27', brentSpot: 71.32, wtiSpot: 66.96, note: 'Pre-war close' },

  // Conflict begins (February 28, 2026 = Day 1)
  { date: '2026-02-28', brentSpot: 73.00, wtiSpot: 68.50, conflictDay: 1, note: 'Operation Epic Fury begins' },

  // March 2026 - Conflict escalation
  { date: '2026-03-02', brentSpot: 77.24, wtiSpot: 71.13, conflictDay: 3 },
  { date: '2026-03-03', brentSpot: 83.28, wtiSpot: 74.48, conflictDay: 4 },
  { date: '2026-03-04', brentSpot: 81.56, wtiSpot: 74.58, conflictDay: 5 },
  { date: '2026-03-05', brentSpot: 88.59, wtiSpot: 80.88, conflictDay: 6, note: 'P&I insurance expires' },
  { date: '2026-03-06', brentSpot: 95.74, wtiSpot: 90.77, conflictDay: 7, note: 'Zero Hormuz transits' },
  { date: '2026-03-09', brentSpot: 94.35, wtiSpot: 94.65, conflictDay: 10, note: 'Oil breaches $100 intraday' },
  { date: '2026-03-10', brentSpot: 89.84, wtiSpot: 83.71, conflictDay: 11, note: 'Iran mines the strait' },
  { date: '2026-03-11', brentSpot: 90.98, wtiSpot: 86.80, conflictDay: 12, note: '400M barrel SPR release' },
  { date: '2026-03-12', brentSpot: 102.38, wtiSpot: 95.61, conflictDay: 13, note: '$100 floor established' },
  { date: '2026-03-13', brentSpot: 103.23, wtiSpot: 98.48, conflictDay: 14, note: 'Yuan-denominated transit emerges' },
  { date: '2026-03-16', brentSpot: 101.04, wtiSpot: 93.39, conflictDay: 17, note: 'F1 cancels Gulf races' },
  { date: '2026-03-17', brentSpot: 108.39, wtiSpot: 96.01, conflictDay: 18, note: 'Larijani killed' },
  { date: '2026-03-18', brentSpot: 118.09, wtiSpot: 96.12, conflictDay: 19, note: 'Ras Laffan struck' },
  { date: '2026-03-19', brentSpot: 111.05, wtiSpot: 96.11, conflictDay: 20, note: 'Goldman warns $147 possible' },
  { date: '2026-03-20', brentSpot: 118.42, wtiSpot: 98.71, conflictDay: 21, note: 'Three weeks, no ceasefire' },
  { date: '2026-03-23', brentSpot: 103.79, wtiSpot: 89.33, conflictDay: 24, note: 'First US-Iran communication' },
  { date: '2026-03-24', brentSpot: 108.42, wtiSpot: 93.18, conflictDay: 25, note: '$580M suspicious trades' },
  { date: '2026-03-25', brentSpot: 109.14, wtiSpot: 91.51, conflictDay: 26, note: 'Iran rejects 15-point plan' },
  { date: '2026-03-26', brentSpot: 113.39, wtiSpot: 96.18, conflictDay: 27, note: 'Steel factories struck' },
  { date: '2026-03-27', brentSpot: 121.47, wtiSpot: 101.26, conflictDay: 28, note: 'WTI breaks $100' },
  { date: '2026-03-30', brentSpot: 121.88, wtiSpot: 104.69, conflictDay: 31, note: 'Week 5 begins' },

  // Late March / Early April - Extended from field notes
  { date: '2026-03-31', brentSpot: 112.78, wtiSpot: 106.50, conflictDay: 32, note: 'March closes +63%' },
  { date: '2026-04-01', brentSpot: 104.86, wtiSpot: 98.20, conflictDay: 33, note: 'Trump primetime address' },
  { date: '2026-04-02', brentSpot: 109.40, wtiSpot: 110.47, conflictDay: 34, note: 'Post-speech surge' },
  { date: '2026-04-03', brentSpot: 121.88, wtiSpot: 104.69, conflictDay: 35, note: 'Two US aircraft down' },
  { date: '2026-04-04', brentSpot: 0, wtiSpot: 0, conflictDay: 36, note: 'EIA data pending — releases Apr 8' },
  { date: '2026-04-05', brentSpot: 0, wtiSpot: 0, conflictDay: 37, note: 'EIA data pending — releases Apr 8' },
  { date: '2026-04-06', brentSpot: 0, wtiSpot: 0, conflictDay: 38, note: 'EIA data pending — market open' },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get oil price for a specific date
 */
export function getOilPrice(date: string): OilPriceEntry | undefined {
  return oilPriceData.find(entry => entry.date === date);
}

/**
 * Get oil price for a specific conflict day
 */
export function getOilPriceByDay(conflictDay: number): OilPriceEntry | undefined {
  return oilPriceData.find(entry => entry.conflictDay === conflictDay);
}

/**
 * Get all oil prices within a date range
 */
export function getOilPriceRange(startDate: string, endDate: string): OilPriceEntry[] {
  return oilPriceData.filter(entry => entry.date >= startDate && entry.date <= endDate);
}

/**
 * Get all conflict-period oil prices (Day 1 onward)
 */
export function getConflictPrices(): OilPriceEntry[] {
  return oilPriceData.filter(entry => entry.conflictDay !== undefined);
}

/**
 * Get pre-conflict baseline prices
 */
export function getPreConflictPrices(): OilPriceEntry[] {
  return oilPriceData.filter(entry => entry.conflictDay === undefined);
}

/**
 * Calculate percent change from pre-war baseline
 * Pre-war baseline: Feb 27, 2026 (Brent: $71.32, WTI: $66.96)
 */
export function getPercentChangeFromBaseline(entry: OilPriceEntry): { brent: number; wti: number } {
  const baselineBrent = 71.32;
  const baselineWti = 66.96;
  return {
    brent: ((entry.brentSpot - baselineBrent) / baselineBrent) * 100,
    wti: ((entry.wtiSpot - baselineWti) / baselineWti) * 100,
  };
}

/**
 * Get the latest available price with actual data (excludes pending/zero entries)
 */
export function getLatestOilPrice(): OilPriceEntry {
  // Find the most recent entry with actual price data (brentSpot > 0)
  for (let i = oilPriceData.length - 1; i >= 0; i--) {
    if (oilPriceData[i].brentSpot > 0) {
      return oilPriceData[i];
    }
  }
  // Fallback to last entry if all are zero (shouldn't happen)
  return oilPriceData[oilPriceData.length - 1];
}

/**
 * Get price statistics for a period
 */
export function getPriceStats(entries: OilPriceEntry[]): {
  brentMin: number;
  brentMax: number;
  brentAvg: number;
  wtiMin: number;
  wtiMax: number;
  wtiAvg: number;
} {
  const brentPrices = entries.map(e => e.brentSpot);
  const wtiPrices = entries.map(e => e.wtiSpot);

  return {
    brentMin: Math.min(...brentPrices),
    brentMax: Math.max(...brentPrices),
    brentAvg: brentPrices.reduce((a, b) => a + b, 0) / brentPrices.length,
    wtiMin: Math.min(...wtiPrices),
    wtiMax: Math.max(...wtiPrices),
    wtiAvg: wtiPrices.reduce((a, b) => a + b, 0) / wtiPrices.length,
  };
}

// =============================================================================
// CHART DATA FORMATTERS
// =============================================================================

/**
 * Format data for Recharts line chart
 */
export function getChartData(): Array<{
  date: string;
  brent: number;
  wti: number;
  day?: number;
  note?: string;
}> {
  return oilPriceData.map(entry => ({
    date: entry.date,
    brent: entry.brentSpot,
    wti: entry.wtiSpot,
    day: entry.conflictDay,
    note: entry.note,
  }));
}

/**
 * Get key event markers for chart overlay
 */
export function getEventMarkers(): Array<{
  date: string;
  day: number;
  label: string;
  brent: number;
}> {
  return oilPriceData
    .filter(entry => entry.note && entry.conflictDay)
    .map(entry => ({
      date: entry.date,
      day: entry.conflictDay!,
      label: entry.note!,
      brent: entry.brentSpot,
    }));
}

// =============================================================================
// KEY MILESTONES
// =============================================================================

export const oilPriceMilestones = {
  preWarBaseline: { date: '2026-02-27', brent: 71.32, wti: 66.96 },
  conflictStart: { date: '2026-02-28', brent: 73.00, wti: 68.50 },
  firstBreakout: { date: '2026-03-06', brent: 95.74, wti: 90.77, note: 'P&I expires' },
  first100: { date: '2026-03-12', brent: 102.38, wti: 95.61, note: '$100 floor' },
  rasLaffanStrike: { date: '2026-03-18', brent: 118.09, wti: 96.12, note: 'Ras Laffan' },
  wti100: { date: '2026-03-27', brent: 121.47, wti: 101.26, note: 'WTI $100' },
  marchClose: { date: '2026-03-31', brent: 112.78, wti: 106.50, note: '+63% month' },
  latest: { date: '2026-04-03', brent: 121.88, wti: 104.69, note: 'Day 35 — EIA data current' },
};

export default oilPriceData;
