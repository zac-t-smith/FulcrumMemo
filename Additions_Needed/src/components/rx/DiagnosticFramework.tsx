import { AlertTriangle, CheckCircle2, TrendingDown, DollarSign, Users, Clock, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const DiagnosticFramework = () => {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            The A&M / Evercore Diagnostic Framework
          </CardTitle>
          <CardDescription>
            When a company calls you for restructuring advice, follow this systematic approach to diagnose the situation and recommend the right technique.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Step 1: Primary Diagnosis */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">1</div>
            <CardTitle>Diagnose: Financial Distress or Strategic Repositioning?</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-amber-500 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Financial Distress Indicators
              </h4>
              <ul className="space-y-2 text-sm">
                {[
                  "Liquidity < 3 months runway",
                  "Covenant breach imminent/actual",
                  "Debt trading below 70 cents",
                  "EBITDA declining YoY",
                  "Negative free cash flow",
                  "Maturity wall within 12 months",
                  "CCC credit rating or worse"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Badge variant="outline" className="border-amber-500/30 text-amber-500">!</Badge>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-emerald-500 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Strategic Repositioning Indicators
              </h4>
              <ul className="space-y-2 text-sm">
                {[
                  "Healthy cash flow, seeking optimization",
                  "Portfolio simplification opportunity",
                  "Growth opportunity requiring capital",
                  "Owner exit/succession planning",
                  "Conglomerate discount to address",
                  "M&A opportunity in market",
                  "Regulatory change requiring response"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-500">✓</Badge>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Triage */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">2</div>
            <CardTitle>If Financial Distress → Triage the Situation</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Liquidity Analysis */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              A. Liquidity Analysis
            </h4>
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
              <p>Current Cash: $X</p>
              <p>+ Revolver availability: $Y</p>
              <p>- Restricted cash: $Z</p>
              <p className="border-t border-border pt-2 mt-2">= <strong>Available liquidity: $A</strong></p>
              <p className="mt-2">Weekly burn rate: $B</p>
              <p className="text-primary font-bold">Runway = A / B = __ weeks</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <Badge variant="destructive" className="mb-2">URGENT</Badge>
                <p className="text-sm font-semibold">Runway &lt; 13 weeks</p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Emergency DIP financing</li>
                  <li>• Standstill + out-of-court term sheet</li>
                  <li>• Controlled liquidation</li>
                </ul>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                <Badge className="bg-amber-500 mb-2">MANAGEABLE</Badge>
                <p className="text-sm font-semibold">Runway 13-26 weeks</p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Amend & extend</li>
                  <li>• Covenant waiver/reset</li>
                  <li>• Out-of-court exchange</li>
                </ul>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                <Badge className="bg-emerald-500 mb-2">STRATEGIC</Badge>
                <p className="text-sm font-semibold">Runway &gt; 26 weeks</p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Refinancing</li>
                  <li>• Asset sales to deleverage</li>
                  <li>• Operational improvements</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Solvency Analysis */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-primary" />
              B. Solvency Analysis (Who's the Fulcrum?)
            </h4>
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
              <p>Enterprise Value: $EV (based on EBITDA multiple or DCF)</p>
              <p className="mt-2 font-semibold">Capital Structure Waterfall:</p>
              <ul className="ml-4 space-y-1">
                <li>- Revolver: $__</li>
                <li>- 1L Term Loan: $__</li>
                <li>- 2L Term Loan: $__</li>
                <li>- Unsecured Notes: $__</li>
                <li>- Sub Notes: $__</li>
              </ul>
              <p className="border-t border-border pt-2 mt-2">Total Debt: $__</p>
              <p className="text-primary font-bold mt-2">Fulcrum Security = First impaired class</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-3">
                <p className="font-semibold text-emerald-500">EV &gt; Total Debt</p>
                <p className="text-xs text-muted-foreground mt-1">SOLVENT - Fix liquidity problem</p>
                <p className="text-xs mt-2">→ Amend & extend, refinance</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="font-semibold text-amber-500">EV &lt; Debt but &gt; Secured</p>
                <p className="text-xs text-muted-foreground mt-1">OVERLEVERAGED - Need debt reduction</p>
                <p className="text-xs mt-2">→ D4E swap, distressed exchange</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="font-semibold text-red-500">EV &lt; Secured Debt</p>
                <p className="text-xs text-muted-foreground mt-1">DEEPLY INSOLVENT</p>
                <p className="text-xs mt-2">→ Chapter 11 or liquidation</p>
              </div>
            </div>
          </div>

          {/* Stakeholder Analysis */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              C. Stakeholder Analysis
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Who controls the outcome?</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Secured lenders</strong> - have collateral, can foreclose</li>
                  <li>• <strong>Fulcrum creditors</strong> - will vote on POR</li>
                  <li>• <strong>Sponsor (PE)</strong> - will they inject capital?</li>
                  <li>• <strong>Management</strong> - do they have equity? Will they stay?</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">What's their incentive?</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Secured lenders:</strong> Want to be made whole</li>
                  <li>• <strong>Fulcrum creditors:</strong> Want equity in reorganized co</li>
                  <li>• <strong>Out-of-money creditors:</strong> Want any recovery</li>
                  <li>• <strong>Sponsor:</strong> Preserve equity or cut losses</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Technique Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">3</div>
            <CardTitle>Select the Right Technique</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Situation</th>
                  <th className="text-left p-2">Best Technique</th>
                  <th className="text-left p-2">Alternative</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b">
                  <td className="p-2">Maturity in 6 months, can't refi</td>
                  <td className="p-2"><Badge>Amend & Extend</Badge></td>
                  <td className="p-2">Prepack Chapter 11</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Covenant breach, temporary</td>
                  <td className="p-2"><Badge>Waiver</Badge></td>
                  <td className="p-2">Reset covenant levels</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Overleveraged, viable business</td>
                  <td className="p-2"><Badge>Debt-for-Equity Swap</Badge></td>
                  <td className="p-2">Distressed Exchange</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Need quick liquidity</td>
                  <td className="p-2"><Badge>DIP Financing</Badge></td>
                  <td className="p-2">Asset sale, Sale-leaseback</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Hostile creditors, can't agree</td>
                  <td className="p-2"><Badge variant="destructive">Chapter 11</Badge></td>
                  <td className="p-2">UK Scheme (if nexus)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Asset value &gt; going concern</td>
                  <td className="p-2"><Badge variant="destructive">Ch.7 / 363 Sale</Badge></td>
                  <td className="p-2">Orderly liquidation</td>
                </tr>
                <tr>
                  <td className="p-2">Multiple tranches, complex</td>
                  <td className="p-2"><Badge>LME</Badge></td>
                  <td className="p-2">Prepack with RSA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* The Interview Answer */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            The A&M Interview Answer
          </CardTitle>
          <CardDescription>
            "Walk me through how you'd approach a distressed company"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="space-y-2">
              <p className="font-semibold text-primary">Phase 1: Triage (Week 1)</p>
              <ul className="ml-4 text-muted-foreground space-y-1">
                <li>• Build 13-week cash flow model to quantify runway</li>
                <li>• Analyze capital structure to identify fulcrum security</li>
                <li>• Assess solvency (EV vs. debt) via comps + liquidation analysis</li>
                <li>• Map stakeholder incentives</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-primary">Phase 2: Strategy Selection (Week 2-3)</p>
              <ul className="ml-4 text-muted-foreground space-y-1">
                <li>• If liquidity crisis but solvent → Out-of-court (A&E, waiver, asset sale)</li>
                <li>• If overleveraged but viable → Debt restructuring (exchange, D4E swap)</li>
                <li>• If deeply insolvent → In-court (prepack if aligned, freefall if not)</li>
                <li>• If terminal → Liquidation (Chapter 7 or orderly wind-down)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-primary">Phase 3: Execution (Ongoing)</p>
              <ul className="ml-4 text-muted-foreground space-y-1">
                <li>• Out-of-court: Negotiate with creditors, execute transaction</li>
                <li>• In-court: File, obtain DIP, confirm plan, emerge</li>
                <li>• Throughout: Operational improvements to stabilize business</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
