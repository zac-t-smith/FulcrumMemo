import { useState, useEffect, useMemo } from 'react';
import { scenarios } from '../data/conflictData';
import { subscribeToAgentFeed, startAgentFeed } from '../data/feeds/agentFeed';
import { subscribeToOilPrices, startOilPriceFeed } from '../data/feeds/oilPriceFeed';
import type { OilPriceState } from '../data/feeds/oilPriceFeed';

// Conflict start date - Operation Epic Fury
const CONFLICT_START = new Date('2026-02-28T00:00:00Z');

// THREATCON levels based on escalation probability
type ThreatconLevel = 'ALPHA' | 'BRAVO' | 'CHARLIE' | 'DELTA';

function getThreatconLevel(escalationProb: number): ThreatconLevel {
  if (escalationProb >= 50) return 'DELTA';
  if (escalationProb >= 35) return 'CHARLIE';
  if (escalationProb >= 20) return 'BRAVO';
  return 'ALPHA';
}

function getThreatconColor(level: ThreatconLevel): string {
  switch (level) {
    case 'DELTA': return '#ef4444';   // Red
    case 'CHARLIE': return '#f97316'; // Orange
    case 'BRAVO': return '#eab308';   // Yellow
    case 'ALPHA': return '#22c55e';   // Green
  }
}

interface HeaderProps {
  vesselCount?: number;
  onShare?: () => void;
  onSitrep?: () => void;
}

export function Header({ vesselCount = 0, onShare, onSitrep }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [eventCount, setEventCount] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [isStatic, setIsStatic] = useState(false);
  const [oilPrices, setOilPrices] = useState<OilPriceState | null>(null);

  // Auto-calculate conflict day
  const conflictDay = useMemo(() => {
    const now = new Date();
    const diff = now.getTime() - CONFLICT_START.getTime();
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
  }, [currentTime]);

  // Get THREATCON level from scenario probabilities
  const threatcon = useMemo(() => {
    const fullEscalation = scenarios.find(s => s.name === 'Full Escalation');
    const prob = fullEscalation?.probability || 50;
    return {
      level: getThreatconLevel(prob),
      color: getThreatconColor(getThreatconLevel(prob))
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    startAgentFeed();
    startOilPriceFeed();

    const unsubscribe = subscribeToAgentFeed((state) => {
      setEventCount(state.events.length);
      setIsLive(state.status === 'live');
      setIsStatic(state.status === 'static');
    });

    const unsubOil = subscribeToOilPrices((state) => {
      setOilPrices(state);
    });

    return () => {
      unsubscribe();
      unsubOil();
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  };

  return (
    <header className="h-14 bg-[#0a0f1a] border-b border-[#1f2937] flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#F96302] live-indicator" />
          <span className="text-[#F96302] font-bold tracking-wider text-sm">
            THE FULCRUM MEMO
          </span>
          <span className="text-gray-500 text-sm">//</span>
          <span className="text-gray-300 font-bold tracking-wider text-sm">
            WORLDVIEW
          </span>
        </div>

        <div className="h-6 w-px bg-[#1f2937]" />

        {/* Operation */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-wide">
            OP: EPIC FURY
          </span>
          <span className="text-xs font-bold text-[#ef4444] bg-[#ef4444]/20 px-2 py-0.5 rounded">
            DAY {conflictDay}
          </span>
        </div>

        <div className="h-6 w-px bg-[#1f2937]" />

        {/* THREATCON Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-wide">
            THREATCON
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded animate-pulse"
            style={{
              color: threatcon.color,
              backgroundColor: `${threatcon.color}20`
            }}
          >
            {threatcon.level}
          </span>
        </div>

        <div className="h-6 w-px bg-[#1f2937]" />

        {/* Agent Feed */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-wide">
            AGENT FEED
          </span>
          {isLive ? (
            <span className="text-xs font-bold text-[#22c55e] bg-[#22c55e]/20 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              LIVE ({eventCount})
            </span>
          ) : isStatic ? (
            <span className="text-xs font-bold text-[#f97316] bg-[#f97316]/20 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
              STATIC ({eventCount})
            </span>
          ) : (
            <span className="text-xs font-bold text-gray-500 bg-gray-500/20 px-2 py-0.5 rounded">
              OFFLINE
            </span>
          )}
        </div>

        <div className="h-6 w-px bg-[#1f2937]" />

        {/* Vessels */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-wide">
            VESSELS
          </span>
          <span className="text-xs font-bold text-[#3b82f6] bg-[#3b82f6]/20 px-2 py-0.5 rounded">
            {vesselCount > 0 ? vesselCount : '--'}
          </span>
        </div>

        <div className="h-6 w-px bg-[#1f2937]" />

        {/* Flights */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-wide">
            FLIGHTS
          </span>
          <span className="text-xs font-bold text-gray-500 bg-gray-500/20 px-2 py-0.5 rounded">
            --
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Live Brent Price */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-wide">
            BRENT
          </span>
          {oilPrices?.brent ? (
            <span
              className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                oilPrices.brent.direction === 'up' ? 'text-[#22c55e] bg-[#22c55e]/20 price-up' :
                oilPrices.brent.direction === 'down' ? 'text-[#ef4444] bg-[#ef4444]/20 price-down' :
                'text-gray-300 bg-gray-500/20'
              }`}
            >
              ${oilPrices.brent.price.toFixed(2)}
              <span className="ml-1 text-[10px]">
                {oilPrices.brent.changePercent >= 0 ? '+' : ''}{oilPrices.brent.changePercent.toFixed(2)}%
              </span>
            </span>
          ) : (
            <span className="text-xs font-bold text-gray-500 bg-gray-500/20 px-2 py-0.5 rounded">
              --
            </span>
          )}
        </div>

        <div className="h-6 w-px bg-[#1f2937]" />

        {/* Hormuz Status */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-wide">
            HORMUZ
          </span>
          <span className="text-xs font-bold text-[#ef4444] bg-[#ef4444]/20 px-2 py-0.5 rounded animate-pulse">
            CLOSED
          </span>
        </div>

        <div className="h-6 w-px bg-[#1f2937]" />

        {/* SITREP Button */}
        {onSitrep && (
          <>
            <button
              onClick={onSitrep}
              className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#F96302] bg-[#1f2937] hover:bg-[#374151] px-3 py-1.5 rounded transition-colors"
              title="View Situation Report"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              SITREP
            </button>
            <div className="h-6 w-px bg-[#1f2937]" />
          </>
        )}

        {/* Share Button */}
        {onShare && (
          <>
            <button
              onClick={onShare}
              className="flex items-center gap-1.5 text-xs font-bold text-[#F96302] hover:text-[#ff8533] bg-[#F96302]/10 hover:bg-[#F96302]/20 px-3 py-1.5 rounded transition-colors"
              title="Share current view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              SHARE
            </button>
            <div className="h-6 w-px bg-[#1f2937]" />
          </>
        )}

        {/* Timestamp */}
        <div className="text-xs text-gray-400 font-mono">
          {formatTime(currentTime)}
        </div>
      </div>
    </header>
  );
}
