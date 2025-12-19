import { ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const KirklandsMemo = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/#research" className="flex items-center gap-2 text-cream-muted hover:text-primary transition-colors">
            <ArrowLeft size={18} />
            <span className="font-body text-sm">Back to Research</span>
          </Link>
          <Button variant="gold-outline" size="sm" asChild>
            <a href="/memos/Kirklands_Credit_Analysis.pdf" download>
              <Download size={14} />
              Download PDF
            </a>
          </Button>
        </div>
      </nav>

      {/* Article Content */}
      <article className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <header className="border-b-4 border-primary pb-6 mb-8">
          <p className="text-primary font-body text-sm tracking-[0.2em] uppercase mb-2">The Fulcrum Memo</p>
          <p className="text-cream-muted font-body text-xs tracking-wider uppercase mb-4">Distressed Credit Analysis</p>
          <h1 className="font-display text-3xl md:text-5xl font-semibold text-foreground mb-4 leading-tight">
            When Your White Knight Is Actually a Vulture
          </h1>
          <p className="text-cream-muted font-body text-lg italic mb-6">
            The Beyond Inc. takeover of Kirkland's demonstrates how creditor-friendly financing can achieve effective control without triggering takeover regulations
          </p>
          <div className="flex flex-wrap gap-4 text-cream-muted font-body text-sm">
            <span>October 2025</span>
            <span className="text-primary">|</span>
            <span>Zachary Smith</span>
            <span className="text-primary">|</span>
            <span>Specialty Retail – Home Décor</span>
            <span className="text-primary">|</span>
            <span>NASDAQ: KIRK</span>
          </div>
        </header>

        {/* Lead Paragraph */}
        <p className="text-lg md:text-xl font-body leading-relaxed text-foreground mb-8">
          Kirkland's Inc. presents not as a traditional distressed retail turnaround, but as a live case study in creditor control and strategic asset extraction disguised as rescue financing. What appears on the surface as a struggling home décor retailer being rescued by Beyond Inc. is, upon deeper analysis, a methodical acquisition strategy where Beyond is purchasing KIRK's infrastructure, customer base, and retail footprint for a fraction of replacement cost.
        </p>

        {/* Personal Note */}
        <div className="bg-navy-light border-l-4 border-blue-500 p-6 mb-8">
          <h3 className="text-blue-400 font-body text-sm uppercase tracking-wider mb-3">Why This Analysis Matters</h3>
          <p className="text-cream-muted font-body italic leading-relaxed mb-3">
            I've navigated a business through restructuring—not as an advisor or investor, but as the operator making the decisions. When you're burning cash and need capital, you don't have the luxury of perfect options. Sometimes the best available choice still leaves you in a difficult position.
          </p>
          <p className="text-cream-muted font-body italic leading-relaxed mb-3">
            What that experience taught me: how to read the incentive structures in distressed financing, why covenant terms matter more than interest rates, and how control shifts happen gradually through complexity rather than overnight through ownership changes.
          </p>
          <p className="text-cream-muted font-body italic leading-relaxed">
            This memo applies those lessons to KIRK—not to criticize management's decisions (they may have had no better alternatives), but to understand the mechanics of how creditor control operates in modern distressed situations.
          </p>
        </div>

        {/* Executive Summary */}
        <div className="bg-navy-light border-l-4 border-primary p-6 mb-8">
          <h3 className="text-primary font-body text-sm uppercase tracking-wider mb-4">Executive Summary</h3>
          <ul className="space-y-3 text-cream-muted font-body">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span><strong className="text-foreground">Revenue collapse accelerating:</strong> Sales down 11.7% year-to-date, with Q2 showing 12.2% decline—deterioration worsening, not stabilizing</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span><strong className="text-foreground">Gross margin compression terminal:</strong> 16.3% in Q2 (down 410 basis points) indicates heavy promotional discounting, unsustainable below 20%</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span><strong className="text-foreground">Liquidity precarious:</strong> 7-12 month runway after $10M brand sale and $20M delayed draw commitment</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span><strong className="text-foreground">Beyond has de facto control:</strong> 40% equity ownership, 2 of 6 board seats, conversion rights on $13.7M debt expandable to 65% ownership</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span><strong className="text-foreground">Expected equity value in 18 months:</strong> $0.10-0.50/share (vs. current ~$1.50) = <span className="bg-red-900/50 text-red-300 px-2 py-0.5 text-sm">67-93% downside</span></span>
            </li>
          </ul>
        </div>

        {/* Section I */}
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mt-12 mb-4 pb-3 border-b border-border">
          I. The Central Thesis: Control Through Complexity
        </h2>
        
        <p className="text-cream-muted font-body leading-relaxed mb-6">
          Kirkland's isn't experiencing a traditional restructuring. Instead, Beyond Inc. has structured a series of increasingly creditor-favorable transactions that provide KIRK with just enough liquidity to avoid bankruptcy whilst positioning Beyond to acquire the company at a deep discount through debt-to-equity conversions.
        </p>

        {/* Timeline */}
        <div className="border-l-4 border-primary pl-6 space-y-6 mb-8">
          {[
            { date: 'October 2024', text: 'Beyond provides $25M rescue financing ($17M debt + $8M equity) when KIRK desperate, securing 40% equity stake and board representation' },
            { date: 'February 2025', text: "Beyond converts $8.5M debt to equity at $1.85/share, establishing ownership position" },
            { date: 'May 2025', text: "Beyond weaponizes going concern opinion to extract additional concessions—$5.2M additional loan with conversion rights at market prices (not fixed price), plus right to purchase Kirkland's brand" },
            { date: 'September 2025', text: 'Beyond purchases Kirkland\'s brand for $10M (asset stripping begins) and commits $20M delayed draw for "store conversions" to Beyond-owned BB&B brand' },
            { date: 'Next 12-18 Months', text: 'Beyond allows KIRK to operate at breakeven or small losses, stock price remains depressed ($1-2 range), converts remaining debt at low market prices achieving 65% control for total investment of ~$45M' },
          ].map((item, index) => (
            <div key={index} className="relative">
              <div className="absolute -left-[1.65rem] top-1.5 w-3 h-3 rounded-full bg-primary" />
              <p className="text-primary font-body font-bold text-sm mb-1">{item.date}</p>
              <p className="text-cream-muted font-body">{item.text}</p>
            </div>
          ))}
        </div>

        <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">What Beyond Is Really Acquiring</h3>

        {/* Data Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-foreground text-background">
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Asset</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Replacement Cost</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Strategic Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">309 retail locations (2.5M sq ft)</td>
                <td className="px-4 py-3 text-cream-muted">$150-200M</td>
                <td className="px-4 py-3 text-cream-muted">Established lease terms, landlord relationships</td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Customer database & loyalty</td>
                <td className="px-4 py-3 text-cream-muted">$50-75M</td>
                <td className="px-4 py-3 text-cream-muted">2-3M active customers, purchasing data</td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">E-commerce & fulfillment</td>
                <td className="px-4 py-3 text-cream-muted">$25-40M</td>
                <td className="px-4 py-3 text-cream-muted">Operational infrastructure, technology</td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Kirkland's brand trademark</td>
                <td className="px-4 py-3 text-cream-muted">$35-50M</td>
                <td className="px-4 py-3 text-cream-muted">Already purchased by Beyond for $10M</td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Supply chain & vendors</td>
                <td className="px-4 py-3 text-cream-muted">$15-25M</td>
                <td className="px-4 py-3 text-cream-muted">Established terms, credit lines</td>
              </tr>
              <tr className="bg-primary/10">
                <td className="px-4 py-3 text-foreground font-semibold">Total Replacement Cost</td>
                <td className="px-4 py-3 text-foreground font-semibold">$275-390M</td>
                <td className="px-4 py-3 text-foreground font-semibold">Beyond's investment: ~$45-50M (85% discount)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pull Quote */}
        <blockquote className="border-t-2 border-b-2 border-primary py-6 my-8 text-center">
          <p className="text-xl md:text-2xl font-display italic text-primary">
            "This represents successful value extraction by Beyond, but effective wipeout for legacy KIRK shareholders"
          </p>
        </blockquote>

        {/* Section II */}
        <div className="border-t-2 border-primary my-12" />

        <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4 pb-3 border-b border-border">
          II. Operating Performance: Accelerating Deterioration
        </h2>

        <p className="text-cream-muted font-body leading-relaxed mb-6">
          The financial results reveal a business in terminal decline, with every key metric worsening quarter-over-quarter despite management's restructuring efforts.
        </p>

        <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Revenue Collapse</h3>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-foreground text-background">
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Period</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Revenue</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">YoY Change</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Comp Sales</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Store Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Q2 FY25</td>
                <td className="px-4 py-3 text-cream-muted">$75.8M</td>
                <td className="px-4 py-3"><span className="bg-red-900/50 text-red-300 px-2 py-0.5 text-xs">-12.2%</span></td>
                <td className="px-4 py-3 text-cream-muted">-9.7%</td>
                <td className="px-4 py-3 text-cream-muted">309</td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Q1 FY25</td>
                <td className="px-4 py-3 text-cream-muted">$81.5M</td>
                <td className="px-4 py-3 text-cream-muted">-11.2%</td>
                <td className="px-4 py-3 text-cream-muted">-8.9%</td>
                <td className="px-4 py-3 text-cream-muted">314</td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">FY24 Full Year</td>
                <td className="px-4 py-3 text-cream-muted">$468.7M</td>
                <td className="px-4 py-3 text-cream-muted">-5.3%</td>
                <td className="px-4 py-3 text-cream-muted">-4.8%</td>
                <td className="px-4 py-3 text-cream-muted">346</td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">FY25 Projected</td>
                <td className="px-4 py-3"><span className="bg-red-900/50 text-red-300 px-2 py-0.5 text-xs">$315-330M</span></td>
                <td className="px-4 py-3"><span className="bg-red-900/50 text-red-300 px-2 py-0.5 text-xs">-30%+</span></td>
                <td className="px-4 py-3 text-cream-muted">-</td>
                <td className="px-4 py-3 text-cream-muted">~300</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Warning Box */}
        <div className="bg-yellow-900/20 border-2 border-yellow-600 p-6 rounded mb-8">
          <h4 className="text-yellow-500 font-body font-semibold mb-3">Critical Alert: Terminal Gross Margin</h4>
          <p className="text-cream-muted font-body leading-relaxed">
            Q2 gross margin of 16.3% is terminal. You cannot operate specialty retail profitably at 16% gross margin when SG&A is 40%+ of sales. This indicates KIRK is liquidating inventory to generate cash, not selling merchandise at healthy markups.
          </p>
        </div>

        {/* Scenario Boxes */}
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mt-12 mb-6 pb-3 border-b border-border">
          IV. Four Scenarios for KIRK
        </h2>

        <div className="space-y-6 mb-8">
          <div className="bg-navy-light p-6 rounded border border-border">
            <h4 className="font-body text-lg text-foreground mb-2">
              Scenario A: Independent Stabilization 
              <span className="ml-3 bg-primary text-background px-3 py-1 text-xs rounded">5% Probability</span>
            </h4>
            <p className="text-cream-muted font-body mb-3">
              BB&B store conversions succeed beyond expectations, driving new customer acquisition. Revenue stabilizes at $340-360M, company achieves breakeven EBITDA.
            </p>
            <p className="text-cream-muted font-body text-sm">
              <strong className="text-foreground">Equity value if achieved:</strong> $3-5/share (recovery from current $1.50)
            </p>
          </div>

          <div className="bg-navy-light p-6 rounded border-2 border-primary">
            <h4 className="font-body text-lg text-foreground mb-2">
              Scenario B: Slow-Motion Beyond Takeover 
              <span className="ml-3 bg-primary text-background px-3 py-1 text-xs rounded">60% Probability — BASE CASE</span>
            </h4>
            <p className="text-cream-muted font-body mb-3">
              KIRK continues operating with losses or small profits for 12-24 months. Beyond provides minimum liquidity via delayed draws to keep company solvent. Stock price remains depressed ($0.75-1.50 range). Beyond converts debt incrementally, reaching 60-65% ownership by mid-2027.
            </p>
            <p className="text-cream-muted font-body text-sm">
              <strong className="text-foreground">For Legacy Shareholders:</strong> <span className="bg-red-900/50 text-red-300 px-2 py-0.5">55-78% value destruction</span>
            </p>
          </div>

          <div className="bg-navy-light p-6 rounded border border-border">
            <h4 className="font-body text-lg text-foreground mb-2">
              Scenario C: Near-Term Bankruptcy 
              <span className="ml-3 bg-primary text-background px-3 py-1 text-xs rounded">25% Probability</span>
            </h4>
            <p className="text-cream-muted font-body">
              Holiday 2025 sales catastrophic, covenant violation Q4 FY25 or Q1 FY26, Bank of America refuses further waivers, company files Chapter 11. Equity wiped out.
            </p>
          </div>

          <div className="bg-navy-light p-6 rounded border border-border">
            <h4 className="font-body text-lg text-foreground mb-2">
              Scenario D: Strategic Sale to Third Party 
              <span className="ml-3 bg-primary text-background px-3 py-1 text-xs rounded">10% Probability</span>
            </h4>
            <p className="text-cream-muted font-body">
              Alternative buyer emerges, values KIRK's assets higher than Beyond's conversion strategy. Beyond's 40% ownership plus board seats equals veto power over any sale—why unlikely.
            </p>
          </div>
        </div>

        {/* Expected Value Table */}
        <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Probability-Weighted Expected Value</h3>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-foreground text-background">
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Scenario</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Probability</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Equity Value/Share</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Weighted Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">A: Independent Stabilization</td>
                <td className="px-4 py-3 text-cream-muted">5%</td>
                <td className="px-4 py-3 text-cream-muted">$4.00</td>
                <td className="px-4 py-3 text-cream-muted">$0.20</td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">B: Beyond Takeover</td>
                <td className="px-4 py-3 text-cream-muted">60%</td>
                <td className="px-4 py-3 text-cream-muted">$0.60</td>
                <td className="px-4 py-3 text-cream-muted">$0.36</td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">C: Bankruptcy</td>
                <td className="px-4 py-3 text-cream-muted">25%</td>
                <td className="px-4 py-3 text-cream-muted">$0.00</td>
                <td className="px-4 py-3 text-cream-muted">$0.00</td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">D: Strategic Sale</td>
                <td className="px-4 py-3 text-cream-muted">10%</td>
                <td className="px-4 py-3 text-cream-muted">$0.30</td>
                <td className="px-4 py-3 text-cream-muted">$0.03</td>
              </tr>
              <tr className="bg-primary/10">
                <td className="px-4 py-3 text-foreground font-semibold">Expected Value</td>
                <td className="px-4 py-3 text-foreground font-semibold">100%</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-foreground font-semibold">$0.59</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-cream-muted font-body mb-4">
          <strong className="text-foreground">Current stock price:</strong> $1.50<br />
          <strong className="text-foreground">Implied downside:</strong> <span className="bg-red-900/50 text-red-300 px-2 py-0.5">61%</span>
        </p>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t-2 border-border">
          <div className="text-cream-muted font-body text-sm mb-4">
            <p className="font-semibold text-foreground mb-2">Contact</p>
            <p>Zachary Smith | zac.smith@financier.com</p>
          </div>
          <p className="text-cream-muted font-body text-xs leading-relaxed">
            <strong>Disclaimer:</strong> This analysis is for educational purposes only and does not constitute investment advice. The author may hold positions in securities discussed. All information is based on publicly available sources and estimates, which may prove incorrect.
          </p>
        </footer>
      </article>
    </div>
  );
};

export default KirklandsMemo;
