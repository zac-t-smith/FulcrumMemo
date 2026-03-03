import { CaseStudyStep, StepProps, stepIcons } from './InteractiveCaseStudy';
import { LiquidityStep } from './steps/LiquidityStep';
import { CapitalStructureStep } from './steps/CapitalStructureStep';
import { TechniqueSuggester } from './steps/TechniqueSuggester';
import { MemoGenerator } from './steps/MemoGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle2,
  ExternalLink,
  Info
} from 'lucide-react';

// Expert data - Your actual Kirkland's analysis
const expertAnalysis = {
  liquidity: {
    cash: 5200, // $5.2M
    revolver: 8000, // $8M capacity
    revolverDrawn: 7500, // $7.5M drawn
    lettersOfCredit: 0, // None
    restrictedCash: 0, // None
    weeklyBurn: 400, // $400K/week
    runway: 11.75, // weeks
    category: 'urgent' // < 13 weeks
  },
  capitalStructure: {
    tranches: [
      { name: 'ABL Revolver', par: 8000, rate: 'SOFR+450', maturity: '2026', security: '1L', trading: null },
      { name: 'Term Loan', par: 45000, rate: 'SOFR+550', maturity: '2027', security: '2L', trading: 65 }
    ],
    totalDebt: 53000,
    marketCap: 12000
  },
  solvency: {
    ev: 35000, // $35M enterprise value
    totalDebt: 53000,
    assessment: 'insolvent', // EV < Total Debt
    fulcrum: 'ABL Revolver', // Where value runs out
    recovery: {
      revolver: 100, // %
      termLoan: 45 // %
    }
  },
  recommendation: {
    primary: 'Strategic Sale / M&A',
    rationale: 'With <13 week runway and insolvent capital structure, best outcome is sale to strategic buyer before liquidity crisis forces fire sale.',
    alternatives: ['Chapter 11 with 363 sale', 'Out-of-court sale process', 'Controlled wind-down'],
    outcome: 'Merged with The ODP Corporation 10 weeks after analysis'
  }
};

// Step 1: Background
const BackgroundStep = ({ data, onUpdate }: StepProps) => {
  return (
    <div className="space-y-6">
      <div className="prose prose-sm max-w-none">
        <h3>Company Overview</h3>
        <p className="text-muted-foreground">
          Kirkland's, Inc. (NASDAQ: KIRK) is a specialty retailer of home décor and furnishings operating approximately
          350 stores across the United States. The company has faced significant challenges including:
        </p>
        <ul className="text-muted-foreground">
          <li>Declining same-store sales for 8 consecutive quarters</li>
          <li>Gross margin compression from 35% to 28%</li>
          <li>Increasing competition from e-commerce and big-box retailers</li>
          <li>High fixed-cost store footprint with unfavorable leases</li>
        </ul>

        <h3 className="mt-6">Your Task</h3>
        <p className="text-muted-foreground">
          You've been hired as an RX analyst to assess Kirkland's financial situation and recommend a path forward.
          You'll work through:
        </p>
        <ol className="text-muted-foreground">
          <li>Liquidity analysis - How much runway does the company have?</li>
          <li>Capital structure - What does the debt stack look like?</li>
          <li>Solvency - Is the company worth more than its debt?</li>
          <li>Restructuring options - What should management do?</li>
        </ol>
      </div>

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="h-4 w-4 text-amber-500" />
            Key Information Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ExternalLink className="h-3 w-3" />
            <span>10-K/10-Q: EDGAR (SEC filings)</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ExternalLink className="h-3 w-3" />
            <span>Debt Pricing: TRACE, Bloomberg</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ExternalLink className="h-3 w-3" />
            <span>Credit Agreement: 8-K filings</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ExternalLink className="h-3 w-3" />
            <span>Comp Data: CapIQ, Factset</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        <span className="text-sm">Ready to begin analysis. Click "Next Step" to start with liquidity.</span>
      </div>
    </div>
  );
};

