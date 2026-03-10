// Satellite Tracking Feed via CelesTrak TLE data
// Uses satellite.js for orbital propagation
// PERFORMANCE OPTIMIZED: Lazy loading, reduced updates, no trails by default

import * as satellite from 'satellite.js';

export type SatelliteCountry = 'usa' | 'russia' | 'china' | 'israel' | 'commercial' | 'gps' | 'unknown';

export interface SatellitePosition {
  name: string;
  noradId: string;
  lat: number;
  lon: number;
  alt: number; // km
  velocity: number; // km/s
  inclination: number; // degrees
  category: 'leo-surveillance' | 'gps' | 'geostationary' | 'starlink' | 'other';
  country: SatelliteCountry;
  isOverTheater: boolean;
  groundTrackRadius: number; // km - imaging footprint approximation
}

export interface SatelliteFeedState {
  satellites: SatellitePosition[];
  isLoading: boolean;
  lastUpdate: Date | null;
  error: string | null;
  totalCount: number;
  visibleCount: number;
  isActive: boolean;
}

interface TLEData {
  name: string;
  tle1: string;
  tle2: string;
  noradId: string;
  inclination: number;
}

// Middle East theater bounding box
const THEATER_BOUNDS = {
  minLat: 10,
  maxLat: 45,
  minLon: 25,
  maxLon: 75
};

// PERFORMANCE: Reduced limits
const MAX_DISPLAY_SATELLITES = 150;
const MAX_PERIGEE_KM = 1000;
const TLE_REFRESH_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours
const POSITION_UPDATE_INTERVAL = 3000; // 3 seconds (was 1s)

// TLE data sources - prioritize military/surveillance catalogs
const TLE_SOURCES = {
  active: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle'
};

let tleCache: TLEData[] = [];
let satrecCache: Map<string, satellite.SatRec> = new Map();
let currentState: SatelliteFeedState = {
  satellites: [],
  isLoading: false,
  lastUpdate: null,
  error: null,
  totalCount: 0,
  visibleCount: 0,
  isActive: false
};

let listeners: Array<(state: SatelliteFeedState) => void> = [];
let positionInterval: ReturnType<typeof setInterval> | null = null;
let tleRefreshInterval: ReturnType<typeof setInterval> | null = null;
let isInitialized = false;

function notify() {
  const state = { ...currentState };
  listeners.forEach(fn => {
    try {
      fn(state);
    } catch (e) {
      console.error('[Satellite] Listener error:', e);
    }
  });
}

// Parse TLE text format (3 lines per satellite)
function parseTLE(tleText: string): TLEData[] {
  const lines = tleText.trim().split('\n');
  const satellites: TLEData[] = [];

  for (let i = 0; i < lines.length - 2; i += 3) {
    const name = lines[i].trim();
    const tle1 = lines[i + 1].trim();
    const tle2 = lines[i + 2].trim();

    if (!tle1.startsWith('1 ') || !tle2.startsWith('2 ')) {
      continue;
    }

    const noradId = tle1.substring(2, 7).trim();

    // Parse inclination from TLE line 2 (columns 9-16)
    const inclination = parseFloat(tle2.substring(8, 16).trim()) || 0;

    satellites.push({ name, tle1, tle2, noradId, inclination });
  }

  return satellites;
}

// Detect country of origin from satellite name
function detectCountry(name: string): SatelliteCountry {
  const upper = name.toUpperCase();

  // USA military/intelligence
  if (upper.match(/^USA[- ]?\d/) ||
      upper.includes('KEYHOLE') ||
      upper.includes('LACROSSE') ||
      upper.includes('ONYX') ||
      upper.includes('MISTY') ||
      upper.includes('NROL') ||
      upper.includes('TRUMPET') ||
      upper.includes('MENTOR') ||
      upper.includes('ORION')) {
    return 'usa';
  }

  // Russian
  if (upper.includes('COSMOS') ||
      upper.includes('KOSMOS') ||
      upper.includes('RESURS') ||
      upper.includes('PERSONA') ||
      upper.includes('KONDOR') ||
      upper.includes('BARS-M')) {
    return 'russia';
  }

  // Chinese
  if (upper.includes('YAOGAN') ||
      upper.includes('TIANHUI') ||
      upper.includes('GAOFEN') ||
      upper.includes('JILIN') ||
      upper.includes('SHIYAN') ||
      upper.includes('ZIYUAN')) {
    return 'china';
  }

  // Israeli
  if (upper.includes('OFEK') ||
      upper.includes('EROS') ||
      upper.includes('OFEQ')) {
    return 'israel';
  }

  // Commercial imaging
  if (upper.includes('WORLDVIEW') ||
      upper.includes('GEOEYE') ||
      upper.includes('PLANET') ||
      upper.includes('MAXAR') ||
      upper.includes('SKYSAT') ||
      upper.includes('PLEIADES') ||
      upper.includes('SPOT')) {
    return 'commercial';
  }

  // GPS/Navigation
  if (upper.includes('GPS') ||
      upper.includes('NAVSTAR') ||
      upper.includes('GLONASS') ||
      upper.includes('GALILEO') ||
      upper.includes('BEIDOU')) {
    return 'gps';
  }

  return 'unknown';
}

