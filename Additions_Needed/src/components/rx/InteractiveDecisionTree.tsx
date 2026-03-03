import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronRight, 
  AlertTriangle, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  FileText, 
  Gavel,
  HandshakeIcon,
  Building2,
  RotateCcw,
  ExternalLink,
  Users,
  Shield,
  Lightbulb,
  Calculator,
  Download,
  Factory,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  BookOpen,
  Scale,
  Target
} from "lucide-react";

type Step = 
  | "start"
  | "distress-check"
  | "business-viability"
  | "liquidity-check"
  | "liquidity-urgent"
  | "liquidity-manageable"
  | "liquidity-strategic"
  | "solvency-check"
  | "covenant-check"
  | "stakeholder-alignment"
  | "consensual-check"
  | "in-court-options"
  | "out-of-court-options"
  | "backup-plan"
  | "strategic-options"
  | "industry-context"
  | "emergency-liquidity"
  | "bor-example";

interface DecisionNode {
  id: Step;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  question: string;
  guidance: string;
  whereToFind: string[];
  options: { label: string; next: Step; warning?: string }[];
  metrics?: { label: string; value: string }[];
  redFlag?: string;
}

const decisionTree: Record<Step, DecisionNode> = {
  start: {
    id: "start",
    title: "Company Analysis",
    subtitle: "Starting Point",
    icon: <Building2 className="h-5 w-5" />,
    question: "Is the company in financial distress or seeking strategic repositioning?",
    guidance: "Look for distress signals: covenant breaches, liquidity concerns, debt trading below par, declining EBITDA, or approaching maturities. Strategic repositioning involves healthy companies looking to optimize structure.",
    whereToFind: [
      "10-K/10-Q filings (SEC EDGAR) - Check MD&A section for going concern language",
      "Credit agreement filings (8-K) - Look for amendments, waivers",
      "Bond trading levels (TRACE, Bloomberg) - Prices below 80 = stress, below 50 = distress",
      "Rating agency reports (S&P, Moody's) - Recent downgrades, CCC ratings",
      "News flow - Restructuring advisor hires, missed payments"
    ],
    options: [
      { label: "Financial Distress", next: "distress-check" },
      { label: "Strategic Repositioning", next: "strategic-options" },
      { label: "Analyze Industry Context First", next: "industry-context" }
    ],
    metrics: [
      { label: "Distressed debt threshold", value: "Trading < 80 cents" },
      { label: "Stress indicator", value: "Trading 50-80 cents" },
      { label: "Hard distress", value: "Trading < 50 cents" }
    ]
  },
  "industry-context": {
    id: "industry-context",
    title: "Industry Context",
    subtitle: "Sector-Specific Considerations",
    icon: <Factory className="h-5 w-5" />,
    question: "What industry is the company in? Different sectors have different playbooks.",
    guidance: "Industry dynamics significantly impact restructuring strategy. Retail focuses on lease rejection, energy on commodity hedges, healthcare on reimbursement issues, manufacturing on asset sales, and tech on burn rate management.",
    whereToFind: [
      "Industry research (IBISWorld, Gartner, sector-specific analysts)",
      "Comparable restructurings in the sector",
      "Regulatory considerations for the industry",
      "Union contracts and labor dynamics",
      "Customer concentration and contract terms"
    ],
    options: [
      { label: "Retail / Consumer - Lease-heavy, seasonal", next: "distress-check" },
      { label: "Energy / Commodities - Reserve-based, hedges", next: "distress-check" },
      { label: "Healthcare / Pharma - Regulatory, reimbursement", next: "distress-check" },
      { label: "Manufacturing - Asset-heavy, supply chain", next: "distress-check" },
      { label: "Technology / SaaS - Burn rate, acqui-hire", next: "distress-check" }
    ],
    metrics: [
      { label: "Retail", value: "Focus on lease rejection, 363 sales" },
      { label: "Energy", value: "Hedge books, reserve-based lending" },
      { label: "Tech", value: "Burn rate, runway, IP value" }
    ]
  },
  "distress-check": {
    id: "distress-check",
    title: "Financial Distress Identified",
    subtitle: "Triage Required",
    icon: <AlertTriangle className="h-5 w-5" />,
    question: "Before diving into liquidity vs solvency, assess: Is this fixable?",
    guidance: "This is the critical first question. A structurally broken business (negative unit economics, declining industry) may not be worth restructuring - strategic sale or liquidation may maximize value. A temporarily impaired business with good fundamentals is a restructuring candidate.",
    whereToFind: [
      "Gross margin trends - Are unit economics positive?",
      "Industry growth/decline analysis",
      "Customer/contract churn data",
      "Path to positive FCF analysis",
      "Management's operational improvement plan"
    ],
    options: [
      { label: "Fixable - Temporary crisis, good fundamentals", next: "business-viability" },
      { label: "Structural problem - May need sale/liquidation", next: "strategic-options", warning: "Consider if restructuring is the right path" }
    ],
    metrics: [
      { label: "Fixable indicators", value: "Positive gross margins, temporary setback" },
      { label: "Structural indicators", value: "Negative unit economics, secular decline" }
    ]
  },
  "business-viability": {
    id: "business-viability",
    title: "Business Model Assessment",
    subtitle: "Can This Be Fixed?",
    icon: <Lightbulb className="h-5 w-5" />,
    question: "What's the nature of the problem: liquidity (cash) or solvency (debt > value)?",
    guidance: "Liquidity = near-term cash crisis. Solvency = structural overleveraging. Most situations involve both, but understanding which is primary drives the solution. A liquidity crisis requires immediate action; solvency issues can be addressed with more time.",
    whereToFind: [
      "13-Week Cash Flow (ask management or build from AP/AR aging)",
      "Revolver availability (credit agreement, borrowing base certificate)",
      "Covenant headroom calculations",
      "Enterprise value analysis (trading comps, transaction comps, DCF)"
    ],
    options: [
      { label: "Liquidity Crisis (Running out of cash)", next: "liquidity-check" },
      { label: "Solvency Issue (Overleveraged)", next: "solvency-check" },
      { label: "Both - Start with Liquidity (more urgent)", next: "liquidity-check" }
    ]
  },
  "liquidity-check": {
    id: "liquidity-check",
    title: "Liquidity Assessment",
    subtitle: "Calculate Runway",
    icon: <Clock className="h-5 w-5" />,
    question: "How much runway does the company have?",
    guidance: "Runway = Available Liquidity ÷ Weekly Cash Burn. Include cash + revolver availability - restricted cash. Weekly burn = operating cash outflows net of inflows. Below 13 weeks is URGENT.",
    whereToFind: [
      "Treasury reports - Daily/weekly cash position",
      "Revolver borrowing base certificate - Availability",
      "AP aging report - Required near-term payments",
      "Payroll records - Fixed weekly obligations",
      "Build 13-week cash flow model from scratch if needed"
    ],
    options: [
      { label: "< 13 Weeks (URGENT - 20% of cases)", next: "liquidity-urgent", warning: "Fire drill mode - every hour counts" },
      { label: "13-26 Weeks (Manageable - 50% of cases)", next: "covenant-check" },
      { label: "> 26 Weeks (Strategic - 30% of cases)", next: "liquidity-strategic" }
    ],
    metrics: [
      { label: "< 13 weeks", value: "20% of distressed situations - URGENT" },
      { label: "13-26 weeks", value: "50% of cases - sweet spot for out-of-court" },
      { label: "> 26 weeks", value: "30% of cases - proactive restructuring" }
    ]
  },
  "liquidity-urgent": {
    id: "liquidity-urgent",
    title: "URGENT: < 13 Week Runway",
    subtitle: "Emergency Mode",
    icon: <AlertTriangle className="h-5 w-5" />,
    question: "Fire drill. Need immediate cash sources.",
    guidance: "At this stage, every decision is about buying time. Parallel path: seek emergency liquidity while preparing for potential Chapter 11 filing. Speed is everything.",
    whereToFind: [
      "DIP financing contacts (restructuring banks: Jefferies, Lazard credit)",
      "Asset-based lenders for emergency ABL",
      "Sale-leaseback candidates (real estate, equipment)",
      "Critical vendor list (who to pay vs. stretch)"
    ],
    options: [
      { label: "DIP Financing (if filing Ch11)", next: "emergency-liquidity" },
      { label: "Emergency A&E (lenders extend now, higher fees)", next: "emergency-liquidity" },
      { label: "Asset Sale (sell non-core for cash)", next: "emergency-liquidity" },
      { label: "Factoring/ABL (convert AR to cash)", next: "emergency-liquidity" },
      { label: "Sponsor Equity Injection", next: "emergency-liquidity" },
      { label: "Controlled Liquidation", next: "emergency-liquidity" }
    ],
    redFlag: "Runway < 13 weeks means limited negotiating power. Lenders know you're desperate. Focus on preserving value, not getting the best deal.",
    metrics: [
      { label: "Emergency A&E fee", value: "100-200bps typical" },
      { label: "DIP financing", value: "L+500-800bps, 2-3% OID" },
      { label: "Factoring discount", value: "2-5% of AR value" }
    ]
  },
  "emergency-liquidity": {
    id: "emergency-liquidity",
    title: "Emergency Liquidity Options",
    subtitle: "Immediate Cash Playbook",
    icon: <DollarSign className="h-5 w-5" />,
    question: "Select your emergency liquidity path:",
    guidance: "Each option has different speed, cost, and implications. DIP requires Ch11 filing. A&E needs lender consent. Asset sales may breach covenants. Factoring depends on AR quality. Sponsor injection means dilution.",
    whereToFind: [
      "DIP term sheets from restructuring banks",
      "Sale-leaseback market (JLL, CBRE for RE; equipment lessors)",
      "AR/ABL lenders (Wells, Bank of America, specialty lenders)",
      "Sponsor fund documents (reserve capacity, fund lifecycle)"
    ],
    options: [
      { label: "Pursue Chapter 11 + DIP", next: "in-court-options" },
      { label: "Try Emergency Out-of-Court First", next: "stakeholder-alignment" },
      { label: "Controlled Liquidation / Wind-Down", next: "bor-example" },
      { label: "← Back to Reassess", next: "liquidity-check" }
    ],
    metrics: [
      { label: "DIP financing timeline", value: "2-4 weeks to close" },
      { label: "Sale-leaseback", value: "4-8 weeks, 80-90% of FMV" },
      { label: "AR factoring", value: "1-2 weeks, 80-95% of face" }
    ]
  },
  "covenant-check": {
    id: "covenant-check",
    title: "Covenant Status",
    subtitle: "Default Analysis",
    icon: <Shield className="h-5 w-5" />,
    question: "Are you in breach or about to breach covenants?",
    guidance: "Covenant breach changes everything. In breach = already in technical default, lenders have leverage. Breach imminent = time to negotiate proactively. Clean = full optionality. Check both maintenance covenants (tested quarterly) and incurrence covenants (tested on specific actions).",
    whereToFind: [
      "Credit agreement - covenant definitions and cure periods",
      "Quarterly compliance certificates",
      "Rolling 4-quarter EBITDA vs. covenant levels",
      "Projections showing when breach might occur",
      "Amendment history - prior waivers indicate stress"
    ],
    options: [
      { label: "Clean (compliant, no near-term risk)", next: "stakeholder-alignment" },
      { label: "Breach imminent (next 1-2 quarters)", next: "stakeholder-alignment", warning: "Proactive outreach to lenders recommended" },
      { label: "Currently in breach / default", next: "stakeholder-alignment", warning: "Limited leverage - lenders control the process" }
    ],
    metrics: [
      { label: "Typical waiver fee", value: "50-100bps of facility" },
      { label: "Rate increase", value: "+25-50bps typical" },
      { label: "Waiver timeline", value: "2-4 weeks to negotiate" }
    ]
  },
  "liquidity-manageable": {
    id: "liquidity-manageable",
    title: "Manageable: 13-26 Week Runway",
    subtitle: "Time to Negotiate",
    icon: <Clock className="h-5 w-5" />,
    question: "Sufficient time for consensual restructuring",
    guidance: "This is the sweet spot for out-of-court restructuring. Enough time to negotiate but enough urgency to drive action. Focus on amend & extend, covenant waivers, or distressed exchanges. Key is aligning major creditors quickly.",
    whereToFind: [
      "Credit agreement - Amendment provisions (required consents)",
      "Lender roster - Who holds what, relationship history",
      "Financial projections - What story can you tell about recovery?",
      "Comparable A&E deals - Market terms for consent fees, spread increases"
    ],
    options: [
      { label: "Check Covenant Status First", next: "covenant-check" },
      { label: "Pursue Consensual Out-of-Court", next: "stakeholder-alignment" },
      { label: "Prepare In-Court Backup", next: "in-court-options" }
    ],
    metrics: [
      { label: "A&E consent fee", value: "1-2% typical" },
      { label: "Spread increase", value: "+50-150bps" },
      { label: "Timeline", value: "6-10 weeks" }
    ]
  },
  "liquidity-strategic": {
    id: "liquidity-strategic",
    title: "Strategic: > 26 Week Runway",
    subtitle: "Multiple Options Available",
    icon: <TrendingDown className="h-5 w-5" />,
    question: "Time allows for optimal solution selection",
    guidance: "With 6+ months of runway, you're negotiating from relative strength. Consider proactive refinancing, operational improvements, or strategic alternatives. This is the time to optimize, not scramble.",
    whereToFind: [
      "Refinancing market conditions (LCD, leveraged loan indices)",
      "Asset valuations for potential sales",
      "Operational improvement opportunities",
      "M&A appetite from strategics and sponsors"
    ],
    options: [
      { label: "Proactive Refinancing (replace expensive debt)", next: "out-of-court-options" },
      { label: "Operational Improvements (fix the business)", next: "solvency-check" },
      { label: "Strategic M&A (sell before problems worsen)", next: "strategic-options" },
      { label: "Covenant Amendment (get ahead of future breach)", next: "covenant-check" },
      { label: "PE Recap (sponsor dividend)", next: "strategic-options" }
    ],
    metrics: [
      { label: "Refi timeline", value: "4-8 weeks in good markets" },
      { label: "Sale process", value: "4-6 months typical" },
      { label: "Operational turnaround", value: "6-18 months" }
    ]
  },
  "solvency-check": {
    id: "solvency-check",
    title: "Capital Structure & Solvency",
    subtitle: "Find the Fulcrum",
    icon: <Scale className="h-5 w-5" />,
    question: "Is the company solvent? (Assets > Liabilities, or EV > Total Debt?)",
    guidance: "Build the waterfall: EV at top, subtract debt by priority. Where EV runs out is the fulcrum. This determines who controls the restructuring and what solutions are available.",
    whereToFind: [
      "EV/EBITDA comps (CapIQ, Bloomberg)",
      "Balance sheet (10-K) - book value analysis",
      "DCF analysis using management projections",
      "Liquidation analysis (asset-by-asset recovery)",
      "Recovery waterfall model"
    ],
    options: [
      { label: "Solvent but Illiquid (EV > Debt)", next: "liquidity-check", warning: "Focus on liquidity solutions - A&E, working capital" },
      { label: "Insolvent / Overleveraged (Debt > EV > Secured)", next: "stakeholder-alignment", warning: "Need deleveraging - D4E, distressed exchange, or Ch11" },
      { label: "Deeply Insolvent (Secured Debt > EV)", next: "in-court-options", warning: "Likely Chapter 11 or liquidation" }
    ],
    metrics: [
      { label: "Solvent but illiquid", value: "BOR example - good margins, bad timing" },
      { label: "Overleveraged", value: "PE-backed retail - too much debt" },
      { label: "Deeply insolvent", value: "Secured lenders own it" }
    ]
  },
  "stakeholder-alignment": {
    id: "stakeholder-alignment",
    title: "Stakeholder Alignment Check",
    subtitle: "The Critical Fork",
    icon: <Users className="h-5 w-5" />,
    question: "Can you get 66-85%+ creditor consent for out-of-court deal?",
    guidance: "This is THE critical question. Concentrated, aligned creditors = out-of-court success. Fragmented, hostile creditors = need court cramdown power. Check holder concentration and required consent thresholds.",
    whereToFind: [
      "Bloomberg HDS / 13D-13G filings - holder concentration",
      "Credit agreement - required lender percentages (50%, 66%, 100%)",
      "Indenture - consent thresholds",
      "Lender calls / advisor outreach - get a read on sentiment",
      "Ad hoc committee formations - who's organized?"
    ],
    options: [
      { label: "Yes - Concentrated, aligned holders", next: "out-of-court-options" },
      { label: "Maybe - Need to build consensus", next: "consensual-check", warning: "RSA negotiation likely needed" },
      { label: "No - Fragmented, hostile, or holdout risk", next: "in-court-options", warning: "Need court cramdown power" }
    ],
    metrics: [
      { label: "3-5 holders control 66%+", value: "High chance of out-of-court" },
      { label: "10+ holders, fragmented", value: "Holdout risk, consider prepack" },
      { label: "Active ad hoc committee", value: "Organized opposition" }
    ]
  },
  "consensual-check": {
    id: "consensual-check",
    title: "Consensual Resolution Path",
    subtitle: "Building the Deal",
    icon: <HandshakeIcon className="h-5 w-5" />,
    question: "Is out-of-court restructuring achievable?",
    guidance: "Out-of-court is faster, cheaper, and less disruptive. BUT requires near-unanimous consent. If holders are concentrated and aligned, this is almost always preferred. Pre-pack is the hybrid - negotiate out-of-court, file for cramdown.",
    whereToFind: [
      "Credit agreement - Amendment thresholds (50%? 66%? 100%?)",
      "Indenture - Consent requirements for modifications",
      "Holder concentration - Can you get to threshold with 3-5 holders?",
      "Relationship history - Will lenders extend or are they selling loans?"
    ],
    options: [
      { label: "Yes → Out-of-Court Solutions", next: "out-of-court-options" },
      { label: "Maybe → RSA + Pre-Packaged Bankruptcy", next: "in-court-options" },
      { label: "No → Full Chapter 11", next: "in-court-options" }
    ],
    metrics: [
      { label: "Out-of-court cost", value: "$2-5M in advisor fees" },
      { label: "Pre-pack cost", value: "$10-20M total" },
      { label: "Free-fall Ch11", value: "$20-50M+ over 12-18 months" }
    ]
  },
  "in-court-options": {
    id: "in-court-options",
    title: "In-Court Restructuring",
    subtitle: "Court Protection Required",
    icon: <Gavel className="h-5 w-5" />,
    question: "Select the appropriate in-court process",
    guidance: "Chapter 11 = reorganization with DIP financing, plan voting, cramdown. Pre-Pack = pre-negotiated plan, file and emerge in 30-60 days. 363 Sale = quick asset sale when business is melting ice cube. Chapter 7 = liquidation when no going concern value.",
    whereToFind: [
      "Venue analysis - Delaware vs. Texas vs. local court",
      "DIP financing commitments",
      "RSA (Restructuring Support Agreement) from key creditors",
      "First day motion templates",
      "Professional fee retainer requirements"
    ],
    options: [
      { label: "Pre-Packaged (RSA signed, 30-60 days)", next: "backup-plan" },
      { label: "Pre-Arranged (term sheet, not signed)", next: "backup-plan" },
      { label: "Free-Fall Chapter 11 (negotiate in court)", next: "backup-plan" },
      { label: "363 Sale (melting ice cube, quick sale)", next: "backup-plan" },
      { label: "Chapter 7 Liquidation (no going concern value)", next: "backup-plan" },
      { label: "← Try Out-of-Court First", next: "out-of-court-options" }
    ],
    metrics: [
      { label: "Pre-pack timeline", value: "30-60 days in court" },
      { label: "Free-fall Ch11", value: "12-24 months typical" },
      { label: "363 sale", value: "60-90 days" }
    ]
  },
  "out-of-court-options": {
    id: "out-of-court-options",
    title: "Out-of-Court Solutions",
    subtitle: "Consensual Restructuring",
    icon: <HandshakeIcon className="h-5 w-5" />,
    question: "Select the appropriate technique",
    guidance: "A&E = extend maturities. Covenant waiver = temporary relief. Debt-for-equity = permanent deleveraging. Distressed exchange = tender for debt at discount. LME = broader liability management. Each has different consent requirements.",
    whereToFind: [
      "Credit agreement amendment provisions",
      "Recent comparable transactions (LCD, Debtwire)",
      "Consent fee market data (1-2% typical)",
      "Rate repricing data for A&E deals"
    ],
    options: [
      { label: "Amend & Extend (maturity wall)", next: "backup-plan" },
      { label: "Covenant Waiver (temporary breach)", next: "backup-plan" },
      { label: "Debt-for-Equity Swap (deleveraging)", next: "backup-plan" },
      { label: "Distressed Exchange (debt reduction)", next: "backup-plan" },
      { label: "LME / Drop-Down (aggressive moves)", next: "backup-plan" },
      { label: "Simple Refinancing (replace debt)", next: "backup-plan" }
    ],
    metrics: [
      { label: "A&E", value: "$2-5M cost, 6-8 weeks, 50-66% consent" },
      { label: "D4E Swap", value: "$2-3M, 3-4 months, 85%+ consent" },
      { label: "Waiver", value: "$500K-$1M, 2-4 weeks, 50-66% consent" }
    ]
  },
  "backup-plan": {
    id: "backup-plan",
    title: "Backup Plan",
    subtitle: "If This Fails",
    icon: <RotateCcw className="h-5 w-5" />,
    question: "Real life is messy. What's your Plan B if negotiations fail?",
    guidance: "Always have a backup. Out-of-court failing? Be ready for prepack. Prepack failing? Free-fall Ch11. Ch11 too expensive? Consider 363 sale or controlled liquidation. The threat of a credible alternative often makes the primary path work.",
    whereToFind: [
      "DIP financing term sheets (have backup lined up)",
      "Stalking horse bid for 363 sale",
      "Liquidation analysis - what's the floor?",
      "Alternative bidder interest"
    ],
    options: [
      { label: "Pre-pack (file with RSA)", next: "start" },
      { label: "Free-fall Ch11 (figure it out in court)", next: "start" },
      { label: "363 Sale (sell company/assets)", next: "start" },
      { label: "Controlled Liquidation (orderly wind-down)", next: "bor-example" },
      { label: "← Restart Analysis", next: "start" }
    ]
  },
  "strategic-options": {
    id: "strategic-options",
    title: "Strategic Alternatives",
    subtitle: "Beyond Restructuring",
    icon: <TrendingDown className="h-5 w-5" />,
    question: "What strategic direction maximizes value?",
    guidance: "Sometimes restructuring the debt isn't the answer. Strategic sale to a buyer with synergies, spin-off of valuable divisions, or controlled wind-down may all produce better outcomes than forcing a restructuring.",
    whereToFind: [
      "Strategic alternatives analysis from banker",
      "Sum-of-the-parts valuation",
      "M&A market appetite (buyer list)",
      "Capital markets conditions for IPO/refinancing"
    ],
    options: [
      { label: "M&A / Strategic Sale", next: "start" },
      { label: "Spin-Off / Divestiture", next: "start" },
      { label: "Recapitalization", next: "start" },
      { label: "Actually Distressed → Check Liquidity", next: "liquidity-check" }
    ]
  },
  "bor-example": {
    id: "bor-example",
    title: "Real Example: BOR",
    subtitle: "A Case Study in Controlled Liquidation",
    icon: <BookOpen className="h-5 w-5" />,
    question: "See how this framework applies to a real situation",
    guidance: "BOR (Blue Ocean Restoration) was a property restoration company with strong fundamentals (60-78% gross margins) but a fatal flaw: insurance payment delays created a structural working capital problem. This is what 'solvent but illiquid' looks like in practice.",
    whereToFind: [
      "Company Analysis: Property restoration, $1.2M revenue",
      "Financial Distress: Insurance payment delays = working capital crisis",
      "Liquidity: 2.5 weeks runway (URGENT)",
      "Solvency: Solvent (60-78% margins) but illiquid",
      "Stakeholder Alignment: Personal guarantees, no leverage"
    ],
    options: [
      { label: "What BOR Tried: A/R acceleration, cost cuts, vendor negotiations", next: "start" },
      { label: "Outcome: Controlled liquidation (40-60% recoveries)", next: "start" },
      { label: "Key Lesson: Even good businesses can fail on working capital", next: "start" },
      { label: "← Restart Analysis", next: "start" }
    ],
    metrics: [
      { label: "Gross margins", value: "60-78% (healthy)" },
      { label: "Runway at crisis", value: "2.5 weeks (URGENT)" },
      { label: "Out-of-court attempts", value: "19 months of trying" },
      { label: "Final recovery", value: "40-60% for creditors" }
    ]
  }
};

