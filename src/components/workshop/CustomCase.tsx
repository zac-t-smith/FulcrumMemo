import { CaseStudyStep, StepProps, stepIcons } from './InteractiveCaseStudy';
import { LiquidityStep } from './steps/LiquidityStep';
import { CapitalStructureStep } from './steps/CapitalStructureStep';
import { TechniqueSuggester } from './steps/TechniqueSuggester';
import { MemoGenerator } from './steps/MemoGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Info, Building2, TrendingDown, TrendingUp } from 'lucide-react';
import type { CompanyData } from '@/services/financialDataService';

// Background Step for Custom Case
const CustomBackgroundStep = ({ data, onUpdate, companyData }: StepProps & { companyData?: CompanyData }) => {
  if (!companyData) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          No company data available. Please select a company from the ticker search.
        </AlertDescription>
      </Alert>
    );
  }

  const distressLevel = companyData.distressScore || 0;
  const distressColor = distressLevel >= 75 ? 'text-red-600' : distressLevel >= 50 ? 'text-amber-600' : 'text-green-600';

  return (
    <div className="space-y-6">
      <div className="prose prose-sm max-w-none">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="mb-0">{companyData.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{companyData.ticker}</Badge>
                <Badge variant="secondary">{companyData.industry}</Badge>
                <Badge variant={companyData.isDistressed ? 'destructive' : 'secondary'}>
                  {companyData.isDistressed ? 'Distressed' : 'Healthy'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {companyData.description && (
          <div className="p-4 bg-muted/30 rounded-lg mb-4">
            <p className="text-sm text-muted-foreground italic mb-0">{companyData.description}</p>
          </div>
        )}

        <h3>Company Overview</h3>
        <div className="grid md:grid-cols-2 gap-4 not-prose">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Sector & Industry</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{companyData.sector}</p>
              <p className="text-sm text-muted-foreground">{companyData.industry}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Market Position</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">Market Cap: ${(companyData.marketCap / 1000).toFixed(1)}M</p>
              <p className="text-sm text-muted-foreground">Share Price: ${companyData.price.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Financial Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Revenue: ${(companyData.revenue / 1000).toFixed(1)}M</p>
              <p className="text-sm">EBITDA: ${(companyData.ebitda / 1000).toFixed(1)}M</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Debt Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Total Debt: ${(companyData.totalDebt / 1000).toFixed(1)}M</p>
              <p className="text-sm">Cash: ${(companyData.cash / 1000).toFixed(1)}M</p>
            </CardContent>
          </Card>
        </div>

        <h3 className="mt-6">Distress Assessment</h3>
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Distress Score</span>
            <span className={`text-2xl font-bold ${distressColor}`}>{distressLevel}/100</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                distressLevel >= 75 ? 'bg-red-500' : distressLevel >= 50 ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${distressLevel}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
            <div>
              <span className="text-muted-foreground">Debt/Equity:</span>{' '}
              <span className="font-medium">{companyData.debtToEquity.toFixed(2)}x</span>
            </div>
            <div>
              <span className="text-muted-foreground">Current Ratio:</span>{' '}
              <span className="font-medium">{companyData.currentRatio.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <h3 className="mt-6">Your Task</h3>
        <p className="text-muted-foreground">
          Analyze {companyData.name}'s financial situation and develop a restructuring recommendation. You'll work through:
        </p>
        <ol className="text-muted-foreground">
          <li>Liquidity analysis - Calculate runway and assess urgency</li>
          <li>Capital structure - Build the debt stack and recovery waterfall</li>
          <li>Restructuring options - Evaluate techniques based on the situation</li>
          <li>Investment memo - Generate your comprehensive analysis</li>
        </ol>
      </div>

      <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        <span className="text-sm">Ready to begin analysis. Click "Next Step" to start with liquidity.</span>
      </div>
    </div>
  );
};

// Create custom case study from company data
export const createCustomCaseStudy = (companyData: CompanyData): CaseStudyStep[] => {
  // Wrapper for Background Step
  const BackgroundStepWrapper = (props: StepProps) => (
    <CustomBackgroundStep {...props} companyData={companyData} />
  );

  // Wrapper for Liquidity Step
  const CustomLiquidityStep = (props: StepProps) => {
    // Enrich data with company info for AI generation
    const enrichedData = {
      ...props.data,
      companyName: companyData.name,
      ticker: companyData.ticker,
      sector: companyData.sector,
      industry: companyData.industry
    };
    return <LiquidityStep {...props} data={enrichedData} />;
  };

  // Wrapper for Capital Structure Step
  const CustomCapStructureStep = (props: StepProps) => {
    // Enrich data with company info for AI generation
    const enrichedData = {
      ...props.data,
      companyName: companyData.name,
      ticker: companyData.ticker,
      sector: companyData.sector,
      industry: companyData.industry
    };
    return <CapitalStructureStep {...props} data={enrichedData} />;
  };

  // Wrapper for Technique Suggester
  const CustomTechniqueSuggester = (props: StepProps) => {
    const combinedData = {
      liquidity: props.data?.liquidity || {},
      capitalStructure: props.data?.capitalStructure || {}
    };
    return <TechniqueSuggester {...props} data={combinedData} />;
  };

  // Wrapper for Memo Generator
  const CustomMemoGenerator = (props: StepProps) => {
    // Enrich data with company info for AI generation
    const enrichedData = {
      ...props.data,
      sector: companyData.sector,
      industry: companyData.industry,
      marketCap: companyData.marketCap,
      revenue: companyData.revenue,
      ebitda: companyData.ebitda
    };
    return (
      <MemoGenerator
        {...props}
        data={enrichedData}
        companyName={companyData.name}
        ticker={companyData.ticker}
      />
    );
  };

  return [
    {
      id: 'background',
      title: 'Background',
      subtitle: 'Company overview and situation',
      icon: stepIcons.background,
      component: BackgroundStepWrapper
    },
    {
      id: 'liquidity',
      title: 'Liquidity Analysis',
      subtitle: 'Calculate runway and urgency',
      icon: stepIcons.liquidity,
      component: CustomLiquidityStep
    },
    {
      id: 'capital-structure',
      title: 'Capital Structure',
      subtitle: 'Map the debt stack',
      icon: stepIcons.capitalStructure,
      component: CustomCapStructureStep
    },
    {
      id: 'technique-suggester',
      title: 'Restructuring Options',
      subtitle: 'Explore recommended techniques',
      icon: stepIcons.solutions,
      component: CustomTechniqueSuggester
    },
    {
      id: 'memo-generator',
      title: 'Investment Memo',
      subtitle: 'Generate structured analysis',
      icon: stepIcons.review,
      component: CustomMemoGenerator
    }
  ];
};