// Categorize satellite by altitude and name
function categorizeSatellite(name: string, alt: number): SatellitePosition['category'] {
  const upperName = name.toUpperCase();

  if (upperName.includes('STARLINK')) return 'starlink';
  if (alt > 35000) return 'geostationary';
  if (upperName.includes('GPS') || upperName.includes('NAVSTAR') ||
      upperName.includes('GLONASS') || upperName.includes('GALILEO')) return 'gps';

  // LEO surveillance satellites
  if (alt < 600 && (
    upperName.includes('USA') ||
    upperName.includes('NROL') ||
    upperName.includes('KH-') ||
    upperName.includes('KEYHOLE') ||
    upperName.includes('LACROSSE') ||
    upperName.includes('ONYX') ||
    upperName.includes('MISTY') ||
    upperName.includes('COSMOS') ||
    upperName.includes('YAOGAN') ||
    upperName.includes('GAOFEN') ||
    upperName.includes('OFEK') ||
    upperName.includes('WORLDVIEW') ||
    upperName.includes('GEOEYE')
  )) return 'leo-surveillance';

  return 'other';
}

// Check if position is over theater of operations
function isOverTheater(lat: number, lon: number): boolean {
  return lat >= THEATER_BOUNDS.minLat &&
         lat <= THEATER_BOUNDS.maxLat &&
         lon >= THEATER_BOUNDS.minLon &&
         lon <= THEATER_BOUNDS.maxLon;
}

// Calculate approximate ground track radius for imaging satellites
function calculateGroundTrackRadius(alt: number, category: SatellitePosition['category']): number {
  if (category !== 'leo-surveillance' || alt > 600) return 0;
  // Rough swath approximation: altitude * 0.5
  return alt * 0.5;
}

// Compute current position for a satellite (NO orbit trail - performance)
function computePosition(satrec: satellite.SatRec, tle: TLEData): SatellitePosition | null {
  try {
    const now = new Date();
    const positionAndVelocity = satellite.propagate(satrec, now);

    if (!positionAndVelocity ||
        !positionAndVelocity.position ||
        typeof positionAndVelocity.position === 'boolean') {
      return null;
    }

    const positionEci = positionAndVelocity.position as satellite.EciVec3<number>;
    const velocityEci = positionAndVelocity.velocity as satellite.EciVec3<number> | undefined;

    const gmst = satellite.gstime(now);
    const positionGd = satellite.eciToGeodetic(positionEci, gmst);

    const lat = satellite.degreesLat(positionGd.latitude);
    const lon = satellite.degreesLong(positionGd.longitude);
    const alt = positionGd.height;

    const category = categorizeSatellite(tle.name, alt);

    // Skip Starlink and high-altitude non-useful satellites
    if (category === 'starlink') return null;
    if (alt > MAX_PERIGEE_KM && category !== 'gps' && category !== 'geostationary') {
      return null;
    }

    let velocity = 0;
    if (velocityEci) {
      velocity = Math.sqrt(
        velocityEci.x ** 2 +
        velocityEci.y ** 2 +
        velocityEci.z ** 2
      );
    }

    const country = detectCountry(tle.name);
    const groundTrackRadius = calculateGroundTrackRadius(alt, category);

    return {
      name: tle.name,
      noradId: tle.noradId,
      lat,
      lon,
      alt,
      velocity,
      inclination: tle.inclination,
      category,
      country,
      isOverTheater: isOverTheater(lat, lon),
      groundTrackRadius
    };
  } catch {
    return null;
  }
}

