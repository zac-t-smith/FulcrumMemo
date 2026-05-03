import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AllyData {
  country: string;
  hormuzDep: number;
  tariffRate: string;
  sprDays: string;
  status: string;
  notes?: string;
}

const alliedData: AllyData[] = [
  {
    country: 'Japan',
    hormuzDep: 95,
    tariffRate: '15%',
    sprDays: '~200',
    status: 'Mid-negotiation',
    notes: '87% fossil fuel import dependency. Most exposed ally.'
  },
  {
    country: 'South Korea',
    hormuzDep: 68,
    tariffRate: '25%',
    sprDays: '~200',
    status: 'Tariffs escalated Jan 26',
    notes: 'Tariffs raised between Venezuela seizure and Iran strikes.'
  },
  {
    country: 'India',
    hormuzDep: 50,
    tariffRate: '18%',
    sprDays: '~60',
    status: 'Linked to Russia freeze',
    notes: 'Trade deal contingent on freezing Russian oil imports.'
  },
  {
    country: 'EU',
    hormuzDep: 14,
    tariffRate: '15%',
    sprDays: '~90',
    status: 'Framework non-binding',
    notes: '$600B investment pledges unenforceable.'
  },
  {
    country: 'China',
    hormuzDep: 38,
    tariffRate: '10%',
    sprDays: '~90',
    status: 'Truce expires Nov 2026',
    notes: 'Receives 80% of Iranian oil. Selective Hormuz access.'
  },
];

const getDependencyColor = (dep: number) => {
  if (dep >= 50) return 'text-red-400 bg-red-500/20';
  if (dep >= 25) return 'text-orange-400 bg-orange-500/20';
  return 'text-yellow-400 bg-yellow-500/20';
};

const getDependencyBg = (dep: number) => {
  if (dep >= 50) return 'bg-red-500';
  if (dep >= 25) return 'bg-orange-500';
  return 'bg-yellow-500';
};

export const AlliedDependencyMatrix = ({ className }: { className?: string }) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const selectedData = alliedData.find(a => a.country === selectedCountry);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn('memo-chart-container', className)}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h4 className="text-xl font-bold text-zinc-100 mb-2">
            Allied Dependency Matrix
          </h4>
          <p className="text-sm text-zinc-400">
            Energy dependency + tariff exposure = dual pressure
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded">
          <AlertTriangle size={14} className="text-amber-400" />
          <span className="text-[10px] text-amber-400 uppercase tracking-wider">
            Dual Pressure Zone
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="text-left py-3 px-4 text-[10px] text-zinc-500 uppercase tracking-wider">
                Country
              </th>
              <th className="text-center py-3 px-4 text-[10px] text-zinc-500 uppercase tracking-wider">
                Hormuz Dep.
              </th>
              <th className="text-center py-3 px-4 text-[10px] text-zinc-500 uppercase tracking-wider">
                Tariff Rate
              </th>
              <th className="text-center py-3 px-4 text-[10px] text-zinc-500 uppercase tracking-wider">
                SPR (Days)
              </th>
              <th className="text-left py-3 px-4 text-[10px] text-zinc-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {alliedData.map((ally, index) => (
              <motion.tr
                key={ally.country}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => setSelectedCountry(selectedCountry === ally.country ? null : ally.country)}
                className={cn(
                  'border-b border-zinc-800 cursor-pointer transition-colors',
                  selectedCountry === ally.country
                    ? 'bg-primary/10'
                    : 'hover:bg-zinc-800/50'
                )}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">
                      {ally.country}
                    </span>
                    {ally.notes && (
                      <Info size={12} className="text-zinc-500" />
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className={cn('h-full rounded-full', getDependencyBg(ally.hormuzDep))}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${ally.hormuzDep}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      />
                    </div>
                    <span className={cn(
                      'text-sm font-semibold px-2 py-0.5 rounded',
                      getDependencyColor(ally.hormuzDep)
                    )}>
                      {ally.hormuzDep}%
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="text-sm text-primary font-semibold">
                    {ally.tariffRate}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="text-sm text-zinc-400">
                    {ally.sprDays}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-xs text-zinc-300">
                    {ally.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <h5 className="text-sm font-semibold text-foreground mb-2">
                  {selectedData.country} — Detailed Assessment
                </h5>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {selectedData.notes}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={cn(
                  'px-2 py-1 rounded text-[10px] uppercase',
                  getDependencyColor(selectedData.hormuzDep)
                )}>
                  {selectedData.hormuzDep >= 50 ? 'Critical' : selectedData.hormuzDep >= 25 ? 'High' : 'Moderate'} Exposure
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-zinc-700 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-[10px] text-zinc-400">&gt;50% Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-[10px] text-zinc-400">25-50% High</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-[10px] text-zinc-400">&lt;25% Moderate</span>
        </div>
      </div>

      {/* Key Insight */}
      <div className="mt-4 p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
        <p className="text-xs text-amber-400 font-semibold mb-1">
          The Vice Thesis
        </p>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Every country faces both energy crisis AND tariff negotiation simultaneously.
          They can't simply pay market price for alternative supply — they must negotiate
          with Washington for energy relief AND tariff relief. The leverage compounds.
        </p>
      </div>
    </motion.div>
  );
};

export default AlliedDependencyMatrix;
