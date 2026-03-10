import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  conflictEvents,
  conflictMetadata,
  insuranceExclusionZone,
  getEventsThrough,
  getEventsForDay,
  type ConflictEvent,
} from '@/data/iranConflictData';

// Fix Leaflet default marker icon issue with bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// =============================================================================
// TYPES
// =============================================================================

interface GDELTEvent {
  lat: number;
  lng: number;
  name: string;
  url: string;
  sourcecountry: string;
  tone: number;
  dateadded: string;
  html?: string;
}

interface AISVessel {
  mmsi: string;
  name: string;
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  flag: string;
  type: 'tanker' | 'cargo' | 'military' | 'other';
  destination?: string;
  draft?: number;
  lastUpdate: number;
}

interface LayerState {
  curatedEvents: boolean;
  gdeltLive: boolean;
  aisVessels: boolean;
  infrastructure: boolean;
  exclusionZone: boolean;
  shippingRoutes: boolean;
}

// =============================================================================
// CONSTANTS
// =============================================================================

// Event type colors and icons
const eventTypeConfig: Record<ConflictEvent['type'], { color: string; label: string; emoji: string }> = {
  strike_us: { color: '#3b82f6', label: 'US/Coalition Strike', emoji: '💥' },
  strike_israel: { color: '#6366f1', label: 'Israeli Strike', emoji: '💥' },
  strike_iran: { color: '#ef4444', label: 'Iranian Strike', emoji: '🔥' },
  shipping: { color: '#06b6d4', label: 'Shipping Event', emoji: '🚢' },
  infrastructure_energy: { color: '#f97316', label: 'Energy Infrastructure', emoji: '🛢️' },
  infrastructure_water: { color: '#14b8a6', label: 'Water Infrastructure', emoji: '💧' },
  naval: { color: '#1e3a8a', label: 'Naval Engagement', emoji: '⚓' },
  ground_offensive: { color: '#22c55e', label: 'Ground Offensive', emoji: '🎖️' },
  interception: { color: '#a855f7', label: 'Interception', emoji: '🛡️' },
};

// Hormuz shipping lane coordinates
const hormuzShippingLane: [number, number][] = [
  [26.5, 56.5],
  [26.0, 56.2],
  [25.5, 55.5],
  [25.0, 54.5],
];

// GDELT query themes
const GDELT_QUERIES = [
  'iran war strike',
  'hormuz shipping',
  'iran missile drone',
  'bahrain kuwait qatar saudi uae oil',
];

// Cache keys
const GDELT_CACHE_KEY = 'gdelt_events_cache';
const GDELT_CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes
const AIS_CACHE_KEY = 'ais_vessels_cache';
const AIS_CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Create custom marker icons
const createCustomIcon = (type: ConflictEvent['type'], isHighlighted: boolean) => {
  const config = eventTypeConfig[type];
  const size = isHighlighted ? 32 : 24;
  const pulseClass = isHighlighted ? 'animate-pulse' : '';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative flex items-center justify-center ${pulseClass}" style="width: ${size}px; height: ${size}px;">
        <div class="absolute inset-0 rounded-full opacity-30" style="background-color: ${config.color};"></div>
        <div class="absolute inset-1 rounded-full flex items-center justify-center text-xs" style="background-color: ${config.color}; border: 2px solid rgba(255,255,255,0.8);">
          <span style="font-size: ${isHighlighted ? '14px' : '10px'};">${config.emoji}</span>
        </div>
        ${isHighlighted ? `<div class="absolute inset-0 rounded-full animate-ping opacity-50" style="background-color: ${config.color};"></div>` : ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Create vessel icon with heading rotation
const createVesselIcon = (type: AISVessel['type'], heading: number) => {
  const colors = {
    tanker: '#06b6d4',
    cargo: '#6b7280',
    military: '#ef4444',
    other: '#a855f7',
  };
  const color = colors[type];

  return L.divIcon({
    className: 'vessel-marker',
    html: `
      <div class="relative" style="width: 16px; height: 16px; transform: rotate(${heading}deg);">
        <svg viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1">
          <path d="M12 2L4 20h16L12 2z"/>
        </svg>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });
};

// Get cached data
function getCachedData<T>(key: string, expiry: number): T | null {
  try {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > expiry) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

// Set cached data
function setCachedData<T>(key: string, data: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Storage might be full, ignore
  }
}

// =============================================================================
// HOOKS
// =============================================================================

// Hook to fetch GDELT events
function useGDELTEvents(enabled: boolean) {
  const [events, setEvents] = useState<GDELTEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!enabled) return;

    // Check cache first
    const cached = getCachedData<GDELTEvent[]>(GDELT_CACHE_KEY, GDELT_CACHE_EXPIRY);
    if (cached) {
      setEvents(cached);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const allEvents: GDELTEvent[] = [];

      // Fetch for each query theme
      for (const query of GDELT_QUERIES) {
        try {
          const response = await fetch(
            `https://api.gdeltproject.org/api/v2/geo/geo?query=${encodeURIComponent(query)}&mode=PointData&format=GeoJSON&timespan=24h`
          );

          if (!response.ok) continue;

          const data = await response.json();

          if (data?.features) {
            for (const feature of data.features) {
              if (feature.geometry?.coordinates && feature.properties) {
                const [lng, lat] = feature.geometry.coordinates;
                // Filter to Middle East region (roughly)
                if (lat >= 15 && lat <= 45 && lng >= 30 && lng <= 65) {
                  allEvents.push({
                    lat,
                    lng,
                    name: feature.properties.name || 'News Event',
                    url: feature.properties.url || '',
                    sourcecountry: feature.properties.sourcecountry || 'Unknown',
                    tone: feature.properties.tone || 0,
                    dateadded: feature.properties.dateadded || '',
                    html: feature.properties.html,
                  });
                }
              }
            }
          }
        } catch {
          // Individual query failed, continue with others
        }
      }

      // Deduplicate by URL
      const uniqueEvents = Array.from(
        new Map(allEvents.map(e => [e.url, e])).values()
      );

      setEvents(uniqueEvents);
      setCachedData(GDELT_CACHE_KEY, uniqueEvents);
    } catch (err) {
      setError('Failed to fetch live news events');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchEvents();
    // Refresh every 15 minutes if enabled
    if (enabled) {
      const interval = setInterval(fetchEvents, GDELT_CACHE_EXPIRY);
      return () => clearInterval(interval);
    }
  }, [enabled, fetchEvents]);

  return { events, loading, error };
}