// Update all satellite positions
function updatePositions() {
  if (!currentState.isActive) return;

  const satellites: SatellitePosition[] = [];
  let processed = 0;

  for (const [noradId, satrec] of satrecCache.entries()) {
    // Early exit if we have enough
    if (satellites.length >= MAX_DISPLAY_SATELLITES) break;

    const tle = tleCache.find(t => t.noradId === noradId);
    if (!tle) continue;

    const pos = computePosition(satrec, tle);
    if (pos) {
      satellites.push(pos);
    }

    processed++;
    // Limit processing per cycle for performance
    if (processed > 500) break;
  }

  // Sort: surveillance over theater first, then by altitude
  satellites.sort((a, b) => {
    // Priority 1: Surveillance satellites over theater
    const aIsSurveillanceOverTheater = a.category === 'leo-surveillance' && a.isOverTheater;
    const bIsSurveillanceOverTheater = b.category === 'leo-surveillance' && b.isOverTheater;
    if (aIsSurveillanceOverTheater !== bIsSurveillanceOverTheater) {
      return aIsSurveillanceOverTheater ? -1 : 1;
    }
    // Priority 2: Over theater
    if (a.isOverTheater !== b.isOverTheater) {
      return a.isOverTheater ? -1 : 1;
    }
    // Priority 3: Surveillance category
    if (a.category === 'leo-surveillance' && b.category !== 'leo-surveillance') return -1;
    if (a.category !== 'leo-surveillance' && b.category === 'leo-surveillance') return 1;
    // Priority 4: Lower altitude
    return a.alt - b.alt;
  });

  currentState = {
    ...currentState,
    satellites: satellites.slice(0, MAX_DISPLAY_SATELLITES),
    visibleCount: satellites.length,
    lastUpdate: new Date()
  };

  notify();
}

// Fetch TLE data from CelesTrak
async function fetchTLEData() {
  currentState = { ...currentState, isLoading: true };
  notify();

  try {
    const response = await fetch(TLE_SOURCES.active);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const tleText = await response.text();
    const satellites = parseTLE(tleText);

    console.log(`[Satellite] Fetched ${satellites.length} TLE records`);

    tleCache = satellites;
    satrecCache.clear();

    // Pre-compute satrec objects
    for (const sat of satellites) {
      try {
        const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
        satrecCache.set(sat.noradId, satrec);
      } catch {
        // Skip invalid TLE
      }
    }

    currentState = {
      ...currentState,
      isLoading: false,
      error: null,
      totalCount: satellites.length
    };

    updatePositions();
    isInitialized = true;
  } catch (error) {
    console.error('[Satellite] TLE fetch error:', error);
    currentState = {
      ...currentState,
      isLoading: false,
      error: String(error)
    };
    notify();
  }
}

// LAZY LOADING: Only start feed when explicitly activated
export function startSatelliteFeed() {
  if (currentState.isActive) {
    console.log('[Satellite] Already active');
    return;
  }

  console.log('[Satellite] Starting satellite feed (lazy load)...');
  currentState = { ...currentState, isActive: true };

  // Only fetch TLE if not already cached
  if (!isInitialized) {
    fetchTLEData();
  } else {
    updatePositions();
  }

  // Position updates every 3 seconds (was 1s)
  if (!positionInterval) {
    positionInterval = setInterval(updatePositions, POSITION_UPDATE_INTERVAL);
  }

  // TLE refresh every 6 hours
  if (!tleRefreshInterval) {
    tleRefreshInterval = setInterval(fetchTLEData, TLE_REFRESH_INTERVAL);
  }
}

export function stopSatelliteFeed() {
  console.log('[Satellite] Stopping satellite feed');
  currentState = { ...currentState, isActive: false };

  if (positionInterval) {
    clearInterval(positionInterval);
    positionInterval = null;
  }
  if (tleRefreshInterval) {
    clearInterval(tleRefreshInterval);
    tleRefreshInterval = null;
  }
  notify();
}

export function subscribeToSatelliteFeed(fn: (state: SatelliteFeedState) => void): () => void {
  listeners.push(fn);
  fn({ ...currentState });
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

export function getSatelliteState(): SatelliteFeedState {
  return { ...currentState };
}

// Get color for satellite by country
export function getSatelliteCountryColor(country: SatelliteCountry): string {
  switch (country) {
    case 'usa': return '#3b82f6'; // blue
    case 'russia': return '#ef4444'; // red
    case 'china': return '#eab308'; // yellow
    case 'israel': return '#ffffff'; // white
    case 'commercial': return '#00ffff'; // cyan
    case 'gps': return '#22c55e'; // green
    default: return '#6b7280'; // gray
  }
}
