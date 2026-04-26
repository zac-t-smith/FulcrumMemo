/**
 * EIA API Integration
 * Fetches crude oil spot prices and gasoline prices from U.S. Energy Information Administration
 *
 * Oil Series (petroleum/pri/spt):
 * - RBRTE: Brent Crude Oil Spot Price FOB ($/barrel)
 * - RWTC: WTI Cushing Oklahoma Crude Oil Spot Price FOB ($/barrel)
 *
 * Gasoline Series (petroleum/pri/gnd):
 * - EMM_EPM0_PTE_NUS_DPG: US Regular All Formulations Retail Gasoline Prices ($/gallon)
 *
 * Source: U.S. Energy Information Administration
 */

import { oilPriceData, getLatestOilPrice, OilPriceEntry } from './oilPriceData';

export const EIA_API_SOURCE_ATTRIBUTION = 'Source: U.S. Energy Information Administration';
export const EIA_GAS_SOURCE_ATTRIBUTION = 'Source: U.S. Energy Information Administration, Gasoline Prices';

const EIA_OIL_API_BASE = 'https://api.eia.gov/v2/petroleum/pri/spt/data/';
const EIA_GAS_API_BASE = 'https://api.eia.gov/v2/petroleum/pri/gnd/data/';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Fallback gas price (current national average approximation)
const FALLBACK_GAS_PRICE = 3.50;

interface EIADataPoint {
  period: string;
  value: number;
  'series-description': string;
}

interface EIAResponse {
  response: {
    data: EIADataPoint[];
  };
}

interface CacheEntry {
  brent: number;
  wti: number;
  date: string;
  timestamp: number;
}

// In-memory cache
let priceCache: CacheEntry | null = null;

interface GasCacheEntry {
  price: number;
  date: string;
  timestamp: number;
}

let gasCache: GasCacheEntry | null = null;

/**
 * Get the EIA API key from environment
 */
function getApiKey(): string | undefined {
  return import.meta.env.VITE_EIA_API_KEY;
}

/**
 * Fetch latest Brent price from EIA API
 */
async function fetchBrentPrice(): Promise<{ price: number; date: string } | null> {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn('EIA API key not configured');
    return null;
  }

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      frequency: 'daily',
      'data[0]': 'value',
      'facets[series][]': 'RBRTE',
      sort: 'period:desc',
      length: '10',
    });

    const response = await fetch(`${EIA_OIL_API_BASE}?${params}`);

    if (!response.ok) {
      console.error(`EIA API error for Brent: ${response.status}`);
      return null;
    }

    const data: EIAResponse = await response.json();

    if (!data.response?.data || data.response.data.length === 0) {
      console.warn('No Brent data from EIA');
      return null;
    }

    // Find first valid observation
    for (const point of data.response.data) {
      if (point.value && !isNaN(point.value)) {
        return { price: point.value, date: point.period };
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching Brent price from EIA:', error);
    return null;
  }
}

/**
 * Fetch latest WTI price from EIA API
 */
async function fetchWTIPrice(): Promise<{ price: number; date: string } | null> {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn('EIA API key not configured');
    return null;
  }

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      frequency: 'daily',
      'data[0]': 'value',
      'facets[series][]': 'RWTC',
      sort: 'period:desc',
      length: '10',
    });

    const response = await fetch(`${EIA_OIL_API_BASE}?${params}`);

    if (!response.ok) {
      console.error(`EIA API error for WTI: ${response.status}`);
      return null;
    }

    const data: EIAResponse = await response.json();

    if (!data.response?.data || data.response.data.length === 0) {
      console.warn('No WTI data from EIA');
      return null;
    }

    // Find first valid observation
    for (const point of data.response.data) {
      if (point.value && !isNaN(point.value)) {
        return { price: point.value, date: point.period };
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching WTI price from EIA:', error);
    return null;
  }
}

/**
 * Fetch latest US gas price from EIA API
 */
