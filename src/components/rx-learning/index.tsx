import { useState } from "react";
import { Scale, GitBranch, Layers, Target, Gavel, HandshakeIcon, TrendingUp, Scissors, Shield, Landmark, BookOpen, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DecisionTree, NodeId } from "./decisiontree";
import { DiagnosticFramework } from "./diagnosticframework";
import { TechniqueCard } from "./techniquecard";
import { LiquidityTechniquesSection, HoldingStructuresSection } from "./additionaltechniques";

const Index = () => {
  const [expandedNode, setExpandedNode] = useState<NodeId>("root");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">RX Techniques Master Reference</h1>
              <p className="text-sm text-muted-foreground">Corporate Restructuring Decision Framework</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Decision Tree Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <GitBranch className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Master Decision Tree</h2>
          </div>
          <DecisionTree expandedNode={expandedNode} setExpandedNode={setExpandedNode} />
        </section>

        {/* Tabs for Categories */}
        <Tabs defaultValue="learn" className="w-full">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:inline-grid">
            <TabsTrigger value="learn">Learn RX</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="in-court">In-Court</TabsTrigger>
            <TabsTrigger value="out-of-court">Out-of-Court</TabsTrigger>
            <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
            <TabsTrigger value="expansion">Expansion</TabsTrigger>
            <TabsTrigger value="divestment">Divestment</TabsTrigger>
          </TabsList>

          <TabsContent value="learn" className="mt-6">
            <DiagnosticFramework />
          </TabsContent>

          <TabsContent value="overview" className="mt-6">
            <OverviewSection />
          </TabsContent>

          <TabsContent value="in-court" className="mt-6">
            <InCourtSection />
          </TabsContent>

          <TabsContent value="out-of-court" className="mt-6">
            <OutOfCourtSection />
          </TabsContent>

          <TabsContent value="liquidity" className="mt-6">
            <LiquidityTechniquesSection />
          </TabsContent>

          <TabsContent value="expansion" className="mt-6">
            <ExpansionSection />
          </TabsContent>

          <TabsContent value="divestment" className="mt-6">
            <DivestmentSection />
          </TabsContent>
        </Tabs>

        {/* Holding Structures */}
        <section className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <Landmark className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Holding Structures & Capital Plays</h2>
          </div>
          <HoldingStructuresSection />
        </section>

        {/* Quick Reference Matrix */}
        <section className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Quick Reference Matrix</h2>
          </div>
          <QuickReferenceMatrix />
        </section>
      </main>
    </div>
  );
};

// Overview Section
const OverviewSection = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Gavel className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-lg">In-Court Restructuring</CardTitle>
        </div>
        <CardDescription>Court-supervised processes with legal protection</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Chapter 11 (US Bankruptcy)</li>
          <li>• Chapter 7 Liquidation</li>
          <li>• Administration (UK)</li>
          <li>• CVA / Scheme of Arrangement</li>
          <li>• Pre-packaged Bankruptcy</li>
          <li>• Section 363 Sale</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="border-emerald-500/30 bg-emerald-500/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <HandshakeIcon className="h-5 w-5 text-emerald-500" />
          <CardTitle className="text-lg">Out-of-Court Restructuring</CardTitle>
        </div>
        <CardDescription>Consensual negotiations without court involvement</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Amend & Extend (A&E)</li>
          <li>• Debt-for-Equity Swap</li>
          <li>• Covenant Reset/Waiver</li>
          <li>• Distressed Exchange</li>
          <li>• Refinancing</li>
          <li>• Liability Management Exercise</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="border-cyan-500/30 bg-cyan-500/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-cyan-500" />
          <CardTitle className="text-lg">Liquidity Solutions</CardTitle>
        </div>
        <CardDescription>Quick cash generation techniques</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Sale-Leaseback</li>
          <li>• Factoring / AR Securitization</li>
          <li>• Vendor Financing</li>
          <li>• Customer Prepayments</li>
          <li>• Mezzanine Financing</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="border-blue-500/30 bg-blue-500/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg">Expansion Plays</CardTitle>
        </div>
        <CardDescription>Growth-oriented strategic transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Mergers & Acquisitions</li>
          <li>• Hostile Takeover / RTO</li>
          <li>• Joint Venture</li>
          <li>• Strategic Alliance</li>
          <li>• Franchising / Licensing</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="border-purple-500/30 bg-purple-500/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-purple-500" />
          <CardTitle className="text-lg">Divestment Plays</CardTitle>
        </div>
        <CardDescription>Value unlocking through separation</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Spin-Off / Demerger</li>
          <li>• Equity Carve-Out (IPO)</li>
          <li>• Sell-Off / Hive-Off / Slump Sale</li>
          <li>• MBO / MBI / BIMBO</li>
          <li>• LBO / Going Private</li>
        </ul>
      </CardContent>
    </Card>

    <Card className="border-rose-500/30 bg-rose-500/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Landmark className="h-5 w-5 text-rose-500" />
          <CardTitle className="text-lg">Holding Structures</CardTitle>
        </div>
        <CardDescription>Corporate architecture optimization</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Topco / Midco / Bidco</li>
          <li>• SPV / IP HoldCo</li>
          <li>• Treasury Center</li>
          <li>• Recapitalization</li>
          <li>• Dual-Class Shares</li>
        </ul>
      </CardContent>
    </Card>
  </div>
);

