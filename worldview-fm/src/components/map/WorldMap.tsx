import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, ZoomControl, CircleMarker, Popup, useMap, Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { ConflictEventLayer } from '../overlays/ConflictEventLayer';
import { VesselLayer } from '../overlays/VesselLayer';
import { ShippingRoutes } from '../overlays/ShippingRoutes';
import { conflictEvents, vesselData } from '../../data/conflictData';
import type { AgentFeedState, AgentEvent } from '../../data/feeds/agentFeed';
import { startAgentFeed, subscribeToAgentFeed } from '../../data/feeds/agentFeed';
import { startAISStream, subscribeToAISStream, getShipTypeCategory } from '../../data/feeds/aisStream';
import type { AISStreamState, VesselPosition } from '../../data/feeds/aisStream';
import { TimelineScrubber } from '../TimelineScrubber';
import { IntelFeedPanel } from '../IntelFeedPanel';
import { EventDetailModal } from '../EventDetailModal';
import type { LayerState } from '../../types';
import 'leaflet/dist/leaflet.css';

interface MapState {
  center: [number, number];
  zoom: number;
}

interface WorldMapProps {
  layers: LayerState;
  onVesselCountChange?: (count: number) => void;
  onMapStateChange?: (state: MapState) => void;
  onDateChange?: (date: string | null) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
  initialDate?: string;
}

// Strait of Hormuz center coordinates
const HORMUZ_CENTER: [number, number] = [26.5, 56.2];
const DEFAULT_ZOOM = 5;
const CONFLICT_START = new Date('2026-02-28T00:00:00Z');

// CartoDB Dark Matter tiles (free, no key required)
const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Agent event type colors
const getEventTypeColor = (type: string): string => {
  switch (type) {
    case 'strike': return '#ef4444';
    case 'naval': return '#3b82f6';
    case 'diplomatic': return '#a855f7';
    case 'economic': return '#eab308';
    case 'infrastructure': return '#f97316';
    case 'casualty': return '#dc2626';
    default: return '#6b7280';
  }
};

// AIS vessel type colors
const getVesselColor = (shipType: number): string => {
  const category = getShipTypeCategory(shipType);
  switch (category) {
    case 'tanker': return '#F96302';
    case 'cargo': return '#3b82f6';
    case 'military': return '#ef4444';
    default: return '#6b7280';
  }
};

const getVesselRadius = (shipType: number): number => {
  const category = getShipTypeCategory(shipType);
  switch (category) {
    case 'tanker': return 6;
    case 'cargo': return 5;
    case 'military': return 8;
    default: return 4;
  }
};

// Component to fly to location
function FlyToLocation({ target }: { target: { lat: number; lon: number } | null }) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lon], 8, { duration: 1 });
    }
  }, [target, map]);

  return null;
}

// Component to track map state changes
function MapStateTracker({ onChange }: { onChange?: (state: MapState) => void }) {
  const map = useMap();

  useEffect(() => {
    if (!onChange) return;

    const handleMove = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      onChange({
        center: [center.lat, center.lng],
        zoom
      });
    };

    map.on('moveend', handleMove);
    map.on('zoomend', handleMove);

    // Report initial state
    handleMove();

    return () => {
      map.off('moveend', handleMove);
      map.off('zoomend', handleMove);
    };
  }, [map, onChange]);

  return null;
}

// Component to set initial map view
function InitialView({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();

  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    } else if (center) {
      map.setView(center, map.getZoom());
    } else if (zoom) {
      map.setZoom(zoom);
    }
  }, []); // Only run once on mount

  return null;
}