async function fetchGasPrice(): Promise<{ price: number; date: string } | null> {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn('EIA API key not configured');
    return null;
  }

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      frequency: 'weekly',
      'data[0]': 'value',
      'facets[series][]': 'EMM_EPM0_PTE_NUS_DPG',
      sort: 'period:desc',
      length: '10',
    });

    const response = await fetch(`${EIA_GAS_API_BASE}?${params}`);

    if (!response.ok) {
      console.error(`EIA API error for Gas: ${response.status}`);
      return null;
    }

    const data: EIAResponse = await response.json();

    if (!data.response?.data || data.response.data.length === 0) {
      console.warn('No gas data from EIA');
      return null;
    }

    // Find first valid observation
    for (const point of data.response.data) {
      if (point.value && !isNaN(point.value)) {
        return { price: point.value, date: point.period };
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching gas price from EIA:', error);
    return null;
  }
}

/**
 * Get latest US gas price with caching
 */
export async function getLatestGasPrice(): Promise<{
  price: number;
  date: string;
  source: 'api' | 'static';
}> {
  const now = Date.now();

  // Check cache
  if (gasCache && (now - gasCache.timestamp) < CACHE_DURATION_MS) {
    return {
      price: gasCache.price,
      date: gasCache.date,
      source: 'api',
    };
  }

  // Try to fetch from API
  const result = await fetchGasPrice();

  if (result) {
    gasCache = {
      price: result.price,
      date: result.date,
      timestamp: now,
    };

    return {
      price: result.price,
      date: result.date,
      source: 'api',
    };
  }

  // Fallback to static data
  console.warn('Using static gas price data as fallback');

  return {
    price: FALLBACK_GAS_PRICE,
    date: 'N/A',
    source: 'static',
  };
}

/**
 * Get latest oil prices with caching
 * Tries API first, falls back to hardcoded oilPriceData
 */
export async function getLatestOilPrices(): Promise<{
  brent: number;
  wti: number;
  date: string;
  source: 'api' | 'static';
}> {
  const now = Date.now();

  // Check cache
  if (priceCache && (now - priceCache.timestamp) < CACHE_DURATION_MS) {
    return {
      brent: priceCache.brent,
      wti: priceCache.wti,
      date: priceCache.date,
      source: 'api',
    };
  }

  // Try to fetch from API
  const [brentResult, wtiResult] = await Promise.all([
    fetchBrentPrice(),
    fetchWTIPrice(),
  ]);

  if (brentResult && wtiResult) {
    priceCache = {
      brent: brentResult.price,
      wti: wtiResult.price,
      date: brentResult.date, // Use Brent date as reference
      timestamp: now,
    };

    return {
      brent: brentResult.price,
      wti: wtiResult.price,
      date: brentResult.date,
      source: 'api',
    };
  }

  // Fallback to static data
  const fallback = getLatestOilPrice();
  console.warn('Using static oil price data as fallback');

  return {
    brent: fallback.brentSpot,
    wti: fallback.wtiSpot,
    date: fallback.date,
    source: 'static',
  };
}

/**
 * Get oil price for a specific date
 * First checks API cache, then falls back to static data
 */
export function getOilPriceForDate(date: string): OilPriceEntry | undefined {
  return oilPriceData.find(entry => entry.date === date);
}

/**
 * Clear the cache (useful for testing or forcing refresh)
 */
export function clearEIACache(): void {
  priceCache = null;
  gasCache = null;
}

/**
 * Check if EIA API is configured
 */
export function isEIAApiConfigured(): boolean {
  return !!getApiKey();
}

/**
 * Get price change from pre-war baseline
 * Uses latest available data (API or static)
 */
export async function getPriceChangeFromBaseline(): Promise<{
  brent: { current: number; baseline: number; change: number; changePercent: number };
  wti: { current: number; baseline: number; change: number; changePercent: number };
}> {
  const latest = await getLatestOilPrices();
  const baseline = { brent: 71.32, wti: 66.96 }; // Feb 27, 2026 pre-war close

  return {
    brent: {
      current: latest.brent,
      baseline: baseline.brent,
      change: latest.brent - baseline.brent,
      changePercent: ((latest.brent - baseline.brent) / baseline.brent) * 100,
    },
    wti: {
      current: latest.wti,
      baseline: baseline.wti,
      change: latest.wti - baseline.wti,
      changePercent: ((latest.wti - baseline.wti) / baseline.wti) * 100,
    },
  };
}
