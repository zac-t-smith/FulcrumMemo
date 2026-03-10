import { useState, useCallback } from 'react';
import type { LayerState } from '../types';

export interface MapStateParams {
  lat?: number;
  lon?: number;
  zoom?: number;
  layers?: string;
  date?: string;
}

// Parse URL params on load
export function parseMapStateFromURL(): MapStateParams {
  const params = new URLSearchParams(window.location.search);

  const lat = params.get('lat');
  const lon = params.get('lon');
  const zoom = params.get('zoom');
  const layers = params.get('layers');
  const date = params.get('date');

  return {
    lat: lat ? parseFloat(lat) : undefined,
    lon: lon ? parseFloat(lon) : undefined,
    zoom: zoom ? parseInt(zoom, 10) : undefined,
    layers: layers || undefined,
    date: date || undefined
  };
}

// Generate shareable URL
export function generateShareURL(params: MapStateParams): string {
  const url = new URL(window.location.origin + window.location.pathname);

  if (params.lat !== undefined) url.searchParams.set('lat', params.lat.toFixed(4));
  if (params.lon !== undefined) url.searchParams.set('lon', params.lon.toFixed(4));
  if (params.zoom !== undefined) url.searchParams.set('zoom', params.zoom.toString());
  if (params.layers) url.searchParams.set('layers', params.layers);
  if (params.date) url.searchParams.set('date', params.date);

  return url.toString();
}

// Parse layers string to LayerState
export function parseLayersString(layersStr: string): Partial<LayerState> {
  const active = layersStr.split(',').map(s => s.trim().toLowerCase());
  return {
    conflictEvents: active.includes('events'),
    vessels: active.includes('vessels'),
    flights: active.includes('flights'),
    satellites: active.includes('satellites'),
    oilInfrastructure: active.includes('oil'),
    shippingRoutes: active.includes('routes')
  };
}

// Convert LayerState to string
export function layersToString(layers: LayerState): string {
  const active: string[] = [];
  if (layers.conflictEvents) active.push('events');
  if (layers.vessels) active.push('vessels');
  if (layers.flights) active.push('flights');
  if (layers.satellites) active.push('satellites');
  if (layers.oilInfrastructure) active.push('oil');
  if (layers.shippingRoutes) active.push('routes');
  return active.join(',');
}

// Toast notification hook
export function useToast() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string, duration = 2000) => {
    setToast(message);
    setTimeout(() => setToast(null), duration);
  }, []);

  return { toast, showToast };
}
