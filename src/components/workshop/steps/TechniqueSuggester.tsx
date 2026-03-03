import { StepProps } from '../InteractiveCaseStudy';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import {
  Lightbulb,
  TrendingUp,
  Gavel,
  HandshakeIcon,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

interface Technique {
  id: string;
  name: string;
  category: 'out-of-court' | 'in-court' | 'hybrid';
  icon: React.ReactNode;
  timeline: string;
  cost: string;
  description: string;
  whenToUse: string[];
  whenNotToUse: string[];
  proForma?: string;
  comparables?: string[];
  learnMoreLink?: string;
}

interface AnalysisContext {
  runway?: number;
  runwayCategory?: string;
  leverage?: number;
  solvency?: string;
  totalDebt?: number;
  enterpriseValue?: number;
}

const techniques: Technique[] = [
  {
    id: 'strategic-sale',
    name: 'Strategic Sale / M&A',
    category: 'out-of-court',
    icon: <TrendingUp className="h-5 w-5" />,
    timeline: '8-16 weeks',
    cost: 'Low-Medium',
    description: 'Sell company to strategic buyer or financial sponsor. Fastest path to liquidity when runway is short.',
    whenToUse: [
      'Runway < 13 weeks (urgent liquidity crisis)',
      'Insolvent capital structure (Debt > EV)',
      'Strategic buyers interested in assets/market position',
      'Want to avoid bankruptcy stigma',
      'Management/Board prefers quick exit'
    ],
    whenNotToUse: [
      'Company is operationally viable with time',
      'Better recovery in reorganization',
      'No willing buyers at acceptable valuation',
      'Equity holders want to preserve value'
    ],
    proForma: 'Sale proceeds pay off secured debt. Unsecured/equity typically get zero in fire sale.',
    comparables: ['Kirkland\'s → ODP Corp', 'Bed Bath & Beyond → various buyers'],
    learnMoreLink: '/learn'
  },
  {
    id: 'amend-extend',
    name: 'Amend & Extend (A&E)',
    category: 'out-of-court',
    icon: <HandshakeIcon className="h-5 w-5" />,
    timeline: '6-8 weeks',
    cost: 'Low',
    description: 'Negotiate with lenders to extend maturity and/or relax covenants. Buys time without new financing.',
    whenToUse: [
      'Runway 13-26 weeks (manageable situation)',
      'Fundamentals are sound, just need time',
      'Maturity wall approaching',
      'Relationship lenders willing to work with you',
      'Want to avoid bankruptcy costs'
    ],
    whenNotToUse: [
      'Runway < 13 weeks (not enough time)',
      'Fundamentally broken business model',
      'Lenders have lost confidence',
      'Need significant deleveraging (>30%)'
    ],
    proForma: 'Extend maturity 12-24 months. Pay 1-2% consent fee. Rate increase +50-100 bps.',
    comparables: ['Many PE-backed companies 2020-2021'],
    learnMoreLink: '/learn'
  },
  {
    id: 'debt-for-equity',
    name: 'Debt-for-Equity Swap',
    category: 'out-of-court',
    icon: <TrendingUp className="h-5 w-5" />,
    timeline: '3-4 months',
    cost: 'Medium',
    description: 'Creditors exchange debt for equity ownership. Immediate deleveraging but dilutes/wipes out existing equity.',
    whenToUse: [
      'Overleveraged (6x+ total, 4x+ secured)',
      'Operationally viable but capital structure unsustainable',
      'Creditors want upside participation',
      'Debt trading at significant discount (40-60¢)',
      'Want to avoid Chapter 11'
    ],
    whenNotToUse: [
      'Runway < 13 weeks (not enough time)',
      'Creditors unwilling to take equity risk',
      'Tax considerations prohibitive',
      'Multiple creditor classes with conflicts'
    ],
    proForma: 'Exchange $100M debt @ 50¢ for 80% equity. Delever from 8x to 4x. Old equity diluted to 20%.',
    comparables: ['iHeartMedia', 'Neiman Marcus (pre-bankruptcy)'],
    learnMoreLink: '/learn'
  },
  {
    id: 'prepack-ch11',
    name: 'Pre-Packaged Chapter 11',
    category: 'hybrid',
    icon: <Gavel className="h-5 w-5" />,
    timeline: '30-90 days',
    cost: 'Medium',
    description: 'Negotiate and vote on restructuring plan BEFORE filing Chapter 11. Combines speed with cramdown power.',
    whenToUse: [
      'Major creditors (66%+) aligned on restructuring',
      'Need cramdown of minority holdouts',
      'Complex capital structure',
      'Want speed + court blessing',
      'Runway 13-26 weeks'
    ],
    whenNotToUse: [
      'Creditors not aligned (<66% support)',
      'Can accomplish out-of-court',
      'Runway < 13 weeks (may not have time)',
      'Stigma concerns override benefits'
    ],
    proForma: 'RSA with 66%+ of each impaired class. File with approved plan. Emerge in 30-90 days.',
    comparables: ['J.Crew', 'Hertz', 'Neiman Marcus'],
    learnMoreLink: '/learn'
  },
  {
    id: 'freefall-ch11',
    name: 'Chapter 11 Reorganization',
    category: 'in-court',
    icon: <Gavel className="h-5 w-5" />,
    timeline: '12-24 months',
    cost: 'High',
    description: 'Court-supervised restructuring. Automatic stay, DIP financing, contract rejection, cramdown provisions.',
    whenToUse: [
      'Need breathing room from creditors',
      'Require contract/lease rejections',
      'DIP financing needed',
      'Creditors not aligned (need cramdown)',
      'Time to reorganize business'
    ],
    whenNotToUse: [
      'Can accomplish out-of-court',
      'No DIP financing available',
      'Asset value < liquidation value',
      'Stigma will destroy business'
    ],
    proForma: 'File, obtain DIP financing, reject unprofitable contracts, file plan, cramdown dissenters, emerge.',
    comparables: ['Party City', 'Serta Simmons', 'Bed Bath & Beyond'],
    learnMoreLink: '/learn'
  },
  {
    id: 'section-363',
    name: 'Section 363 Sale',
    category: 'in-court',
    icon: <Gavel className="h-5 w-5" />,
    timeline: '30-60 days',
    cost: 'Medium',
    description: 'Quick asset sale during Chapter 11. Buyer gets assets free and clear of liens with court blessing.',
    whenToUse: [
      'Melting ice cube (assets deteriorating)',
      'Stalking horse bidder in hand',
      'Want competitive auction',
      'Cleaner than out-of-court sale',
      'Buyer needs court protection'
    ],
    whenNotToUse: [
      'Can sell out-of-court',
      'Going concern value > liquidation value',
      'No credible bidders',
      'Want to preserve going concern'
    ],
    proForma: 'Stalking horse bid → auction → sale approval → closing. Proceeds to creditors per priority.',
    comparables: ['Toys R Us', 'Sports Authority'],
    learnMoreLink: '/learn'
  }
];

const getSuggestedTechniques = (context: AnalysisContext): Technique[] => {
  const { runway = 0, leverage = 0, solvency = 'unknown', totalDebt = 0, enterpriseValue = 0 } = context;

  const suggested: Technique[] = [];

  // Urgent liquidity crisis (< 13 weeks)
  if (runway < 13) {
    suggested.push(
      techniques.find(t => t.id === 'strategic-sale')!,
      techniques.find(t => t.id === 'section-363')!,
      techniques.find(t => t.id === 'freefall-ch11')!
    );
  }
  // Manageable (13-26 weeks)
  else if (runway < 26) {
    if (leverage > 6 || solvency === 'insolvent') {
      suggested.push(
        techniques.find(t => t.id === 'debt-for-equity')!,
        techniques.find(t => t.id === 'prepack-ch11')!,
        techniques.find(t => t.id === 'strategic-sale')!
      );
    } else {
      suggested.push(
        techniques.find(t => t.id === 'amend-extend')!,
        techniques.find(t => t.id === 'debt-for-equity')!,
        techniques.find(t => t.id === 'prepack-ch11')!
      );
    }
  }
  // Strategic time (> 26 weeks)
  else {
    suggested.push(
      techniques.find(t => t.id === 'amend-extend')!,
      techniques.find(t => t.id === 'debt-for-equity')!,
      techniques.find(t => t.id === 'strategic-sale')!
    );
  }

  return suggested.filter(Boolean);
};

export const TechniqueSuggester = ({ data = {} }: StepProps) => {
  // Extract analysis context from previous steps
  const liquidityData = data.liquidity || {};
  const capStructureData = data.capitalStructure || {};

  const cash = parseFloat(liquidityData.cash) || 0;
  const revolver = parseFloat(liquidityData.revolver) || 0;
  const revolverDrawn = parseFloat(liquidityData.revolverDrawn) || 0;
  const lettersOfCredit = parseFloat(liquidityData.lettersOfCredit) || 0;
  const restrictedCash = parseFloat(liquidityData.restrictedCash) || 0;
  const weeklyBurn = parseFloat(liquidityData.weeklyBurn) || 0;

  const revolverAvailable = Math.max(0, revolver - revolverDrawn - lettersOfCredit);
  const unrestricted = Math.max(0, cash - restrictedCash);
  const availableLiquidity = unrestricted + revolverAvailable;
  const runway = weeklyBurn > 0 ? availableLiquidity / weeklyBurn : 0;
  const runwayCategory = runway < 13 ? 'urgent' : runway < 26 ? 'manageable' : 'strategic';

  const tranches = capStructureData.tranches || [];
  const totalDebt = tranches.reduce((sum: number, t: any) => sum + (parseFloat(t.parValue) || 0), 0);
  const ltmEbitda = parseFloat(capStructureData.ltmEbitda) || 0;
  const enterpriseValue = parseFloat(capStructureData.enterpriseValue) || 0;
  const leverage = ltmEbitda > 0 ? totalDebt / ltmEbitda : 0;
  const solvency = enterpriseValue > 0 && totalDebt > enterpriseValue ? 'insolvent' : 'solvent';

  const context: AnalysisContext = {
    runway,
    runwayCategory,
    leverage,
    solvency,
    totalDebt,
    enterpriseValue
  };

  const suggestedTechniques = getSuggestedTechniques(context);

  const hasAnalysisData = runway > 0 && totalDebt > 0;

  return (
    <div className="space-y-6">
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>Objective:</strong> Based on your liquidity and capital structure analysis,
          here are recommended restructuring techniques to consider. Each links to detailed RX learning content.
        </AlertDescription>
      </Alert>

      {/* Analysis Summary */}
      {hasAnalysisData ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Your Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-background rounded-lg">
                <div className="text-muted-foreground mb-1">Runway</div>
                <div className="text-2xl font-bold">{runway.toFixed(1)} weeks</div>
                <Badge
                  variant={runwayCategory === 'urgent' ? 'destructive' : runwayCategory === 'manageable' ? 'secondary' : 'default'}
                  className="mt-1"
                >
                  {runwayCategory.toUpperCase()}
                </Badge>
              </div>

              {leverage > 0 && (
                <div className="p-3 bg-background rounded-lg">
                  <div className="text-muted-foreground mb-1">Leverage</div>
                  <div className="text-2xl font-bold">{leverage.toFixed(1)}x</div>
                  <Badge
                    variant={leverage > 6 ? 'destructive' : leverage > 4 ? 'secondary' : 'default'}
                    className="mt-1"
                  >
                    {leverage > 6 ? 'HIGH' : leverage > 4 ? 'ELEVATED' : 'MODERATE'}
                  </Badge>
                </div>
              )}

              {enterpriseValue > 0 && (
                <div className="p-3 bg-background rounded-lg">
                  <div className="text-muted-foreground mb-1">Solvency</div>
                  <div className="text-lg font-bold">
                    ${enterpriseValue.toLocaleString()}K EV
                  </div>
                  <Badge
                    variant={solvency === 'insolvent' ? 'destructive' : 'default'}
                    className="mt-1"
                  >
                    {solvency.toUpperCase()}
                  </Badge>
                </div>
              )}

              <div className="p-3 bg-background rounded-lg">
                <div className="text-muted-foreground mb-1">Total Debt</div>
                <div className="text-lg font-bold">${totalDebt.toLocaleString()}K</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {tranches.length} tranche{tranches.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Complete Previous Steps First
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            To get technique recommendations, complete the Liquidity Analysis and Capital Structure steps first.
            The suggester needs runway, leverage, and solvency data to provide accurate recommendations.
          </CardContent>
        </Card>
      )}

      {/* Recommended Techniques */}
      {hasAnalysisData && suggestedTechniques.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Recommended Techniques</h3>
            <Badge className="bg-primary">
              {suggestedTechniques.length} options
            </Badge>
          </div>

          <div className="grid md:grid-cols-1 gap-4">
            {suggestedTechniques.map((technique, index) => (
              <Card
                key={technique.id}
                className={`hover:border-primary/50 transition-all ${index === 0 ? 'border-primary/30 bg-primary/5' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {index === 0 && (
                        <div className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-semibold">
                          RECOMMENDED
                        </div>
                      )}
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {technique.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{technique.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {technique.category === 'out-of-court' && 'Out-of-Court'}
                            {technique.category === 'in-court' && 'In-Court'}
                            {technique.category === 'hybrid' && 'Hybrid'}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {technique.timeline}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {technique.cost} cost
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{technique.description}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        When to Use
                      </h4>
                      <ul className="space-y-1">
                        {technique.whenToUse.slice(0, 3).map((item, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                            <span className="text-emerald-500 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        When NOT to Use
                      </h4>
                      <ul className="space-y-1">
                        {technique.whenNotToUse.slice(0, 3).map((item, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {technique.proForma && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <h4 className="text-sm font-semibold mb-1">Pro Forma Structure</h4>
                      <p className="text-xs text-muted-foreground">{technique.proForma}</p>
                    </div>
                  )}

                  {technique.comparables && technique.comparables.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Comparable Transactions</h4>
                      <div className="flex flex-wrap gap-2">
                        {technique.comparables.map((comp, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Link to={technique.learnMoreLink || '/learn'}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3 mr-2" />
                        Learn More in RX Training
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost">
                      Use This Template
                      <ArrowRight className="h-3 w-3 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Techniques Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Available Techniques</CardTitle>
          <CardDescription>
            Not seeing what you need? Explore all restructuring techniques in the RX Learning Center.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/learn">
            <Button className="w-full">
              <Lightbulb className="h-4 w-4 mr-2" />
              Browse All RX Techniques
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
