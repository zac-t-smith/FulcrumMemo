import { useState } from 'react';
import { StepProps } from '../InteractiveCaseStudy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { generateCapStructureAnalysis, isGeminiAvailable } from '@/services/geminiService';
import {
  Plus,
  Trash2,
  Info,
  AlertTriangle,
  TrendingDown,
  Calendar,
  DollarSign,
  CheckCircle2,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface DebtTranche {
  id: string;
  facility: string;
  parValue: number;
  maturity: string;
  coupon: string;
  security: string;
  tradingPrice: number;
  amortization: string;
}

interface RedFlag {
  type: 'error' | 'warning';
  message: string;
  icon: React.ReactNode;
}

export const CapitalStructureStep = ({ data = {}, onUpdate, showExpert }: StepProps) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const tranches: DebtTranche[] = data.tranches || [];
  const ltmEbitda = parseFloat(data.ltmEbitda) || 0;
  const enterpriseValue = parseFloat(data.enterpriseValue) || 0;

  const addTranche = () => {
    const newTranche: DebtTranche = {
      id: Date.now().toString(),
      facility: '',
      parValue: 0,
      maturity: '',
      coupon: '',
      security: '',
      tradingPrice: 100,
      amortization: 'None'
    };
    onUpdate({ ...data, tranches: [...tranches, newTranche] });
  };

  const removeTranche = (id: string) => {
    onUpdate({ ...data, tranches: tranches.filter(t => t.id !== id) });
  };

  const updateTranche = (id: string, field: string, value: any) => {
    onUpdate({
      ...data,
      tranches: tranches.map(t => t.id === id ? { ...t, [field]: value } : t)
    });
  };

  // Calculations
  const totalDebtPar = tranches.reduce((sum, t) => sum + (t.parValue || 0), 0);
  const totalDebtMarket = tranches.reduce((sum, t) => sum + ((t.parValue || 0) * (t.tradingPrice || 100) / 100), 0);
  const leverageRatio = ltmEbitda > 0 ? totalDebtPar / ltmEbitda : 0;

  // Security priority order
  const priorityOrder: Record<string, number> = {
    '1L': 1,
    '1.5L': 2,
    '2L': 3,
    'Unsecured': 4,
    'Subordinated': 5
  };

  const sortedTranches = [...tranches].sort((a, b) =>
    (priorityOrder[a.security] || 99) - (priorityOrder[b.security] || 99)
  );

  // Red flags
  const redFlags: RedFlag[] = [];

  if (leverageRatio > 6) {
    redFlags.push({
      type: 'error',
      message: `Leverage at ${leverageRatio.toFixed(1)}x (>6x is highly leveraged)`,
      icon: <AlertTriangle className="h-4 w-4" />
    });
  }

  if (enterpriseValue > 0 && totalDebtPar > enterpriseValue) {
    redFlags.push({
      type: 'error',
      message: `Insolvent: Debt ($${totalDebtPar.toLocaleString()}K) > EV ($${enterpriseValue.toLocaleString()}K)`,
      icon: <TrendingDown className="h-4 w-4" />
    });
  }

  tranches.forEach(t => {
    if (t.tradingPrice && t.tradingPrice < 80) {
      redFlags.push({
        type: 'warning',
        message: `${t.facility} trading at ${t.tradingPrice}¢ (distressed)`,
        icon: <DollarSign className="h-4 w-4" />
      });
    }

    if (t.maturity) {
      const maturityDate = new Date(t.maturity);
      const monthsToMaturity = (maturityDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30);
      if (monthsToMaturity < 18 && monthsToMaturity > 0) {
        redFlags.push({
          type: 'warning',
          message: `${t.facility} matures in ${Math.round(monthsToMaturity)} months (maturity wall)`,
          icon: <Calendar className="h-4 w-4" />
        });
      }
    }
  });

  // Calculate YTM (simplified)
  const calculateYTM = (tranche: DebtTranche) => {
    if (!tranche.tradingPrice || !tranche.coupon || !tranche.maturity) return null;

    const couponRate = parseFloat(tranche.coupon.replace(/[^0-9.]/g, '')) || 0;
    const price = tranche.tradingPrice;
    const yearsToMaturity = tranche.maturity ?
      (new Date(tranche.maturity).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 365) : 0;

    if (yearsToMaturity <= 0) return null;

    // Simplified YTM approximation: ((Coupon + (100-Price)/Years) / ((100+Price)/2))
    const ytm = ((couponRate + (100 - price) / yearsToMaturity) / ((100 + price) / 2)) * 100;
    return ytm;
  };

  // Waterfall calculation
  const calculateRecovery = () => {
    if (enterpriseValue === 0) return [];

    let remainingValue = enterpriseValue;
    return sortedTranches.map(t => {
      const recovery = Math.min(100, (remainingValue / t.parValue) * 100);
      remainingValue = Math.max(0, remainingValue - t.parValue);
      return {
        facility: t.facility,
        parValue: t.parValue,
        recovery: recovery,
        recoveryAmount: t.parValue * (recovery / 100)
      };
    });
  };

  const recoveryAnalysis = calculateRecovery();
  const fulcrumSecurity = recoveryAnalysis.find(r => r.recovery > 0 && r.recovery < 100);

  // AI Analysis Generation
  const handleGenerateAIAnalysis = async () => {
    if (tranches.length === 0 || totalDebtPar === 0) return;

    setIsGeneratingAI(true);
    try {
      const analysis = await generateCapStructureAnalysis({
        companyName: data.companyName || 'Target Company',
        ticker: data.ticker || 'XXX',
        totalDebt: totalDebtPar,
        enterpriseValue,
        tranches: tranches.map(t => ({
          facility: t.facility,
          parValue: t.parValue,
          security: t.security,
          tradingPrice: t.tradingPrice
        }))
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
          <strong>Objective:</strong> Build the complete capital structure to understand priority, leverage,
          and recovery expectations. This forms the foundation for solvency analysis and restructuring recommendations.
        </AlertDescription>
      </Alert>

      {/* Context Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Company Fundamentals</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>LTM EBITDA ($K)</Label>
            <Input
              type="number"
              placeholder="e.g., 6500"
              value={data.ltmEbitda || ''}
              onChange={(e) => onUpdate({ ...data, ltmEbitda: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              For leverage calculations. Find in 10-K or calculate from recent quarters.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Enterprise Value Estimate ($K)</Label>
            <Input
              type="number"
              placeholder="e.g., 35000"
              value={data.enterpriseValue || ''}
              onChange={(e) => onUpdate({ ...data, enterpriseValue: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              For recovery analysis. Use comp-based valuation or market cap + net debt.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cap Table Builder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Capital Structure (Debt Stack)</CardTitle>
            <Button onClick={addTranche} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Tranche
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {tranches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-4">No debt tranches added yet</p>
              <Button onClick={addTranche} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add First Tranche
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tranches.map((tranche, index) => (
                <Card key={tranche.id} className="border-muted">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="outline">Tranche {index + 1}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTranche(tranche.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-4 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs">Facility Name</Label>
                        <Input
                          placeholder="e.g., ABL Revolver"
                          value={tranche.facility}
                          onChange={(e) => updateTranche(tranche.id, 'facility', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Par Value ($K)</Label>
                        <Input
                          type="number"
                          placeholder="8000"
                          value={tranche.parValue || ''}
                          onChange={(e) => updateTranche(tranche.id, 'parValue', parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Maturity</Label>
                        <Input
                          type="date"
                          value={tranche.maturity}
                          onChange={(e) => updateTranche(tranche.id, 'maturity', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Coupon/Rate</Label>
                        <Input
                          placeholder="SOFR+450"
                          value={tranche.coupon}
                          onChange={(e) => updateTranche(tranche.id, 'coupon', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Security</Label>
                        <select
                          className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                          value={tranche.security}
                          onChange={(e) => updateTranche(tranche.id, 'security', e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1L">1st Lien</option>
                          <option value="1.5L">1.5 Lien</option>
                          <option value="2L">2nd Lien</option>
                          <option value="Unsecured">Unsecured</option>
                          <option value="Subordinated">Subordinated</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Trading Price (¢)</Label>
                        <Input
                          type="number"
                          placeholder="100"
                          value={tranche.tradingPrice || ''}
                          onChange={(e) => updateTranche(tranche.id, 'tradingPrice', parseFloat(e.target.value) || 100)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Amortization</Label>
                        <select
                          className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                          value={tranche.amortization}
                          onChange={(e) => updateTranche(tranche.id, 'amortization', e.target.value)}
                        >
                          <option value="None">None</option>
                          <option value="1% annually">1% annually</option>
                          <option value="5% annually">5% annually</option>
                          <option value="Bullet">Bullet</option>
                        </select>
                      </div>

                      {/* Auto-calculated fields */}
                      <div className="space-y-2 bg-muted/30 p-2 rounded">
                        <Label className="text-xs text-muted-foreground">Market Value</Label>
                        <div className="text-sm font-semibold">
                          ${((tranche.parValue * (tranche.tradingPrice || 100) / 100)).toLocaleString()}K
                        </div>
                      </div>
                    </div>

                    {/* YTM if calculable */}
                    {tranche.tradingPrice && tranche.tradingPrice !== 100 && calculateYTM(tranche) && (
                      <div className="mt-3 p-2 bg-amber-500/10 rounded text-xs">
                        Estimated YTM: ~{calculateYTM(tranche)?.toFixed(1)}%
                        (Trading at {tranche.tradingPrice}¢ implies {tranche.tradingPrice < 100 ? 'distress' : 'premium'})
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary & Analytics */}
      {tranches.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Summary Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Capital Structure Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Total Debt (Par)</div>
                    <div className="text-xl font-bold">${totalDebtPar.toLocaleString()}K</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Market Value</div>
                    <div className="text-xl font-bold">${totalDebtMarket.toLocaleString()}K</div>
                  </div>
                  {ltmEbitda > 0 && (
                    <>
                      <div>
                        <div className="text-muted-foreground">Total Leverage</div>
                        <div className="text-xl font-bold">{leverageRatio.toFixed(1)}x</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">LTM EBITDA</div>
                        <div className="text-xl font-bold">${ltmEbitda.toLocaleString()}K</div>
                      </div>
                    </>
                  )}
                  {enterpriseValue > 0 && (
                    <>
                      <div>
                        <div className="text-muted-foreground">Enterprise Value</div>
                        <div className="text-xl font-bold">${enterpriseValue.toLocaleString()}K</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Solvency</div>
                        <Badge variant={totalDebtPar > enterpriseValue ? 'destructive' : 'default'}>
                          {totalDebtPar > enterpriseValue ? 'Insolvent' : 'Solvent'}
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recovery Analysis */}
            {enterpriseValue > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recovery Waterfall</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recoveryAnalysis.map((r, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{r.facility || `Tranche ${i + 1}`}</span>
                        <Badge variant={r.recovery >= 100 ? 'default' : r.recovery > 50 ? 'secondary' : 'destructive'}>
                          {r.recovery.toFixed(0)}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${r.recovery >= 100 ? 'bg-emerald-500' : r.recovery > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(100, r.recovery)}%` }}
                            />
                          </div>
                        </div>
                        <span>${r.recoveryAmount.toLocaleString()}K / ${r.parValue.toLocaleString()}K</span>
                      </div>
                    </div>
                  ))}
                  {fulcrumSecurity && (
                    <Alert className="mt-4">
                      <TrendingDown className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        <strong>Fulcrum Security:</strong> {fulcrumSecurity.facility}
                        ({fulcrumSecurity.recovery.toFixed(0)}% recovery).
                        This is where value runs out - likely gets equity in reorganization.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Red Flags & Priority */}
          <div className="space-y-4">
            {/* Red Flags */}
            {redFlags.length > 0 && (
              <Card className="border-red-500/30 bg-red-500/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Red Flags Detected
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {redFlags.map((flag, i) => (
                    <div key={i} className={`flex items-start gap-2 p-2 rounded ${
                      flag.type === 'error' ? 'bg-red-500/10' : 'bg-amber-500/10'
                    }`}>
                      <div className={flag.type === 'error' ? 'text-red-500' : 'text-amber-500'}>
                        {flag.icon}
                      </div>
                      <span className="text-sm">{flag.message}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Priority Stack */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sortedTranches.map((t, i) => (
                    <div key={t.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded text-sm">
                      <Badge variant="outline" className="w-8 text-center">{i + 1}</Badge>
                      <div className="flex-1">
                        <div className="font-medium">{t.facility || 'Unnamed'}</div>
                        <div className="text-xs text-muted-foreground">{t.security}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${t.parValue.toLocaleString()}K</div>
                        {t.tradingPrice && t.tradingPrice !== 100 && (
                          <div className="text-xs text-muted-foreground">{t.tradingPrice}¢</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Expert Analysis */}
            {isGeminiAvailable() && tranches.length > 0 && (
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
                        Generate an AI-powered capital structure analysis with recovery insights and restructuring implications.
                      </p>
                      <Button
                        onClick={handleGenerateAIAnalysis}
                        disabled={isGeneratingAI || tranches.length === 0}
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
          </div>
        </div>
      )}

      {/* Expert Comparison */}
      {showExpert && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Expert Capital Structure (Zac's Analysis)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-background rounded-lg">
                <div className="font-semibold mb-2">ABL Revolver (1st Lien)</div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>Par: $8,000K</div>
                  <div>Rate: SOFR+450 bps</div>
                  <div>Maturity: 2026</div>
                  <div>Security: 1L on inventory/AR</div>
                  <div className="text-foreground">Trading: N/A (revolver)</div>
                </div>
              </div>

              <div className="p-3 bg-background rounded-lg">
                <div className="font-semibold mb-2">Term Loan B (2nd Lien)</div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>Par: $45,000K</div>
                  <div>Rate: SOFR+550 bps</div>
                  <div>Maturity: 2027</div>
                  <div>Security: 2L</div>
                  <div className="text-red-400 font-semibold">Trading: 65¢ (distressed)</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t space-y-2">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Debt:</span> <strong>$53,000K</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Leverage:</span> <strong>8.2x</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">EV Estimate:</span> <strong>$35,000K</strong>
                </div>
              </div>
              <Badge variant="destructive">Insolvent (Debt exceeds EV)</Badge>
            </div>

            <div className="p-3 bg-background rounded-lg mt-3">
              <p className="text-xs italic">
                "Term Loan trading at 65¢ signals distress - the market is pricing in less than 35% recovery.
                With $53M total debt vs $35M enterprise value, the ABL Revolver is money good (100% recovery),
                but the Term Loan is the fulcrum security (~78% recovery). Unsecured/equity get nothing.
                This capital structure is INSOLVENT and requires deleveraging."
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
