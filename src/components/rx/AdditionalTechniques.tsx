import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { TechniqueCard } from "./TechniqueCard";

export const LiquidityTechniquesSection = () => (
  <div className="space-y-6">
    <div className="bg-muted/50 rounded-lg p-4 mb-4">
      <h3 className="font-semibold mb-2">Quick Liquidity Solutions</h3>
      <p className="text-sm text-muted-foreground">
        These techniques can generate immediate cash without requiring formal restructuring. Often used as first-line defense or in combination with other restructuring strategies.
      </p>
    </div>
    
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="sale-leaseback">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500">Cash Generator</Badge>
            Sale-Leaseback
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Sell real estate or equipment to a third party and immediately lease it back, converting fixed assets to cash while preserving operational use"
            when={[
              "Need immediate liquidity but can't sell operations",
              "Own significant real estate or equipment",
              "Want to unlock value in underutilized assets",
              "Rent expense is manageable relative to cash generated",
              "Common in retail, restaurant, and industrial distress"
            ]}
            pros={["Immediate cash infusion", "Keep using assets", "Improve asset efficiency ratios", "Off-balance sheet treatment possible"]}
            cons={["Now have rent expense", "Loss of appreciation upside", "Long-term cost may exceed ownership", "Credit quality affects lease terms"]}
            microstages={["Asset Identification", "Valuation", "Buyer/Lessor Selection", "Lease Negotiation", "Sale Closing", "Leaseback Commencement"]}
            example={{
              scenario: "Retail chain owns $100M of real estate but facing liquidity crunch",
              outcome: "Sell properties for $80M, lease back at 8% cap rate ($6.4M/year). Immediate cash injection funds turnaround, rent is manageable vs. alternative of bankruptcy"
            }}
            keyMetrics={["Cap rate: 6-10% typical", "Lease term: 10-20 years", "Cash generated: 60-90% of FMV"]}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="factoring">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500">Working Capital</Badge>
            Factoring / AR Securitization
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Sell accounts receivable at a discount for immediate cash, or pledge AR as collateral for a borrowing facility"
            when={[
              "Long collection cycles (60-120 days)",
              "High-quality receivables (investment-grade customers)",
              "Need working capital without additional debt",
              "Insurance receivables (like restoration companies)",
              "Export receivables with letter of credit support"
            ]}
            pros={["Immediate cash (80-95% advance)", "Non-recourse options available", "Off-balance sheet possible", "Scales with revenue"]}
            cons={["Discount rate (2-5%)", "Customer notification may be required", "Quality of AR matters", "Concentration limits"]}
            microstages={["AR Audit", "Eligibility Criteria", "Facility Structuring", "Documentation", "Funding", "Collection/Remittance"]}
            example={{
              scenario: "Restoration company has $800K in insurance receivables, 90-day collection cycle",
              outcome: "Factor $800K at 3% discount, receive $776K immediately. Use cash to fund operations, avoid covenant breach"
            }}
            keyMetrics={["Advance rate: 80-95%", "Discount: 1-5% depending on quality", "Notification vs. non-notification"]}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="vendor-financing">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500">Trade Credit</Badge>
            Vendor Financing Arrangements
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Negotiate extended payment terms, consignment arrangements, or supplier financing to preserve cash"
            when={[
              "Critical suppliers with long relationships",
              "Supplier has strong interest in your survival",
              "Temporary cash flow mismatch",
              "Supplier can afford extended terms",
              "Alternative is losing major customer (you)"
            ]}
            pros={["No interest if extended terms", "Preserves banking relationships", "Signals supplier confidence", "Flexible negotiation"]}
            cons={["Supplier concentration risk", "May require personal guarantee", "Could affect supply reliability", "Limits future negotiating power"]}
            microstages={["Supplier Prioritization", "Proposal Development", "Negotiation", "Documentation", "Implementation", "Monitoring"]}
            example={{
              scenario: "Manufacturer needs $2M in raw materials but maxed out credit lines",
              outcome: "Negotiate 90-day terms (vs. 30-day) with key suppliers, effectively getting $4M interest-free financing"
            }}
            keyMetrics={["Extended terms: 60-120 days typical", "Consignment: No payment until sale", "May require equity/warrant participation"]}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="customer-prepayment">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500">Revenue Acceleration</Badge>
            Customer Prepayment Programs
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Incentivize customers to pay in advance through discounts or enhanced service commitments"
            when={[
              "Loyal customer base values your product/service",
              "Subscription or recurring revenue model possible",
              "Can offer meaningful discount (3-10%)",
              "Customers have strong balance sheets",
              "Alternative is supply disruption for customer"
            ]}
            pros={["Interest-free financing", "Customer loyalty signal", "Predictable cash flow", "No creditor negotiation needed"]}
            cons={["Discount reduces margin", "Customer may demand more", "Revenue recognition complexity", "Creates obligation to deliver"]}
            microstages={["Customer Segmentation", "Discount Structure", "Proposal", "Agreement", "Cash Collection", "Fulfillment"]}
            example={{
              scenario: "Software company offers annual prepay discount to customers paying monthly",
              outcome: "Offer 15% discount for annual prepay, 40% of customers convert, generating $3M immediate cash"
            }}
            keyMetrics={["Discount: 5-20% typical", "Conversion rate: 20-50%", "Cash acceleration: 6-12 months"]}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="mezzanine">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500">Subordinated</Badge>
            Mezzanine Financing
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Raise subordinated debt with equity kicker (warrants), sitting between senior debt and equity in the capital structure"
            when={[
              "Need capital but don't want full dilution",
              "Senior debt capacity exhausted",
              "Bridge to future event (sale, IPO, refinancing)",
              "PE sponsor unwilling to inject more equity",
              "Strong cash flows but overleveraged"
            ]}
            pros={["Preserves equity ownership", "Tax-deductible interest", "Patient capital", "No amortization typically"]}
            cons={["Expensive (12-20% all-in)", "Equity dilution via warrants", "Structural subordination", "Covenant packages"]}
            microstages={["Capital Need Assessment", "Mezz Fund Outreach", "Term Sheet", "Due Diligence", "Documentation", "Funding", "Monitoring"]}
            example={{
              scenario: "PE-backed company needs $20M for acquisition but sponsor won't put in more equity",
              outcome: "Raise $20M mezzanine at 14% cash pay + 2% PIK + 5% warrant coverage. Complete acquisition, warrants only matter if home run"
            }}
            keyMetrics={["Cost: 12-20% total return", "Warrant coverage: 3-10%", "Term: 5-7 years typically", "Usually PIK toggle available"]}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

export const HoldingStructuresSection = () => (
  <div className="space-y-6">
    <div className="bg-muted/50 rounded-lg p-4 mb-4">
      <h3 className="font-semibold mb-2">Corporate Structure Optimization</h3>
      <p className="text-sm text-muted-foreground">
        These structures enable tax efficiency, liability isolation, transaction flexibility, and governance optimization. Often used in PE transactions and multinational restructurings.
      </p>
    </div>
    
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="spv">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Ring-Fence</Badge>
            Special Purpose Vehicle (SPV)
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Separate legal entity created for a specific transaction or to hold specific assets, providing bankruptcy remoteness and liability isolation"
            when={[
              "Securitization transactions (isolate assets for bond issuance)",
              "Joint ventures with specific scope",
              "Project financing (non-recourse to parent)",
              "Asset protection from operating liabilities",
              "Regulatory ring-fencing requirements"
            ]}
            pros={["Bankruptcy remote", "Liability isolation", "Transaction-specific governance", "Clear asset ownership"]}
            cons={["Administrative overhead", "Intercompany complexity", "May require independent directors", "Consolidated financials complexity"]}
            microstages={["Purpose Definition", "Jurisdiction Selection", "Formation", "Asset Transfer", "Governance Setup", "Ongoing Compliance"]}
            example={{
              scenario: "REIT wants to securitize mortgage portfolio without putting parent at risk",
              outcome: "Create SPV to hold mortgages, issue CMBS bonds backed by SPV assets. If mortgages default, bondholders only recourse is SPV assets"
            }}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="topco">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="outline">PE Structure</Badge>
            Topco / Midco / Bidco
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Multi-layer holding structure common in PE LBOs, with Topco for equity, Midco for holdco debt, and Bidco as acquisition vehicle"
            when={[
              "Leveraged buyout transactions",
              "Need to place debt at multiple levels",
              "Management rollover with different economics",
              "Tax optimization (interest deductibility)",
              "Exit flexibility planning"
            ]}
            pros={["Tax efficiency", "Debt placement flexibility", "Waterfall control", "Management incentive structuring"]}
            cons={["Complexity", "Intercompany documentation", "Transfer pricing scrutiny", "Multiple jurisdictions"]}
            microstages={["Structure Design", "Jurisdiction Selection", "Entity Formation", "Debt Placement", "Equity Rollover", "Intercompany Agreements"]}
            example={{
              scenario: "PE fund acquiring $500M company with $300M debt",
              outcome: "Topco (Cayman) holds equity, Midco (Luxembourg) issues $50M PIK notes, Bidco (Delaware) issues $250M senior secured, OpCos below"
            }}
            keyMetrics={["Typical layers: 3-5 entities", "Holdco PIK: Often at Midco", "Senior debt: Usually at Bidco/OpCo"]}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="ip-holdco">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="outline">IP Strategy</Badge>
            IP Holding Company
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Subsidiary that owns intellectual property and licenses it to operating companies, providing protection and tax optimization"
            when={[
              "Valuable trademarks, patents, or technology",
              "Operating liability exposure concerns",
              "Multi-jurisdictional operations",
              "IP monetization strategy",
              "M&A preparation (cleaner IP ownership)"
            ]}
            pros={["Asset protection", "Tax optimization (royalty flows)", "Monetization flexibility", "Cleaner M&A transactions"]}
            cons={["Transfer pricing scrutiny", "Substance requirements", "Intercompany complexity", "May trigger tax on transfer"]}
            microstages={["IP Audit", "Valuation", "HoldCo Formation", "IP Transfer", "License Agreements", "Transfer Pricing Study", "Ongoing Compliance"]}
            example={{
              scenario: "Tech company with $500M valued IP faces product liability lawsuits",
              outcome: "Transfer IP to Delaware HoldCo, license back to OpCo at arm's length. IP protected from operating liabilities"
            }}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="treasury">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Cash Management</Badge>
            Treasury Center
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Centralized entity for cash management, FX hedging, and intercompany lending across a multinational group"
            when={[
              "Multinational operations with multiple currencies",
              "Need efficient cash pooling",
              "FX risk management required",
              "Interest rate optimization",
              "Intercompany funding needs"
            ]}
            pros={["Cash efficiency", "Lower borrowing costs", "Centralized FX management", "Interest optimization"]}
            cons={["Regulatory requirements", "Transfer pricing complexity", "Withholding tax issues", "Operational complexity"]}
            microstages={["Treasury Policy Development", "Entity Formation", "Banking Relationships", "Cash Pool Setup", "FX Hedging Program", "Intercompany Loan Structure"]}
            example={{
              scenario: "Multinational with €50M trapped cash in Europe, $30M borrowing in US",
              outcome: "Treasury center in Netherlands pools European cash, lends to US entities. Net interest savings of $2M/year"
            }}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="recapitalization">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge className="bg-rose-500">Capital Structure</Badge>
            Recapitalization
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Fundamental change to capital structure (debt/equity mix) without change of control, often to return cash to shareholders or optimize balance sheet"
            when={[
              "Excess cash / underleveraged balance sheet",
              "Return capital to shareholders tax-efficiently",
              "Optimize weighted average cost of capital",
              "Prepare for growth phase",
              "PE dividend recapitalization"
            ]}
            pros={["Tax-efficient distributions", "WACC optimization", "Shareholder return", "Maintain control"]}
            cons={["Increased leverage risk", "Reduced flexibility", "Covenant constraints", "Rating agency concerns"]}
            microstages={["Capital Structure Analysis", "Debt Capacity Assessment", "Financing Commitment", "Documentation", "Funding", "Distribution/Deployment"]}
            example={{
              scenario: "PE-backed company worth $400M with only $100M debt, sponsors want return",
              outcome: "Dividend recap: Raise $150M new debt, distribute $150M to sponsors. Sponsors get 37% of investment back, still own 100%"
            }}
            keyMetrics={["Leverage target: 4-6x EBITDA typical in recap", "Dividend amount: Often 30-50% of equity", "Interest coverage: Minimum 2.0x"]}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="dual-class">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Governance</Badge>
            Dual-Class Share Structure
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Create multiple classes of shares with different voting rights, allowing founders to retain control with minority economic ownership"
            when={[
              "Founder wants to maintain control post-IPO",
              "Family business going public",
              "Long-term vision requires insulation from activists",
              "Strategic decisions need stability",
              "Google, Facebook, Snap model"
            ]}
            pros={["Founder control preserved", "Long-term focus", "Protection from activists", "Enables public listing"]}
            cons={["Governance concerns", "Index exclusion (some)", "Minority shareholder issues", "Sunset provisions pressure"]}
            microstages={["Structure Design", "Charter Amendment", "Share Conversion", "Shareholder Approval", "SEC Filings", "Implementation"]}
            example={{
              scenario: "Founder owns 20% economically but wants to maintain control at IPO",
              outcome: "Create Class B shares with 10 votes each (founder), Class A with 1 vote each (public). Founder has 20% economics but 72% voting"
            }}
            keyMetrics={["Voting multiple: 10x typical", "Sunset: 5-10 years or transfer triggers", "Some indices exclude dual-class"]}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="intercompany">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500">Internal RX</Badge>
            Intercompany Restructuring
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <TechniqueCard
            description="Internal reorganization of group structure including intercompany loans, asset transfers, and dividend policies to optimize capital allocation"
            when={[
              "Value trapped in subsidiaries",
              "Need to push cash to debt-service entity",
              "Transfer pricing optimization",
              "Preparing for M&A (clean up structure)",
              "Regulatory capital requirements"
            ]}
            pros={["Value unlocking", "Tax efficiency", "Simplified structure", "Transaction readiness"]}
            cons={["Transfer pricing scrutiny", "Taxable events possible", "Creditor consent may be needed", "Complexity"]}
            microstages={["Structure Analysis", "Value Mapping", "Transfer Pricing Study", "Transaction Design", "Approvals", "Implementation", "Documentation"]}
            example={{
              scenario: "HoldCo has debt but subsidiaries have cash; can't upstream due to dividend restrictions",
              outcome: "Intercompany loan from sub to HoldCo at arm's length rate. Cash moves up, interest flows down (tax deductible)"
            }}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);