// In-Court Section
const InCourtSection = () => (
  <div className="space-y-6">
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="ch11">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="destructive">Critical</Badge>
            Chapter 11 Reorganization (US)
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Court-supervised restructuring allowing debtor to continue operations while reorganizing debts. The automatic stay stops all creditor collection actions, giving the company breathing room."
            when={[
              "Need breathing room (automatic stay) from creditors",
              "Business is viable but capital structure unsustainable",
              "Need to reject unfavorable contracts/leases",
              "Require cramdown of dissenting creditor classes",
              "DIP financing needed to fund operations"
            ]}
            pros={["Automatic stay protects assets", "DIP financing priority", "Contract rejection rights", "Cramdown provisions"]}
            cons={["Expensive ($10M+ in fees)", "Time-consuming (12-24 months)", "Reputational damage", "Loss of control"]}
            microstages={["Filing & First Day Motions", "DIP Financing", "Plan Development", "Disclosure Statement", "Voting", "Confirmation", "Emergence"]}
            example={{
              scenario: "Retail chain with $500M debt, 40% of stores unprofitable, landlords demanding rent",
              outcome: "File Ch.11, reject 200 unprofitable leases, negotiate DIP, emerge in 14 months with $200M debt and profitable footprint"
            }}
            keyMetrics={["Time in court: 12-24 months (freefall) vs. 30-90 days (prepack)", "Professional fees: $10M-$50M+", "DIP financing: 10-15% of revenue typically"]}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="ch7">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="destructive">Terminal</Badge>
            Chapter 7 Liquidation (US)
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Complete wind-down where a trustee takes control, sells all assets, and distributes proceeds according to absolute priority rule."
            when={[
              "No viable path to profitability (negative FCF forever)",
              "Asset value > going concern value",
              "Stakeholders prefer immediate cash over reorganization risk",
              "Burned through all restructuring options"
            ]}
            pros={["Clean break", "Lower costs than Ch.11", "Definitive timeline", "Priority waterfall clarity"]}
            cons={["Trustee takes control", "Fire sale prices (20-30 cents on dollar)", "Job losses", "No going concern premium"]}
            microstages={["Petition Filing", "Trustee Appointment", "Asset Inventory", "Claims Bar Date", "Asset Sales", "Distribution", "Case Closure"]}
            example={{
              scenario: "Failed retailer with $100M assets, $200M debt, no path to profitability",
              outcome: "Ch.7 liquidation yields $30M (fire sale), secured gets 100%, unsecured gets 5%"
            }}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="s363">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Hybrid</Badge>
            Section 363 Sale
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Quick sale of assets free and clear of liens during Ch.11. Buyer gets clean title with court blessing, protected from successor liability."
            when={[
              "Melting ice cube - assets deteriorating rapidly",
              "Stalking horse bidder in hand",
              "Want competitive auction for assets",
              "Cleaner than out-of-court (no successor liability)"
            ]}
            pros={["Speed (30-60 days)", "Free and clear of liens", "Competitive auction", "Buyer protection from fraudulent conveyance"]}
            cons={["May not maximize value", "Credit bid risks", "Break-up fee costs"]}
            microstages={["Stalking Horse Agreement", "Sale Motion", "Bid Procedures Order", "Marketing (30-60 days)", "Auction", "Sale Approval", "Closing"]}
            example={{
              scenario: "Competitor wants customer contracts + brand but not your debt",
              outcome: "File Ch.11, competitor bids $2M as stalking horse, auction yields $2.8M, buyer gets assets clean"
            }}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="prepack">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500">Efficient</Badge>
            Pre-Packaged Bankruptcy
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Negotiate and vote on Plan of Reorganization BEFORE filing, then file with plan already approved. Combines out-of-court speed with in-court cramdown power."
            when={[
              "Major creditors (66%+) aligned on restructuring terms",
              "Need court blessing for cramdown of minority holdouts",
              "Want speed of out-of-court + certainty of in-court",
              "Complex capital structure but cooperative creditors"
            ]}
            pros={["Fast (30-45 days in court)", "Lower costs", "Less disruption", "Pre-negotiated certainty"]}
            cons={["Requires creditor cooperation upfront", "Limited flexibility once filed", "Holdout risk if RSA fails"]}
            microstages={["RSA Negotiation (66%+ each class)", "Disclosure Prep", "Pre-Filing Solicitation", "Filing", "Confirmation Hearing", "Emergence"]}
            keyMetrics={["Freefall Ch.11: 12-24 months", "Prepack: 30-90 days", "Out-of-court: 3-6 months (no cramdown)"]}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

// Out-of-Court Section  
const OutOfCourtSection = () => (
  <div className="space-y-6">
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="ae">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500">Common</Badge>
            Amend & Extend (A&E)
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Modify existing credit agreements to extend maturity and/or relax terms. First line of defense when maturity wall approaching."
            when={[
              "Near-term maturity wall approaching",
              "Refinancing market unfavorable",
              "Fundamentals sound, just need time",
              "Relationship lenders willing to work with you"
            ]}
            pros={["No new financing needed", "Preserves relationships", "Lower transaction costs", "No change of control"]}
            cons={["Consent fees (1-2%)", "Rate increase (+50-100bps)", "Covenant tightening possible", "Kicks can down road"]}
            microstages={["Maturity Analysis", "Lender Outreach", "Term Sheet", "Documentation", "Consent Solicitation (50%+)", "Amendment Effective"]}
            example={{
              scenario: "Term loan matures in 6 months, can't refinance in current market",
              outcome: "Extend maturity 18 months, pay 1.5% fee + L+50bps rate increase, interest-only for 12 months"
            }}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="d4e">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Deleveraging</Badge>
            Debt-for-Equity Swap
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Creditors exchange debt for equity ownership, immediately reducing leverage. Old equity often wiped out or severely diluted."
            when={[
              "Company overleveraged but operationally viable",
              "Debt trading at significant discount (40-60 cents)",
              "Creditors prefer ownership to recovery risk",
              "Need balance sheet repair to avoid bankruptcy"
            ]}
            pros={["Immediate deleveraging", "Improved cash flow (less interest)", "Creditors aligned with upside", "Avoid bankruptcy stigma"]}
            cons={["Equity dilution/wipeout", "COD income (tax)", "Creditor conflicts on valuation", "Execution complexity"]}
            microstages={["Valuation", "Creditor Negotiation", "Conversion Ratio", "Documentation", "Shareholder Approval", "Share Issuance"]}
            example={{
              scenario: "Company has $500M debt, $300M EV, bonds trading at 50 cents",
              outcome: "Unsecured exchanges $100M bonds for 80% equity. Debt reduced to $400M, bondholders get equity worth more than 50 cents"
            }}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="lme">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="destructive">Aggressive</Badge>
            Liability Management Exercise (LME)
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Comprehensive restructuring using aggressive techniques like uptiers, drop-downs, and double-dips. Often controversial and litigated."
            when={[
              "Multiple debt tranches with different priorities",
              "Need to subordinate existing debt (Serta-style uptiers)",
              "Sponsor-driven value extraction opportunity",
              "Covenant flexibility allows creative structuring"
            ]}
            pros={["Avoid bankruptcy", "Preserve sponsor equity value", "Flexible structuring", "Speed"]}
            cons={["Litigation risk (post-Serta)", "Creditor warfare", "Reputation damage", "Indemnity exposure"]}
            microstages={["Document Analysis", "Coalition Building", "Strategy Design", "Execution", "Litigation Defense"]}
            example={{
              scenario: "Sponsor exploits loose covenants to create super-priority debt priming existing lenders",
              outcome: "Uptier exchange: Participating lenders get new 1L, non-participants become 2L. Litigation ensues but sponsor preserved"
            }}
            keyMetrics={["Post-Serta: Non-pro rata uptiers carry significant litigation risk", "Pro-rata exchanges preferred", "DIP priming may be cleaner path"]}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

// Expansion Section
const ExpansionSection = () => (
  <div className="space-y-6">
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="ma">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500">Strategic</Badge>
            Mergers & Acquisitions
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Combine with another company (merger) or purchase another company (acquisition) to achieve scale, synergies, or market position."
            when={[
              "Industry consolidation opportunity",
              "Acquire competitor/complementary business",
              "Achieve economies of scale",
              "Enter new markets/geographies"
            ]}
            pros={["Complete integration", "Synergy capture", "Market share gains", "Talent acquisition"]}
            cons={["Integration risk", "Cultural challenges", "Antitrust scrutiny", "Premium payment"]}
            microstages={["Strategic Rationale", "Target Selection", "Due Diligence", "Valuation", "Negotiation", "Agreement", "HSR Filing", "Shareholder Vote", "Closing", "Integration"]}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="jv">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500">Partnership</Badge>
            Joint Venture
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Two companies create separate entity for specific project or market, sharing resources, risks, and rewards."
            when={[
              "Enter new market with local partner",
              "Share technology/resources",
              "Limit capital commitment",
              "Regulatory requirements (China JVs)"
            ]}
            pros={["Shared risk", "Combined expertise", "Market access", "Capital efficiency"]}
            cons={["Governance complexity", "Profit sharing", "Potential conflicts", "Exit challenges"]}
            microstages={["Partner Selection", "JV Agreement", "Entity Formation", "Governance Setup", "Operations", "Profit Distribution"]}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

// Divestment Section  
const DivestmentSection = () => (
  <div className="space-y-6">
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="spinoff">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500">Tax-Free</Badge>
            Spin-Off (Demerger)
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Distribute subsidiary shares to parent shareholders, creating independent public company. Tax-free if IRC §355 requirements met."
            when={[
              "Conglomerate discount elimination",
              "Different investor bases for each business",
              "Strategic focus improvement",
              "Unlock hidden value"
            ]}
            pros={["Tax-free (if qualified)", "Shareholder value creation", "Management focus", "Pure-play investors"]}
            cons={["Dis-synergies", "Stranded costs", "Execution complexity"]}
            microstages={["Strategic Rationale", "Tax Analysis (355)", "Separation Planning", "Form 10 Filing", "Road Show", "Distribution", "Trading Begins"]}
            example={{
              scenario: "Company owns Insurance ($500M value) + Restoration ($200M), trading at $600M combined",
              outcome: "Spin-off Restoration. Sum of parts now $700M. Conglomerate discount eliminated"
            }}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="mbo">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500">Management</Badge>
            MBO / MBI / BIMBO
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="MBO: Existing management buys company. MBI: External management buys in. BIMBO: Combination of both."
            when={[
              "Owner seeking exit",
              "Management believes in upside",
              "PE sponsor available to back team",
              "Turnaround opportunity"
            ]}
            pros={["Continuity (MBO)", "Fresh perspective (MBI)", "Aligned incentives", "PE partnership"]}
            cons={["Conflict of interest", "Financing challenges", "Integration risk (MBI)"]}
            microstages={["Management Interest", "PE Sponsor Search", "Funding Structure", "Bid", "Negotiation", "Closing", "Rollover"]}
            example={{
              scenario: "You partner with PE firm as management",
              outcome: "PE puts up 70%, you put up 30% (mostly rollover). Buy company, now you're owner-operator with PE backing"
            }}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="lbo">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="destructive">Leveraged</Badge>
            Leveraged Buyout (LBO)
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Acquire company using significant debt (60-80%), with target's cash flows servicing the debt. Classic PE strategy."
            when={[
              "Stable, predictable cash flows",
              "Asset-rich target (collateral)",
              "Cost reduction opportunities",
              "PE-style returns targeted (20%+ IRR)"
            ]}
            pros={["High returns via leverage", "Tax shield from interest", "Operational focus", "Aligned incentives"]}
            cons={["Financial risk", "Covenant pressure", "Limited flexibility", "Downside exposure"]}
            microstages={["Target ID", "LBO Model", "Debt Financing", "Equity Commitment", "SPA", "Closing", "Value Creation", "Exit"]}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

// Quick Reference Matrix
const QuickReferenceMatrix = () => {
  const techniques = [
    { name: "Chapter 11", speed: "Slow", cost: "High", control: "Low", bestFor: "Complex restructuring, need cramdown" },
    { name: "Pre-Pack", speed: "Fast", cost: "Medium", control: "Medium", bestFor: "Aligned creditors, need court blessing" },
    { name: "A&E", speed: "Fast", cost: "Low", control: "High", bestFor: "Maturity wall, relationship lenders" },
    { name: "D4E Swap", speed: "Medium", cost: "Medium", control: "Low", bestFor: "Overleveraged but viable" },
    { name: "Sale-Leaseback", speed: "Fast", cost: "Low", control: "High", bestFor: "Need quick cash, own real estate" },
    { name: "Spin-Off", speed: "Slow", cost: "High", control: "High", bestFor: "Conglomerate discount, tax-free" },
    { name: "LBO", speed: "Medium", cost: "High", control: "PE", bestFor: "Stable CF, value creation" },
    { name: "MBO", speed: "Medium", cost: "Medium", control: "Mgmt", bestFor: "Owner exit, mgmt believes in upside" },
  ];

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-semibold">Technique</th>
              <th className="text-left p-3 font-semibold">Speed</th>
              <th className="text-left p-3 font-semibold">Cost</th>
              <th className="text-left p-3 font-semibold">Control</th>
              <th className="text-left p-3 font-semibold">Best For</th>
            </tr>
          </thead>
          <tbody>
            {techniques.map((tech, i) => (
              <tr key={i} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="p-3 font-medium">{tech.name}</td>
                <td className="p-3">
                  <Badge variant={tech.speed === "Fast" ? "default" : tech.speed === "Medium" ? "secondary" : "outline"} className="text-xs">
                    {tech.speed}
                  </Badge>
                </td>
                <td className="p-3">
                  <Badge variant={tech.cost === "Low" ? "default" : tech.cost === "Medium" ? "secondary" : "outline"} className="text-xs">
                    {tech.cost}
                  </Badge>
                </td>
                <td className="p-3 text-muted-foreground">{tech.control}</td>
                <td className="p-3 text-muted-foreground">{tech.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Index;
