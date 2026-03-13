import { useState, useEffect } from 'react';
import { marketData, scenarios, evaluatePredictions, predictions as fallbackPredictions } from '../../data/conflictData';
import { subscribeToAgentFeed, getAgentFeedState } from '../../data/feeds/agentFeed';
import type { LayerState } from '../../types';
import type { Prediction } from '../../types';

interface IntelligencePanelProps {
  layers: LayerState;
  onToggleLayer: (layer: keyof LayerState) => void;
}

export function IntelligencePanel({ layers, onToggleLayer }: IntelligencePanelProps) {
  const [predictions, setPredictions] = useState<Prediction[]>(fallbackPredictions);

  // Subscribe to agent feed and evaluate predictions
  useEffect(() => {
    // Get initial state
    const initialState = getAgentFeedState();
    if (initialState.events.length > 0) {
      setPredictions(evaluatePredictions(initialState.events));
    }

    // Subscribe to updates
    const unsubscribe = subscribeToAgentFeed((state) => {
      if (state.events.length > 0) {
        setPredictions(evaluatePredictions(state.events));
      }
    });

    return unsubscribe;
  }, []);

  const confirmedCount = predictions.filter(p => p.status === 'confirmed').length;

  return (
    <div className="w-80 h-full bg-[#111827] border-l border-[#1f2937] flex flex-col overflow-hidden">
      {/* Market Data Section */}
      <div className="p-4 border-b border-[#1f2937]">
        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">
          MARKET SNAPSHOT
        </div>

        <div className="space-y-2">
          <DataRow
            label="BRENT CRUDE"
            value={`$${marketData.brent.toFixed(2)}`}
            subValue={`HIGH: $${marketData.brentHigh.toFixed(2)}`}
            highlight
          />
          <DataRow
            label="WTI"
            value={`$${marketData.wti.toFixed(2)}`}
          />
          <DataRow
            label="10Y YIELD"
            value={`${marketData.tenYearYield.toFixed(2)}%`}
          />
          <DataRow
            label="VIX"
            value={marketData.vix.toFixed(2)}
            alert={marketData.vix > 25}
          />
        </div>
      </div>

      {/* Conflict Status Section */}
      <div className="p-4 border-b border-[#1f2937]">
        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">
          CONFLICT STATUS // DAY {marketData.conflictDay}
        </div>

        <div className="space-y-2">
          <DataRow
            label="HORMUZ WESTERN TRANSITS"
            value={marketData.hormuzTransits.toString()}
            alert
          />
          <DataRow
            label="VLCC RATE"
            value={marketData.vlccRate}
            highlight
          />
          <DataRow
            label="HY SPREAD"
            value={`~${marketData.hySpread} bps`}
            subValue={`+${marketData.hySpread - marketData.hySpreadBaseline} from baseline`}
            alert
          />
        </div>
      </div>

      {/* Scenario Probabilities */}
      <div className="p-4 border-b border-[#1f2937]">
        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">
          SCENARIO ANALYSIS
        </div>

        <div className="space-y-3">
          {scenarios.map((scenario) => (
            <div key={scenario.name} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs text-gray-300">{scenario.name}</div>
                <div className="h-1.5 bg-[#1f2937] rounded mt-1">
                  <div
                    className={`h-full rounded ${
                      scenario.probability > 50
                        ? 'bg-[#ef4444]'
                        : scenario.probability > 20
                          ? 'bg-[#f59e0b]'
                          : 'bg-[#22c55e]'
                    }`}
                    style={{ width: `${scenario.probability}%` }}
                  />
                </div>
              </div>
              <div className={`ml-3 text-sm font-bold ${
                scenario.probability > 50
                  ? 'text-[#ef4444]'
                  : scenario.probability > 20
                    ? 'text-[#f59e0b]'
                    : 'text-[#22c55e]'
              }`}>
                {scenario.probability}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predictions Scorecard */}
      <div className="p-4 border-b border-[#1f2937] flex-1 overflow-y-auto">
        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 flex justify-between">
          <span>PREDICTIONS SCORECARD</span>
          <span className="text-[#22c55e]">{confirmedCount}/{predictions.length}</span>
        </div>

        <div className="space-y-2">
          {predictions.map((pred) => (
            <div
              key={pred.id}
              className={`text-[11px] p-2 rounded border-l-2 ${
                pred.status === 'confirmed'
                  ? 'border-[#22c55e] bg-[#22c55e]/10 text-gray-300'
                  : pred.status === 'tracking'
                    ? 'border-[#f59e0b] bg-[#f59e0b]/10 text-gray-400'
                    : 'border-[#ef4444] bg-[#ef4444]/10 text-gray-500'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span>{pred.prediction}</span>
                <span className={`shrink-0 text-[9px] font-bold uppercase ${
                  pred.status === 'confirmed' ? 'text-[#22c55e]' : 'text-[#f59e0b]'
                }`}>
                  {pred.status === 'confirmed' ? `✓ ${pred.date}` : '◉'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layer Controls */}
      <div className="p-4 border-t border-[#1f2937]">
        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">
          MAP LAYERS
        </div>

        <div className="grid grid-cols-2 gap-2">
          <LayerToggle
            label="Events"
            active={layers.conflictEvents}
            onClick={() => onToggleLayer('conflictEvents')}
          />
          <LayerToggle
            label="Vessels"
            active={layers.vessels}
            onClick={() => onToggleLayer('vessels')}
          />
          <LayerToggle
            label="Flights"
            active={layers.flights}
            onClick={() => onToggleLayer('flights')}
          />
          <LayerToggle
            label="Satellites"
            active={layers.satellites}
            onClick={() => onToggleLayer('satellites')}
          />
          <LayerToggle
            label="Oil Infra"
            active={layers.oilInfrastructure}
            onClick={() => onToggleLayer('oilInfrastructure')}
          />
          <LayerToggle
            label="Routes"
            active={layers.shippingRoutes}
            onClick={() => onToggleLayer('shippingRoutes')}
          />
        </div>
      </div>
    </div>
  );
}

// Helper Components
interface DataRowProps {
  label: string;
  value: string;
  subValue?: string;
  highlight?: boolean;
  alert?: boolean;
}

function DataRow({ label, value, subValue, highlight, alert }: DataRowProps) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</span>
      <div className="text-right">
        <span className={`text-sm font-bold ${
          alert ? 'text-[#ef4444]' : highlight ? 'text-[#F96302]' : 'text-gray-200'
        }`}>
          {value}
        </span>
        {subValue && (
          <div className="text-[9px] text-gray-500">{subValue}</div>
        )}
      </div>
    </div>
  );
}

interface LayerToggleProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function LayerToggle({ label, active, onClick }: LayerToggleProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-[10px] uppercase tracking-wide rounded transition-all ${
        active
          ? 'bg-[#F96302] text-white'
          : 'bg-[#1f2937] text-gray-400 hover:bg-[#374151]'
      }`}
    >
      {label}
    </button>
  );
}
