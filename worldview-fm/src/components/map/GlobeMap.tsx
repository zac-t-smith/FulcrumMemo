// GlobeMap - CesiumJS 3D Globe with performance optimizations
// Uses primitive collections for 10-50x faster rendering
// All Cesium objects managed via useRef, never useState

import { useEffect, useCallback, useRef, memo, useState } from 'react';
import * as Cesium from 'cesium';
import type { AgentEvent } from '../../data/feeds/agentFeed';
import { startAgentFeed, subscribeToAgentFeed } from '../../data/feeds/agentFeed';
import { startAISStream, subscribeToAISStream, getShipTypeCategory } from '../../data/feeds/aisStream';
import { startOpenSkyFeed, subscribeToOpenSky, stopOpenSkyFeed } from '../../data/feeds/openSkyFeed';
import { startSatelliteFeed, subscribeToSatelliteFeed, stopSatelliteFeed, getSatelliteCountryColor } from '../../data/feeds/satelliteFeed';
import type { SatellitePosition } from '../../data/feeds/satelliteFeed';
import type { VesselPosition } from '../../data/feeds/aisStream';
import type { FlightPosition } from '../../data/feeds/openSkyFeed';
import { TimelineScrubber } from '../TimelineScrubber';
import { IntelFeedPanel } from '../IntelFeedPanel';
import type { LayerState } from '../../types';

import 'cesium/Build/Cesium/Widgets/widgets.css';

// Configure Cesium Ion
const CESIUM_ION_TOKEN = import.meta.env.VITE_CESIUM_ION_TOKEN;
if (CESIUM_ION_TOKEN) {
  Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN;
  console.log('[Globe] Cesium Ion token configured');
} else {
  console.error('[Globe] No Cesium Ion token found - set VITE_CESIUM_ION_TOKEN in GitHub Secrets or .env');
  console.error('[Globe] The 3D globe will not render correctly without a valid token');
}

interface MapState {
  center: [number, number];
  zoom: number;
}

interface GlobeMapProps {
  layers: LayerState;
  onVesselCountChange?: (count: number) => void;
  onMapStateChange?: (state: MapState) => void;
  onDateChange?: (date: string | null) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
  initialDate?: string;
}

// Initial camera position - centered on Persian Gulf / Strait of Hormuz
const INITIAL_CAMERA = {
  lon: 56.26,
  lat: 26.57,
  alt: 4500000 // 4500km - shows Middle East theater clearly
};

const CONFLICT_START = new Date('2026-02-28T00:00:00Z');

// Event type colors
const EVENT_COLORS: Record<string, Cesium.Color> = {
  strike: Cesium.Color.fromCssColorString('#ef4444'),
  naval: Cesium.Color.fromCssColorString('#3b82f6'),
  diplomatic: Cesium.Color.fromCssColorString('#a855f7'),
  economic: Cesium.Color.fromCssColorString('#eab308'),
  infrastructure: Cesium.Color.fromCssColorString('#f97316'),
  casualty: Cesium.Color.fromCssColorString('#dc2626'),
  default: Cesium.Color.fromCssColorString('#6b7280')
};

// Vessel colors
const VESSEL_COLORS: Record<string, Cesium.Color> = {
  tanker: Cesium.Color.fromCssColorString('#F96302'),
  cargo: Cesium.Color.fromCssColorString('#3b82f6'),
  military: Cesium.Color.fromCssColorString('#ef4444'),
  other: Cesium.Color.fromCssColorString('#6b7280')
};

// Flight colors
const FLIGHT_COLORS: Record<string, Cesium.Color> = {
  military: Cesium.Color.fromCssColorString('#ef4444'),
  commercial: Cesium.Color.fromCssColorString('#22c55e'),
  unknown: Cesium.Color.fromCssColorString('#6b7280')
};

