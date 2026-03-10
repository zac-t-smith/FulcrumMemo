import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { ConflictEvent } from '../../types';
import { categoryColors } from '../../data/conflictData';

interface ConflictEventLayerProps {
  events: ConflictEvent[];
}

// Create custom icon for each category
function createEventIcon(category: string, isChokepoint: boolean = false): L.DivIcon {
  const color = categoryColors[category] || '#F96302';
  const size = isChokepoint ? 20 : 14;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 2px solid rgba(255,255,255,0.8);
        border-radius: 50%;
        box-shadow: 0 0 ${isChokepoint ? '12px' : '8px'} ${color};
        ${isChokepoint ? 'animation: pulse 2s infinite;' : ''}
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
}

export function ConflictEventLayer({ events }: ConflictEventLayerProps) {
  return (
    <>
      {events.map((event) => (
        <Marker
          key={event.id}
          position={event.coordinates}
          icon={createEventIcon(event.category, event.category === 'chokepoint')}
        >
          <Popup>
            <div className="event-popup">
              <h3>{event.name}</h3>
              <div className="category">
                {event.category}
                {event.day && ` // DAY ${event.day}`}
              </div>
              <p className="description">{event.description}</p>
              {event.status && (
                <span className={`status ${event.status}`}>
                  {event.status}
                </span>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
