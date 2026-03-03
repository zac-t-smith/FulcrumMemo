import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Briefcase, Building2 } from "lucide-react";

interface GlossaryTerm {
  term: string;
  meaning: string;
  context: "FA" | "Consultant" | "Both";
  example?: string;
}

const glossaryTerms: GlossaryTerm[] = [
  { term: "Fulcrum", meaning: "The security class that sits at the breaking point in the capital structure - partially recovered, controls the restructuring", context: "Both", example: "\"Where's the fulcrum?\" = \"Who's getting the equity in the reorg?\"" },
  { term: "Melting Ice Cube", meaning: "Business rapidly losing value - urgent need to sell or restructure", context: "Both", example: "\"This is a melting ice cube situation\" = \"We need to move fast before there's nothing left\"" },
  { term: "DIP", meaning: "Debtor-In-Possession financing - new loans to fund operations during Ch.11", context: "Both", example: "\"They're going to need a DIP\" = \"No cash runway without emergency financing\"" },
  { term: "Pre-Pack", meaning: "Pre-packaged bankruptcy - negotiate the plan BEFORE filing, then quickly confirm", context: "Both", example: "\"Let's push for a pre-pack\" = \"Get everyone aligned before going to court\"" },
  { term: "Free-Fall", meaning: "Uncontrolled Chapter 11 without a pre-negotiated deal", context: "Both", example: "\"We're looking at a free-fall\" = \"Nobody agrees on anything, this is going to be messy\"" },
  { term: "Cramdown", meaning: "Court forcing a plan on dissenting creditors who voted no", context: "Both", example: "\"We'll cramdown the unsecureds\" = \"They'll vote no but we'll get it approved anyway\"" },
  { term: "363 Sale", meaning: "Quick asset sale in bankruptcy, free and clear of liens", context: "FA", example: "\"Run a 363 process\" = \"Let's auction the assets in court\"" },
  { term: "Stalking Horse", meaning: "Initial bidder in 363 sale who sets the floor price", context: "FA", example: "\"Who's the stalking horse?\" = \"Do we have a backup bidder locked?\"" },
  { term: "Break-Up Fee", meaning: "Compensation to stalking horse if outbid at auction", context: "FA", example: "\"What's the break-up?\" = \"How much do we pay if someone outbids?\"" },
  { term: "A&E", meaning: "Amend and Extend - push out debt maturities without new financing", context: "Both", example: "\"Just A&E it\" = \"Kick the can, extend the maturity\"" },
  { term: "D4E", meaning: "Debt-for-Equity swap - creditors become owners", context: "Both", example: "\"Push for a D4E\" = \"Give them equity instead of paying them back\"" },
  { term: "LME", meaning: "Liability Management Exercise - aggressive creditor-on-creditor tactics", context: "FA", example: "\"They pulled a Serta\" = \"Primed existing lenders through an uptier\"" },
  { term: "RSA", meaning: "Restructuring Support Agreement - binding deal signed before filing", context: "Both", example: "\"We need an RSA\" = \"Lock up the votes before we file\"" },
  { term: "Haircut", meaning: "Percentage reduction in claim amount creditors accept", context: "Both", example: "\"They're taking a 40% haircut\" = \"Getting 60 cents on the dollar\"" },
  { term: "TRS", meaning: "Total Return Swap - synthetic ownership often used by activists", context: "FA", example: "\"Check for TRS positions\" = \"Someone may own more than filings show\"" },
  { term: "COD", meaning: "Cancellation of Debt - taxable income when debt is forgiven", context: "Consultant", example: "\"Watch the COD\" = \"Tax liability on forgiven debt\"" },
  { term: "13-Week", meaning: "Standard short-term cash flow forecast in distress situations", context: "Consultant", example: "\"Build the 13-week\" = \"Show me exactly when we run out of money\"" },
  { term: "Runway", meaning: "How long until cash runs out at current burn rate", context: "Both", example: "\"What's the runway?\" = \"How many weeks of cash do we have?\"" },
  { term: "First Day Motions", meaning: "Emergency requests filed on day one of bankruptcy", context: "Both", example: "\"Prep first days\" = \"Get vendor pay, DIP, cash management motions ready\"" },
  { term: "Critical Vendor", meaning: "Essential suppliers paid in full to keep business running", context: "Consultant", example: "\"Put them on the critical vendor list\" = \"We have to pay them or we're dead\"" },
  { term: "KEIP/KERP", meaning: "Key Employee Incentive/Retention Plan - bonuses to keep management", context: "Both", example: "\"The team needs a KERP\" = \"Pay to keep management from leaving\"" },
  { term: "Take-Back", meaning: "Paper issued to creditors as part of recovery", context: "FA", example: "\"What's the take-back?\" = \"What securities are they getting in the reorg?\"" },
  { term: "Priming", meaning: "New lender getting priority over existing secured debt", context: "FA", example: "\"DIP is priming\" = \"New money goes senior to existing secured\"" },
  { term: "Equitization", meaning: "Converting debt to equity ownership", context: "Both", example: "\"Full equitization of the converts\" = \"All the convertible debt becomes stock\"" },
  { term: "Money Good", meaning: "Debt that will be paid in full", context: "Both", example: "\"Senior is money good\" = \"They're getting 100 cents\"" },
  { term: "Out of the Money", meaning: "Security that will receive zero recovery", context: "Both", example: "\"Equity is out of the money\" = \"Shareholders are getting wiped out\"" },
  { term: "In the Money", meaning: "Security that will receive full or substantial recovery", context: "Both", example: "\"First lien is in the money\" = \"They're getting paid in full\"" },
  { term: "Roll-Up", meaning: "Converting pre-petition debt into DIP or new debt", context: "FA", example: "\"They want a roll-up\" = \"Existing lenders want to convert old debt to new priority debt\"" },
  { term: "Gift", meaning: "Value given to out-of-money class to buy their vote", context: "FA", example: "\"Gift to the unsecureds\" = \"Give them a little to get their vote yes\"" },
  { term: "Death Spiral", meaning: "Convertible debt that keeps diluting as stock drops", context: "FA", example: "\"It's a death spiral convert\" = \"The lower the stock goes, the more shares they get\"" },
];

