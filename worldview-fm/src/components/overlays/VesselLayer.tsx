import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { VesselData } from '../../types';

interface VesselLayerProps {
  vessels: VesselData[];
}

// Create vessel icon based on type
function createVesselIcon(vessel: VesselData): L.DivIcon {
  const isMilitary = vessel.type === 'Military';
  const color = isMilitary ? '#ef4444' : '#3b82f6';
  const rotation = vessel.heading;

  return L.divIcon({
    className: 'vessel-marker',
    html: `
      <div style="
        transform: rotate(${rotation}deg);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 16px solid ${color};
        filter: drop-shadow(0 0 4px ${color});
      "></div>
    `,
    iconSize: [12, 16],
    iconAnchor: [6, 8],
    popupAnchor: [0, -8]
  });
}

export function VesselLayer({ vessels }: VesselLayerProps) {
  return (
    <>
      {vessels.map((vessel) => (
        <Marker
          key={vessel.mmsi}
          position={vessel.coordinates}
          icon={createVesselIcon(vessel)}
        >
          <Popup>
            <div className="event-popup">
              <h3>{vessel.name}</h3>
              <div className="category">{vessel.type} // {vessel.flag}</div>
              <div className="description">
                <div>MMSI: {vessel.mmsi}</div>
                <div>Speed: {vessel.speed} kn</div>
                <div>Heading: {vessel.heading}°</div>
                {vessel.destination && (
                  <div>Dest: {vessel.destination}</div>
                )}
              </div>
              <span className={`status ${vessel.speed === 0 ? 'tracking' : 'confirmed'}`}>
                {vessel.speed === 0 ? 'HOLDING' : 'UNDERWAY'}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