// Create custom icon for event markers
function createEventIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: 'custom-event-marker',
    html: `<div style="
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: ${color};
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
}

function AgentEventMarker({ event, onReadMore }: { event: AgentEvent; onReadMore: (e: AgentEvent) => void }) {
  if (event.lat === null || event.lon === null) return null;

  const color = getEventTypeColor(event.eventType);
  const icon = createEventIcon(color);

  return (
    <Marker
      position={[event.lat, event.lon]}
      icon={icon}
    >
      <Popup>
        <div className="max-w-xs">
          <div className="text-xs uppercase font-bold mb-1" style={{ color }}>
            {event.eventType} {event.validated && '✓'}
          </div>
          <div className="font-semibold text-sm mb-1">{event.rawHeadline}</div>
          <div className="text-xs text-gray-600 mb-2 line-clamp-2">{event.summary}</div>
          <div className="text-xs text-gray-500">
            {event.actor1} → {event.actor2}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {event.location}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReadMore(event);
            }}
            className="mt-2 text-xs font-bold text-blue-500 hover:text-blue-400 uppercase tracking-wide"
          >
            READ MORE →
          </button>
        </div>
      </Popup>
    </Marker>
  );
}

function AISVesselMarker({ vessel }: { vessel: VesselPosition }) {
  const color = getVesselColor(vessel.shipType);
  const radius = getVesselRadius(vessel.shipType);
  const category = getShipTypeCategory(vessel.shipType);
  const isMilitary = category === 'military';

  const secondsAgo = Math.floor((Date.now() - vessel.lastUpdate.getTime()) / 1000);

  return (
    <CircleMarker
      center={[vessel.lat, vessel.lon]}
      radius={radius}
      pathOptions={{
        color: 'transparent',
        fillColor: color,
        fillOpacity: 0.85,
        weight: 0,
        className: isMilitary ? 'animate-pulse' : ''
      }}
    >
      <Popup>
        <div className="min-w-[180px]">
          <div className="font-semibold text-sm mb-1">{vessel.name}</div>
          <div className="text-xs text-gray-500 mb-2">MMSI: {vessel.mmsi}</div>
          <div className="text-xs text-gray-600 mb-1">
            Type: {category.toUpperCase()} ({vessel.shipType})
          </div>
          <div className="text-xs text-gray-600">
            Speed: {vessel.speed.toFixed(1)} knots
          </div>
          <div className="text-xs text-gray-600">
            Heading: {vessel.heading}°
          </div>
          <div className="text-xs text-gray-400 mt-2 italic">
            Last update: {secondsAgo}s ago
          </div>
        </div>
      </Popup>
    </CircleMarker>
  );
}

export function WorldMap({
  layers,
  onVesselCountChange,
  onMapStateChange,
  onDateChange,
  initialCenter,
  initialZoom,
  initialDate
}: WorldMapProps) {
  const [agentFeed, setAgentFeed] = useState<AgentFeedState>({
    status: 'connecting',
    eventCount: 0,
    lastUpdated: null,
    events: []
  });

  const [aisState, setAisState] = useState<AISStreamState>({
    isConnected: false,
    vessels: new Map(),
    vesselCount: 0,
    lastMessage: null,
    error: null,
    mode: 'disconnected'
  });

  const [timelineDate, setTimelineDate] = useState<Date | null>(
    initialDate ? new Date(initialDate) : null
  );
  const [isLive, setIsLive] = useState(!initialDate);
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lon: number } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<AgentEvent | null>(null);

  useEffect(() => {
    // Start the agent feed polling
    startAgentFeed();
    startAISStream();

    // Subscribe to feed updates
    const unsubAgentFeed = subscribeToAgentFeed((state) => {
      setAgentFeed(state);
    });

    const unsubAIS = subscribeToAISStream((state) => {
      setAisState(state);
      onVesselCountChange?.(state.vesselCount);
    });

    return () => {
      unsubAgentFeed();
      unsubAIS();
    };
  }, [onVesselCountChange]);

  // Filter events by timeline date and map relevance - MEMOIZED to prevent re-renders
  const filteredAgentEvents = useMemo(() => {
    return agentFeed.events.filter(e => {
      // Must have coordinates
      if (e.lat === null || e.lon === null) return false;

      // Filter by map relevance (if field exists, use it; otherwise show all with coords)
      if (e.mapRelevant === false) return false;

      // Filter by timeline date
      if (timelineDate) {
        const eventDate = new Date(e.timestamp);
        return eventDate >= CONFLICT_START && eventDate <= timelineDate;
      }

      return true;
    });
  }, [agentFeed.events, timelineDate]);

  // Force re-render of MarkerClusterGroup when events change
  const [clusterKey, setClusterKey] = useState(0);
  const prevEventCount = useRef(0);

  useEffect(() => {
    if (filteredAgentEvents.length !== prevEventCount.current) {
      console.log('[WorldMap] Event count changed:', prevEventCount.current, '->', filteredAgentEvents.length, '- forcing cluster re-render');
      prevEventCount.current = filteredAgentEvents.length;
      setClusterKey(k => k + 1);
    }
  }, [filteredAgentEvents.length]);

  // Log when markers should render
  useEffect(() => {
    if (layers.conflictEvents && filteredAgentEvents.length > 0) {
      console.log('[WorldMap] Markers added to map:', filteredAgentEvents.length);
    }
  }, [layers.conflictEvents, filteredAgentEvents.length, clusterKey]);

  // Debug logging - only when values change
  useEffect(() => {
    console.log('[WorldMap] Agent feed status:', agentFeed.status, '| Total events:', agentFeed.events.length, '| Filtered for map:', filteredAgentEvents.length);
    console.log('[WorldMap] layers.conflictEvents:', layers.conflictEvents, '| Will render markers:', layers.conflictEvents && filteredAgentEvents.length > 0);
    if (filteredAgentEvents.length > 0) {
      console.log('[WorldMap] First event coords:', filteredAgentEvents[0].lat, filteredAgentEvents[0].lon, '| ID:', filteredAgentEvents[0].id);
    }
  }, [agentFeed.status, agentFeed.events.length, filteredAgentEvents.length, layers.conflictEvents]);

  const handleDateChange = useCallback((date: Date | null) => {
    setTimelineDate(date);
    setIsLive(date === null);
    onDateChange?.(date ? date.toISOString().split('T')[0] : null);
  }, [onDateChange]);

  const handleLiveToggle = useCallback(() => {
    setIsLive(true);
    setTimelineDate(null);
    onDateChange?.(null);
  }, [onDateChange]);

  const handleEventClick = useCallback((event: AgentEvent) => {
    if (event.lat && event.lon) {
      setFlyTarget({ lat: event.lat, lon: event.lon });
    }
  }, []);

  // Get AIS vessels array
  const aisVessels = Array.from(aisState.vessels.values());

  return (
    <div className="relative h-full w-full">
      {/* Intel Feed Panel */}
      <IntelFeedPanel onEventClick={handleEventClick} />

      <MapContainer
        center={initialCenter || HORMUZ_CENTER}
        zoom={initialZoom || DEFAULT_ZOOM}
        zoomControl={false}
        className="h-full w-full"
        minZoom={3}
        maxZoom={12}
      >
        <TileLayer
          url={DARK_TILE_URL}
          attribution={TILE_ATTRIBUTION}
          subdomains="abcd"
        />
        <ZoomControl position="bottomleft" />

        {/* Map state tracking for share feature */}
        <MapStateTracker onChange={onMapStateChange} />
        <InitialView center={initialCenter} zoom={initialZoom} />

        <FlyToLocation target={flyTarget} />

        {/* Shipping routes */}
        {layers.shippingRoutes && <ShippingRoutes showDiversion={true} />}

        {layers.conflictEvents && (
          <ConflictEventLayer events={conflictEvents} />
        )}

        {layers.vessels && (
          <>
            <VesselLayer vessels={vesselData} />
            {/* AIS live vessels */}
            {aisVessels.map(vessel => (
              <AISVesselMarker key={vessel.mmsi} vessel={vessel} />
            ))}
          </>
        )}

        {/* Agent-sourced events - clustered markers */}
        {layers.conflictEvents && filteredAgentEvents.length > 0 && (
          <MarkerClusterGroup
            key={`cluster-${clusterKey}`}
            chunkedLoading
            showCoverageOnHover={false}
            spiderfyOnMaxZoom={true}
            maxClusterRadius={50}
            iconCreateFunction={(cluster: { getChildCount: () => number }) => {
              const count = cluster.getChildCount();
              return L.divIcon({
                html: `<div style="
                  background-color: #F96302;
                  color: white;
                  border-radius: 50%;
                  width: 30px;
                  height: 30px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  font-size: 12px;
                  border: 2px solid rgba(10, 15, 26, 0.9);
                  box-shadow: 0 2px 6px rgba(0,0,0,0.5);
                ">${count}</div>`,
                className: 'custom-cluster-icon',
                iconSize: L.point(30, 30)
              });
            }}
          >
            {filteredAgentEvents.map(event => (
              <AgentEventMarker key={event.id} event={event} onReadMore={setSelectedEvent} />
            ))}
          </MarkerClusterGroup>
        )}
      </MapContainer>

      {/* Timeline Scrubber */}
      <TimelineScrubber
        onDateChange={handleDateChange}
        isLive={isLive}
        onLiveToggle={handleLiveToggle}
      />

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        allEvents={agentFeed.events}
        onClose={() => setSelectedEvent(null)}
        onEventClick={(event) => {
          setSelectedEvent(event);
          if (event.lat && event.lon) {
            setFlyTarget({ lat: event.lat, lon: event.lon });
          }
        }}
      />
    </div>
  );
}
