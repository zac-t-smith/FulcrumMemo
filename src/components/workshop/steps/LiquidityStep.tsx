import { useState } from 'react';
import { StepProps } from '../InteractiveCaseStudy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { J } from '../JargonTooltip';
import { generateLiquidityAnalysis, isGeminiAvailable } from '@/services/geminiService';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Calculator,
  TrendingDown,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface ExpertLiquidity {
  cash: number;
  revolver: number;
  revolverDrawn: number;
  lettersOfCredit: number;
  restrictedCash: number;
  weeklyBurn: number;
  runway: number;
  category: string;
}

interface LiquidityStepProps extends StepProps {
  expertData?: ExpertLiquidity;
}

export const LiquidityStep = ({ data = {}, onUpdate, showExpert, expertData }: LiquidityStepProps) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // User inputs
  const cash = parseFloat(data.cash) || 0;
  const revolver = parseFloat(data.revolver) || 0;
  const revolverDrawn = parseFloat(data.revolverDrawn) || 0;
  const lettersOfCredit = parseFloat(data.lettersOfCredit) || 0;
  const restrictedCash = parseFloat(data.restrictedCash) || 0;
  const weeklyBurn = parseFloat(data.weeklyBurn) || 0;

  // Calculate runway using proper formula
  const revolverAvailable = Math.max(0, revolver - revolverDrawn - lettersOfCredit);
  const unrestricted = Math.max(0, cash - restrictedCash);
  const availableLiquidity = unrestricted + revolverAvailable;
  const runway = weeklyBurn > 0 ? availableLiquidity / weeklyBurn : 0;
  const runwayCategory = runway < 13 ? 'urgent' : runway < 26 ? 'manageable' : 'strategic';

  // Calculate expert runway if data provided
  const expertRunway = expertData ? (
    (expertData.cash - expertData.restrictedCash) +
    (expertData.revolver - expertData.revolverDrawn - expertData.lettersOfCredit)
  ) / expertData.weeklyBurn : 0;

  // Validation
  const hasUserData = cash > 0 && revolver > 0 && weeklyBurn > 0;
  const matchesExpert = hasUserData && expertData && Math.abs(runway - expertRunway) < 0.5;
  const runwayDifference = hasUserData && expertData ? ((runway - expertRunway) / expertRunway * 100) : 0;

  // AI Analysis Generation
  const handleGenerateAIAnalysis = async () => {
    if (!hasUserData) return;

    setIsGeneratingAI(true);
    try {
      const analysis = await generateLiquidityAnalysis({
        companyName: data.companyName || 'Target Company',
        ticker: data.ticker || 'XXX',
        cash,
        revolver,
        revolverDrawn,
        weeklyBurn,
        runway
      });
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('AI generation error:', error);
      setAiAnalysis('Failed to generate AI analysis. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Objective:</strong> Calculate available <J termId="liquidity">liquidity</J> and <J termId="runway">runway</J> using the proper RX formula.
          A company with less than 13 weeks of runway is in urgent <J termId="distressed">distress</J> and has limited negotiating leverage.
        </AlertDescription>
      </Alert>

      {/* Formula Display */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Calculator className="h-4 w-4 text-primary" />
            The Formula (Standard RX Approach)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm font-mono">
          <div className="p-3 bg-background rounded-lg">
            <div className="text-muted-foreground mb-2">Step 1: Calculate Unrestricted Cash</div>
            <div className="text-foreground">
              Unrestricted Cash = Total Cash - Restricted Cash
            </div>
            {hasUserData && (
              <div className="text-xs text-primary mt-1">
                = ${cash.toLocaleString()}K - ${restrictedCash.toLocaleString()}K = ${unrestricted.toLocaleString()}K
              </div>
            )}
          </div>

          <div className="p-3 bg-background rounded-lg">
            <div className="text-muted-foreground mb-2">Step 2: Calculate Available Revolver</div>
            <div className="text-foreground">
              Available = Capacity - Drawn - Letters of Credit
            </div>
            {hasUserData && (
              <div className="text-xs text-primary mt-1">
                = ${revolver.toLocaleString()}K - ${revolverDrawn.toLocaleString()}K - ${lettersOfCredit.toLocaleString()}K = ${revolverAvailable.toLocaleString()}K
              </div>
            )}
          </div>

          <div className="p-3 bg-background rounded-lg">
            <div className="text-muted-foreground mb-2">Step 3: Total Available Liquidity</div>
            <div className="text-foreground">
              Total Liquidity = Unrestricted Cash + Available Revolver
            </div>
            {hasUserData && (
              <div className="text-xs text-primary mt-1">
                = ${unrestricted.toLocaleString()}K + ${revolverAvailable.toLocaleString()}K = ${availableLiquidity.toLocaleString()}K
              </div>
            )}
          </div>

          <div className="p-3 bg-background rounded-lg">
            <div className="text-muted-foreground mb-2">Step 4: Calculate Runway</div>
            <div className="text-foreground">
              Runway (weeks) = Total Liquidity ÷ Weekly Burn Rate
            </div>
            {hasUserData && (
              <div className="text-xs text-primary mt-1">
                = ${availableLiquidity.toLocaleString()}K ÷ ${weeklyBurn.toLocaleString()}K = {runway.toFixed(1)} weeks
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Total Cash on Balance Sheet ($K)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 5200"
                  value={data.cash || ''}
                  onChange={(e) => onUpdate({ ...data, cash: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Where to find: 10-Q → Balance Sheet → "Cash and cash equivalents"
                </p>
              </div>

              <div className="space-y-2">
                <Label><J termId="restricted-cash">Restricted Cash</J> ($K)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 0"
                  value={data.restrictedCash || ''}
                  onChange={(e) => onUpdate({ ...data, restrictedCash: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Where to find: 10-Q → Balance Sheet (separate line item) or Cash Flow Statement note
                </p>
              </div>

              <div className="space-y-2">
                <Label><J termId="revolver">Revolver</J> Capacity ($K)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 8000"
                  value={data.revolver || ''}
                  onChange={(e) => onUpdate({ ...data, revolver: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Where to find: Credit Agreement or 10-K → Note on Long-Term Debt → "<J termId="abl">ABL</J> Facility"
                </p>
              </div>

              <div className="space-y-2">
                <Label><J termId="revolver">Revolver</J> Currently Drawn ($K)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 7500"
                  value={data.revolverDrawn || ''}
                  onChange={(e) => onUpdate({ ...data, revolverDrawn: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Where to find: 10-Q → Balance Sheet → "Revolving credit facility" or Debt note
                </p>
              </div>

              <div className="space-y-2">
                <Label><J termId="lc">Letters of Credit</J> Outstanding ($K)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 0"
                  value={data.lettersOfCredit || ''}
                  onChange={(e) => onUpdate({ ...data, lettersOfCredit: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Where to find: 10-K → Debt note → "Outstanding letters of credit reduce availability"
                </p>
              </div>

              <div className="space-y-2">
                <Label>Weekly <J termId="cash-burn">Cash Burn</J> ($K)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 400"
                  value={data.weeklyBurn || ''}
                  onChange={(e) => onUpdate({ ...data, weeklyBurn: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Calculate: (Operating Cash Flow / 52) from Statement of Cash Flows. Use most recent quarter annualized.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {/* Validation */}
          {hasUserData && expertData && (
            <Card className={matchesExpert ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-amber-500/50 bg-amber-500/5'}>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  {matchesExpert ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                  Validation Check
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                {matchesExpert ? (
                  <div className="text-emerald-600">
                    ✓ Your calculation matches expert analysis!
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground">Your Runway</div>
                        <div className="font-bold">{runway.toFixed(1)} weeks</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Expert Runway</div>
                        <div className="font-bold">{expertRunway.toFixed(1)} weeks</div>
                      </div>
                    </div>
                    <div className="text-amber-600">
                      Difference: {Math.abs(runwayDifference).toFixed(1)}%
                      {Math.abs(runwayDifference) > 10 && ' - Double check your inputs'}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Calculated Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Available Liquidity</div>
                <div className="text-2xl font-bold">
                  ${availableLiquidity.toLocaleString()}K
                </div>
                <div className="text-xs text-muted-foreground mt-2 space-y-0.5">
                  <div>Unrestricted Cash: ${unrestricted.toLocaleString()}K</div>
                  <div>Available Revolver: ${revolverAvailable.toLocaleString()}K</div>
                </div>
              </div>

              {hasUserData && (
                <div className={`
                  p-4 rounded-lg border-2
                  ${runwayCategory === 'urgent' ? 'border-red-500 bg-red-500/10' :
                    runwayCategory === 'manageable' ? 'border-yellow-500 bg-yellow-500/10' :
                    'border-green-500 bg-green-500/10'}
                `}>
                  <div className="flex items-center gap-2 mb-2">
                    {runwayCategory === 'urgent' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                    {runwayCategory === 'manageable' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                    {runwayCategory === 'strategic' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    <div className="text-sm font-semibold">
                      {runwayCategory === 'urgent' && 'URGENT - Fire Drill Mode'}
                      {runwayCategory === 'manageable' && 'MANAGEABLE - Time to Negotiate'}
                      {runwayCategory === 'strategic' && 'STRATEGIC - Multiple Options'}
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-2">
                    {runway.toFixed(1)} weeks
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {runwayCategory === 'urgent' && '< 13 weeks = Limited leverage, need immediate action'}
                    {runwayCategory === 'manageable' && '13-26 weeks = Sweet spot for out-of-court restructuring'}
                    {runwayCategory === 'strategic' && '> 26 weeks = Can optimize solution, avoid fire sale'}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Your Assessment</Label>
                <Textarea
                  placeholder="What does this liquidity situation mean for Kirkland? What's your recommendation on urgency and next steps?"
                  value={data.assessment || ''}
                  onChange={(e) => onUpdate({ ...data, assessment: e.target.value })}
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Expert Analysis */}
          {isGeminiAvailable() && hasUserData && (
            <Card className="border-purple-500/30 bg-purple-500/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  AI Expert Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!aiAnalysis ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Generate an AI-powered liquidity analysis from a senior restructuring analyst's perspective.
                    </p>
                    <Button
                      onClick={handleGenerateAIAnalysis}
                      disabled={isGeneratingAI || !hasUserData}
                      className="w-full"
                      variant="default"
                    >
                      {isGeneratingAI ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating Expert Analysis...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Expert Analysis
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-background rounded-lg text-sm whitespace-pre-wrap">
                      {aiAnalysis}
                    </div>
                    <Button
                      onClick={handleGenerateAIAnalysis}
                      disabled={isGeneratingAI}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      {isGeneratingAI ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Regenerate Analysis
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Expert Comparison */}
          {showExpert && expertData && (
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Expert Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <strong>Total Cash:</strong> ${expertData.cash.toLocaleString()}K
                  </div>
                  <div>
                    <strong>Restricted:</strong> ${expertData.restrictedCash.toLocaleString()}K
                  </div>
                  <div>
                    <strong>Revolver Cap:</strong> ${expertData.revolver.toLocaleString()}K
                  </div>
                  <div>
                    <strong>Drawn:</strong> ${expertData.revolverDrawn.toLocaleString()}K
                  </div>
                  <div>
                    <strong>Letters of Credit:</strong> ${expertData.lettersOfCredit.toLocaleString()}K
                  </div>
                  <div>
                    <strong>Weekly Burn:</strong> ${expertData.weeklyBurn.toLocaleString()}K
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="font-semibold mb-1">Calculated Runway: {expertData.runway} weeks</div>
                  <Badge variant="destructive" className="mb-2">
                    {expertData.category.toUpperCase()}
                  </Badge>
                </div>

                <div className="p-3 bg-background rounded-lg">
                  <p className="text-xs italic">
                    "With less than 13 weeks of runway, Kirkland's has minimal negotiating leverage.
                    The revolver is 94% drawn (${expertData.revolverDrawn}K / ${expertData.revolver}K), leaving only
                    ${(expertData.revolver - expertData.revolverDrawn - expertData.lettersOfCredit).toLocaleString()}K available.
                    This points to either a quick strategic sale or Chapter 11 filing. Out-of-court
                    restructuring is unlikely given the urgency."
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