// Hook for AIS vessel tracking
function useAISVessels(enabled: boolean, apiKey?: string) {
  const [vessels, setVessels] = useState<AISVessel[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!enabled || !apiKey) {
      // Load from cache if available
      const cached = getCachedData<AISVessel[]>(AIS_CACHE_KEY, AIS_CACHE_EXPIRY);
      if (cached) setVessels(cached);
      return;
    }

    const connectWebSocket = () => {
      try {
        const socket = new WebSocket('wss://stream.aisstream.io/v0/stream');
        socketRef.current = socket;

        socket.onopen = () => {
          setConnected(true);
          setError(null);
          socket.send(JSON.stringify({
            Apikey: apiKey,
            BoundingBoxes: [[[23.0, 54.0], [27.5, 60.0]]], // Hormuz region
            FilterMessageTypes: ['PositionReport'],
          }));
        };

        socket.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.MessageType === 'PositionReport' && msg.MetaData && msg.Message?.PositionReport) {
              const pos = msg.Message.PositionReport;
              const meta = msg.MetaData;

              // Determine vessel type from name/MMSI
              let type: AISVessel['type'] = 'other';
              const nameLower = (meta.ShipName || '').toLowerCase();
              if (nameLower.includes('tanker') || nameLower.includes('crude') || nameLower.includes('vlcc')) {
                type = 'tanker';
              } else if (nameLower.includes('cargo') || nameLower.includes('container')) {
                type = 'cargo';
              } else if (meta.MMSI?.toString().startsWith('3') || nameLower.includes('navy') || nameLower.includes('uss') || nameLower.includes('hms')) {
                type = 'military';
              }

              const vessel: AISVessel = {
                mmsi: meta.MMSI?.toString() || 'Unknown',
                name: meta.ShipName || 'Unknown Vessel',
                lat: pos.Latitude,
                lng: pos.Longitude,
                heading: pos.TrueHeading || pos.Cog || 0,
                speed: pos.Sog || 0,
                flag: meta.country || 'Unknown',
                type,
                destination: pos.Destination,
                draft: pos.Draught,
                lastUpdate: Date.now(),
              };

              setVessels(prev => {
                const updated = prev.filter(v => v.mmsi !== vessel.mmsi);
                const newVessels = [...updated, vessel];
                setCachedData(AIS_CACHE_KEY, newVessels);
                return newVessels;
              });
            }
          } catch {
            // Invalid message, ignore
          }
        };

        socket.onerror = () => {
          setError('AIS connection error');
          setConnected(false);
        };

        socket.onclose = () => {
          setConnected(false);
          // Try to reconnect after 5 seconds
          setTimeout(connectWebSocket, 5000);
        };
      } catch {
        setError('Failed to connect to AIS stream');
      }
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [enabled, apiKey]);

  return { vessels, connected, error };
}

