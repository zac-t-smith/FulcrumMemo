// OpenSky Network Flight Tracking
// Free API, no key required for anonymous access
// PERFORMANCE OPTIMIZED: 60s updates, 100 flight cap, no trails

export interface FlightPosition {
  icao24: string;
  callsign: string;
  lat: number;
  lon: number;
  altitude: number; // meters
  velocity: number; // m/s
  heading: number; // degrees
  verticalRate: number; // m/s
  onGround: boolean;
  originCountry: string;
  lastContact: Date;
  category: 'military' | 'commercial' | 'unknown';
}

export interface OpenSkyState {
  flights: FlightPosition[];
  isConnected: boolean;
  lastUpdate: Date | null;
  error: string | null;
  militaryCount: number;
  totalCount: number;
}

// Extended bounding box for Middle East theater
const BBOX = {
  lamin: 10,
  lomin: 30,
  lamax: 45,
  lomax: 75
};

const OPENSKY_URL = `https://opensky-network.org/api/states/all?lamin=${BBOX.lamin}&lomin=${BBOX.lomin}&lamax=${BBOX.lamax}&lomax=${BBOX.lomax}`;
const POLL_INTERVAL = 60 * 1000; // 60 seconds (performance optimization)
const MAX_FLIGHTS = 100; // Cap for performance

// Military callsign patterns
const MILITARY_PATTERNS = [
  /^RCH/,      // Air Mobility Command
  /^REACH/,   // Air Mobility Command
  /^LAGR/,    // Logistics airlift
  /^CHAOS/,   // Special ops
  /^JAKE/,    // Military
  /^KNIFE/,   // Military
  /^SLAM/,    // Military
  /^VIPER/,   // Fighter callsign
  /^ROCKY/,   // Military
  /^FORTE/,   // RQ-4 Global Hawk
  /^USAF/,    // US Air Force
  /^TOPGUN/,  // Navy Fighter Weapons School
  /^VENUS/,   // Tanker
  /^GHOST/,   // Stealth
  /^DEMON/,   // Military
  /^DARK/,    // Special ops
  /^EAGLE/,   // Fighter
  /^HAWK/,    // Fighter
  /^RAVEN/,   // Surveillance
  /^FURY/,    // Op Epic Fury callsigns
  /^DOOM/,    // B-52 callsign
  /^TANK/,    // Tanker
  /^BONE/,    // B-1 Lancer
  /^BUFF/,    // B-52 nickname
  /^DRAGN/,   // Dragon
  /^MAKO/,    // Fighter
  /^SPEAR/,   // Strike
  /^IRON/,    // Military
  /^STEEL/,   // Military
  /^COBRA/,   // Attack helicopter
  /^RAZOR/,   // Military
  /^STORM/,   // Military
  /^THUD/,    // F-105 (legacy)
  /^VENOM/,   // Military
  /^HAVOC/,   // Apache
  /^REAPER/,  // MQ-9
  /^PRED/,    // MQ-1 Predator
  /^SNTRY/,   // AWACS
  /^AWACS/,   // AWACS
  /^MAGIC/,   // AWACS
  /^RIVET/,   // Reconnaissance
  /^JSTARS/,  // E-8
  /^RAF/,     // Royal Air Force
  /^RRR/,     // Royal Air Force
  /^IAF/,     // Israeli Air Force
  /^ISRA/,    // Israeli
  /^NAVY/,    // US Navy
  /^ARMY/,    // US Army
  /^DUKE/,    // C-17 common
  /^ATLAS/,   // C-17/heavy lift
  /^GORDO/,   // KC-135
  /^SHELL/,   // Tanker
  /^TEXAN/,   // T-6 trainer
  /^PACK/,    // Pack callsigns
  /^NITRO/,   // Fighter
  /^KILLER/,  // Attack
  /^BANDIT/,  // Fighter
];

// US Military ICAO24 hex ranges
// AE0000-AFFFFF is US military block
function isMilitaryIcao24(icao24: string): boolean {
  if (!icao24 || icao24.length !== 6) return false;
  const hex = icao24.toLowerCase();
  // US Military: AE0000 to AFFFFF
  if (hex >= 'ae0000' && hex <= 'afffff') return true;
  // Additional military blocks
  // UK Military: 43C000-43CFFF
  if (hex >= '43c000' && hex <= '43cfff') return true;
  return false;
}

