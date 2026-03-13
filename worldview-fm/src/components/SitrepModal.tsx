// Situation Report Modal
// Full-width modal overlay for AI-generated conflict analysis

import { useState, useEffect, useCallback } from 'react';
import { marketData } from '../data/conflictData';

interface SitrepModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SitrepData {
  summary: string;
  generatedAt: string;
  eventCount?: number;
  conflictDay?: number;
  cached?: boolean;
}

// Configurable agent URL - defaults to localhost for dev
const AGENT_API = import.meta.env.VITE_AGENT_URL || 'http://localhost:3001';

export function SitrepModal({ isOpen, onClose }: SitrepModalProps) {
  const [sitrep, setSitrep] = useState<SitrepData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSitrep = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${AGENT_API}/api/sitrep`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setSitrep({
          summary: data.summary,
          generatedAt: data.generatedAt,
          eventCount: data.eventCount,
          conflictDay: data.conflictDay,
          cached: data.cached
        });
      } else {
        throw new Error(data.error || 'Failed to generate SITREP');
      }
    } catch (err) {
      console.error('[SITREP] Error:', err);
      setError('Failed to connect to agent server. Start the agent server with: npm run server');
      // Fallback content
      setSitrep({
        summary: `As of Day ${marketData.conflictDay}, Operation Epic Fury continues with sustained US air operations targeting Iranian military infrastructure. Naval forces maintain a defensive posture in the Strait of Hormuz while commercial shipping diverts to the Cape of Good Hope route.\n\nOil markets remain volatile with Brent crude trading at $${marketData.brent.toFixed(2)}, reflecting ongoing supply disruption concerns. War risk insurance premiums for Gulf-transiting vessels have increased substantially, with major underwriters restricting coverage.\n\nEscalation indicators remain elevated. The conflict has not yet reached a clear inflection point, with both parties demonstrating capacity for sustained operations. De-escalation depends on diplomatic channels currently showing limited activity.`,
        generatedAt: new Date().toISOString(),
        conflictDay: marketData.conflictDay,
        cached: false
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !sitrep) {
      fetchSitrep();
    }
  }, [isOpen, sitrep, fetchSitrep]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const minutesAgo = sitrep?.generatedAt
    ? Math.floor((Date.now() - new Date(sitrep.generatedAt).getTime()) / 60000)
    : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative w-full max-w-3xl mx-4 bg-[#0a0f1a] border border-[#1f2937] rounded-lg shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f2937]">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              SITUATION REPORT
            </h2>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
              DAY {sitrep?.conflictDay || marketData.conflictDay} // THE FULCRUM MEMO
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#F96302] border-t-transparent rounded-full animate-spin mb-4" />
              <div className="text-gray-400 text-sm">Generating situation report...</div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
              {error}
            </div>
          ) : sitrep ? (
            <div className="space-y-4">
              {sitrep.summary.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-gray-300 leading-relaxed text-sm">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#1f2937] bg-[#111827]">
          <div className="text-xs text-gray-500">
            {sitrep?.cached && <span className="text-yellow-500 mr-2">[CACHED]</span>}
            Generated: {minutesAgo === 0 ? 'just now' : `${minutesAgo} minutes ago`}
            {sitrep?.eventCount && (
              <span className="ml-2">• {sitrep.eventCount} events analyzed</span>
            )}
          </div>
          <button
            onClick={() => {
              setSitrep(null);
              fetchSitrep();
            }}
            disabled={isLoading}
            className="px-4 py-2 bg-[#F96302] hover:bg-[#e55a00] disabled:bg-gray-600 text-white text-xs font-bold uppercase tracking-wide rounded transition-colors"
          >
            {isLoading ? 'GENERATING...' : 'REGENERATE'}
          </button>
        </div>
      </div>
    </div>
  );
}
