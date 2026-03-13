// Live Oil Price Feed via Agent Server Proxy (avoids CORS issues)

export interface OilPrice {
  symbol: string;
  name: string;
  price: number;
  previousPrice: number | null;
  change: number;
  changePercent: number;
  direction: 'up' | 'down' | 'unchanged';
  lastUpdate: Date;
  isStatic?: boolean;
}

export interface OilPriceState {
  brent: OilPrice | null;
  wti: OilPrice | null;
  isLoading: boolean;
  error: string | null;
  isStatic?: boolean;
}

// Configurable agent URL - defaults to localhost for dev
const AGENT_URL = import.meta.env.VITE_AGENT_URL || 'http://localhost:3001';
const AGENT_API_URL = `${AGENT_URL}/api/market`;
const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Only use static fallback if NO agent URL is configured AND we're on GitHub Pages
const USE_STATIC_ONLY = !import.meta.env.VITE_AGENT_URL &&
                        window.location.hostname.includes('github.io');

// Static fallback prices for GitHub Pages (last known values from anchor events)
const STATIC_BRENT: OilPrice = {
  symbol: 'BZ=F',
  name: 'Brent Crude',
  price: 108.75,
  previousPrice: null,
  change: 0,
  changePercent: 0,
  direction: 'unchanged',
  lastUpdate: new Date(),
  isStatic: true
};

const STATIC_WTI: OilPrice = {
  symbol: 'CL=F',
  name: 'WTI Crude',
  price: 108.62,
  previousPrice: null,
  change: 0,
  changePercent: 0,
  direction: 'unchanged',
  lastUpdate: new Date(),
  isStatic: true
};

let currentState: OilPriceState = {
  brent: null,
  wti: null,
  isLoading: false,
  error: null
};

let pollInterval: ReturnType<typeof setInterval> | null = null;
let listeners: Array<(state: OilPriceState) => void> = [];

function notify() {
  listeners.forEach(fn => {
    try {
      fn({ ...currentState });
    } catch (e) {
      console.error('[OilPrice] Listener error:', e);
    }
  });
}

async function fetchPrices() {
  currentState = { ...currentState, isLoading: true };
  notify();

  try {
    const response = await fetch(AGENT_API_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.brent || !data.wti) {
      throw new Error('Invalid market data response');
    }

    // Determine direction based on previous prices
    const prevBrentPrice = currentState.brent?.price || null;
    const prevWtiPrice = currentState.wti?.price || null;

    const getBrentDirection = (): 'up' | 'down' | 'unchanged' => {
      if (prevBrentPrice === null) return 'unchanged';
      if (data.brent > prevBrentPrice) return 'up';
      if (data.brent < prevBrentPrice) return 'down';
      return 'unchanged';
    };

    const getWtiDirection = (): 'up' | 'down' | 'unchanged' => {
      if (prevWtiPrice === null) return 'unchanged';
      if (data.wti > prevWtiPrice) return 'up';
      if (data.wti < prevWtiPrice) return 'down';
      return 'unchanged';
    };

    const brent: OilPrice = {
      symbol: 'BZ=F',
      name: 'Brent Crude',
      price: data.brent,
      previousPrice: prevBrentPrice,
      change: data.brentChange * data.brent / 100, // Convert % back to $
      changePercent: data.brentChange,
      direction: getBrentDirection(),
      lastUpdate: new Date(data.timestamp)
    };

    const wti: OilPrice = {
      symbol: 'CL=F',
      name: 'WTI Crude',
      price: data.wti,
      previousPrice: prevWtiPrice,
      change: data.wtiChange * data.wti / 100,
      changePercent: data.wtiChange,
      direction: getWtiDirection(),
      lastUpdate: new Date(data.timestamp)
    };

    currentState = {
      brent,
      wti,
      isLoading: false,
      error: null
    };

    console.log('[OilPrice] Updated via proxy:',
      `Brent $${brent.price.toFixed(2)} (${brent.changePercent >= 0 ? '+' : ''}${brent.changePercent.toFixed(2)}%)`,
      `WTI $${wti.price.toFixed(2)} (${wti.changePercent >= 0 ? '+' : ''}${wti.changePercent.toFixed(2)}%)`
    );
  } catch (error) {
    console.error('[OilPrice] Fetch error:', error);
    currentState = {
      ...currentState,
      isLoading: false,
      error: String(error)
    };
  }

  notify();
}

export function startOilPriceFeed() {
  if (pollInterval) {
    console.log('[OilPrice] Already running');
    return;
  }

  // Only use static fallback if no agent URL configured and on GitHub Pages
  if (USE_STATIC_ONLY) {
    console.log('[OilPrice] Static mode: no VITE_AGENT_URL configured');
    currentState = {
      brent: STATIC_BRENT,
      wti: STATIC_WTI,
      isLoading: false,
      error: null,
      isStatic: true
    };
    notify();
    return;
  }

  console.log('[OilPrice] Live mode: connecting to', AGENT_URL);

  // Initial fetch
  fetchPrices();

  // Poll every 5 minutes
  pollInterval = setInterval(fetchPrices, POLL_INTERVAL);
}

export function stopOilPriceFeed() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
}

export function subscribeToOilPrices(fn: (state: OilPriceState) => void): () => void {
  listeners.push(fn);
  fn({ ...currentState });
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

export function getOilPriceState(): OilPriceState {
  return { ...currentState };
}

export function refreshOilPrices() {
  fetchPrices();
}
