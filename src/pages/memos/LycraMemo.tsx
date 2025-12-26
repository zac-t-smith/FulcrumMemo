import { ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LycraMemo = () => {
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
            <a href="/memos/LYCRA_Credit_Analysis.pdf" download>
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
            The Second Restructuring
          </h1>
          <p className="text-cream-muted font-body text-lg italic mb-6">
            When debt reduction isn't enough: The LYCRA Company's serial distress demonstrates that capital structure fixes cannot solve broken business models
          </p>
          <div className="flex flex-wrap gap-4 text-cream-muted font-body text-sm">
            <span>October 2025</span>
            <span className="text-primary">|</span>
            <span>Zachary Smith</span>
            <span className="text-primary">|</span>
            <span>Chemical Manufacturing – Specialty Fibers</span>
            <span className="text-primary">|</span>
            <span>Eagle Intermediate Global Holding B.V.</span>
          </div>
        </header>

        {/* Lead Paragraph */}
        <p className="text-lg md:text-xl font-body leading-relaxed text-foreground mb-8">
          The LYCRA Company stands at a critical juncture—just three years removed from its 2022 restructuring, the specialty fiber manufacturer finds itself negotiating its second major recapitalization. With $1.4 billion in debt maturing December 31, 2025, and a Lock-Up Agreement announced in September that will convert existing creditors into new equity holders, LYCRA exemplifies a fundamental principle: debt reduction alone cannot salvage businesses facing secular decline.
        </p>

        {/* Personal Note */}
        <div className="bg-navy-light border-l-4 border-blue-500 p-6 mb-8">
          <h3 className="text-blue-400 font-body text-sm uppercase tracking-wider mb-3">Why This Analysis Matters</h3>
          <p className="text-cream-muted font-body italic leading-relaxed mb-3">
            I've watched distressed situations from the inside, where restructuring felt like the path to survival. My own experience taught me that when a business has a fundamentally sound operating model but faces liquidity or capital structure challenges, financial engineering can indeed provide a solution.
          </p>
          <p className="text-cream-muted font-body italic leading-relaxed mb-3">
            LYCRA, however, illustrates the other, more dangerous kind of distress. Its journey from 2019 LBO to 2022 restructuring to 2025's second recapitalization proves that when secular headwinds and eroding competitive advantages overwhelm the core business model, debt reduction alone merely delays the inevitable.
          </p>
          <p className="text-cream-muted font-body italic leading-relaxed">
            This memo isn't about criticizing management decisions—they're playing the hand they were dealt. It's about understanding the mechanics of serial restructurings, why creditors who "won" in 2022 are facing dilution in 2025, and what happens when structural problems overwhelm even dramatically reduced debt loads.
          </p>
        </div>

        {/* Executive Summary */}
        <div className="bg-navy-light border-l-4 border-primary p-6 mb-8">
          <h3 className="text-primary font-body text-sm uppercase tracking-wider mb-4">Executive Summary</h3>
          <ul className="space-y-3 text-cream-muted font-body">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span><strong className="text-foreground">Serial restructuring pattern:</strong> 2022 debt-for-equity swap eliminated original owners, yet only 3 years later company negotiating second recapitalization</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span><strong className="text-foreground">Revenue decline accelerating:</strong> ~$800M LTM (down from $885M in 2020), indicating structural market deterioration</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span><strong className="text-foreground">PIK interest death spiral:</strong> $138M/year in cash interest converted to payment-in-kind effective March 2025—company cannot service any debt</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span><strong className="text-foreground">Complex priority structure:</strong> $120M of Refinancing Notes elevated to "super senior" status in 2023, creating split recovery profile</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span><strong className="text-foreground">Expected recoveries:</strong> SSTL 100%, Super Senior Refi Notes 70-90%, remaining tranches <span className="bg-red-900/50 text-red-300 px-2 py-0.5 text-sm">10-30%</span></span>
            </li>
          </ul>
        </div>

        {/* Section I */}
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mt-12 mb-4 pb-3 border-b border-border">
          I. The Central Story: Three Restructurings in Six Years
        </h2>
        
        <p className="text-cream-muted font-body leading-relaxed mb-6">
          LYCRA's distress didn't begin in 2025—it began the day Shandong Ruyi acquired the company from Koch Industries in 2019 for $2.6 billion. The overleveraged transaction collapsed almost immediately, with the company defaulting in May 2019, just weeks after closing.
        </p>

        {/* Timeline */}
        <div className="border-l-4 border-primary pl-6 space-y-6 mb-8">
          {[
            { date: 'May 2019', text: 'Shandong Ruyi completes $2.6B leveraged buyout financed with ~$1.4B debt. Company defaults within weeks.' },
            { date: '2020-2021', text: 'Operates in distressed state. Revenue declines. Mezzanine creditors begin enforcement proceedings.' },
            { date: '2022', text: 'First Restructuring: Mezzanine lenders execute "credit bid" through Dutch court, acquiring 100% equity control. Ruyi completely wiped out.' },
            { date: 'September 2023', text: 'Intercreditor Agreement amended to elevate $120M of Refinancing Notes to super senior status.' },
            { date: 'January 28, 2025', text: 'Company announces sale to undisclosed Chinese state-owned enterprise structured to pay all existing debt in full.' },
            { date: 'March-April 2025', text: 'Sale collapses. Liquidity crisis emerges. Emergency maturity extensions with all interest converted to PIK.' },
            { date: 'September 5, 2025', text: 'Second Restructuring: Lock-Up Agreement publicly announced. All existing debt will exchange into new debt and/or equity.' },
            { date: 'December 31, 2025', text: 'All debt matures. Company must close Lock-Up restructuring or file bankruptcy.' },
          ].map((item, index) => (
            <div key={index} className="relative">
              <div className="absolute -left-[1.65rem] top-1.5 w-3 h-3 rounded-full bg-primary" />
              <p className="text-primary font-body font-bold text-sm mb-1">{item.date}</p>
              <p className="text-cream-muted font-body">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Pull Quote */}
        <blockquote className="border-t-2 border-b-2 border-primary py-6 my-8 text-center">
          <p className="text-xl md:text-2xl font-display italic text-primary">
            "The 2022 creditors who 'won' control through debt enforcement now face becoming minority stakeholders just three years later"
          </p>
        </blockquote>

        {/* Section II */}
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mt-12 mb-4 pb-3 border-b border-border">
          II. Capital Structure: The Complex Priority Waterfall
        </h2>

        <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Complete Debt Stack (as of October 2025)</h3>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-foreground text-background">
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Tranche</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Outstanding</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Maturity</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Coupon</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Super Senior Term Loan</td>
                <td className="px-4 py-3 text-cream-muted">$194M</td>
                <td className="px-4 py-3 text-cream-muted">Dec 31, 2025</td>
                <td className="px-4 py-3 text-cream-muted">Floating</td>
                <td className="px-4 py-3 text-cream-muted">1 (Highest)</td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Refinancing Notes (Super Senior)</td>
                <td className="px-4 py-3 text-cream-muted">$120M</td>
                <td className="px-4 py-3 text-cream-muted">Dec 31, 2025</td>
                <td className="px-4 py-3 text-cream-muted">16.000%</td>
                <td className="px-4 py-3 text-cream-muted">2</td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Refinancing Notes (Pari Passu)</td>
                <td className="px-4 py-3 text-cream-muted">€468M (~$390M)</td>
                <td className="px-4 py-3 text-cream-muted">Dec 31, 2025</td>
                <td className="px-4 py-3 text-cream-muted">16.000%</td>
                <td className="px-4 py-3 text-cream-muted">3</td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">Dollar Notes</td>
                <td className="px-4 py-3 text-cream-muted">$740M</td>
                <td className="px-4 py-3 text-cream-muted">Dec 31, 2025</td>
                <td className="px-4 py-3 text-cream-muted">7.500%</td>
                <td className="px-4 py-3 text-cream-muted">3</td>
              </tr>
              <tr className="bg-primary/10">
                <td className="px-4 py-3 text-foreground font-semibold">Total Debt</td>
                <td className="px-4 py-3 text-foreground font-semibold">~$1.44B</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Warning Box */}
        <div className="bg-yellow-900/20 border-2 border-yellow-600 p-6 rounded mb-8">
          <h4 className="text-yellow-500 font-body font-semibold mb-3">Critical Structural Detail: The 2023 Super Senior Amendment</h4>
          <p className="text-cream-muted font-body leading-relaxed mb-3">
            In September 2023, facing potential maturity defaults, LYCRA's advisors explored aggressive "drop-down financing" structures. Instead, creditors negotiated: $120M of Refinancing Notes elevated to "super senior" status.
          </p>
          <p className="text-cream-muted font-body leading-relaxed">
            <strong className="text-foreground">Lesson:</strong> Those who negotiated priority in 2023—before acute distress—are likely recovering 70-90%. Those who didn't are likely recovering 10-30%. The time to negotiate is before the crisis becomes terminal.
          </p>
        </div>

        {/* PIK Death Spiral */}
        <div className="bg-navy-light border-l-4 border-blue-500 p-6 mb-8">
          <h3 className="text-blue-400 font-body text-sm uppercase tracking-wider mb-3">What PIK Interest Really Means</h3>
          <p className="text-cream-muted font-body italic leading-relaxed mb-3">
            When companies elect PIK interest, they're announcing to the world: "We cannot generate enough cash to pay even the interest on our debt." This isn't a strategic choice—it's a survival mechanism.
          </p>
          <p className="text-cream-muted font-body italic leading-relaxed">
            LYCRA's PIK election in March 2025 was the moment smart creditors knew: this isn't getting fixed through operations. The only paths forward are restructuring or bankruptcy.
          </p>
        </div>

        {/* Pull Quote */}
        <blockquote className="border-t-2 border-b-2 border-primary py-6 my-8 text-center">
          <p className="text-xl md:text-2xl font-display italic text-primary">
            "Capital structure cannot fix broken business models. LYCRA spent three years proving this principle."
          </p>
        </blockquote>

        {/* Recovery Analysis */}
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mt-12 mb-4 pb-3 border-b border-border">
          V. Recovery Analysis & Scenario Modeling
        </h2>

        <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">Recovery Waterfall (Base Case: $300M Enterprise Value)</h3>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-foreground text-background">
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Claim</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Recovery $</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Recovery %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">1. SSTL</td>
                <td className="px-4 py-3 text-cream-muted">$194M</td>
                <td className="px-4 py-3 text-cream-muted">$194M</td>
                <td className="px-4 py-3"><span className="bg-yellow-600/30 text-yellow-300 px-2 py-0.5 text-xs">100%</span></td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">2. Super Senior Refi Notes</td>
                <td className="px-4 py-3 text-cream-muted">$120M</td>
                <td className="px-4 py-3 text-cream-muted">$106M</td>
                <td className="px-4 py-3"><span className="bg-yellow-600/30 text-yellow-300 px-2 py-0.5 text-xs">88%</span></td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">3. Remaining Refi Notes</td>
                <td className="px-4 py-3 text-cream-muted">$390M</td>
                <td className="px-4 py-3 text-cream-muted">$0M</td>
                <td className="px-4 py-3"><span className="bg-red-900/50 text-red-300 px-2 py-0.5 text-xs">0%</span></td>
              </tr>
              <tr className="hover:bg-navy-light transition-colors">
                <td className="px-4 py-3 text-foreground">3. Dollar Notes</td>
                <td className="px-4 py-3 text-cream-muted">$740M</td>
                <td className="px-4 py-3 text-cream-muted">$0M</td>
                <td className="px-4 py-3"><span className="bg-red-900/50 text-red-300 px-2 py-0.5 text-xs">0%</span></td>
              </tr>
              <tr className="bg-primary/10">
                <td className="px-4 py-3 text-foreground font-semibold">Total</td>
                <td className="px-4 py-3 text-foreground font-semibold">$1,444M</td>
                <td className="px-4 py-3 text-foreground font-semibold">$300M</td>
                <td className="px-4 py-3 text-foreground font-semibold">21%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Structural Headwinds */}
        <div className="bg-navy-light border-l-4 border-primary p-6 mb-8">
          <h3 className="text-primary font-body text-sm uppercase tracking-wider mb-4">Why LYCRA Can't Stabilize</h3>
          <ul className="space-y-3 text-cream-muted font-body">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span><strong className="text-foreground">Commodity spandex market:</strong> Chinese manufacturers produce equivalent products at 30-40% lower cost</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span><strong className="text-foreground">Tariff uncertainty:</strong> US-China trade tensions create unpredictable cost structures</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span><strong className="text-foreground">Secular decline:</strong> Traditional apparel/textile end markets shrinking</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span><strong className="text-foreground">Capital intensity:</strong> 8 global manufacturing facilities require substantial ongoing capex</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">▪</span>
              <span><strong className="text-foreground">Premium positioning failure:</strong> Despite strong brands (LYCRA®, COOLMAX®), cannot command sufficient premium</span>
            </li>
          </ul>
        </div>

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

export default LycraMemo;
