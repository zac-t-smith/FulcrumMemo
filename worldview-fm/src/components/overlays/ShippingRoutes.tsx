import { Polyline, Popup } from 'react-leaflet';

// Normal route: Through Strait of Hormuz
const HORMUZ_ROUTE: [number, number][] = [
  [25.0, 56.5],   // Gulf of Oman approach
  [26.0, 56.4],   // Entering Hormuz
  [26.5, 56.2],   // Strait of Hormuz (narrowest point)
  [27.0, 55.5],   // Inside Persian Gulf
  [27.5, 53.0],   // Central Gulf
  [28.5, 50.5],   // Approaching Kuwait/Bahrain
  [29.5, 48.5],   // Northern Gulf terminals
];

// Cape of Good Hope diversion route (from Fujairah around Africa)
const CAPE_ROUTE: [number, number][] = [
  [25.0, 56.5],   // Gulf of Oman (Fujairah area)
  [22.0, 60.0],   // Arabian Sea
  [15.0, 55.0],   // Heading south
  [5.0, 50.0],    // East of Somalia
  [-5.0, 45.0],   // Approaching Africa
  [-15.0, 42.0],  // Mozambique Channel approach
  [-25.0, 38.0],  // East coast of Africa
  [-34.0, 25.0],  // Approaching Cape
  [-34.8, 18.5],  // Cape of Good Hope
  [-30.0, 15.0],  // Heading north (Atlantic)
  [-15.0, 10.0],  // West Africa
  [5.0, 0.0],     // Gulf of Guinea
  [20.0, -10.0],  // Continuing north
  [35.0, -5.0],   // Gibraltar approach
  [36.0, -5.5],   // Strait of Gibraltar
];

// Red Sea route segment (now blocked by Hormuz closure)
const RED_SEA_ROUTE: [number, number][] = [
  [12.5, 43.5],   // Bab el-Mandeb
  [15.0, 42.0],   // Southern Red Sea
  [20.0, 38.5],   // Central Red Sea
  [25.0, 35.0],   // Northern Red Sea
  [28.0, 33.5],   // Gulf of Suez approach
  [30.0, 32.5],   // Suez Canal
];

interface ShippingRoutesProps {
  showDiversion?: boolean;
}

export function ShippingRoutes({ showDiversion = true }: ShippingRoutesProps) {
  return (
    <>
      {/* Normal Hormuz Route (blocked) */}
      <Polyline
        positions={HORMUZ_ROUTE}
        pathOptions={{
          color: '#ef4444',
          weight: 3,
          opacity: 0.6,
          dashArray: '10, 10',
        }}
      >
        <Popup>
          <div className="text-sm">
            <div className="font-bold text-red-500 mb-1">⚠️ ROUTE BLOCKED</div>
            <div className="text-gray-700">Normal Hormuz Transit</div>
            <div className="text-xs text-gray-500 mt-1">
              ~2 days transit time
            </div>
            <div className="text-xs text-red-600 mt-1">
              ZERO Western transits since Day 1
            </div>
          </div>
        </Popup>
      </Polyline>

      {/* Cape Diversion Route */}
      {showDiversion && (
        <Polyline
          positions={CAPE_ROUTE}
          pathOptions={{
            color: '#22c55e',
            weight: 2,
            opacity: 0.7,
            dashArray: '5, 10',
          }}
        >
          <Popup>
            <div className="text-sm">
              <div className="font-bold text-green-500 mb-1">🚢 CAPE DIVERSION</div>
              <div className="text-gray-700">Alternative via Cape of Good Hope</div>
              <div className="text-xs text-gray-500 mt-1">
                +14-21 days transit time
              </div>
              <div className="text-xs text-amber-600 mt-1">
                VLCC rates: $440-460K/day
              </div>
            </div>
          </Popup>
        </Polyline>
      )}

      {/* Red Sea Route (active but risk elevated) */}
      <Polyline
        positions={RED_SEA_ROUTE}
        pathOptions={{
          color: '#f97316',
          weight: 2,
          opacity: 0.5,
          dashArray: '5, 5',
        }}
      >
        <Popup>
          <div className="text-sm">
            <div className="font-bold text-orange-500 mb-1">⚠️ ELEVATED RISK</div>
            <div className="text-gray-700">Bab el-Mandeb / Suez Route</div>
            <div className="text-xs text-gray-500 mt-1">
              Houthi activity zone
            </div>
            <div className="text-xs text-orange-600 mt-1">
              Insurance premiums +200%
            </div>
          </div>
        </Popup>
      </Polyline>
    </>
  );
}
