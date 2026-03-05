import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, TrendingDown, Building2, Store, Sparkles, Target, CheckCircle2, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InteractiveCaseStudy } from '@/components/workshop/InteractiveCaseStudy';
import { TickerSearch } from '@/components/workshop/TickerSearch';
import { kirklandsCaseStudy } from '@/components/workshop/KirklandsCase';
import { createCustomCaseStudy } from '@/components/workshop/CustomCase';
import type { CompanyData } from '@/services/financialDataService';

interface CaseStudy {
  id: string;
  company: string;
  ticker: string;
  industry: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  icon: React.ReactNode;
  description: string;
  keyLearnings: string[];
  situation: string;
  completed?: boolean;
}

const caseStudies: CaseStudy[] = [
  {
    id: 'kirklands',
    company: "Kirkland's Home Decor",
    ticker: 'KIRK',
    industry: 'Retail',
    difficulty: 'Intermediate',
    duration: '45-60 min',
    icon: <Store className="h-6 w-6" />,
    description: 'Retail distress case with declining margins and covenant pressures. Learn to identify liquidity crises and predict outcomes.',
    keyLearnings: [
      'Liquidity runway analysis',
      'Retail-specific metrics',
      'Covenant breach prediction',
      'M&A as restructuring alternative',
      'Timing market movements'
    ],
    situation: 'Home decor retailer facing margin compression, declining sales, and potential covenant breaches. Zac predicted 50-75% downside and a merger 10 weeks before announcement.'
  },
  {
    id: 'lycra',
    company: 'LYCRA Company',
    ticker: 'LYCRA',
    industry: 'Chemicals/Materials',
    difficulty: 'Advanced',
    duration: '60-75 min',
    icon: <Building2 className="h-6 w-6" />,
    description: 'Complex capital structure with multiple debt tranches. Master waterfall analysis and fulcrum security identification.',
    keyLearnings: [
      'Multi-tranche capital structure',
      'Recovery waterfall modeling',
      'Fulcrum security identification',
      'Chemical industry dynamics',
      'PE sponsor incentives'
    ],
    situation: 'PE-backed specialty chemicals company with leveraged capital structure. Practice building complex recovery analyses.'
  },
  {
    id: 'party-city',
    company: 'Party City',
    ticker: 'PRTY',
    industry: 'Retail',
    difficulty: 'Beginner',
    duration: '30-45 min',
    icon: <Sparkles className="h-6 w-6" />,
    description: 'Classic retail bankruptcy case. Perfect for learning Chapter 11 process and first-day motions.',
    keyLearnings: [
      'Chapter 11 filing process',
      'DIP financing analysis',
      'Store closure strategy',
      'Lease rejection economics',
      'Timeline to liquidation'
    ],
    situation: 'Party supplies retailer files Chapter 11, eventually converting to Chapter 7. Learn the bankruptcy process from filing to liquidation.'
  }
];

