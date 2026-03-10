import { useState, useEffect, useCallback, useRef } from 'react';

interface TimelineScrubberProps {
  onDateChange: (date: Date | null) => void;
  isLive: boolean;
  onLiveToggle: () => void;
}

// Conflict start date
const CONFLICT_START = new Date('2026-02-28T00:00:00Z');

function getDayNumber(date: Date): number {
  const diff = date.getTime() - CONFLICT_START.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

function getDateFromDay(day: number): Date {
  const date = new Date(CONFLICT_START);
  date.setDate(date.getDate() + day - 1);
  return date;
}

export function TimelineScrubber({ onDateChange, isLive, onLiveToggle }: TimelineScrubberProps) {
  const today = new Date();
  const totalDays = getDayNumber(today);

  const [currentDay, setCurrentDay] = useState(totalDays);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Calculate position percentage
  const position = ((currentDay - 1) / (totalDays - 1)) * 100;

  // Handle day change
  const handleDayChange = useCallback((day: number) => {
    const clampedDay = Math.max(1, Math.min(totalDays, day));
    setCurrentDay(clampedDay);

    if (clampedDay === totalDays) {
      onDateChange(null); // null = show all (live)
    } else {
      onDateChange(getDateFromDay(clampedDay));
    }
  }, [totalDays, onDateChange]);

  // Handle mouse/touch drag
  const handleDrag = useCallback((clientX: number) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    const day = Math.round(percent * (totalDays - 1)) + 1;
    handleDayChange(day);
  }, [totalDays, handleDayChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsPlaying(false);
    handleDrag(e.clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDrag(e.clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleDrag]);

  // Play animation
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentDay(prev => {
          if (prev >= totalDays) {
            setIsPlaying(false);
            return prev;
          }
          const nextDay = prev + 1;
          if (nextDay === totalDays) {
            onDateChange(null);
          } else {
            onDateChange(getDateFromDay(nextDay));
          }
          return nextDay;
        });
      }, 2000); // 1 day per 2 seconds
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, totalDays, onDateChange]);

  // Handle live mode
  useEffect(() => {
    if (isLive) {
      setCurrentDay(totalDays);
      setIsPlaying(false);
    }
  }, [isLive, totalDays]);

  const handlePlay = () => {
    if (currentDay >= totalDays) {
      setCurrentDay(1);
      onDateChange(getDateFromDay(1));
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleLive = () => {
    setIsPlaying(false);
    setCurrentDay(totalDays);
    onDateChange(null);
    onLiveToggle();
  };

  // Generate tick marks for each day
  const ticks = [];
  for (let i = 1; i <= totalDays; i++) {
    const tickPos = ((i - 1) / (totalDays - 1)) * 100;
    const isMajor = i === 1 || i % 5 === 0 || i === totalDays;
    ticks.push(
      <div
        key={i}
        className={`absolute bottom-0 w-px ${isMajor ? 'h-3 bg-gray-500' : 'h-1.5 bg-gray-700'}`}
        style={{ left: `${tickPos}%` }}
      />
    );
  }

  return (
    <div className="absolute bottom-20 left-4 right-4 z-[1000] bg-[#0a0f1a]/95 border border-[#1f2937] rounded-lg p-3 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        {/* Play/Pause buttons */}
        <div className="flex items-center gap-1">
          {isPlaying ? (
            <button
              onClick={handlePause}
              className="w-8 h-8 flex items-center justify-center bg-[#1f2937] hover:bg-[#2d3748] rounded text-gray-300 transition-colors"
              title="Pause"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="w-8 h-8 flex items-center justify-center bg-[#1f2937] hover:bg-[#2d3748] rounded text-gray-300 transition-colors"
              title="Play"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </button>
          )}
          <button
            onClick={handleLive}
            className={`px-3 h-8 flex items-center justify-center rounded text-xs font-bold transition-colors ${
              isLive && currentDay === totalDays
                ? 'bg-[#F96302] text-white'
                : 'bg-[#1f2937] hover:bg-[#2d3748] text-gray-300'
            }`}
          >
            LIVE
          </button>
        </div>

        {/* Day counter */}
        <div className="flex items-center gap-2 min-w-[80px]">
          <span className="text-[10px] text-gray-500 uppercase">DAY</span>
          <span className="text-lg font-bold text-[#F96302]">{currentDay}</span>
        </div>

        {/* Timeline track */}
        <div
          ref={trackRef}
          className="flex-1 h-6 relative cursor-pointer"
          onMouseDown={handleMouseDown}
        >
          {/* Track background */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-[#1f2937] rounded">
            {/* Progress fill */}
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#F96302]/50 to-[#F96302] rounded"
              style={{ width: `${position}%` }}
            />
          </div>

          {/* Tick marks */}
          <div className="absolute top-1/2 left-0 right-0 h-4">
            {ticks}
          </div>

          {/* Scrubber handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F96302] rounded-full shadow-lg cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
            style={{ left: `calc(${position}% - 8px)` }}
          >
            <div className="absolute inset-1 bg-white/30 rounded-full" />
          </div>
        </div>

        {/* Date label */}
        <div className="text-xs text-gray-400 min-w-[80px] text-right font-mono">
          {getDateFromDay(currentDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
}
