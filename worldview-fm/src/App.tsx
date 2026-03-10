import { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { GlobeMap } from './components/map/GlobeMap';
import { ViewModeFilter } from './components/ViewModeFilter';
import { IntelligencePanel } from './components/panels/IntelligencePanel';
import { SitrepModal } from './components/SitrepModal';
import { Toast } from './components/Toast';
import type { LayerState } from './types';
import {
  parseMapStateFromURL,
  generateShareURL,
  layersToString,
  parseLayersString,
  useToast
} from './hooks/useMapState';

export interface MapState {
  center: [number, number];
  zoom: number;
}

function App() {
  // Parse initial state from URL
  const urlParams = useRef(parseMapStateFromURL());

  const [layers, setLayers] = useState<LayerState>(() => {
    // Use URL params if available, otherwise defaults
    if (urlParams.current.layers) {
      const parsed = parseLayersString(urlParams.current.layers);
      return {
        vessels: parsed.vessels ?? true,
        flights: parsed.flights ?? true,
        satellites: parsed.satellites ?? true,
        oilInfrastructure: parsed.oilInfrastructure ?? true,
        conflictEvents: parsed.conflictEvents ?? true,
        shippingRoutes: parsed.shippingRoutes ?? true,
      };
    }
    return {
      vessels: true,
      flights: true,
      satellites: true,
      oilInfrastructure: true,
      conflictEvents: true,
      shippingRoutes: true,
    };
  });

  const [vesselCount, setVesselCount] = useState(0);
  const [mapState, setMapState] = useState<MapState>({
    center: [
      urlParams.current.lat ?? 26.5,
      urlParams.current.lon ?? 56.2
    ],
    zoom: urlParams.current.zoom ?? 5
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(
    urlParams.current.date || null
  );

  const { toast, showToast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSitrepOpen, setIsSitrepOpen] = useState(false);

  const handleToggleLayer = (layer: keyof LayerState) => {
    setLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const handleVesselCountChange = useCallback((count: number) => {
    setVesselCount(count);
  }, []);

  const handleMapStateChange = useCallback((state: MapState) => {
    setMapState(state);
  }, []);

  const handleDateChange = useCallback((date: string | null) => {
    setSelectedDate(date);
  }, []);

  const handleShare = useCallback(() => {
    const shareUrl = generateShareURL({
      lat: mapState.center[0],
      lon: mapState.center[1],
      zoom: mapState.zoom,
      layers: layersToString(layers),
      date: selectedDate || undefined
    });

    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast('Link copied to clipboard!');
    }).catch(() => {
      // Fallback: show URL in console
      console.log('Share URL:', shareUrl);
      showToast('Link generated (check console)');
    });
  }, [mapState, layers, selectedDate, showToast]);

  // Clear URL params after initial load (keeps URL clean)
  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0f1a]">
      <Header
        vesselCount={vesselCount}
        onShare={handleShare}
        onSitrep={() => setIsSitrepOpen(true)}
      />
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 relative">
          <GlobeMap
            layers={layers}
            onVesselCountChange={handleVesselCountChange}
            onMapStateChange={handleMapStateChange}
            onDateChange={handleDateChange}
            initialCenter={urlParams.current.lat && urlParams.current.lon
              ? [urlParams.current.lat, urlParams.current.lon]
              : undefined
            }
            initialZoom={urlParams.current.zoom}
            initialDate={urlParams.current.date}
          />
          <ViewModeFilter />
        </div>

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="sidebar-toggle fixed right-4 top-16 z-[60] bg-[#F96302] text-white p-2 rounded-lg shadow-lg"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isSidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className={`intelligence-panel ${isSidebarOpen ? 'expanded' : ''} md:relative md:transform-none`}>
          <IntelligencePanel
            layers={layers}
            onToggleLayer={handleToggleLayer}
          />
        </div>
      </div>
      <SitrepModal
        isOpen={isSitrepOpen}
        onClose={() => setIsSitrepOpen(false)}
      />
      <Toast message={toast} />
    </div>
  );
}

export default App;