// Wrapper for Liquidity Step with expert data
const KirklandsLiquidityStep = (props: StepProps) => (
  <LiquidityStep {...props} expertData={expertAnalysis.liquidity} />
);

// Wrapper for Capital Structure Step (uses imported component)
const KirklandsCapStructureStep = (props: StepProps) => (
  <CapitalStructureStep {...props} />
);

// Wrapper for Technique Suggester (passes accumulated data from previous steps)
const KirklandsTechniqueSuggester = (props: StepProps) => {
  // Create combined data object from all previous steps
  const combinedData = {
    liquidity: props.data?.liquidity || {},
    capitalStructure: props.data?.capitalStructure || {}
  };

  return <TechniqueSuggester {...props} data={combinedData} />;
};

// Wrapper for Memo Generator (passes all accumulated data)
const KirklandsMemoGenerator = (props: StepProps) => {
  return (
    <MemoGenerator
      {...props}
      companyName="Kirkland's"
      ticker="KIRK"
    />
  );
};

// Step 4: Recommendation
const RecommendationStep = ({ data = {}, onUpdate, showExpert }: StepProps) => {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Objective:</strong> Based on your analysis, what should Kirkland's do?
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Your Recommendation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Primary Recommendation</Label>
            <Input
              placeholder="e.g., Strategic Sale, Chapter 11, Out-of-Court A&E..."
              value={data.primary || ''}
              onChange={(e) => onUpdate({ ...data, primary: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Rationale</Label>
            <Textarea
              placeholder="Explain your reasoning based on liquidity, capital structure, and market conditions..."
              value={data.rationale || ''}
              onChange={(e) => onUpdate({ ...data, rationale: e.target.value })}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label>Alternative Options (Backup Plans)</Label>
            <Textarea
              placeholder="What are the backup options if your primary recommendation fails?"
              value={data.alternatives || ''}
              onChange={(e) => onUpdate({ ...data, alternatives: e.target.value })}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {showExpert && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Zac's Recommendation & Outcome
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-emerald-600">Primary Recommendation</Label>
              <p className="text-sm mt-1">{expertAnalysis.recommendation.primary}</p>
            </div>

            <div>
              <Label className="text-emerald-600">Rationale</Label>
              <p className="text-sm mt-1">{expertAnalysis.recommendation.rationale}</p>
            </div>

            <div>
              <Label className="text-emerald-600">Alternative Options</Label>
              <ul className="text-sm mt-1 space-y-1">
                {expertAnalysis.recommendation.alternatives.map((alt, i) => (
                  <li key={i}>• {alt}</li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t">
              <Badge className="bg-emerald-500 mb-2">Actual Outcome</Badge>
              <p className="text-sm font-medium">{expertAnalysis.recommendation.outcome}</p>
              <p className="text-xs text-muted-foreground mt-2 italic">
                "This validates the analysis: with urgent liquidity needs and an insolvent capital structure,
                a strategic buyer was the optimal outcome. The timing (10 weeks after analysis) confirms
                the company had minimal runway to explore alternatives."
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Export the case study configuration
export const kirklandsCaseStudy: CaseStudyStep[] = [
  {
    id: 'background',
    title: 'Background',
    subtitle: 'Company overview and situation',
    icon: stepIcons.background,
    component: BackgroundStep
  },
  {
    id: 'liquidity',
    title: 'Liquidity Analysis',
    subtitle: 'Calculate runway and urgency',
    icon: stepIcons.liquidity,
    component: KirklandsLiquidityStep
  },
  {
    id: 'capital-structure',
    title: 'Capital Structure',
    subtitle: 'Map the debt stack',
    icon: stepIcons.capitalStructure,
    component: KirklandsCapStructureStep
  },
  {
    id: 'technique-suggester',
    title: 'Restructuring Options',
    subtitle: 'Explore recommended techniques',
    icon: stepIcons.solutions,
    component: KirklandsTechniqueSuggester
  },
  {
    id: 'memo-generator',
    title: 'Investment Memo',
    subtitle: 'Generate structured analysis',
    icon: stepIcons.review,
    component: KirklandsMemoGenerator
  }
];
