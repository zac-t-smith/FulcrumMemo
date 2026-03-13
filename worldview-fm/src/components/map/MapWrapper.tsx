import React, { useState, useEffect, Suspense } from 'react';
import { WorldMap } from './WorldMap';
import type { LayerState } from '../../types';

interface MapState {
  center: [number, number];
  zoom: number;
}

interface MapWrapperProps {
  layers: LayerState;
  onVesselCountChange?: (count: number) => void;
  onMapStateChange?: (state: MapState) => void;
  onDateChange?: (date: string | null) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
  initialDate?: string;
}

// Lazy load GlobeMap only when we're going to use it
const GlobeMap = React.lazy(() => import('./GlobeMap').then(module => ({ default: module.GlobeMap })));

/**
 * MapWrapper - Automatic map selection based on Cesium token availability
 *
 * Uses CesiumJS 3D globe when VITE_CESIUM_ION_TOKEN is set
 * Falls back to Leaflet 2D map when token is missing
 */
export function MapWrapper(props: MapWrapperProps) {
  const [mapMode, setMapMode] = useState<'loading' | 'cesium' | 'leaflet'>('loading');

  useEffect(() => {
    const cesiumToken = import.meta.env.VITE_CESIUM_ION_TOKEN;
    const hasCesiumToken = !!cesiumToken && cesiumToken.length > 10;

    // Debug: verify token is reaching the build
    console.log('[MapWrapper] Cesium token present:', hasCesiumToken, 'length:', cesiumToken?.length ?? 0);

    if (hasCesiumToken) {
      console.log('[MapWrapper] Using CesiumJS 3D globe');
      setMapMode('cesium');
    } else {
      console.log('[MapWrapper] Using Leaflet 2D map (no Cesium token)');
      setMapMode('leaflet');
    }
  }, []);

  // Loading state
  if (mapMode === 'loading') {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#0a0f1a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F96302] mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm font-mono">Initializing map...</p>
        </div>
      </div>
    );
  }

  // Cesium 3D globe
  if (mapMode === 'cesium') {
    return (
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center bg-[#0a0f1a]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F96302] mx-auto mb-4"></div>
              <p className="text-gray-400 text-sm font-mono">Loading 3D globe...</p>
            </div>
          </div>
        }
      >
        <ErrorBoundary
          fallback={
            <div className="h-full w-full">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-900/80 text-amber-200 px-4 py-2 rounded-lg text-xs font-mono z-50">
                3D globe failed to load — using 2D map
              </div>
              <WorldMap {...props} />
            </div>
          }
        >
          <GlobeMap {...props} />
        </ErrorBoundary>
      </Suspense>
    );
  }

  // Leaflet 2D map (default fallback)
  return <WorldMap {...props} />;
}

// Simple error boundary for catching Cesium load failures
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[MapWrapper] Cesium error, falling back to Leaflet:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default MapWrapper;
