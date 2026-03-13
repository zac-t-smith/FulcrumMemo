// AIS Stream Integration via AISStream.io WebSocket with Agent Server Fallback

export interface VesselPosition {
  mmsi: string;
  name: string;
  lat: number;
  lon: number;
  speed: number;
  heading: number;
  shipType: number;
  lastUpdate: Date;
  source?: 'ais' | 'event-derived';
}

export interface AISStreamState {
  isConnected: boolean;
  vessels: Map<string, VesselPosition>;
  vesselCount: number;
  lastMessage: Date | null;
  error: string | null;
  mode: 'websocket' | 'fallback' | 'disconnected';
}

const AIS_WS_URL = 'wss://stream.aisstream.io/v0/stream';
const FALLBACK_API_URL = 'http://localhost:3001/api/vessels';
const MAX_VESSELS = 200; // PERFORMANCE: reduced from 300
const RECONNECT_DELAY = 5000;
const WS_TIMEOUT = 10000; // 10 seconds to receive first message

let ws: WebSocket | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let wsTimeout: ReturnType<typeof setTimeout> | null = null;
let fallbackInterval: ReturnType<typeof setInterval> | null = null;
let vessels = new Map<string, VesselPosition>();
let listeners: Array<(state: AISStreamState) => void> = [];
let isConnected = false;
let lastMessage: Date | null = null;
let lastError: string | null = null;
let firstMessageReceived = false;
let usingFallback = false;

function getState(): AISStreamState {
  return {
    isConnected,
    vessels: new Map(vessels),
    vesselCount: vessels.size,
    lastMessage,
    error: lastError,
    mode: usingFallback ? 'fallback' : (isConnected ? 'websocket' : 'disconnected')
  };
}

function notify() {
  const state = getState();
  listeners.forEach(fn => {
    try {
      fn(state);
    } catch (e) {
      console.error('[AISStream] Listener error:', e);
    }
  });
}

function getShipTypeCategory(typeCode: number): 'tanker' | 'cargo' | 'military' | 'other' {
  if (typeCode >= 80 && typeCode <= 89) return 'tanker';
  if (typeCode >= 70 && typeCode <= 79) return 'cargo';
  if (typeCode === 35) return 'military';
  return 'other';
}

function handleMessage(data: unknown) {
  try {
    const msg = data as {
      MessageType?: string;
      Message?: {
        PositionReport?: {
          UserID: number;
          Latitude: number;
          Longitude: number;
          Sog: number;
          TrueHeading: number;
        };
      };
      MetaData?: {
        MMSI: number;
        ShipName?: string;
        ShipType?: number;
      };
    };

    if (msg.MessageType !== 'PositionReport') return;

    const pos = msg.Message?.PositionReport;
    const meta = msg.MetaData;

    if (!pos || !meta) return;

    const mmsi = String(meta.MMSI);
    const vessel: VesselPosition = {
      mmsi,
      name: meta.ShipName?.trim() || `MMSI ${mmsi}`,
      lat: pos.Latitude,
      lon: pos.Longitude,
      speed: pos.Sog,
      heading: pos.TrueHeading,
      shipType: meta.ShipType || 0,
      lastUpdate: new Date(),
      source: 'ais'
    };

    // Update or add vessel
    vessels.set(mmsi, vessel);

    // Prune if over limit (remove oldest)
    if (vessels.size > MAX_VESSELS) {
      const entries = Array.from(vessels.entries());
      entries.sort((a, b) => a[1].lastUpdate.getTime() - b[1].lastUpdate.getTime());
      const toRemove = entries.slice(0, entries.length - MAX_VESSELS);
      toRemove.forEach(([key]) => vessels.delete(key));
    }

    lastMessage = new Date();
    notify();
  } catch (e) {
    console.error('[AISStream] Message parse error:', e);
  }
}

// Fallback: Fetch vessel positions from agent server
async function fetchFallbackVessels() {
  try {
    const response = await fetch(FALLBACK_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data.success || !data.vessels) {
      throw new Error('Invalid vessels response');
    }

    // Clear existing vessels and load from fallback
    vessels.clear();
    data.vessels.forEach((v: {
      mmsi: string;
      name: string;
      lat: number;
      lon: number;
      speed: number;
      heading: number;
      shipType: number;
      lastUpdate: string;
    }) => {
      vessels.set(v.mmsi, {
        ...v,
        lastUpdate: new Date(v.lastUpdate),
        source: 'event-derived'
      });
    });

    lastMessage = new Date();
    isConnected = true;
    lastError = null;
    console.log(`[AIS] Fallback loaded ${data.vessels.length} vessel positions from events`);
    notify();
  } catch (error) {
    console.error('[AIS] Fallback fetch error:', error);
    lastError = 'Fallback fetch failed';
    notify();
  }
}

