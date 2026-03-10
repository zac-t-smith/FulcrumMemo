import { useState, useEffect } from 'react';

export type ViewMode = 'standard' | 'crt' | 'nightvision' | 'thermal';

interface ViewModeFilterProps {
  onModeChange?: (mode: ViewMode) => void;
}

const VIEW_MODES: Array<{ id: ViewMode; label: string; icon: string }> = [
  { id: 'standard', label: 'STD', icon: '◯' },
  { id: 'crt', label: 'CRT', icon: '▦' },
  { id: 'nightvision', label: 'NVG', icon: '◉' },
  { id: 'thermal', label: 'FLIR', icon: '◈' }
];

export function ViewModeFilter({ onModeChange }: ViewModeFilterProps) {
  const [activeMode, setActiveMode] = useState<ViewMode>('standard');

  useEffect(() => {
    // Apply CSS filter to the globe container
    const container = document.querySelector('.globe-container');
    if (!container) return;

    // Remove all mode classes first
    container.classList.remove('mode-crt', 'mode-nightvision', 'mode-thermal');

    // Apply new mode class
    if (activeMode !== 'standard') {
      container.classList.add(`mode-${activeMode}`);
    }

    onModeChange?.(activeMode);
  }, [activeMode, onModeChange]);

  return (
    <div className="absolute bottom-20 left-4 z-20">
      <div className="bg-black/80 border border-gray-700 rounded-lg p-1 flex gap-1">
        {VIEW_MODES.map(mode => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            className={`
              px-3 py-2 rounded text-xs font-mono transition-all
              ${activeMode === mode.id
                ? 'bg-[#F96302] text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }
            `}
            title={mode.label}
          >
            <span className="mr-1">{mode.icon}</span>
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// CSS styles for view modes (add to index.css)
export const viewModeStyles = `
/* CRT Monitor Effect */
.mode-crt {
  animation: crt-flicker 0.15s infinite;
  position: relative;
}

.mode-crt::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 1000;
}

.mode-crt::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    rgba(0, 0, 0, 0.3) 90%,
    rgba(0, 0, 0, 0.6) 100%
  );
  pointer-events: none;
  z-index: 1001;
}

@keyframes crt-flicker {
  0% { opacity: 0.97; }
  50% { opacity: 1; }
  100% { opacity: 0.98; }
}

/* Night Vision Effect */
.mode-nightvision {
  filter: brightness(1.2) contrast(1.1);
}

.mode-nightvision canvas,
.mode-nightvision .cesium-viewer {
  filter:
    brightness(0.8)
    contrast(1.3)
    saturate(0)
    sepia(1)
    hue-rotate(70deg)
    saturate(2);
}

.mode-nightvision::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 30%,
    rgba(0, 50, 0, 0.3) 100%
  );
  pointer-events: none;
  z-index: 1000;
}

/* Add scan lines for night vision */
.mode-nightvision::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.1) 2px,
    transparent 2px,
    transparent 4px
  );
  pointer-events: none;
  z-index: 1001;
  animation: nvg-scan 0.1s linear infinite;
}

@keyframes nvg-scan {
  0% { opacity: 0.5; }
  50% { opacity: 0.7; }
  100% { opacity: 0.5; }
}

/* Thermal/FLIR Effect */
.mode-thermal canvas,
.mode-thermal .cesium-viewer {
  filter:
    grayscale(100%)
    contrast(1.4)
    brightness(0.9);
}

.mode-thermal {
  position: relative;
}

.mode-thermal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 100, 0, 0.05) 0%,
    transparent 20%,
    transparent 80%,
    rgba(255, 100, 0, 0.05) 100%
  );
  pointer-events: none;
  z-index: 1000;
  mix-blend-mode: overlay;
}

/* FLIR crosshair overlay */
.mode-thermal::after {
  content: '+';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  color: rgba(255, 255, 255, 0.3);
  font-family: monospace;
  pointer-events: none;
  z-index: 1002;
}

/* Noise grain effect for thermal */
.mode-thermal .cesium-widget {
  animation: thermal-noise 0.3s steps(4) infinite;
}

@keyframes thermal-noise {
  0%, 100% { filter: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter></svg>#n'); }
}
`;
