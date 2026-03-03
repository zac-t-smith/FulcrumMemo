import { useState } from 'react';
import { TrendingDown, AlertTriangle, Scale, ChevronDown, ChevronUp, DollarSign, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface FinancialSnapshot {
  phase: string;
  date: string;
  assets: {
    total: number;
    cash: number;
    ar: number;
    dso: string;
    arAging: string;
    vehicles: number;
    inventory: number;
  };
  liabilities: {
    total: number;
    revolving: number;
    ap?: number;
    trade?: number;
  };
  cashBurn: number;
  equity: number;
  workingCapital: number;
  wcChange?: string;
  icon: typeof TrendingDown;
  color: string;
}

const snapshots: FinancialSnapshot[] = [
  {
    phase: 'Steady State',
    date: 'September 2024',
    assets: {
      total: 234,
      cash: 3.6,
      ar: 189,
      dso: '57 days',
      arAging: '9% >60 days',
      vehicles: 36,
      inventory: 5,
    },
    liabilities: {
      total: 31,
      revolving: 31,
    },
    cashBurn: -12,
    equity: 203,
    workingCapital: 156,
    icon: DollarSign,
    color: 'text-green-400',
  },
  {
    phase: 'Peak Distress',
    date: 'November 2024',
    assets: {
      total: 188,
      cash: 2.5,
      ar: 144,
      dso: '103 days',
      arAging: '30% >60 days',
      vehicles: 36,
      inventory: 5,
    },
    liabilities: {
      total: 89,
      revolving: 26,
      ap: 51,
      trade: 12,
    },
    cashBurn: -28,
    equity: 98,
    workingCapital: 45,
    wcChange: '↓ -71%',
    icon: AlertTriangle,
    color: 'text-red-400',
  },
  {
    phase: 'Liquidation',
    date: 'June 2025',
    assets: {
      total: 149,
      cash: 1,
      ar: 90,
      dso: 'N/A',
      arAging: '70% >60 days, 52% >90 days',
      vehicles: 55,
      inventory: 3,
    },
    liabilities: {
      total: 140,
      revolving: 47,
      ap: 75,
      trade: 18,
    },
    cashBurn: 0,
    equity: 9,
    workingCapital: -1,
    icon: Scale,
    color: 'text-primary',
  },
];

const waterfallData = [
  { name: 'Priority 1 - Secured/Related', recovery: 100, amount: 25, color: 'bg-green-500' },
  { name: 'Priority 2 - Credit Facilities', recovery: 71, amount: 16, color: 'bg-yellow-500' },
  { name: 'Priority 3 - Trade/Unsecured', recovery: 50, amount: 37, color: 'bg-orange-500' },
  { name: 'Investor Recovery', recovery: 0.89, amount: 2, color: 'bg-red-500' },
];

const lessons = [
  {
    title: 'Capital Structure Mismatch',
    description: 'Business model required 30-day payables while revenue collected in 120-180 days, creating a structural working capital deficit that no amount of operational excellence could solve.',
    icon: TrendingDown,
  },
  {
    title: 'Covenant Management',
    description: 'Learned to distinguish operational fixes vs. structural problems. DSO deterioration was an indicator, not the root cause. Sometimes the capital structure is simply broken.',
    icon: AlertTriangle,
  },
  {
    title: 'Strategic Alternatives',
    description: 'Evaluated bankruptcy vs. workout vs. liquidation. Reputational risk drove decision-making. Orderly wind-down preserved creditor relationships and returned capital to investors.',
    icon: Scale,
  },
];

const CaseStudySection = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [hoveredWaterfall, setHoveredWaterfall] = useState<number | null>(null);

  return (
    <section id="case-study" className="py-20 bg-card overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-primary font-mono text-[10px] tracking-[0.3em] uppercase mb-3">
              Real-World Experience
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Case Study: Gulf Coast Restoration
            </h2>
            <div className="gold-line-left w-24 mb-4" />
            <p className="text-muted-foreground font-mono text-sm max-w-3xl leading-relaxed">
              A firsthand look at financial distress from the operator's seat—from $100K/month peak revenue
              to orderly liquidation with negotiated creditor settlements.
            </p>
          </motion.div>

          {/* Company Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {[
              { label: 'Industry', value: 'Property Restoration' },
              { label: 'Founded', value: 'March 2024' },
              { label: 'Peak Revenue', value: '$100K/month' },
              { label: 'Outcome', value: 'Orderly Liquidation' },
            ].map((item, i) => (
              <div key={i} className="surface-elevated p-4 text-center">
                <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-foreground font-display text-base font-semibold">{item.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Financial Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h3 className="font-display text-xl font-semibold text-foreground mb-6">
              Financial Timeline
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {snapshots.map((snapshot, index) => (
                <div
                  key={index}
                  className="surface-elevated p-6 transition-all duration-500 hover:border-primary/50 border border-border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <snapshot.icon className={`${snapshot.color}`} size={20} />
                      <div>
                        <h4 className="font-display text-base font-semibold text-foreground">
                          {snapshot.phase}
                        </h4>
                        <p className="text-muted-foreground text-xs font-mono">{snapshot.date}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {expandedCard === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider">Assets</p>
                      <p className="text-foreground font-display text-lg font-semibold">${snapshot.assets.total}K</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider">Liabilities</p>
                      <p className="text-foreground font-display text-lg font-semibold">${snapshot.liabilities.total}K</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider">Equity</p>
                      <p className={`font-display text-lg font-semibold ${snapshot.equity < 50 ? 'text-red-400' : 'text-foreground'}`}>
                        ${snapshot.equity}K
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider">Working Cap</p>
                      <p className={`font-display text-lg font-semibold ${snapshot.workingCapital < 0 ? 'text-red-400' : 'text-foreground'}`}>
                        ${snapshot.workingCapital}K
                        {snapshot.wcChange && (
                          <span className="text-red-400 text-xs ml-1">{snapshot.wcChange}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Monthly Cash Burn */}
                  <div className="flex items-center gap-2 py-2 border-t border-border">
                    <Clock size={12} className="text-muted-foreground" />
                    <span className="text-muted-foreground text-xs font-mono">Monthly Burn:</span>
                    <span className={`font-mono text-xs font-medium ${snapshot.cashBurn < 0 ? 'text-red-400' : 'text-foreground'}`}>
                      ${snapshot.cashBurn}K/mo
                    </span>
                  </div>

                  {/* Expanded Details */}
                  <div className={`overflow-hidden transition-all duration-300 ${expandedCard === index ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-primary text-[10px] font-mono uppercase tracking-wider mb-2">Asset Breakdown</p>
                        <div className="space-y-1 text-xs font-mono">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Cash</span>
                            <span className="text-foreground">${snapshot.assets.cash}K</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">A/R</span>
                            <span className="text-foreground">${snapshot.assets.ar}K</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">DSO</span>
                            <span className="text-foreground">{snapshot.assets.dso}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">A/R Aging</span>
                            <span className="text-foreground text-[10px]">{snapshot.assets.arAging}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-primary text-[10px] font-mono uppercase tracking-wider mb-2">Liability Breakdown</p>
                        <div className="space-y-1 text-xs font-mono">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Revolving Credit</span>
                            <span className="text-foreground">${snapshot.liabilities.revolving}K</span>
                          </div>
                          {snapshot.liabilities.ap && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">A/P (aged)</span>
                              <span className="text-foreground">${snapshot.liabilities.ap}K</span>
                            </div>
                          )}
                          {snapshot.liabilities.trade && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Trade Payables</span>
                              <span className="text-foreground">${snapshot.liabilities.trade}K</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Liquidation Waterfall */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Liquidation Proceeds
            </h3>
            <p className="text-muted-foreground font-mono text-sm mb-6">
              Interactive Creditor Waterfall — $79K Total Realized (53% of book value)
            </p>

            <div className="surface-elevated p-6 border border-border">
              <div className="space-y-4">
                {waterfallData.map((item, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer"
                    onMouseEnter={() => setHoveredWaterfall(index)}
                    onMouseLeave={() => setHoveredWaterfall(null)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-foreground font-mono text-xs">{item.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground font-mono text-xs">
                          {item.recovery}% recovery
                        </span>
                        <span className="text-foreground font-display font-semibold text-sm">
                          ${item.amount}K
                        </span>
                      </div>
                    </div>
                    <div className="h-6 bg-secondary rounded overflow-hidden">
                      <div
                        className={`h-full ${item.color} transition-all duration-700 ease-out flex items-center justify-end pr-3`}
                        style={{
                          width: hoveredWaterfall === index || hoveredWaterfall === null
                            ? `${(item.amount / 79) * 100}%`
                            : '0%',
                          transitionDelay: `${index * 100}ms`,
                        }}
                      >
                        <span className="text-background font-mono text-[10px] font-semibold">
                          ${item.amount}K
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Asset Recovery Summary */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-primary text-[10px] font-mono uppercase tracking-wider mb-4">Asset Recovery</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: 'A/R Recovery', value: '$34K', sub: '38%' },
                    { label: 'Vehicles', value: '$32K', sub: '' },
                    { label: 'Equipment', value: '$12K', sub: '' },
                    { label: 'Inventory', value: '$1K', sub: '' },
                    { label: 'Total Realized', value: '$79K', sub: '', highlight: true },
                  ].map((item, i) => (
                    <div key={i} className={`${item.highlight ? 'text-primary' : ''}`}>
                      <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider">{item.label}</p>
                      <p className={`font-display text-base font-semibold ${item.highlight ? 'text-primary' : 'text-foreground'}`}>
                        {item.value}
                        {item.sub && <span className="text-muted-foreground text-xs ml-1">({item.sub})</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Lessons Learned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Lessons Learned
            </h3>
            <p className="text-muted-foreground font-mono text-sm mb-6">
              Key Takeaways from Distressed Operations
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {lessons.map((lesson, index) => (
                <div
                  key={index}
                  className="group memo-card"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 surface-elevated group-hover:bg-primary/10 transition-colors">
                      <lesson.icon size={18} className="text-primary" />
                    </div>
                    <h4 className="font-display text-base font-semibold text-foreground">
                      {lesson.title}
                    </h4>
                  </div>
                  <p className="text-muted-foreground font-mono text-xs leading-relaxed">
                    {lesson.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudySection;