function startFallbackMode() {
  if (usingFallback) return;

  console.log('[AIS] Switching to fallback mode (agent server)');
  usingFallback = true;

  // Stop WebSocket
  if (ws) {
    ws.close();
    ws = null;
  }
  if (wsTimeout) {
    clearTimeout(wsTimeout);
    wsTimeout = null;
  }

  // Initial fallback fetch
  fetchFallbackVessels();

  // Poll every 30 seconds
  fallbackInterval = setInterval(fetchFallbackVessels, 30000);
}

function connect() {
  const apiKey = import.meta.env.VITE_AISSTREAM_API_KEY;

  console.log('[AIS] API key present:', !!apiKey);

  if (!apiKey) {
    console.warn('[AIS] No API key found (VITE_AISSTREAM_API_KEY) - using fallback');
    startFallbackMode();
    return;
  }

  console.log('[AIS] Connecting to AISStream.io...');
  firstMessageReceived = false;

  try {
    ws = new WebSocket(AIS_WS_URL);

    // Set timeout for first message
    wsTimeout = setTimeout(() => {
      if (!firstMessageReceived) {
        console.warn('[AIS] No message received within 10s - switching to fallback');
        startFallbackMode();
      }
    }, WS_TIMEOUT);

    ws.onopen = () => {
      console.log('[AIS] Connected to AISStream');
      isConnected = true;
      lastError = null;

      // Subscribe to expanded coverage for Cape diversion tracking:
      // Persian Gulf, Arabian Sea, Indian Ocean, Cape of Good Hope
      const subscriptionMessage = {
        APIKey: apiKey,
        BoundingBoxes: [
          [[20.0, 48.0], [28.0, 62.0]],    // Persian Gulf + Strait of Hormuz
          [[10.0, 40.0], [25.0, 55.0]],    // Red Sea + Gulf of Aden + Bab el-Mandeb
          [[0.0, 50.0], [20.0, 75.0]],     // Arabian Sea (tanker corridor)
          [[-15.0, 40.0], [5.0, 60.0]],    // Western Indian Ocean
          [[-40.0, 15.0], [-25.0, 35.0]],  // Cape of Good Hope region
          [[-35.0, -5.0], [-20.0, 20.0]]   // South Atlantic (Cape route)
        ],
        FilterMessageTypes: ['PositionReport']
      };

      console.log('[AIS] Sending subscription:', JSON.stringify(subscriptionMessage));
      ws?.send(JSON.stringify(subscriptionMessage));
      notify();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (!firstMessageReceived) {
          console.log('[AIS] First message received:', data.MessageType || 'unknown type');
          firstMessageReceived = true;
          // Clear timeout since we got a message
          if (wsTimeout) {
            clearTimeout(wsTimeout);
            wsTimeout = null;
          }
        }

        handleMessage(data);
      } catch (e) {
        console.error('[AIS] JSON parse error:', e);
      }
    };

    ws.onerror = (event) => {
      console.error('[AIS] WebSocket error:', event);
      lastError = 'WebSocket error';
      notify();
    };

    ws.onclose = (event) => {
      console.log('[AISStream] Disconnected, code:', event.code);
      isConnected = false;
      ws = null;

      if (wsTimeout) {
        clearTimeout(wsTimeout);
        wsTimeout = null;
      }

      // If we never got messages, switch to fallback
      if (!firstMessageReceived && !usingFallback) {
        console.log('[AIS] Connection failed without receiving data - using fallback');
        startFallbackMode();
        return;
      }

      // If not using fallback, try to reconnect
      if (!usingFallback) {
        notify();
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(() => {
          console.log('[AISStream] Attempting reconnect...');
          connect();
        }, RECONNECT_DELAY);
      }
    };
  } catch (e) {
    console.error('[AISStream] Connection error:', e);
    lastError = String(e);
    startFallbackMode();
  }
}

export function startAISStream() {
  if (ws || usingFallback) {
    console.log('[AISStream] Already running');
    return;
  }
  connect();
}

export function stopAISStream() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  if (wsTimeout) {
    clearTimeout(wsTimeout);
    wsTimeout = null;
  }
  if (fallbackInterval) {
    clearInterval(fallbackInterval);
    fallbackInterval = null;
  }
  if (ws) {
    ws.close();
    ws = null;
  }
  isConnected = false;
  usingFallback = false;
  notify();
}

export function subscribeToAISStream(fn: (state: AISStreamState) => void): () => void {
  listeners.push(fn);
  fn(getState());
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

export function getVessels(): VesselPosition[] {
  return Array.from(vessels.values());
}

export function getVesselCount(): number {
  return vessels.size;
}

export { getShipTypeCategory };
