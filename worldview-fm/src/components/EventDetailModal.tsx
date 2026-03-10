import { useEffect, useCallback, useMemo } from 'react';
import type { AgentEvent } from '../data/feeds/agentFeed';

interface EventDetailModalProps {
  event: AgentEvent | null;
  allEvents: AgentEvent[];
  onClose: () => void;
  onEventClick: (event: AgentEvent) => void;
}

// Conflict start date for day calculation
const CONFLICT_START = new Date('2026-02-28T00:00:00Z');

function getConflictDay(timestamp: string): number {
  const eventDate = new Date(timestamp);
  const diff = eventDate.getTime() - CONFLICT_START.getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
}

function getEventTypeColor(type: string): string {
  switch (type) {
    case 'strike': return '#ef4444';
    case 'naval': return '#3b82f6';
    case 'diplomatic': return '#a855f7';
    case 'economic': return '#eab308';
    case 'infrastructure': return '#f97316';
    case 'casualty': return '#dc2626';
    default: return '#6b7280';
  }
}

function getConfidenceBadgeStyle(confidence: string): { bg: string; text: string } {
  switch (confidence) {
    case 'high': return { bg: 'bg-green-500/20', text: 'text-green-400' };
    case 'medium': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400' };
    case 'low': return { bg: 'bg-red-500/20', text: 'text-red-400' };
    default: return { bg: 'bg-gray-500/20', text: 'text-gray-400' };
  }
}

// Calculate distance between two points (simple Haversine)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function EventDetailModal({ event, allEvents, onClose, onEventClick }: EventDetailModalProps) {
  // Handle ESC key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Find related events (by location proximity and time)
  const relatedEvents = useMemo(() => {
    if (!event || event.lat === null || event.lon === null) return [];

    return allEvents
      .filter(e => e.id !== event.id && e.lat !== null && e.lon !== null)
      .map(e => ({
        event: e,
        distance: getDistance(event.lat!, event.lon!, e.lat!, e.lon!),
        timeDiff: Math.abs(new Date(event.timestamp).getTime() - new Date(e.timestamp).getTime())
      }))
      .sort((a, b) => {
        // Prioritize nearby events, then recent ones
        const distScore = a.distance - b.distance;
        const timeScore = (a.timeDiff - b.timeDiff) / (1000 * 60 * 60 * 24); // normalize to days
        return distScore * 0.7 + timeScore * 0.3;
      })
      .slice(0, 3)
      .map(r => r.event);
  }, [event, allEvents]);

  if (!event) return null;

  const conflictDay = getConflictDay(event.timestamp);
  const typeColor = getEventTypeColor(event.eventType);
  const confidenceStyle = getConfidenceBadgeStyle(event.confidence);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#0a0f1a] border border-[#1f2937] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#0a0f1a] border-b border-[#1f2937] p-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs font-bold uppercase px-2 py-0.5 rounded"
                style={{ backgroundColor: `${typeColor}20`, color: typeColor }}
              >
                {event.eventType}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${confidenceStyle.bg} ${confidenceStyle.text}`}>
                {event.confidence.toUpperCase()}
              </span>
              {event.validated && (
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                  ✓ VALIDATED
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-gray-100">
              {event.rawHeadline}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Summary */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Summary</h3>
            <p className="text-gray-300 leading-relaxed">{event.summary}</p>
          </div>

          {/* Actors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Actor 1</h3>
              <p className="text-gray-200 font-medium">{event.actor1}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Actor 2</h3>
              <p className="text-gray-200 font-medium">{event.actor2}</p>
            </div>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-3 gap-4 bg-[#111827] rounded-lg p-4">
            <div>
              <div className="text-xs text-gray-500 uppercase">Location</div>
              <div className="text-sm text-gray-200 font-medium">{event.location}</div>
              {event.lat !== null && event.lon !== null && (
                <div className="text-xs text-gray-500 font-mono mt-1">
                  {event.lat.toFixed(4)}, {event.lon.toFixed(4)}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase">Timestamp</div>
              <div className="text-sm text-gray-200 font-medium">
                {new Date(event.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(event.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })} UTC
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase">Conflict Day</div>
              <div className="text-sm text-[#ef4444] font-bold">DAY {conflictDay}</div>
            </div>
          </div>

          {/* Source */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Source</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">{event.source}</span>
              {event.sourceUrl && (
                <a
                  href={event.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                >
                  View Original →
                </a>
              )}
            </div>
          </div>

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Related Events</h3>
              <div className="space-y-2">
                {relatedEvents.map(related => (
                  <button
                    key={related.id}
                    onClick={() => onEventClick(related)}
                    className="w-full text-left bg-[#111827] hover:bg-[#1f2937] rounded-lg p-3 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${getEventTypeColor(related.eventType)}20`, color: getEventTypeColor(related.eventType) }}
                      >
                        {related.eventType}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Day {getConflictDay(related.timestamp)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300 line-clamp-1">{related.rawHeadline}</div>
                    <div className="text-xs text-gray-500 mt-1">{related.location}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
