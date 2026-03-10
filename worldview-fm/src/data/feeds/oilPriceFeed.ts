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
}

export interface OilPriceState {
  brent: OilPrice | null;
  wti: OilPrice | null;
  isLoading: boolean;
  error: string | null;
}

const AGENT_API_URL = 'http://localhost:3001/api/market';
const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

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

  console.log('[OilPrice] Starting price feed via agent proxy...');

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