// Comparison table data
const techniqueComparison = [
  { technique: "Amend & Extend", cost: "$2-5M", timeline: "6-8 weeks", consent: "50-66%", bestFor: "Maturity wall, temporary relief" },
  { technique: "Covenant Waiver", cost: "$500K-$1M", timeline: "2-4 weeks", consent: "50-66%", bestFor: "Temporary breach" },
  { technique: "Debt-for-Equity", cost: "$2-3M", timeline: "3-4 months", consent: "85%+", bestFor: "Overleveraged, need deleveraging" },
  { technique: "Distressed Exchange", cost: "$1-3M", timeline: "4-8 weeks", consent: "Varies", bestFor: "Debt trading at discount" },
  { technique: "Pre-Pack Ch11", cost: "$10-20M", timeline: "30-60 days in court", consent: "66%+ (voting)", bestFor: "Holdouts, cramdown needed" },
  { technique: "Free-Fall Ch11", cost: "$20-50M+", timeline: "12-24 months", consent: "Court approval", bestFor: "Hostile creditors, need time" },
  { technique: "363 Sale", cost: "$5-15M", timeline: "60-90 days", consent: "Court approval", bestFor: "Melting ice cube, quick exit" }
];

export const InteractiveDecisionTree = () => {
  const [currentStep, setCurrentStep] = useState<Step>("start");
  const [history, setHistory] = useState<Step[]>([]);
  const [activeView, setActiveView] = useState<"tree" | "calculator" | "compare" | "checklist">("tree");
  
  // Calculator state
  const [cash, setCash] = useState<string>("");
  const [weeklyBurn, setWeeklyBurn] = useState<string>("");
  const [revolverAvailable, setRevolverAvailable] = useState<string>("");

  const node = decisionTree[currentStep];

  const handleSelect = (next: Step) => {
    if (next === "start") {
      setHistory([]);
      setCurrentStep("start");
    } else {
      setHistory([...history, currentStep]);
      setCurrentStep(next);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentStep(prev);
    }
  };

  // Calculate runway
  const calculateRunway = () => {
    const totalLiquidity = (parseFloat(cash) || 0) + (parseFloat(revolverAvailable) || 0);
    const burn = parseFloat(weeklyBurn) || 0;
    if (burn <= 0) return null;
    return Math.round(totalLiquidity / burn * 10) / 10;
  };

  const runway = calculateRunway();
  const runwayCategory = runway ? (runway < 13 ? "urgent" : runway < 26 ? "manageable" : "strategic") : null;

  // Generate document checklist based on path
  const generateChecklist = () => {
    const docs = [
      { name: "Credit Agreement", always: true },
      { name: "10-K / 10-Q Filings", always: true },
      { name: "13-Week Cash Flow", always: true }
    ];

    if (history.includes("covenant-check") || currentStep === "covenant-check") {
      docs.push({ name: "Compliance Certificates (last 4 quarters)", always: false });
      docs.push({ name: "Covenant Calculation Workpapers", always: false });
    }
    if (history.includes("stakeholder-alignment") || currentStep === "stakeholder-alignment") {
      docs.push({ name: "Lender Roster / Holder List", always: false });
      docs.push({ name: "Bloomberg HDS Report", always: false });
      docs.push({ name: "13D/13G Filings", always: false });
    }
    if (history.includes("out-of-court-options") || currentStep === "out-of-court-options") {
      docs.push({ name: "Recent Amendment Term Sheets", always: false });
      docs.push({ name: "Comparable A&E Transactions", always: false });
    }
    if (history.includes("in-court-options") || currentStep === "in-court-options") {
      docs.push({ name: "DIP Financing Term Sheets", always: false });
      docs.push({ name: "RSA Draft", always: false });
      docs.push({ name: "First Day Motion Templates", always: false });
    }
    if (history.includes("solvency-check") || currentStep === "solvency-check") {
      docs.push({ name: "Enterprise Value Analysis", always: false });
      docs.push({ name: "Recovery Waterfall Model", always: false });
      docs.push({ name: "Liquidation Analysis", always: false });
    }

    return docs;
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as typeof activeView)}>
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="tree">
            <Target className="h-4 w-4 mr-2" />
            Decision Tree
          </TabsTrigger>
          <TabsTrigger value="calculator">
            <Calculator className="h-4 w-4 mr-2" />
            Runway Calc
          </TabsTrigger>
          <TabsTrigger value="compare">
            <BarChart3 className="h-4 w-4 mr-2" />
            Compare Paths
          </TabsTrigger>
          <TabsTrigger value="checklist">
            <FileText className="h-4 w-4 mr-2" />
            Doc Checklist
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="mt-6">
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Runway Sensitivity Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Current Cash ($K)</Label>
                  <Input 
                    type="number" 
                    value={cash}
                    onChange={(e) => setCash(e.target.value)}
                    placeholder="e.g., 5000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Weekly Burn ($K)</Label>
                  <Input 
                    type="number" 
                    value={weeklyBurn}
                    onChange={(e) => setWeeklyBurn(e.target.value)}
                    placeholder="e.g., 250"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Revolver Availability ($K)</Label>
                  <Input 
                    type="number" 
                    value={revolverAvailable}
                    onChange={(e) => setRevolverAvailable(e.target.value)}
                    placeholder="e.g., 2000"
                  />
                </div>
              </div>

              {runway !== null && (
                <div className={`p-6 rounded-lg border-2 ${
                  runwayCategory === "urgent" ? "border-destructive bg-destructive/10" :
                  runwayCategory === "manageable" ? "border-yellow-500 bg-yellow-500/10" :
                  "border-green-500 bg-green-500/10"
                }`}>
                  <div className="flex items-center gap-4">
                    {runwayCategory === "urgent" && <AlertTriangle className="h-8 w-8 text-destructive" />}
                    {runwayCategory === "manageable" && <Clock className="h-8 w-8 text-yellow-500" />}
                    {runwayCategory === "strategic" && <CheckCircle2 className="h-8 w-8 text-green-500" />}
                    <div>
                      <p className="text-2xl font-bold">{runway} weeks</p>
                      <p className="text-sm text-muted-foreground">
                        {runwayCategory === "urgent" && "URGENT - Less than 13 weeks. Fire drill mode."}
                        {runwayCategory === "manageable" && "Manageable - Sweet spot for out-of-court restructuring."}
                        {runwayCategory === "strategic" && "Strategic time - Multiple options available."}
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="mt-4"
                    onClick={() => {
                      if (runwayCategory === "urgent") handleSelect("liquidity-urgent");
                      else if (runwayCategory === "manageable") handleSelect("covenant-check");
                      else handleSelect("liquidity-strategic");
                      setActiveView("tree");
                    }}
                  >
                    Go to Recommended Path
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compare Tab */}
        <TabsContent value="compare" className="mt-6">
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Compare Restructuring Paths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold">Technique</th>
                      <th className="text-left p-3 font-semibold">Cost</th>
                      <th className="text-left p-3 font-semibold">Timeline</th>
                      <th className="text-left p-3 font-semibold">Consent Needed</th>
                      <th className="text-left p-3 font-semibold">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {techniqueComparison.map((row, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="p-3 font-medium">{row.technique}</td>
                        <td className="p-3 text-muted-foreground">{row.cost}</td>
                        <td className="p-3 text-muted-foreground">{row.timeline}</td>
                        <td className="p-3 text-muted-foreground">{row.consent}</td>
                        <td className="p-3 text-muted-foreground">{row.bestFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Checklist Tab */}
        <TabsContent value="checklist" className="mt-6">
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Document Checklist
                {history.length > 0 && (
                  <Badge variant="outline" className="ml-2">Based on your path</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generateChecklist().map((doc, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="h-5 w-5 border-2 border-primary/50 rounded flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3 text-primary opacity-0 hover:opacity-100 cursor-pointer" />
                    </div>
                    <span className={doc.always ? "font-medium" : ""}>
                      {doc.name}
                      {doc.always && <Badge variant="secondary" className="ml-2 text-xs">Required</Badge>}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4" onClick={() => window.print()}>
                <Download className="h-4 w-4 mr-2" />
                Export Checklist
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Decision Tree Tab */}
        <TabsContent value="tree" className="mt-6 space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <span>Path:</span>
            {history.map((step, i) => (
              <span key={i} className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">{decisionTree[step].title}</Badge>
                <ChevronRight className="h-3 w-3" />
              </span>
            ))}
            <Badge className="bg-primary text-primary-foreground">{node.title}</Badge>
          </div>

          {/* Red Flag Alert */}
          {node.redFlag && (
            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="font-semibold text-destructive">⚠️ Warning</p>
                <p className="text-sm text-muted-foreground">{node.redFlag}</p>
              </div>
            </div>
          )}

          {/* Main Decision Card */}
          <Card className="border-primary/30 glow-gold">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    {node.icon}
                  </div>
                  <div>
                    <span className="text-primary">{node.title}</span>
                    <p className="text-sm font-normal text-muted-foreground">{node.subtitle}</p>
                  </div>
                </CardTitle>
                {history.length > 0 && (
                  <Button variant="outline" size="sm" onClick={handleBack}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question */}
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">{node.question}</h3>
                <p className="text-sm text-muted-foreground">{node.guidance}</p>
              </div>

              {/* Metrics/Benchmarks */}
              {node.metrics && node.metrics.length > 0 && (
                <div className="grid gap-3 md:grid-cols-3">
                  {node.metrics.map((metric, i) => (
                    <div key={i} className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                      <p className="text-sm font-medium text-primary">{metric.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Where to Find Info */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-primary" />
                  Where to Find This Information
                </h4>
                <ul className="space-y-2">
                  {node.whereToFind.map((source, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {source}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <h4 className="font-semibold">Your Assessment:</h4>
                <div className="grid gap-3">
                  {node.options.map((option, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className={`justify-start h-auto p-4 text-left hover:border-primary/50 hover:bg-primary/5 ${
                        option.warning ? "border-yellow-500/30" : ""
                      }`}
                      onClick={() => handleSelect(option.next)}
                    >
                      <div className="flex items-start gap-2 w-full">
                        <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="block">{option.label}</span>
                          {option.warning && (
                            <span className="block text-xs text-yellow-600 mt-1">
                              ⚠️ {option.warning}
                            </span>
                          )}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Restart Button */}
          {currentStep !== "start" && (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setCurrentStep("start");
                  setHistory([]);
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Start Over
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