const Workshop = () => {
  const location = useLocation();
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [customCompany, setCustomCompany] = useState<CompanyData | null>(null);

  // Check for custom company data from ticker search
  useEffect(() => {
    const state = location.state as { customCompany?: CompanyData };
    if (state?.customCompany) {
      setCustomCompany(state.customCompany);
      setSelectedCase('custom');
    }
  }, [location]);

  // Custom ticker-based case study
  if (selectedCase === 'custom' && customCompany) {
    const customPageTitle = `${customCompany.name} Analysis | Zac Smith`;
    return (
      <>
        <Helmet>
          <title>{customPageTitle}</title>
        </Helmet>
        <div className="min-h-screen bg-background pb-12">
          <div className="container mx-auto px-6 py-6">
            <Button variant="ghost" onClick={() => {
              setSelectedCase(null);
              setCustomCompany(null);
            }}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Workshop
            </Button>
          </div>
          <InteractiveCaseStudy
            companyName={customCompany.name}
            ticker={customCompany.ticker}
            steps={createCustomCaseStudy(customCompany)}
            onComplete={() => {
              alert('Case study completed! Your analysis has been saved.');
              setSelectedCase(null);
              setCustomCompany(null);
            }}
          />
        </div>
      </>
    );
  }

  if (selectedCase === 'kirklands') {
    return (
      <>
        <Helmet>
          <title>Kirkland's Case Study | Zac Smith</title>
        </Helmet>
        <div className="min-h-screen bg-background pb-12">
          <div className="container mx-auto px-6 py-6">
            <Button variant="ghost" onClick={() => setSelectedCase(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Case Studies
            </Button>
          </div>
          <InteractiveCaseStudy
            companyName="Kirkland's Home Decor"
            ticker="KIRK"
            steps={kirklandsCaseStudy}
            expertMemoUrl="/FulcrumMemo/memos/kirklands"
            onComplete={() => {
              alert('Case study completed! Your analysis has been saved.');
              setSelectedCase(null);
            }}
          />
        </div>
      </>
    );
  }

  if (selectedCase) {
    // Placeholder for other case studies
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <Button variant="ghost" onClick={() => setSelectedCase(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Case Studies
          </Button>
          <div className="mt-8 text-center">
            <h1 className="text-3xl font-bold mb-4">
              {caseStudies.find(c => c.id === selectedCase)?.company}
            </h1>
            <p className="text-muted-foreground mb-6">
              This interactive case study is coming soon. For now, you can view the credit memo.
            </p>
            <Link to={`/memos/${selectedCase === 'lycra' ? 'lycra' : 'party-city'}`}>
              <Button>View Credit Memo</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Case Study Workshop | Zac Smith</title>
        <meta
          name="description"
          content="Practice restructuring analysis with real case studies. Work through Kirkland's, LYCRA, and Party City step-by-step."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Portfolio
                  </Button>
                </Link>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">Case Study Workshop</h1>
                    <p className="text-sm text-muted-foreground">Interactive RX Analysis Practice</p>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary">
                Fulcrum Memo
              </Badge>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8 space-y-8">
          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-2xl border border-border p-8 md:p-12 bg-gradient-to-br from-primary/5 via-background to-background">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
            <div className="relative z-10 max-w-3xl">
              <Badge className="mb-4 bg-primary text-primary-foreground">Hands-On Practice</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Analyze Real Companies
                <span className="text-primary"> Step-by-Step</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Work through actual distressed situations using the same framework I used to write these credit memos.
                Build your analysis, make decisions, then compare to my actual findings.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Step-by-step guided workflow</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Real financial data</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Compare to expert analysis</span>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      1
                    </div>
                    <CardTitle className="text-lg">Select a Case</CardTitle>
                  </div>
                  <CardDescription>
                    Choose from real companies I've analyzed. Each case teaches different aspects of RX work.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      2
                    </div>
                    <CardTitle className="text-lg">Build Your Analysis</CardTitle>
                  </div>
                  <CardDescription>
                    Work through liquidity, cap structure, solvency, and restructuring options. Input your findings at each step.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      3
                    </div>
                    <CardTitle className="text-lg">Compare & Learn</CardTitle>
                  </div>
                  <CardDescription>
                    See how your analysis compares to mine. Learn from differences and understand the reasoning behind key decisions.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* Ticker Search - Build Your Own */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Search Any Company</h3>
                <p className="text-sm text-muted-foreground">Explore distressed companies and build your own analysis</p>
              </div>
            </div>
            <TickerSearch />
          </section>

          {/* Case Studies */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground">Guided Case Studies</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Total Practice Time: ~2.5 hours</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies.map((caseStudy) => (
                <Card
                  key={caseStudy.id}
                  className="group hover:border-primary/50 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedCase(caseStudy.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {caseStudy.icon}
                      </div>
                      {caseStudy.completed && (
                        <Badge className="bg-emerald-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{caseStudy.company}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {caseStudy.ticker}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          caseStudy.difficulty === 'Beginner' ? 'border-emerald-500/30 text-emerald-400' :
                          caseStudy.difficulty === 'Intermediate' ? 'border-amber-500/30 text-amber-400' :
                          'border-red-500/30 text-red-400'
                        }
                      >
                        {caseStudy.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {caseStudy.duration}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">{caseStudy.description}</p>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground italic">{caseStudy.situation}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">What You'll Learn:</h4>
                      <ul className="space-y-1">
                        {caseStudy.keyLearnings.slice(0, 3).map((learning, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                            <TrendingDown className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                            {learning}
                          </li>
                        ))}
                        {caseStudy.keyLearnings.length > 3 && (
                          <li className="text-xs text-muted-foreground">
                            + {caseStudy.keyLearnings.length - 3} more...
                          </li>
                        )}
                      </ul>
                    </div>

                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                      Start Analysis
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Coming Soon */}
          <section className="mt-12">
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Coming Soon
                </CardTitle>
                <CardDescription>
                  More case studies are in development, including:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Neiman Marcus</h4>
                    <p className="text-xs text-muted-foreground">Luxury retail bankruptcy</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Serta Simmons</h4>
                    <p className="text-xs text-muted-foreground">Non-pro rata uptier analysis</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Your Company</h4>
                    <p className="text-xs text-muted-foreground">Build your own case study</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 mt-12">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Case Study Workshop — Practice Real RX Analysis
              </p>
              <div className="flex items-center gap-4">
                <Link to="/learn">
                  <Button variant="ghost" size="sm">
                    Learn RX Fundamentals First
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Workshop;
