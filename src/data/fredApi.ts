/**
 * FRED API Integration
 * Fetches High Yield OAS (Option-Adjusted Spread) and VIX data from Federal Reserve Economic Data
 *
 * Credit Series:
 * - BAMLH0A0HYM2: ICE BofA US High Yield Index Option-Adjusted Spread
 * - BAMLH0A1HYBB: ICE BofA BB US High Yield Index OAS
 * - BAMLH0A2HYB: ICE BofA B US High Yield Index OAS
 * - BAMLH0A3HYC: ICE BofA CCC & Lower US High Yield Index OAS
 *
 * Volatility Series:
 * - VIXCLS: CBOE Volatility Index (VIX)
 *
 * Source: ICE Data Indices, LLC; CBOE via FRED, Federal Reserve Bank of St. Louis
 */

export const FRED_SOURCE_ATTRIBUTION = 'Source: ICE Data Indices, LLC via FRED, Federal Reserve Bank of St. Louis';
export const VIX_SOURCE_ATTRIBUTION = 'Source: CBOE via FRED, Federal Reserve Bank of St. Louis';

const FRED_API_BASE = 'https://api.stlouisfed.org/fred/series/observations';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Fallback values if API fails (based on recent data)
const FALLBACK_VALUES = {
  BAMLH0A0HYM2: 285, // HY OAS (bps)
  BAMLH0A1HYBB: 185, // BB OAS (bps)
  BAMLH0A2HYB: 295,  // B OAS (bps)
  BAMLH0A3HYC: 750,  // CCC OAS (bps)
  VIXCLS: 18.5,      // VIX (index points)
};

// Series that are already in the correct units (not percentages needing conversion to bps)
const NO_CONVERSION_SERIES = new Set(['VIXCLS']);

export type FredSeriesId = keyof typeof FALLBACK_VALUES;

interface FredObservation {
  date: string;
  value: string;
}

interface FredResponse {
  observations: FredObservation[];
}

interface CacheEntry {
  value: number;
  timestamp: number;
  seriesId: FredSeriesId;
}

// In-memory cache
const cache: Map<FredSeriesId, CacheEntry> = new Map();

/**
 * Get the FRED API key from environment
 */
function getApiKey(): string | undefined {
  return import.meta.env.VITE_FRED_API_KEY;
}

/**
 * Fetch the latest value for a FRED series
 */
async function fetchFredSeries(seriesId: FredSeriesId): Promise<number | null> {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn(`FRED API key not configured, using fallback for ${seriesId}`);
    return null;
  }

  try {
    const params = new URLSearchParams({
      series_id: seriesId,
      api_key: apiKey,
      file_type: 'json',
      sort_order: 'desc',
      limit: '10', // Get last 10 observations to handle missing data
    });

    const response = await fetch(`${FRED_API_BASE}?${params}`);

    if (!response.ok) {
      console.error(`FRED API error for ${seriesId}: ${response.status}`);
      return null;
    }

    const data: FredResponse = await response.json();

    if (!data.observations || data.observations.length === 0) {
      console.warn(`No observations found for ${seriesId}`);
      return null;
    }

    // Find the first valid (non-missing) observation
    for (const obs of data.observations) {
      if (obs.value !== '.' && obs.value !== '') {
        const value = parseFloat(obs.value);
        if (!isNaN(value)) {
          // VIX is already in index points; HY spreads need conversion to bps
          return NO_CONVERSION_SERIES.has(seriesId) ? value : value * 100;
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`Error fetching FRED series ${seriesId}:`, error);
    return null;
  }
}

/**
 * Get HY spread data with caching
 */
export async function getHYSpread(seriesId: FredSeriesId = 'BAMLH0A0HYM2'): Promise<number> {
  // Check cache
  const cached = cache.get(seriesId);
  const now = Date.now();

  if (cached && (now - cached.timestamp) < CACHE_DURATION_MS) {
    return cached.value;
  }

  // Fetch fresh data
  const freshValue = await fetchFredSeries(seriesId);

  if (freshValue !== null) {
    cache.set(seriesId, {
      value: freshValue,
      timestamp: now,
      seriesId,
    });
    return freshValue;
  }

  // Return cached value even if expired, or fallback
  if (cached) {
    console.warn(`Using stale cache for ${seriesId}`);
    return cached.value;
  }

  console.warn(`Using fallback value for ${seriesId}: ${FALLBACK_VALUES[seriesId]} bps`);
  return FALLBACK_VALUES[seriesId];
}

/**
 * Get all HY spread tiers
 */
export async function getAllHYSpreads(): Promise<{
  hy: number;
  bb: number;
  b: number;
  ccc: number;
}> {
  const [hy, bb, b, ccc] = await Promise.all([
    getHYSpread('BAMLH0A0HYM2'),
    getHYSpread('BAMLH0A1HYBB'),
    getHYSpread('BAMLH0A2HYB'),
    getHYSpread('BAMLH0A3HYC'),
  ]);

  return { hy, bb, b, ccc };
}

/**
 * Clear the cache (useful for testing or forcing refresh)
 */
export function clearFredCache(): void {
  cache.clear();
}

/**
 * Check if FRED API is configured
 */
export function isFredApiConfigured(): boolean {
  return !!getApiKey();
}

/**
 * Get VIX (CBOE Volatility Index) with caching
 */
export async function getVix(): Promise<number> {
  return getHYSpread('VIXCLS');
}
