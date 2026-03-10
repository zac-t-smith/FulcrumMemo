import { useState, useEffect } from 'react';
import type { AgentEvent } from '../data/feeds/agentFeed';
import { subscribeToAgentFeed, startAgentFeed } from '../data/feeds/agentFeed';

interface IntelFeedPanelProps {
  onEventClick: (event: AgentEvent) => void;
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  strike: '#ef4444',
  naval: '#3b82f6',
  economic: '#eab308',
  diplomatic: '#a855f7',
  infrastructure: '#f97316',
  casualty: '#dc2626'
};

const SOURCE_LABELS: Record<string, string> = {
  newsScanner: 'NEWS',
  osintMonitor: 'OSINT',
  shippingMonitor: 'SHIPPING',
  'anchor-event': 'VERIFIED',
  'acled-backfill': 'ACLED'
};

function formatTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'now';
}

function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return str.slice(0, len - 3) + '...';
}

export function IntelFeedPanel({ onEventClick }: IntelFeedPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [events, setEvents] = useState<AgentEvent[]>([]);

  useEffect(() => {
    startAgentFeed();

    const unsubscribe = subscribeToAgentFeed((state) => {
      // Sort by timestamp descending and take top 20
      const sorted = [...state.events].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setEvents(sorted.slice(0, 20));
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* Toggle button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-[1000] bg-[#0a0f1a] border border-[#1f2937] border-l-0 rounded-r-lg px-2 py-4 hover:bg-[#1a1f2e] transition-colors"
        >
          <div className="flex flex-col items-center gap-2">
            <svg className="w-4 h-4 text-[#F96302]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[10px] text-[#F96302] font-bold tracking-wider [writing-mode:vertical-lr] rotate-180">
              INTEL FEED
            </span>
          </div>
        </button>
      )}

      {/* Panel */}
      <div
        className={`absolute left-0 top-0 bottom-0 z-[1000] bg-[#0a0f1a]/95 border-r border-[#1f2937] backdrop-blur-sm transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '300px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-[#1f2937]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-sm font-bold text-[#F96302] tracking-wider">INTEL FEED</span>
            <span className="text-xs text-gray-500">({events.length})</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-[#1f2937] rounded transition-colors"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Events list */}
        <div className="overflow-y-auto" style={{ height: 'calc(100% - 52px)' }}>
          {events.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No events available
            </div>
          ) : (
            events.map((event) => (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
                className="w-full text-left p-3 border-b border-[#1f2937] hover:bg-[#1a1f2e] transition-colors group"
                style={{ borderLeftWidth: '3px', borderLeftColor: EVENT_TYPE_COLORS[event.eventType] || '#6b7280' }}
              >
                {/* Summary */}
                <div className="text-sm text-gray-200 mb-1 group-hover:text-white">
                  {truncate(event.summary, 80)}
                </div>

                {/* Actors */}
                <div className="text-xs text-gray-500 mb-1">
                  {event.actor1} → {event.actor2}
                </div>

                {/* Location + timestamp */}
                <div className="flex items-center justify-between text-[10px] text-gray-600">
                  <span className="truncate max-w-[150px]">{event.location}</span>
                  <span>{formatTimeAgo(event.timestamp)}</span>
                </div>

                {/* Source badge */}
                <div className="mt-1.5 flex items-center gap-2">
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                    style={{
                      backgroundColor: `${EVENT_TYPE_COLORS[event.eventType]}20`,
                      color: EVENT_TYPE_COLORS[event.eventType]
                    }}
                  >
                    {event.eventType.toUpperCase()}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-[#1f2937] text-gray-400 rounded">
                    {SOURCE_LABELS[event.source] || event.source}
                  </span>
                  {event.validated && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#22c55e]/20 text-[#22c55e] rounded">
                      VERIFIED
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