let currentState: OpenSkyState = {
  flights: [],
  isConnected: false,
  lastUpdate: null,
  error: null,
  militaryCount: 0,
  totalCount: 0
};

let pollInterval: ReturnType<typeof setInterval> | null = null;
let listeners: Array<(state: OpenSkyState) => void> = [];

function notify() {
  listeners.forEach(fn => {
    try {
      fn({ ...currentState });
    } catch (e) {
      console.error('[OpenSky] Listener error:', e);
    }
  });
}

function isMilitaryCallsign(callsign: string): boolean {
  if (!callsign) return false;
  const upper = callsign.trim().toUpperCase();
  return MILITARY_PATTERNS.some(pattern => pattern.test(upper));
}

function isMilitaryFlight(icao24: string, callsign: string): boolean {
  // Check ICAO24 hex range first (most reliable)
  if (isMilitaryIcao24(icao24)) return true;
  // Then check callsign patterns
  return isMilitaryCallsign(callsign);
}

async function fetchFlights() {
  try {
    const response = await fetch(OPENSKY_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.states || !Array.isArray(data.states)) {
      throw new Error('Invalid response format');
    }

    const flights: FlightPosition[] = [];
    let militaryCount = 0;

    for (const state of data.states) {
      // Early exit if we hit cap
      if (flights.length >= MAX_FLIGHTS) break;

      const [
        icao24,      // 0
        callsign,    // 1
        originCountry, // 2
        _timePosition, // 3
        lastContact, // 4
        lon,         // 5
        lat,         // 6
        baroAlt,     // 7
        onGround,    // 8
        velocity,    // 9
        heading,     // 10
        verticalRate, // 11
        _sensors,    // 12
        geoAlt,      // 13
        _squawk,     // 14
        _spi,        // 15
        _category    // 16
      ] = state;

      // Skip if no position
      if (lat === null || lon === null) continue;

      const callsignStr = callsign?.trim() || '';
      const isMilitary = isMilitaryFlight(icao24, callsignStr);

      if (isMilitary) militaryCount++;

      flights.push({
        icao24,
        callsign: callsignStr,
        lat,
        lon,
        altitude: geoAlt || baroAlt || 0,
        velocity: velocity || 0,
        heading: heading || 0,
        verticalRate: verticalRate || 0,
        onGround: onGround || false,
        originCountry: originCountry || 'Unknown',
        lastContact: new Date(lastContact * 1000),
        category: isMilitary ? 'military' : (callsignStr ? 'commercial' : 'unknown')
      });
    }

    // Sort: military first, then take top MAX_FLIGHTS
    flights.sort((a, b) => {
      if (a.category === 'military' && b.category !== 'military') return -1;
      if (a.category !== 'military' && b.category === 'military') return 1;
      return 0;
    });

    const cappedFlights = flights.slice(0, MAX_FLIGHTS);

    currentState = {
      flights: cappedFlights,
      isConnected: true,
      lastUpdate: new Date(),
      error: null,
      militaryCount,
      totalCount: cappedFlights.length
    };

    console.log(`[OpenSky] Updated: ${cappedFlights.length} flights, ${militaryCount} military`);
  } catch (error) {
    console.error('[OpenSky] Fetch error:', error);
    currentState = {
      ...currentState,
      isConnected: false,
      error: String(error)
    };
  }

  notify();
}

export function startOpenSkyFeed() {
  if (pollInterval) {
    console.log('[OpenSky] Already running');
    return;
  }

  console.log('[OpenSky] Starting flight feed...');

  // Initial fetch
  fetchFlights();

  // Poll every 30 seconds
  pollInterval = setInterval(fetchFlights, POLL_INTERVAL);
}

export function stopOpenSkyFeed() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
}

export function subscribeToOpenSky(fn: (state: OpenSkyState) => void): () => void {
  listeners.push(fn);
  fn({ ...currentState });
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

export function getOpenSkyState(): OpenSkyState {
  return { ...currentState };
}
