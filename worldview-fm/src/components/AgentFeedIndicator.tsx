import { useState, useEffect } from 'react';
import type { AgentFeedState } from '../data/feeds/agentFeed';
import { subscribeToAgentFeed, startAgentFeed } from '../data/feeds/agentFeed';

export function AgentFeedIndicator() {
  const [feedState, setFeedState] = useState<AgentFeedState>({
    status: 'connecting',
    eventCount: 0,
    lastUpdated: null,
    events: []
  });

  useEffect(() => {
    // Start the agent feed polling
    startAgentFeed();

    // Subscribe to state changes
    const unsubscribe = subscribeToAgentFeed(setFeedState);

    return () => {
      unsubscribe();
    };
  }, []);

  const isLive = feedState.status === 'live';

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-500 uppercase tracking-wide">
        AGENT FEED
      </span>
      {isLive ? (
        <span className="text-xs font-bold text-[#22c55e] bg-[#22c55e]/20 px-2 py-0.5 rounded flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
          LIVE
        </span>
      ) : (
        <span className="text-xs font-bold text-gray-500 bg-gray-500/20 px-2 py-0.5 rounded">
          {feedState.status === 'connecting' ? 'CONNECTING' : 'OFFLINE'}
        </span>
      )}
      {isLive && feedState.events.length > 0 && (
        <span className="text-[10px] text-gray-400">
          ({feedState.events.length} events)
        </span>
      )}
    </div>
  );
}

export function AgentFeedPanel() {
  const [feedState, setFeedState] = useState<AgentFeedState>({
    status: 'connecting',
    eventCount: 0,
    lastUpdated: null,
    events: []
  });

  useEffect(() => {
    startAgentFeed();
    const unsubscribe = subscribeToAgentFeed(setFeedState);
    return () => unsubscribe();
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'strike': return 'text-red-400';
      case 'naval': return 'text-blue-400';
      case 'diplomatic': return 'text-purple-400';
      case 'economic': return 'text-yellow-400';
      case 'infrastructure': return 'text-orange-400';
      case 'casualty': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return <span className="text-[9px] px-1 py-0.5 bg-green-500/20 text-green-400 rounded">HIGH</span>;
      case 'medium':
        return <span className="text-[9px] px-1 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">MED</span>;
      case 'low':
        return <span className="text-[9px] px-1 py-0.5 bg-red-500/20 text-red-400 rounded">LOW</span>;
      default:
        return null;
    }
  };

  const isLive = feedState.status === 'live';

  if (!isLive) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        <div className="mb-2">Agent feed {feedState.status}</div>
        <div className="text-xs">Start the agent swarm server to enable live intelligence</div>
      </div>
    );
  }

  if (feedState.events.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        No recent events from agent swarm
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#1f2937]">
      {feedState.events.slice(0, 10).map(event => (
        <div key={event.id} className="p-3 hover:bg-[#1a1f2e] transition-colors">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className={`text-[10px] uppercase font-bold ${getEventTypeColor(event.eventType)}`}>
              {event.eventType}
            </span>
            <div className="flex items-center gap-1">
              {getConfidenceBadge(event.confidence)}
              {event.validated && (
                <span className="text-[9px] px-1 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                  VALIDATED
                </span>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-200 mb-1 line-clamp-2">
            {event.summary}
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-500">
            <span>{event.location}</span>
            <span>{formatTime(event.timestamp)}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-600 mt-1">
            <span>{event.actor1} → {event.actor2}</span>
            <span className="italic">{event.source}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
