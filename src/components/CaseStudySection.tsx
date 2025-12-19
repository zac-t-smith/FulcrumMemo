import { useState } from 'react';
import { TrendingDown, AlertTriangle, Scale, ChevronDown, ChevronUp, DollarSign, Clock, Percent } from 'lucide-react';

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
    <section id="case-study" className="py-24 bg-navy-light overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-16 animate-fade-up">
            <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">
              Real-World Experience
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Case Study: Gulf Coast Restoration
            </h2>
            <p className="text-cream-muted font-body text-lg max-w-3xl">
              A firsthand look at financial distress from the operator's seat—from $100K/month peak revenue 
              to orderly liquidation with negotiated creditor settlements.
            </p>
          </div>

          {/* Company Overview */}
          <div className="grid md:grid-cols-4 gap-4 mb-16 animate-fade-up animate-delay-100">
            {[
              { label: 'Industry', value: 'Property Restoration' },
              { label: 'Founded', value: 'March 2024' },
              { label: 'Peak Revenue', value: '$100K/month' },
              { label: 'Outcome', value: 'Orderly Liquidation' },
            ].map((item, i) => (
              <div key={i} className="bg-background border border-border p-4 text-center">
                <p className="text-cream-muted text-sm font-body mb-1">{item.label}</p>
                <p className="text-foreground font-display text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Financial Timeline */}
          <div className="mb-16">
            <h3 className="font-display text-2xl font-semibold text-foreground mb-8 animate-fade-up animate-delay-200">
              Financial Timeline
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {snapshots.map((snapshot, index) => (
                <div
                  key={index}
                  className={`bg-background border border-border p-6 transition-all duration-500 hover:border-primary/50 animate-fade-up`}
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <snapshot.icon className={`${snapshot.color}`} size={24} />
                      <div>
                        <h4 className="font-display text-lg font-semibold text-foreground">
                          {snapshot.phase}
                        </h4>
                        <p className="text-cream-muted text-sm font-body">{snapshot.date}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                      className="text-cream-muted hover:text-primary transition-colors"
                    >
                      {expandedCard === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-cream-muted text-xs font-body">Assets</p>
                      <p className="text-foreground font-display text-xl font-semibold">${snapshot.assets.total}K</p>
                    </div>
                    <div>
                      <p className="text-cream-muted text-xs font-body">Liabilities</p>
                      <p className="text-foreground font-display text-xl font-semibold">${snapshot.liabilities.total}K</p>
                    </div>
                    <div>
                      <p className="text-cream-muted text-xs font-body">Equity</p>
                      <p className={`font-display text-xl font-semibold ${snapshot.equity < 50 ? 'text-red-400' : 'text-foreground'}`}>
                        ${snapshot.equity}K
                      </p>
                    </div>
                    <div>
                      <p className="text-cream-muted text-xs font-body">Working Capital</p>
                      <p className={`font-display text-xl font-semibold ${snapshot.workingCapital < 0 ? 'text-red-400' : 'text-foreground'}`}>
                        ${snapshot.workingCapital}K
                        {snapshot.wcChange && (
                          <span className="text-red-400 text-sm ml-1">{snapshot.wcChange}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Monthly Cash Burn */}
                  <div className="flex items-center gap-2 py-2 border-t border-border">
                    <Clock size={14} className="text-cream-muted" />
                    <span className="text-cream-muted text-sm font-body">Monthly Cash Burn:</span>
                    <span className={`font-body font-medium ${snapshot.cashBurn < 0 ? 'text-red-400' : 'text-foreground'}`}>
                      ${snapshot.cashBurn}K/mo
                    </span>
                  </div>

                  {/* Expanded Details */}
                  <div className={`overflow-hidden transition-all duration-300 ${expandedCard === index ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-primary text-xs font-body uppercase tracking-wider mb-2">Asset Breakdown</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-cream-muted">Cash</span>
                            <span className="text-foreground">${snapshot.assets.cash}K</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cream-muted">A/R</span>
                            <span className="text-foreground">${snapshot.assets.ar}K</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cream-muted">DSO</span>
                            <span className="text-foreground">{snapshot.assets.dso}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cream-muted">A/R Aging</span>
                            <span className="text-foreground text-xs">{snapshot.assets.arAging}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cream-muted">Vehicles/Equipment</span>
                            <span className="text-foreground">${snapshot.assets.vehicles}K</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-primary text-xs font-body uppercase tracking-wider mb-2">Liability Breakdown</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-cream-muted">Revolving Credit</span>
                            <span className="text-foreground">${snapshot.liabilities.revolving}K</span>
                          </div>
                          {snapshot.liabilities.ap && (
                            <div className="flex justify-between">
                              <span className="text-cream-muted">A/P (aged)</span>
                              <span className="text-foreground">${snapshot.liabilities.ap}K</span>
                            </div>
                          )}
                          {snapshot.liabilities.trade && (
                            <div className="flex justify-between">
                              <span className="text-cream-muted">Trade Payables</span>
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
          </div>

          {/* Liquidation Waterfall */}
          <div className="mb-16 animate-fade-up animate-delay-400">
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
              Liquidation Proceeds
            </h3>
            <p className="text-cream-muted font-body mb-8">
              Interactive Creditor Waterfall — $79K Total Realized (53% of book value)
            </p>

            <div className="bg-background border border-border p-6">
              <div className="space-y-4">
                {waterfallData.map((item, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer"
                    onMouseEnter={() => setHoveredWaterfall(index)}
                    onMouseLeave={() => setHoveredWaterfall(null)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-foreground font-body text-sm">{item.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-cream-muted font-body text-sm">
                          {item.recovery}% recovery
                        </span>
                        <span className="text-foreground font-display font-semibold">
                          ${item.amount}K
                        </span>
                      </div>
                    </div>
                    <div className="h-8 bg-navy-lighter rounded overflow-hidden">
                      <div
                        className={`h-full ${item.color} transition-all duration-700 ease-out flex items-center justify-end pr-3`}
                        style={{
                          width: hoveredWaterfall === index || hoveredWaterfall === null 
                            ? `${(item.amount / 79) * 100}%` 
                            : '0%',
                          transitionDelay: `${index * 100}ms`,
                        }}
                      >
                        <span className="text-background font-body text-xs font-semibold">
                          ${item.amount}K
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Asset Recovery Summary */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-primary text-xs font-body uppercase tracking-wider mb-4">Asset Recovery</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: 'A/R Recovery', value: '$34K', sub: '38%' },
                    { label: 'Vehicles', value: '$32K', sub: '' },
                    { label: 'Equipment', value: '$12K', sub: '' },
                    { label: 'Inventory', value: '$1K', sub: '' },
                    { label: 'Total Realized', value: '$79K', sub: '', highlight: true },
                  ].map((item, i) => (
                    <div key={i} className={`${item.highlight ? 'text-primary' : ''}`}>
                      <p className="text-cream-muted text-xs font-body">{item.label}</p>
                      <p className={`font-display text-lg font-semibold ${item.highlight ? 'text-primary' : 'text-foreground'}`}>
                        {item.value}
                        {item.sub && <span className="text-cream-muted text-sm ml-1">({item.sub})</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lessons Learned */}
          <div className="animate-fade-up animate-delay-500">
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
              Lessons Learned
            </h3>
            <p className="text-cream-muted font-body mb-8">
              Key Takeaways from Distressed Operations
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {lessons.map((lesson, index) => (
                <div
                  key={index}
                  className="group bg-background border border-border p-6 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-navy-lighter group-hover:bg-primary/10 transition-colors">
                      <lesson.icon size={20} className="text-primary" />
                    </div>
                    <h4 className="font-display text-lg font-semibold text-foreground">
                      {lesson.title}
                    </h4>
                  </div>
                  <p className="text-cream-muted font-body text-sm leading-relaxed">
                    {lesson.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudySection;