// Shipping route data
const SHIPPING_ROUTES = {
  hormuzNormal: [
    [56.2, 26.5], [56.8, 26.3], [57.5, 25.8], [58.5, 25.0],
    [60.0, 24.5], [65.0, 22.0], [72.0, 18.0]
  ],
  capeDiversion: [
    [72.0, 18.0], [65.0, 10.0], [55.0, 0.0], [45.0, -10.0],
    [35.0, -25.0], [20.0, -35.0], [5.0, -35.0], [-5.0, -30.0],
    [-15.0, -10.0], [-20.0, 10.0]
  ],
  suezRoute: [
    [56.2, 26.5], [50.0, 27.0], [45.0, 25.0], [40.0, 20.0],
    [38.0, 15.0], [43.5, 12.6], [44.5, 12.7]
  ]
};

function GlobeMapComponent({
  layers,
  onVesselCountChange,
  onMapStateChange,
  onDateChange,
  initialCenter,
  initialZoom,
  initialDate
}: GlobeMapProps) {
  // Refs for all Cesium objects - NEVER use useState for these
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const pointsRef = useRef<Cesium.PointPrimitiveCollection | null>(null);
  const labelsRef = useRef<Cesium.LabelCollection | null>(null);
  const groundTracksRef = useRef<Cesium.PrimitiveCollection | null>(null);
  const clickHandlerRef = useRef<Cesium.ScreenSpaceEventHandler | null>(null);

  // Point-to-event mapping for click detection
  const pointEventMapRef = useRef<Map<number, AgentEvent>>(new Map());
  const eventPointsRef = useRef<Map<string, Cesium.PointPrimitive>>(new Map());

  // Data refs
  const eventsRef = useRef<AgentEvent[]>([]);
  const vesselsRef = useRef<VesselPosition[]>([]);
  const flightsRef = useRef<FlightPosition[]>([]);
  const satellitesRef = useRef<SatellitePosition[]>([]);

  // State refs (to avoid re-renders)
  const layersRef = useRef(layers);
  const timelineDateRef = useRef<Date | null>(initialDate ? new Date(initialDate) : null);
  const isLiveRef = useRef(!initialDate);

  // React state for modal (needs re-renders)
  const [selectedEvent, setSelectedEvent] = useState<AgentEvent | null>(null);
  const [modalPos, setModalPos] = useState({ x: 0, y: 0 });

  // Stats for display
  const statsRef = useRef({
    satellites: 0,
    flights: 0,
    militaryFlights: 0,
    vessels: 0
  });

  // Force update for stats display
  const forceUpdateRef = useRef(0);

  // Update layers ref when prop changes
  useEffect(() => {
    layersRef.current = layers;

    // Lazy load satellite data only when layer is enabled
    if (layers.satellites) {
      startSatelliteFeed();
    } else {
      stopSatelliteFeed();
    }

    // Same for flights
    if (layers.flights) {
      startOpenSkyFeed();
    } else {
      stopOpenSkyFeed();
    }

    // Trigger re-render of primitives
    updatePrimitives();
  }, [layers]);

  // Initialize Cesium viewer
  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    console.log('[Globe] Initializing Cesium viewer...');

    // Create viewer with performance settings
    const viewer = new Cesium.Viewer(containerRef.current, {
      timeline: false,
      animation: false,
      homeButton: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      navigationHelpButton: false,
      geocoder: false,
      fullscreenButton: false,
      vrButton: false,
      infoBox: false,
      selectionIndicator: false,
      scene3DOnly: true,
      shadows: false,
      shouldAnimate: false,
      // Dark base layer
      baseLayer: new Cesium.ImageryLayer(
        new Cesium.UrlTemplateImageryProvider({
          url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          subdomains: ['a', 'b', 'c', 'd'],
          maximumLevel: 18,
          credit: 'CartoDB'
        })
      ),
      creditContainer: document.createElement('div')
    });

    // PERFORMANCE: Apply optimization settings
    viewer.scene.fog.enabled = false;
    viewer.scene.globe.maximumScreenSpaceError = 4;
    viewer.scene.requestRenderMode = true;
    viewer.scene.maximumRenderTimeChange = 1.0;
    viewer.resolutionScale = 0.9;
    viewer.scene.globe.tileCacheSize = 100;

    // Camera constraints and controls
    const controller = viewer.scene.screenSpaceCameraController;
    controller.minimumZoomDistance = 500;
    controller.maximumZoomDistance = 20000000;
    // Explicitly enable all camera controls
    controller.enableRotate = true;
    controller.enableZoom = true;
    controller.enableTilt = true;
    controller.enableLook = true;
    controller.enableTranslate = true;

    // Set initial camera position
    const initLon = initialCenter ? initialCenter[1] : INITIAL_CAMERA.lon;
    const initLat = initialCenter ? initialCenter[0] : INITIAL_CAMERA.lat;
    const initAlt = initialZoom
      ? Math.pow(2, 18 - initialZoom) * 1000
      : INITIAL_CAMERA.alt;

    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(initLon, initLat, initAlt),
      orientation: {
        heading: 0,
        pitch: Cesium.Math.toRadians(-90), // Straight down view
        roll: 0
      }
    });

    // Create primitive collections for efficient rendering
    const points = new Cesium.PointPrimitiveCollection();
    const labels = new Cesium.LabelCollection();
    const groundTracks = new Cesium.PrimitiveCollection();

    viewer.scene.primitives.add(points);
    viewer.scene.primitives.add(labels);
    viewer.scene.primitives.add(groundTracks);

    viewerRef.current = viewer;
    pointsRef.current = points;
    labelsRef.current = labels;
    groundTracksRef.current = groundTracks;

    // Add shipping routes as static polylines
    addShippingRoutes(viewer);

    // Track camera changes for share feature
    viewer.camera.moveEnd.addEventListener(() => {
      if (!onMapStateChange) return;
      const cartographic = viewer.camera.positionCartographic;
      const lat = Cesium.Math.toDegrees(cartographic.latitude);
      const lon = Cesium.Math.toDegrees(cartographic.longitude);
      const altitude = cartographic.height;
      const zoom = Math.max(1, Math.min(18, Math.round(18 - Math.log2(altitude / 1000))));
      onMapStateChange({ center: [lat, lon], zoom });
    });

    // Set up click handler for event markers
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // Click handler - simplified approach using event ID stored on primitive
    handler.setInputAction((click: { position: Cesium.Cartesian2 }) => {
      const pickedObject = viewer.scene.pick(click.position);

      if (Cesium.defined(pickedObject)) {
        // Check for event ID on the picked object
        const eventId = pickedObject.id;
        if (eventId && typeof eventId === 'string') {
          // Find event by ID
          const event = eventsRef.current.find(e => e.id === eventId);
          if (event) {
            setSelectedEvent(event);
            setModalPos({ x: click.position.x, y: click.position.y });
            viewer.scene.requestRender();
            return;
          }
        }

        // Fallback: check point-event map
        if (pickedObject.primitive === pointsRef.current) {
          // Try to find by iterating the map
          for (const [_index, event] of pointEventMapRef.current.entries()) {
            const point = eventPointsRef.current.get(event.id);
            if (point && pickedObject.primitive) {
              // Check if this is an event point by position comparison
              const clickedPoint = pickedObject.id;
              if (clickedPoint === event.id) {
                setSelectedEvent(event);
                setModalPos({ x: click.position.x, y: click.position.y });
                viewer.scene.requestRender();
                return;
              }
            }
          }
        }
      }

      // Clicked empty space - close modal
      setSelectedEvent(null);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Hover handler for cursor
    handler.setInputAction((movement: { endPosition: Cesium.Cartesian2 }) => {
      const pickedObject = viewer.scene.pick(movement.endPosition);
      if (Cesium.defined(pickedObject) && pickedObject.primitive === pointsRef.current) {
        viewer.scene.canvas.style.cursor = 'pointer';
      } else {
        viewer.scene.canvas.style.cursor = 'default';
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    clickHandlerRef.current = handler;

    // Cleanup
    return () => {
      if (clickHandlerRef.current) {
        clickHandlerRef.current.destroy();
        clickHandlerRef.current = null;
      }
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  // Add shipping routes as static polylines
  function addShippingRoutes(viewer: Cesium.Viewer) {
    // Normal Hormuz route - green
    viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(
          SHIPPING_ROUTES.hormuzNormal.flat()
        ),
        width: 2,
        material: Cesium.Color.fromCssColorString('#22c55e').withAlpha(0.7),
        clampToGround: true
      }
    });

    // Suez route - blue
    viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(
          SHIPPING_ROUTES.suezRoute.flat()
        ),
        width: 2,
        material: Cesium.Color.fromCssColorString('#3b82f6').withAlpha(0.7),
        clampToGround: true
      }
    });

    // Cape diversion - orange dashed
    viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(
          SHIPPING_ROUTES.capeDiversion.flat()
        ),
        width: 3,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.fromCssColorString('#F96302'),
          dashLength: 16
        }),
        clampToGround: true
      }
    });
  }

  // Update all primitives based on current data
  function updatePrimitives() {
    const viewer = viewerRef.current;
    const points = pointsRef.current;
    const labels = labelsRef.current;
    const groundTracks = groundTracksRef.current;

    if (!viewer || !points || !labels || !groundTracks) return;

    // Clear existing primitives and maps
    points.removeAll();
    labels.removeAll();
    groundTracks.removeAll();
    pointEventMapRef.current.clear();
    eventPointsRef.current.clear();

    const layers = layersRef.current;
    const cameraAlt = viewer.camera.positionCartographic.height;
    const showLabels = cameraAlt < 3000000; // Show labels when < 3000km

    let pointIndex = 0; // Track point index for click mapping

    // Render conflict events
    if (layers.conflictEvents) {
      const timelineDate = timelineDateRef.current;
      const filteredEvents = eventsRef.current.filter(e => {
        if (e.lat === null || e.lon === null) return false;
        if (e.mapRelevant === false) return false;
        if (timelineDate) {
          const eventDate = new Date(e.timestamp);
          return eventDate >= CONFLICT_START && eventDate <= timelineDate;
        }
        return true;
      });

      for (const event of filteredEvents) {
        const color = EVENT_COLORS[event.eventType] || EVENT_COLORS.default;
        const point = points.add({
          position: Cesium.Cartesian3.fromDegrees(event.lon!, event.lat!, 0),
          pixelSize: 12, // Slightly larger for easier clicking
          color: color,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          id: event.id // Store event ID on the primitive
        });

        // Store mapping from point index to event
        pointEventMapRef.current.set(pointIndex, event);
        eventPointsRef.current.set(event.id, point);
        pointIndex++;

        if (showLabels) {
          labels.add({
            position: Cesium.Cartesian3.fromDegrees(event.lon!, event.lat!, 0),
            text: event.eventType.charAt(0).toUpperCase(),
            font: 'bold 10px sans-serif',
            fillColor: Cesium.Color.WHITE,
            outlineColor: color,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, -18),
            showBackground: true,
            backgroundColor: color.withAlpha(0.8),
            backgroundPadding: new Cesium.Cartesian2(4, 2),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          });
        }
      }
    }

    // Render vessels
    if (layers.vessels) {
      for (const vessel of vesselsRef.current) {
        const category = getShipTypeCategory(vessel.shipType);
        const color = VESSEL_COLORS[category] || VESSEL_COLORS.other;
        const size = category === 'military' ? 8 : category === 'tanker' ? 6 : 5;

        points.add({
          position: Cesium.Cartesian3.fromDegrees(vessel.lon, vessel.lat, 0),
          pixelSize: size,
          color: color,
          outlineColor: Cesium.Color.WHITE.withAlpha(0.5),
          outlineWidth: 1
        });
      }
    }

    // Render flights
    if (layers.flights) {
      for (const flight of flightsRef.current) {
        const color = FLIGHT_COLORS[flight.category] || FLIGHT_COLORS.unknown;
        const size = flight.category === 'military' ? 8 : 5;

        points.add({
          position: Cesium.Cartesian3.fromDegrees(flight.lon, flight.lat, flight.altitude),
          pixelSize: size,
          color: color,
          outlineColor: Cesium.Color.WHITE.withAlpha(0.5),
          outlineWidth: 1
        });

        // Military flight labels
        if (flight.category === 'military' && showLabels && flight.callsign) {
          labels.add({
            position: Cesium.Cartesian3.fromDegrees(flight.lon, flight.lat, flight.altitude),
            text: flight.callsign.substring(0, 8),
            font: 'bold 9px monospace',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.RED,
            outlineWidth: 1,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(12, 0),
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
            backgroundPadding: new Cesium.Cartesian2(4, 2),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          });
        }
      }
    }

    // Render satellites with country colors
    if (layers.satellites) {
      for (const sat of satellitesRef.current) {
        const colorStr = getSatelliteCountryColor(sat.country);
        const color = Cesium.Color.fromCssColorString(colorStr);
        const size = sat.isOverTheater ? 6 : 4;

        // Satellite position
        points.add({
          position: Cesium.Cartesian3.fromDegrees(sat.lon, sat.lat, sat.alt * 1000),
          pixelSize: size,
          color: color,
          outlineColor: sat.isOverTheater ? Cesium.Color.WHITE : Cesium.Color.TRANSPARENT,
          outlineWidth: sat.isOverTheater ? 1 : 0
        });

        // Labels for surveillance satellites over theater
        if (sat.isOverTheater && sat.category === 'leo-surveillance' && showLabels) {
          const displayName = sat.name.length > 12 ? sat.name.substring(0, 12) : sat.name;
          labels.add({
            position: Cesium.Cartesian3.fromDegrees(sat.lon, sat.lat, sat.alt * 1000),
            text: displayName,
            font: '9px monospace',
            fillColor: color,
            style: Cesium.LabelStyle.FILL,
            pixelOffset: new Cesium.Cartesian2(10, 0),
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
            backgroundPadding: new Cesium.Cartesian2(3, 1),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          });
        }

        // Ground track circle for low-altitude surveillance satellites
        if (sat.groundTrackRadius > 0 && sat.isOverTheater) {
          const circle = new Cesium.CircleGeometry({
            center: Cesium.Cartesian3.fromDegrees(sat.lon, sat.lat),
            radius: sat.groundTrackRadius * 1000, // Convert to meters
            height: 0
          });

          const instance = new Cesium.GeometryInstance({
            geometry: circle,
            attributes: {
              color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                color.withAlpha(0.08)
              )
            }
          });

          groundTracks.add(new Cesium.GroundPrimitive({
            geometryInstances: instance,
            appearance: new Cesium.PerInstanceColorAppearance({
              flat: true,
              translucent: true
            })
          }));
        }
      }
    }

    // Request render
    viewer.scene.requestRender();
  }

  // Subscribe to data feeds
  useEffect(() => {
    startAgentFeed();
    startAISStream();

    // Only start satellite/flight if layer is on
    if (layersRef.current.satellites) startSatelliteFeed();
    if (layersRef.current.flights) startOpenSkyFeed();

    const unsubAgent = subscribeToAgentFeed((state) => {
      eventsRef.current = state.events;
      updatePrimitives();
    });

    const unsubAIS = subscribeToAISStream((state) => {
      vesselsRef.current = Array.from(state.vessels.values());
      statsRef.current.vessels = state.vesselCount;
      onVesselCountChange?.(state.vesselCount);
      updatePrimitives();
    });

    const unsubOpenSky = subscribeToOpenSky((state) => {
      flightsRef.current = state.flights;
      statsRef.current.flights = state.totalCount;
      statsRef.current.militaryFlights = state.militaryCount;
      updatePrimitives();
      forceUpdateRef.current++;
    });

    const unsubSatellite = subscribeToSatelliteFeed((state) => {
      satellitesRef.current = state.satellites;
      statsRef.current.satellites = state.visibleCount;
      updatePrimitives();
      forceUpdateRef.current++;
    });

    return () => {
      unsubAgent();
      unsubAIS();
      unsubOpenSky();
      unsubSatellite();
    };
  }, [onVesselCountChange]);

  // Timeline handlers
  const handleDateChange = useCallback((date: Date | null) => {
    timelineDateRef.current = date;
    isLiveRef.current = date === null;
    onDateChange?.(date ? date.toISOString().split('T')[0] : null);
    updatePrimitives();
  }, [onDateChange]);

  const handleLiveToggle = useCallback(() => {
    isLiveRef.current = true;
    timelineDateRef.current = null;
    onDateChange?.(null);
    updatePrimitives();
  }, [onDateChange]);

  const handleEventClick = useCallback((event: AgentEvent) => {
    if (event.lat && event.lon && viewerRef.current) {
      viewerRef.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(event.lon, event.lat, 500000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-45),
          roll: 0
        },
        duration: 1.5
      });
    }
  }, []);

  return (
    <div className="relative h-full w-full globe-container">
      {/* Intel Feed Panel */}
      <IntelFeedPanel onEventClick={handleEventClick} />

      {/* Cesium container */}
      <div ref={containerRef} className="h-full w-full" />

      {/* Status overlay */}
      <div className="absolute top-4 left-4 bg-black/70 px-3 py-2 rounded-lg text-xs font-mono z-10">
        <div className="text-green-400">
          SATELLITES: {statsRef.current.satellites}
        </div>
        <div className="text-blue-400">
          FLIGHTS: {statsRef.current.flights}
          {statsRef.current.militaryFlights > 0 && (
            <span className="text-red-400 ml-2">
              MIL: {statsRef.current.militaryFlights}
            </span>
          )}
        </div>
        <div className="text-orange-400">
          VESSELS: {statsRef.current.vessels}
        </div>
      </div>

      {/* Timeline Scrubber */}
      <TimelineScrubber
        onDateChange={handleDateChange}
        isLive={isLiveRef.current}
        onLiveToggle={handleLiveToggle}
      />

      {/* Event Detail Modal - positioned near click location */}
      {selectedEvent && (
        <div
          className="event-popup"
          style={{
            position: 'fixed',
            left: Math.min(modalPos.x + 15, window.innerWidth - 380),
            top: Math.min(modalPos.y - 10, window.innerHeight - 320),
            width: '360px',
            backgroundColor: '#0d1117',
            border: '1px solid #F96302',
            borderRadius: '6px',
            padding: '16px',
            zIndex: 1000,
            color: '#e5e7eb',
            fontFamily: 'ui-monospace, monospace',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{
              color: EVENT_COLORS[selectedEvent.eventType]?.toCssColorString() || '#F96302',
              fontSize: '11px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {selectedEvent.eventType}
            </span>
            <button
              onClick={() => setSelectedEvent(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: '20px',
                lineHeight: 1,
                padding: '0 4px'
              }}
            >
              ×
            </button>
          </div>

          {/* Summary */}
          <div style={{ fontSize: '13px', marginBottom: '12px', lineHeight: '1.6', color: '#f3f4f6' }}>
            {selectedEvent.summary}
          </div>

          {/* Actor info */}
          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px' }}>
            <span style={{ color: '#F96302' }}>{selectedEvent.actor1}</span>
            <span style={{ margin: '0 6px' }}>→</span>
            <span style={{ color: '#ef4444' }}>{selectedEvent.actor2}</span>
          </div>

          {/* Location */}
          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px' }}>
            📍 {selectedEvent.location}
          </div>

          {/* Timestamp */}
          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '14px' }}>
            🕐 {new Date(selectedEvent.timestamp).toLocaleString()}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              fontSize: '10px',
              padding: '3px 8px',
              backgroundColor: selectedEvent.confidence === 'high' ? '#166534' : selectedEvent.confidence === 'medium' ? '#854d0e' : '#7f1d1d',
              color: selectedEvent.confidence === 'high' ? '#86efac' : selectedEvent.confidence === 'medium' ? '#fde68a' : '#fca5a5',
              borderRadius: '4px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              {selectedEvent.confidence} CONFIDENCE
            </span>
            <div style={{ display: 'flex', gap: '12px' }}>
              {selectedEvent.sourceUrl && (
                <a
                  href={selectedEvent.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '11px', color: '#F96302', textDecoration: 'none' }}
                >
                  SOURCE →
                </a>
              )}
              <button
                onClick={() => {
                  handleEventClick(selectedEvent);
                }}
                style={{
                  fontSize: '11px',
                  color: '#3b82f6',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                FLY TO →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrap in React.memo for performance
export const GlobeMap = memo(GlobeMapComponent);
