import { useState, useEffect, useCallback } from 'react';

interface SitrepData {
  summary: string;
  generatedAt: string;
  eventCount?: number;
  conflictDay?: number;
  cached?: boolean;
}

const SITREP_API_URL = 'http://localhost:3001/api/sitrep';
const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes

export function SitrepCard() {
  const [sitrep, setSitrep] = useState<SitrepData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchSitrep = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(SITREP_API_URL, {
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
      console.error('[SITREP] Fetch error:', err);
      setError('Unable to generate situation report');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchSitrep();

    // Refresh every 30 minutes
    const interval = setInterval(fetchSitrep, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchSitrep]);

  // Format time since generation
  const formatTimeSince = (timestamp: string): string => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="border-b border-[#1f2937]">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-[#1f2937]/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">
            SITUATION REPORT
          </span>
          {sitrep?.cached && (
            <span className="text-[8px] text-gray-600 uppercase">CACHED</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          {isLoading && !sitrep && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating situation report...
            </div>
          )}

          {error && !sitrep && (
            <div className="text-sm text-gray-500">
              <p className="mb-2">{error}</p>
              <button
                onClick={fetchSitrep}
                className="text-[#F96302] hover:text-[#ff8533] text-xs uppercase tracking-wide"
              >
                Retry
              </button>
            </div>
          )}

          {sitrep && (
            <>
              <div className="text-[11px] text-gray-300 leading-relaxed space-y-3 whitespace-pre-wrap">
                {sitrep.summary.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1f2937]">
                <div className="text-[10px] text-gray-500">
                  Generated {formatTimeSince(sitrep.generatedAt)}
                  {sitrep.eventCount && ` • ${sitrep.eventCount} events analyzed`}
                </div>
                <button
                  onClick={fetchSitrep}
                  disabled={isLoading}
                  className="text-[10px] text-[#F96302] hover:text-[#ff8533] uppercase tracking-wide disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Refresh'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
