import { ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PartyCityMemo = () => {
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
            <a href="/memos/Party_City_Credit_Analysis.pdf" download>
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
          <p className="text-primary font-body text-sm tracking-[0.2em] uppercase mb-2">Credit Memo</p>
          <p className="text-cream-muted font-body text-xs tracking-wider uppercase mb-4">Distressed Credit Analysis & Post-Mortems</p>
          <span className="inline-block bg-primary/20 text-primary px-3 py-1 text-xs font-body uppercase tracking-wider mb-4">Restructuring Failure</span>
          <h1 className="font-display text-3xl md:text-5xl font-semibold text-foreground mb-4 leading-tight">
            Party City: When Debt Reduction Can't Save a Dying Business
          </h1>
          <p className="text-cream-muted font-body text-lg italic mb-6">
            Post-mortem analysis of a failed bankruptcy restructuring. The specialty retailer eliminated nearly $1 billion in debt, only to liquidate 14 months later—a case study in mistaking balance sheet repair for business model salvation.
          </p>
          <div className="flex flex-wrap gap-4 text-cream-muted font-body text-sm">
            <span>October 2025</span>
            <span className="text-primary">|</span>
            <span>Zachary Smith</span>
            <span className="text-primary">|</span>
            <span>Specialty Retail – Party Supplies</span>
          </div>
        </header>

        {/* Lead Paragraph */}
        <p className="text-lg md:text-xl font-body leading-relaxed text-foreground mb-6">
          Party City's October 2023 bankruptcy emergence lasted just 14 months—a case study in mistaking balance sheet repair for business model salvation. The specialty retailer eliminated nearly $1 billion in debt, closed 70 underperforming stores, and raised $75 million in fresh equity, only to file for liquidation bankruptcy in December 2024.
        </p>

        <p className="text-cream-muted font-body leading-relaxed mb-8">
          By February 2025, all 700+ stores were closed and 12,000 employees terminated. This post-mortem examines why the restructuring failed, identifies early warning signs visible in real-time, and extracts lessons for credit investors evaluating distressed situations.
        </p>

        {/* Key Timeline */}
        <div className="bg-navy-light border-l-4 border-primary p-6 mb-8">
          <h3 className="text-primary font-body text-sm uppercase tracking-wider mb-4">Key Timeline</h3>
          <ul className="space-y-2 text-cream-muted font-body">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span>October 12, 2023: Emerged from Chapter 11 bankruptcy</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span>Debt reduced from ~$1.5B to $232M in Second Lien Notes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span>December 21, 2024: Filed for liquidation (14 months later)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span>February 2025: All 700+ stores closed, 12,000 jobs eliminated</span>
            </li>
          </ul>
        </div>

        {/* Executive Summary */}
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mt-12 mb-4 pb-3 border-b border-border">
          Executive Summary
        </h2>

        <p className="text-cream-muted font-body leading-relaxed mb-6">
          Party City Holdco Inc. emerged from Chapter 11 bankruptcy on October 12, 2023, after reducing total debt from approximately $1.5 billion to $232 million in Second Lien PIK Toggle Notes and establishing a new $562 million asset-based lending (ABL) facility. Despite this dramatic deleveraging, the company filed for liquidation just 14 months later on December 21, 2024.
        </p>

        <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Operational Deterioration Accelerated Post-Emergence</h3>

        <p className="text-cream-muted font-body leading-relaxed mb-6">
          Comparable store sales declined 11.4% in 9M 2023 (pre-emergence), then 9.5% in 2024 (post-emergence). The consumer products division sales plummeted 24.8% year-over-year. Two workforce reductions affected 680 corporate employees. CEO turnover occurred in August 2024, just 10 months post-emergence—a clear signal that the board recognized the post-emergence plan was failing.
        </p>

        <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Liquidation Proceeds Minimal</h3>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-primary text-background">
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Asset</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Buyer/Result</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Proceeds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Store Leases (150)</td>
                <td className="px-4 py-3 text-cream-muted">Dollar Tree</td>
                <td className="px-4 py-3 text-cream-muted">~$14.5M</td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Store Leases (40)</td>
                <td className="px-4 py-3 text-cream-muted">Five Below</td>
                <td className="px-4 py-3 text-cream-muted">Included above</td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Intellectual Property</td>
                <td className="px-4 py-3 text-cream-muted">Ad Populum</td>
                <td className="px-4 py-3 text-cream-muted">~$20M</td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Inventory</td>
                <td className="px-4 py-3 text-cream-muted">Liquidation</td>
                <td className="px-4 py-3 text-cream-muted">30-40% of book</td>
              </tr>
              <tr className="bg-primary/10">
                <td className="px-4 py-3 text-foreground font-semibold">Total Recovery Pool</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-foreground font-semibold">$100-150M</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Estimated Recoveries */}
        <div className="bg-navy-light border-l-4 border-primary p-6 mb-8">
          <h3 className="text-primary font-body text-sm uppercase tracking-wider mb-4">Estimated Recoveries</h3>
          <ul className="space-y-2 text-cream-muted font-body">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span>ABL Facility lenders: 30-40 cents on the dollar</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span>Second Lien Note holders (12% PIK toggle): <span className="bg-red-900/50 text-red-300 px-2 py-0.5 text-sm">0-10 cents</span></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span>Equity holders: Zero</span>
            </li>
          </ul>
        </div>

        {/* Pull Quote */}
        <blockquote className="border-l-4 border-primary pl-6 my-8">
          <p className="text-xl md:text-2xl font-display italic text-primary leading-relaxed">
            Debt reduction alone cannot salvage a business facing secular decline, intensifying competition, and no sustainable competitive advantages.
          </p>
        </blockquote>

        {/* Root Cause Analysis */}
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mt-12 mb-4 pb-3 border-b border-border">
          Root Cause Analysis: Why the Restructuring Failed
        </h2>

        <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">1. Debt Reduction Alone Cannot Fix Business Model Failure</h3>

        <p className="text-cream-muted font-body leading-relaxed mb-6">
          <strong className="text-foreground">The Core Problem:</strong> Party City's bankruptcy addressed the symptom (unsustainable leverage) but not the disease (broken business model facing secular decline).
        </p>

        <p className="text-cream-muted font-body leading-relaxed mb-6">
          Post-emergence debt service of approximately $35M annually represented an $85M reduction from pre-bankruptcy levels. Yet operating cash flow remained deeply negative at $(100M)+ because revenue continued declining 10% annually, gross margins compressed, and fixed costs remained too high for the sales base.
        </p>

        <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">2. Competitive Position Deteriorated Further Post-Emergence</h3>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-navy-light border border-border p-6">
            <h4 className="font-body font-semibold text-foreground mb-3">Financial Distress</h4>
            <div className="space-y-2 text-cream-muted font-body text-sm">
              <p><strong className="text-foreground">Example:</strong> LBO with too much debt</p>
              <p><strong className="text-foreground">Business:</strong> Underlying business stable/growing</p>
              <p><strong className="text-foreground">Solution:</strong> Debt refinancing solves problem</p>
              <p><strong className="text-foreground">Risk Profile:</strong> Credit investment = lending</p>
            </div>
          </div>
          <div className="bg-navy-light border-2 border-primary p-6">
            <h4 className="font-body font-semibold text-primary mb-3">Business Model Failure</h4>
            <div className="space-y-2 text-cream-muted font-body text-sm">
              <p><strong className="text-foreground">Example:</strong> Party City</p>
              <p><strong className="text-foreground">Business:</strong> Revenue declining structurally</p>
              <p><strong className="text-foreground">Solution:</strong> Debt reduction delays inevitable</p>
              <p><strong className="text-foreground">Risk Profile:</strong> Credit investment = equity risk</p>
            </div>
          </div>
        </div>

        <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">3. ABL Facility Structure Created Death Spiral</h3>

        <p className="text-cream-muted font-body leading-relaxed mb-6">
          Asset-based lending facilities feel conservative but create pro-cyclical liquidity in declining businesses. As sales decline, inventory levels drop, which reduces the borrowing base and triggers a liquidity crisis.
        </p>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-primary text-background">
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Date</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Inventory</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Borrowing Base</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">ABL Drawn</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Oct 2023</td>
                <td className="px-4 py-3 text-cream-muted">$600M</td>
                <td className="px-4 py-3 text-cream-muted">$485M</td>
                <td className="px-4 py-3 text-cream-muted">$150M</td>
                <td className="px-4 py-3"><span className="text-green-400">$335M</span></td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Mar 2024</td>
                <td className="px-4 py-3 text-cream-muted">$550M</td>
                <td className="px-4 py-3 text-cream-muted">$440M</td>
                <td className="px-4 py-3 text-cream-muted">$200M</td>
                <td className="px-4 py-3 text-cream-muted">$240M</td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Sep 2024</td>
                <td className="px-4 py-3 text-cream-muted">$450M</td>
                <td className="px-4 py-3 text-cream-muted">$360M</td>
                <td className="px-4 py-3 text-cream-muted">$280M</td>
                <td className="px-4 py-3"><span className="bg-red-900/50 text-red-300 px-2 py-0.5 text-xs">$80M</span></td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Dec 2024</td>
                <td className="px-4 py-3 text-cream-muted">$350M</td>
                <td className="px-4 py-3 text-cream-muted">$280M</td>
                <td className="px-4 py-3 text-cream-muted">$280M</td>
                <td className="px-4 py-3"><span className="bg-red-900/50 text-red-300 px-2 py-0.5 text-xs">$0</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-cream-muted font-body text-sm italic mb-8">
          As sales declined 35%, borrowing base declined 42%—faster than revenue.
        </p>

        {/* Red Flag Timeline */}
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mt-12 mb-4 pb-3 border-b border-border">
          Red Flag Timeline: Signals Visible in Real-Time
        </h2>

        <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Q3 2024: Red Lights Flashing</h3>

        <div className="bg-navy-light border-l-4 border-primary p-6 mb-8">
          <h4 className="text-primary font-body font-semibold mb-4">Exit Window Closing</h4>
          <div className="space-y-3 text-cream-muted font-body">
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">August 2024:</span>
              <span className="text-red-400">CEO Barry Litwin departs</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">September 2024:</span>
              <span className="text-red-400">Failed capital raise</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Bond Pricing:</span>
              <span className="text-red-400">20-30 cents</span>
            </div>
          </div>
          <p className="text-primary font-body font-bold mt-4">
            SELL SIGNAL: Second bankruptcy likely within 6 months
          </p>
        </div>

        <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Trading Implications</h3>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-primary text-background">
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Exit Date</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Price</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Return from Par</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Return from 70¢</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Oct 2023 (Emergence)</td>
                <td className="px-4 py-3 text-cream-muted">70¢</td>
                <td className="px-4 py-3"><span className="text-red-400">-30%</span></td>
                <td className="px-4 py-3 text-cream-muted">0%</td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Mar 2024</td>
                <td className="px-4 py-3 text-cream-muted">60¢</td>
                <td className="px-4 py-3"><span className="text-red-400">-40%</span></td>
                <td className="px-4 py-3"><span className="text-red-400">-14%</span></td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Jun 2024</td>
                <td className="px-4 py-3 text-cream-muted">45¢</td>
                <td className="px-4 py-3"><span className="text-red-400">-55%</span></td>
                <td className="px-4 py-3"><span className="text-red-400">-36%</span></td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Sep 2024</td>
                <td className="px-4 py-3 text-cream-muted">25¢</td>
                <td className="px-4 py-3"><span className="text-red-400">-75%</span></td>
                <td className="px-4 py-3"><span className="text-red-400">-64%</span></td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Dec 2024</td>
                <td className="px-4 py-3 text-cream-muted">8¢</td>
                <td className="px-4 py-3"><span className="text-red-400">-92%</span></td>
                <td className="px-4 py-3"><span className="text-red-400">-89%</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-cream-muted font-body text-sm italic mb-8">
          Active monitoring and willingness to take losses in September 2024 could have avoided catastrophic losses. Distressed debt requires active trading, not buy-and-hold.
        </p>

        {/* Final Warning Box */}
        <div className="bg-red-900/20 border-2 border-red-600 p-6 rounded mb-8">
          <p className="text-red-300 font-body font-semibold text-center text-lg">
            When equity is nearly worthless and EV/Revenue is sub-0.2x, even "secured" debt is highly speculative.
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t-2 border-border">
          <div className="text-cream-muted font-body text-sm mb-4">
            <p className="font-semibold text-foreground mb-2">Contact</p>
            <p>Zachary Smith | zac.t.smith@outlook.com</p>
          </div>
          <p className="text-cream-muted font-body text-xs leading-relaxed">
            <strong>Disclaimer:</strong> This analysis is for educational purposes only and does not constitute investment advice. The author may hold positions in securities discussed. All information is based on publicly available sources and estimates, which may prove incorrect.
          </p>
        </footer>
      </article>
    </div>
  );
};

export default PartyCityMemo;
