import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building2, ArrowRight, CheckCircle2 } from "lucide-react";

export const RoleComparison = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle>Financial Advisor vs. RX Consultant: Two Different Jobs, Same Outcome</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Both roles work on distressed situations, but from different angles. <strong className="text-foreground">FAs</strong> (Evercore RX, PJT, Houlihan Lokey) 
            focus on capital structure solutions and M&A. <strong className="text-foreground">Consultants</strong> (Alvarez & Marsal, FTI, AlixPartners) 
            focus on operations and cash management. Understanding both perspectives makes you a better practitioner.
          </p>
        </CardContent>
      </Card>

      {/* Side by Side Comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Financial Advisor */}
        <Card className="border-blue-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Briefcase className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <span className="text-blue-400">Financial Advisor</span>
                <p className="text-sm font-normal text-muted-foreground mt-1">Evercore RX, PJT, Moelis, Houlihan Lokey</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Primary Focus</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-blue-400" />
                  Capital structure optimization & debt restructuring
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-blue-400" />
                  M&A and 363 sale processes
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-blue-400" />
                  Creditor negotiations & Plan of Reorganization
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-blue-400" />
                  Valuation and solvency analysis
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Key Deliverables</h4>
              <div className="flex flex-wrap gap-2">
                {["Restructuring Term Sheet", "Valuation Analysis", "Creditor Presentation", "Sale Process", "Expert Testimony"].map((d, i) => (
                  <Badge key={i} variant="outline" className="border-blue-500/30 text-blue-400">{d}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Day in the Life</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Update recovery waterfall model</li>
                <li>• Call with ad hoc group of bondholders</li>
                <li>• Draft counter-proposal to lender RSA</li>
                <li>• Run sale process data room</li>
                <li>• Expert witness prep for valuation</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Success Metric</h4>
              <p className="text-sm text-muted-foreground">
                Maximize recovery for your client (debtor or creditor) through optimal capital structure solution or M&A outcome.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* RX Consultant */}
        <Card className="border-emerald-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Building2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-emerald-400">RX Consultant</span>
                <p className="text-sm font-normal text-muted-foreground mt-1">A&M, FTI, AlixPartners, McKinsey RTS</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Primary Focus</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-emerald-400" />
                  Operational turnaround & cost reduction
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-emerald-400" />
                  Cash management & 13-week forecasting
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-emerald-400" />
                  Interim management & CRO services
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 text-emerald-400" />
                  Business plan development & execution
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Key Deliverables</h4>
              <div className="flex flex-wrap gap-2">
                {["13-Week Cash Flow", "Operational Assessment", "Cost Reduction Plan", "Vendor Negotiations", "Interim CFO Services"].map((d, i) => (
                  <Badge key={i} variant="outline" className="border-emerald-500/30 text-emerald-400">{d}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Day in the Life</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Daily cash management meeting</li>
                <li>• AP/AR aging review and prioritization</li>
                <li>• Negotiate payment terms with critical vendors</li>
                <li>• Present weekly cash forecast to lenders</li>
                <li>• Implement workforce reduction plan</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Success Metric</h4>
              <p className="text-sm text-muted-foreground">
                Stabilize operations, extend runway, and create a viable go-forward business that can emerge from distress.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How They Work Together */}
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            How They Work Together
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-muted-foreground">Phase</th>
                  <th className="text-left p-3 text-blue-400">FA Role</th>
                  <th className="text-left p-3 text-emerald-400">Consultant Role</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border">
                  <td className="p-3 font-medium text-foreground">Initial Assessment</td>
                  <td className="p-3">Capital structure analysis, solvency opinion</td>
                  <td className="p-3">13-week build, operational assessment</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-medium text-foreground">Strategy Development</td>
                  <td className="p-3">Evaluate restructuring alternatives</td>
                  <td className="p-3">Cost reduction & cash preservation plan</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-medium text-foreground">Stakeholder Management</td>
                  <td className="p-3">Lead creditor negotiations</td>
                  <td className="p-3">Vendor/employee stabilization</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-medium text-foreground">Execution</td>
                  <td className="p-3">Run M&A process or exchange offer</td>
                  <td className="p-3">Implement operational improvements</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-foreground">Emergence</td>
                  <td className="p-3">Exit financing, new capital structure</td>
                  <td className="p-3">Transition to new management, hand-off</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