// =============================================================================
// COMPONENTS
// =============================================================================

interface ConflictMapProps {
  throughDay?: number;
  highlightDay?: number;
  className?: string;
  height?: string;
  showLegend?: boolean;
  showDaySlider?: boolean;
  showLayerControls?: boolean;
  aisApiKey?: string;
}

// Layer toggle panel component
const LayerTogglePanel = ({
  layers,
  setLayers,
  gdeltLoading,
  gdeltError,
  aisConnected,
  aisError,
  vesselCount,
}: {
  layers: LayerState;
  setLayers: React.Dispatch<React.SetStateAction<LayerState>>;
  gdeltLoading: boolean;
  gdeltError: string | null;
  aisConnected: boolean;
  aisError: string | null;
  vesselCount: number;
}) => {
  const toggleLayer = (key: keyof LayerState) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const LayerToggle = ({
    label,
    layerKey,
    isLive,
    status,
    count,
  }: {
    label: string;
    layerKey: keyof LayerState;
    isLive?: boolean;
    status?: 'loading' | 'connected' | 'error' | 'disabled';
    count?: number;
  }) => (
    <label className="flex items-center gap-2 cursor-pointer hover:bg-muted/30 p-1 rounded transition-colors">
      <input
        type="checkbox"
        checked={layers[layerKey]}
        onChange={() => toggleLayer(layerKey)}
        className="w-3 h-3 accent-primary"
      />
      <span className="font-mono text-[9px] text-muted-foreground flex-1">{label}</span>
      {isLive && (
        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/20 rounded text-[8px] font-mono text-emerald-400">
          <span className={cn('w-1.5 h-1.5 rounded-full bg-emerald-400', status === 'connected' && 'animate-pulse')} />
          LIVE
        </span>
      )}
      {status === 'loading' && (
        <span className="text-[8px] font-mono text-amber-400">Loading...</span>
      )}
      {status === 'error' && (
        <span className="text-[8px] font-mono text-red-400">Unavailable</span>
      )}
      {count !== undefined && count > 0 && (
        <span className="text-[8px] font-mono text-cyan-400">{count}</span>
      )}
    </label>
  );

  return (
    <div className="absolute top-14 left-3 z-[1000] bg-background/95 backdrop-blur-sm p-3 rounded border border-border w-56">
      <p className="font-mono text-[9px] uppercase tracking-wider text-primary mb-2">Layers</p>
      <div className="space-y-1">
        <LayerToggle label="Curated Events" layerKey="curatedEvents" />
        <LayerToggle
          label="Live News (GDELT)"
          layerKey="gdeltLive"
          isLive
          status={gdeltLoading ? 'loading' : gdeltError ? 'error' : layers.gdeltLive ? 'connected' : 'disabled'}
        />
        <LayerToggle
          label="Live Vessels (AIS)"
          layerKey="aisVessels"
          isLive
          status={aisError ? 'error' : aisConnected ? 'connected' : 'disabled'}
          count={layers.aisVessels ? vesselCount : undefined}
        />
        <div className="border-t border-border my-2" />
        <LayerToggle label="Insurance Exclusion Zone" layerKey="exclusionZone" />
        <LayerToggle label="Shipping Routes" layerKey="shippingRoutes" />
      </div>
      {vesselCount > 0 && layers.aisVessels && (
        <div className="mt-3 pt-2 border-t border-border">
          <p className="font-mono text-[9px] text-muted-foreground">
            Vessels in Hormuz: <span className="text-cyan-400 font-semibold">{vesselCount}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export const ConflictMap = ({
  throughDay = conflictMetadata.conflictDay,
  highlightDay,
  className,
  height = '500px',
  showLegend = true,
  showDaySlider = false,
  showLayerControls = true,
  aisApiKey,
}: ConflictMapProps) => {
  const [selectedDay, setSelectedDay] = useState(throughDay);
  const [selectedEvent, setSelectedEvent] = useState<ConflictEvent | null>(null);

  // Layer visibility state
  const [layers, setLayers] = useState<LayerState>({
    curatedEvents: true,
    gdeltLive: false, // Off by default
    aisVessels: false, // Off by default
    infrastructure: true,
    exclusionZone: true,
    shippingRoutes: true,
  });

  const effectiveDay = showDaySlider ? selectedDay : throughDay;
  const effectiveHighlightDay = highlightDay ?? effectiveDay;

  const events = useMemo(() => getEventsThrough(effectiveDay), [effectiveDay]);
  const highlightedEvents = useMemo(() => getEventsForDay(effectiveHighlightDay), [effectiveHighlightDay]);

  // Live data hooks
  const { events: gdeltEvents, loading: gdeltLoading, error: gdeltError } = useGDELTEvents(layers.gdeltLive);
  const { vessels: aisVessels, connected: aisConnected, error: aisError } = useAISVessels(layers.aisVessels, aisApiKey);

  const center: [number, number] = [28.0, 52.0];
  const defaultZoom = 5;

  // Get unique event types for legend
  const activeTypes = useMemo(() => {
    const types = new Set(events.map(e => e.type));
    return Array.from(types);
  }, [events]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn('relative rounded-lg overflow-hidden border border-border', className)}
    >
      {/* Data as of label */}
      <div className="absolute top-3 right-3 z-[1000] bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded border border-border">
        <span className="font-mono text-[10px] text-muted-foreground">
          Data as of Day {effectiveDay}
        </span>
      </div>

      {/* Day slider */}
      {showDaySlider && (
        <div className="absolute top-3 left-3 right-24 z-[1000] bg-background/90 backdrop-blur-sm px-4 py-2 rounded border border-border">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">Day 1</span>
            <input
              type="range"
              min={1}
              max={conflictMetadata.conflictDay}
              value={selectedDay}
              onChange={(e) => setSelectedDay(parseInt(e.target.value))}
              className="flex-1 h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
              Day {conflictMetadata.conflictDay}
            </span>
          </div>
        </div>
      )}

      {/* Layer toggle panel */}
      {showLayerControls && (
        <LayerTogglePanel
          layers={layers}
          setLayers={setLayers}
          gdeltLoading={gdeltLoading}
          gdeltError={gdeltError}
          aisConnected={aisConnected}
          aisError={aisError}
          vesselCount={aisVessels.length}
        />
      )}

      {/* Map container */}
      <div style={{ height }} className="w-full">
        <MapContainer
          center={center}
          zoom={defaultZoom}
          minZoom={3}
          maxZoom={10}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          {/* Dark theme tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Insurance exclusion zone polygon */}
          {layers.exclusionZone && (
            <Polygon
              positions={insuranceExclusionZone.coordinates}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.15,
                weight: 2,
                dashArray: '5, 10',
              }}
            />
          )}

          {/* Hormuz shipping lane */}
          {layers.shippingRoutes && (
            <Polyline
              positions={hormuzShippingLane}
              pathOptions={{
                color: '#06b6d4',
                weight: 3,
                dashArray: '10, 10',
                opacity: 0.7,
              }}
            />
          )}

          {/* Curated event markers */}
          {layers.curatedEvents && events.map((event, index) => {
            const isHighlighted = highlightedEvents.some(
              (he) => he.lat === event.lat && he.lng === event.lng && he.target === event.target
            );

            return (
              <Marker
                key={`curated-${event.date}-${event.target}-${index}`}
                position={[event.lat, event.lng]}
                icon={createCustomIcon(event.type, isHighlighted)}
                eventHandlers={{
                  click: () => setSelectedEvent(event),
                }}
              >
                <Popup className="conflict-popup">
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider"
                        style={{
                          backgroundColor: `${eventTypeConfig[event.type].color}20`,
                          color: eventTypeConfig[event.type].color,
                        }}
                      >
                        {eventTypeConfig[event.type].label}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        Day {event.day}
                      </span>
                    </div>
                    <h4 className="font-mono text-sm font-semibold text-foreground mb-1">
                      {event.target}
                    </h4>
                    <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                    {event.impact && (
                      <p className="font-mono text-xs text-primary mt-2 font-semibold">
                        Impact: {event.impact}
                      </p>
                    )}
                    {event.status && (
                      <span
                        className={cn(
                          'inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-mono uppercase',
                          event.status === 'confirmed' && 'bg-green-500/20 text-green-400',
                          event.status === 'reported' && 'bg-amber-500/20 text-amber-400',
                          event.status === 'unconfirmed' && 'bg-red-500/20 text-red-400'
                        )}
                      >
                        {event.status}
                      </span>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* GDELT live event markers */}
          {layers.gdeltLive && gdeltEvents.map((event, index) => (
            <CircleMarker
              key={`gdelt-${event.url}-${index}`}
              center={[event.lat, event.lng]}
              radius={4}
              pathOptions={{
                color: 'white',
                fillColor: 'white',
                fillOpacity: 0.3,
                weight: 1,
                opacity: 0.5,
              }}
            >
              <Popup className="conflict-popup">
                <div className="p-2 min-w-[220px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-white/20 rounded text-[9px] font-mono uppercase text-white/80">
                      GDELT Live
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {event.sourcecountry}
                    </span>
                  </div>
                  <h4 className="font-mono text-xs font-semibold text-foreground mb-2 leading-relaxed">
                    {event.name}
                  </h4>
                  {event.dateadded && (
                    <p className="font-mono text-[10px] text-muted-foreground mb-2">
                      {new Date(event.dateadded).toLocaleString()}
                    </p>
                  )}
                  {event.url && (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] text-primary hover:underline"
                    >
                      Read article →
                    </a>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* AIS vessel markers */}
          {layers.aisVessels && aisVessels.map((vessel) => (
            <Marker
              key={`ais-${vessel.mmsi}`}
              position={[vessel.lat, vessel.lng]}
              icon={createVesselIcon(vessel.type, vessel.heading)}
            >
              <Popup className="conflict-popup">
                <div className="p-2 min-w-[180px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[9px] font-mono uppercase',
                        vessel.type === 'tanker' && 'bg-cyan-500/20 text-cyan-400',
                        vessel.type === 'cargo' && 'bg-gray-500/20 text-gray-400',
                        vessel.type === 'military' && 'bg-red-500/20 text-red-400',
                        vessel.type === 'other' && 'bg-purple-500/20 text-purple-400'
                      )}
                    >
                      {vessel.type}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {vessel.flag}
                    </span>
                  </div>
                  <h4 className="font-mono text-xs font-semibold text-foreground mb-1">
                    {vessel.name}
                  </h4>
                  <div className="space-y-1 text-[10px] font-mono text-muted-foreground">
                    <p>MMSI: {vessel.mmsi}</p>
                    <p>Speed: {vessel.speed.toFixed(1)} kts</p>
                    <p>Heading: {vessel.heading}°</p>
                    {vessel.destination && <p>Dest: {vessel.destination}</p>}
                    {vessel.draft && <p>Draft: {vessel.draft}m</p>}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-background/90 backdrop-blur-sm p-3 rounded border border-border max-w-[200px]">
          <p className="font-mono text-[9px] uppercase tracking-wider text-primary mb-2">Legend</p>
          <div className="grid grid-cols-1 gap-1.5">
            {layers.curatedEvents && activeTypes.map((type) => (
              <div key={type} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: eventTypeConfig[type].color }}
                >
                  <span className="text-[8px]">{eventTypeConfig[type].emoji}</span>
                </div>
                <span className="font-mono text-[9px] text-muted-foreground">
                  {eventTypeConfig[type].label}
                </span>
              </div>
            ))}
            {layers.gdeltLive && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white/30 border border-white/50"></div>
                <span className="font-mono text-[9px] text-muted-foreground">GDELT News</span>
              </div>
            )}
            {layers.aisVessels && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-cyan-500" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
                  <span className="font-mono text-[9px] text-muted-foreground">Tanker</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
                  <span className="font-mono text-[9px] text-muted-foreground">Cargo</span>
                </div>
              </>
            )}
            {layers.exclusionZone && (
              <div className="flex items-center gap-2 mt-1 pt-1 border-t border-border">
                <div className="w-3 h-3 border-2 border-dashed border-red-500 rounded-sm opacity-50"></div>
                <span className="font-mono text-[9px] text-muted-foreground">War Risk Zone</span>
              </div>
            )}
            {layers.shippingRoutes && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-cyan-500 opacity-70" style={{ borderBottom: '2px dashed #06b6d4' }}></div>
                <span className="font-mono text-[9px] text-muted-foreground">Shipping Lane</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hormuz CLOSED label */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded">
        <span className="font-mono text-[10px] text-white font-bold tracking-wider">
          HORMUZ: CLOSED TO WESTERN SHIPPING
        </span>
      </div>

      {/* AIS connection status */}
      {layers.aisVessels && !aisApiKey && (
        <div className="absolute bottom-12 right-3 z-[1000] bg-amber-500/90 backdrop-blur-sm px-3 py-1 rounded">
          <span className="font-mono text-[9px] text-white">
            AIS: No API key configured
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default ConflictMap;
