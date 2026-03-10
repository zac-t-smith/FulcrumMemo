import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, useMap } from 'react-leaflet';
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

// Hormuz shipping lane coordinates
const hormuzShippingLane: [number, number][] = [
  [26.5, 56.5],
  [26.0, 56.2],
  [25.5, 55.5],
  [25.0, 54.5],
];

interface ConflictMapProps {
  throughDay?: number;
  highlightDay?: number;
  className?: string;
  height?: string;
  showLegend?: boolean;
  showDaySlider?: boolean;
}

// Component to handle map view updates
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export const ConflictMap = ({
  throughDay = conflictMetadata.conflictDay,
  highlightDay,
  className,
  height = '500px',
  showLegend = true,
  showDaySlider = false,
}: ConflictMapProps) => {
  const [selectedDay, setSelectedDay] = useState(throughDay);
  const [selectedEvent, setSelectedEvent] = useState<ConflictEvent | null>(null);

  const effectiveDay = showDaySlider ? selectedDay : throughDay;
  const effectiveHighlightDay = highlightDay ?? effectiveDay;

  const events = useMemo(() => getEventsThrough(effectiveDay), [effectiveDay]);
  const highlightedEvents = useMemo(() => getEventsForDay(effectiveHighlightDay), [effectiveHighlightDay]);

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

          {/* Hormuz shipping lane */}
          <Polyline
            positions={hormuzShippingLane}
            pathOptions={{
              color: '#06b6d4',
              weight: 3,
              dashArray: '10, 10',
              opacity: 0.7,
            }}
          />

          {/* Event markers */}
          {events.map((event, index) => {
            const isHighlighted = highlightedEvents.some(
              (he) => he.lat === event.lat && he.lng === event.lng && he.target === event.target
            );

            return (
              <Marker
                key={`${event.date}-${event.target}-${index}`}
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
        </MapContainer>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-background/90 backdrop-blur-sm p-3 rounded border border-border max-w-[200px]">
          <p className="font-mono text-[9px] uppercase tracking-wider text-primary mb-2">Legend</p>
          <div className="grid grid-cols-1 gap-1.5">
            {activeTypes.map((type) => (
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
            <div className="flex items-center gap-2 mt-1 pt-1 border-t border-border">
              <div className="w-3 h-3 border-2 border-dashed border-red-500 rounded-sm opacity-50"></div>
              <span className="font-mono text-[9px] text-muted-foreground">War Risk Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-cyan-500 opacity-70" style={{ borderBottom: '2px dashed #06b6d4' }}></div>
              <span className="font-mono text-[9px] text-muted-foreground">Shipping Lane</span>
            </div>
          </div>
        </div>
      )}

      {/* Hormuz CLOSED label */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded">
        <span className="font-mono text-[10px] text-white font-bold tracking-wider">
          HORMUZ: CLOSED TO WESTERN SHIPPING
        </span>
      </div>
    </motion.div>
  );
};

export default ConflictMap;
