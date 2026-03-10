// WorldView-FM Type Definitions

export type EventCategory = 'strike' | 'naval' | 'infrastructure' | 'insurance' | 'chokepoint';

export interface ConflictEvent {
  id: string;
  name: string;
  category: EventCategory;
  coordinates: [number, number]; // [lat, lng]
  date?: string;
  day?: number;
  description: string;
  status?: 'confirmed' | 'reported' | 'tracking';
}

export interface VesselData {
  mmsi: string;
  name: string;
  type: string;
  coordinates: [number, number];
  heading: number;
  speed: number;
  destination?: string;
  flag?: string;
}

export interface FlightData {
  icao24: string;
  callsign: string;
  origin_country: string;
  coordinates: [number, number];
  altitude: number;
  velocity: number;
  heading: number;
}

export interface MarketData {
  brent: number;
  brentHigh: number;
  wti: number;
  tenYearYield: number;
  vix: number;
  hySpread: number;
  hySpreadBaseline: number;
  vlccRate: string;
  hormuzTransits: number;
  conflictDay: number;
  lastUpdated: string;
}

export interface ScenarioProbability {
  name: string;
  probability: number;
  description: string;
}

export interface Prediction {
  id: string;
  prediction: string;
  status: 'confirmed' | 'tracking' | 'missed';
  date?: string;
}

export interface LayerState {
  vessels: boolean;
  flights: boolean;
  satellites: boolean;
  oilInfrastructure: boolean;
  conflictEvents: boolean;
  shippingRoutes: boolean;
}

export interface DataSource {
  name: string;
  type: 'websocket' | 'rest' | 'manual';
  endpoint?: string;
  updateInterval?: number;
  lastFetch?: string;
  status: 'live' | 'stale' | 'offline';
}