export const NativeLanguageGlossary = () => {
  const faTerms = glossaryTerms.filter(t => t.context === "FA" || t.context === "Both");
  const consultantTerms = glossaryTerms.filter(t => t.context === "Consultant" || t.context === "Both");

  return (
    <div className="space-y-6">
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Native Language: How RXers Actually Talk
          </CardTitle>
          <CardDescription>
            Master the terminology that experienced restructuring professionals use daily. These aren't textbook definitions - they're how the language is actually spoken in deals.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Financial Advisor Terms */}
        <Card className="border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="h-5 w-5 text-blue-400" />
              Financial Advisor (Evercore, PJT, Moelis)
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Focus on deal execution, M&A, and capital markets
            </p>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
            {faTerms.map((term, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-blue-400">{term.term}</span>
                  {term.context === "Both" && (
                    <Badge variant="outline" className="text-xs">Both</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{term.meaning}</p>
                {term.example && (
                  <p className="text-xs italic text-primary/80 font-mono bg-muted/50 p-2 rounded">
                    {term.example}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Consultant Terms */}
        <Card className="border-emerald-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-emerald-400" />
              RX Consultant (A&M, FTI, AlixPartners)
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Focus on operations, cash management, and turnaround
            </p>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
            {consultantTerms.map((term, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-emerald-400">{term.term}</span>
                  {term.context === "Both" && (
                    <Badge variant="outline" className="text-xs">Both</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{term.meaning}</p>
                {term.example && (
                  <p className="text-xs italic text-primary/80 font-mono bg-muted/50 p-2 rounded">
                    {term.example}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
