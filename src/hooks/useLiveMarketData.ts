/**
 * Live Market Data Hook
 * Provides real-time oil prices from EIA and HY spreads from FRED
 * with automatic fallback to static data when APIs unavailable
 */

import { useState, useEffect, useCallback } from 'react';
import { getLatestOilPrices, isEIAApiConfigured, EIA_API_SOURCE_ATTRIBUTION } from '@/data/eiaApi';
import { getHYSpread, getAllHYSpreads, isFredApiConfigured, FRED_SOURCE_ATTRIBUTION } from '@/data/fredApi';
import { getLatestOilPrice } from '@/data/oilPriceData';

export interface LiveOilPrices {
  brent: number;
  wti: number;
  date: string;
  source: 'api' | 'static';
  isLive: boolean;
  attribution: string;
}

export interface LiveHYSpreads {
  hy: number;       // Total HY OAS
  bb?: number;      // BB tier
  b?: number;       // B tier
  ccc?: number;     // CCC tier
  source: 'api' | 'static';
  isLive: boolean;
  attribution: string;
}

export interface LiveMarketData {
  oil: LiveOilPrices | null;
  spreads: LiveHYSpreads | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

// Cache duration: 5 minutes for hook-level cache (API has 24hr cache)
const HOOK_CACHE_DURATION_MS = 5 * 60 * 1000;

let cachedOilData: LiveOilPrices | null = null;
let cachedSpreadData: LiveHYSpreads | null = null;
let lastFetchTime: number = 0;

/**
 * Hook for accessing live market data
 * @param options Configuration options
 * @returns Live market data with loading/error states
 */
export function useLiveMarketData(options: {
  fetchOil?: boolean;
  fetchSpreads?: boolean;
  fetchAllSpreadTiers?: boolean;
} = {}): LiveMarketData {
  const { fetchOil = true, fetchSpreads = true, fetchAllSpreadTiers = false } = options;

  const [oil, setOil] = useState<LiveOilPrices | null>(cachedOilData);
  const [spreads, setSpreads] = useState<LiveHYSpreads | null>(cachedSpreadData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    lastFetchTime ? new Date(lastFetchTime) : null
  );

  const fetchData = useCallback(async () => {
    const now = Date.now();

    // Use cache if available and fresh
    if (now - lastFetchTime < HOOK_CACHE_DURATION_MS && cachedOilData && cachedSpreadData) {
      setOil(cachedOilData);
      setSpreads(cachedSpreadData);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch oil prices
      if (fetchOil) {
        if (isEIAApiConfigured()) {
          const oilData = await getLatestOilPrices();
          const liveOil: LiveOilPrices = {
            ...oilData,
            isLive: oilData.source === 'api',
            attribution: EIA_API_SOURCE_ATTRIBUTION,
          };
          cachedOilData = liveOil;
          setOil(liveOil);
        } else {
          // Fallback to static data
          const staticOil = getLatestOilPrice();
          const fallbackOil: LiveOilPrices = {
            brent: staticOil.brentSpot,
            wti: staticOil.wtiSpot,
            date: staticOil.date,
            source: 'static',
            isLive: false,
            attribution: 'Source: U.S. Energy Information Administration (static)',
          };
          cachedOilData = fallbackOil;
          setOil(fallbackOil);
        }
      }

      // Fetch HY spreads
      if (fetchSpreads) {
        if (isFredApiConfigured()) {
          if (fetchAllSpreadTiers) {
            const allSpreads = await getAllHYSpreads();
            const liveSpreads: LiveHYSpreads = {
              ...allSpreads,
              source: 'api',
              isLive: true,
              attribution: FRED_SOURCE_ATTRIBUTION,
            };
            cachedSpreadData = liveSpreads;
            setSpreads(liveSpreads);
          } else {
            const hySpread = await getHYSpread();
            const liveSpreads: LiveHYSpreads = {
              hy: hySpread,
              source: 'api',
              isLive: true,
              attribution: FRED_SOURCE_ATTRIBUTION,
            };
            cachedSpreadData = liveSpreads;
            setSpreads(liveSpreads);
          }
        } else {
          // Fallback to static data
          const fallbackSpreads: LiveHYSpreads = {
            hy: 285, // Fallback value
            source: 'static',
            isLive: false,
            attribution: 'Source: ICE Data Indices, LLC via FRED (static)',
          };
          cachedSpreadData = fallbackSpreads;
          setSpreads(fallbackSpreads);
        }
      }

      lastFetchTime = now;
      setLastUpdated(new Date(now));
    } catch (err) {
      console.error('Error fetching live market data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');

      // Use static fallbacks on error
      if (fetchOil && !cachedOilData) {
        const staticOil = getLatestOilPrice();
        setOil({
          brent: staticOil.brentSpot,
          wti: staticOil.wtiSpot,
          date: staticOil.date,
          source: 'static',
          isLive: false,
          attribution: 'Source: U.S. Energy Information Administration (static)',
        });
      }
      if (fetchSpreads && !cachedSpreadData) {
        setSpreads({
          hy: 285,
          source: 'static',
          isLive: false,
          attribution: 'Source: ICE Data Indices, LLC via FRED (static)',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchOil, fetchSpreads, fetchAllSpreadTiers]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    oil,
    spreads,
    isLoading,
    error,
    lastUpdated,
    refresh: fetchData,
  };
}

/**
 * Simple hook for just oil prices
 */
export function useLiveOilPrice() {
  const { oil, isLoading, error, lastUpdated, refresh } = useLiveMarketData({
    fetchOil: true,
    fetchSpreads: false,
  });
  return { oil, isLoading, error, lastUpdated, refresh };
}

/**
 * Simple hook for just HY spreads
 */
export function useLiveHYSpread() {
  const { spreads, isLoading, error, lastUpdated, refresh } = useLiveMarketData({
    fetchOil: false,
    fetchSpreads: true,
  });
  return { spreads, isLoading, error, lastUpdated, refresh };
}

export default useLiveMarketData;
