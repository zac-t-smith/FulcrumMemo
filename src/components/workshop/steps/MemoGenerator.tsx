import { StepProps } from '../InteractiveCaseStudy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { exportToPDF, exportToPPTX, exportBoth } from '@/services/exportService';
import { generateFullMemo, isGeminiAvailable } from '@/services/geminiService';
import {
  CheckCircle2,
  Info,
  FileText,
  Lightbulb,
  TrendingDown,
  AlertTriangle,
  Download,
  Save,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MemoSection {
  title: string;
  content: string;
}

interface MemoGeneratorProps extends StepProps {
  companyName?: string;
  ticker?: string;
}

export const MemoGenerator = ({
  data = {},
  onUpdate,
  showExpert,
  companyName = 'Kirkland\'s',
  ticker = 'KIRK'
}: MemoGeneratorProps) => {
  const [autoPopulated, setAutoPopulated] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Extract data from previous steps
  const liquidity = data.liquidity || {};
  const capStructure = data.capitalStructure || {};
  const selectedTechnique = data.selectedTechnique || {};

  // Calculate key metrics
  const runway = liquidity.runway || 0;
  const availableLiquidity = liquidity.availableLiquidity || 0;
  const totalDebt = capStructure.totalDebt || 0;
  const enterpriseValue = capStructure.enterpriseValue || 0;
  const leverageRatio = enterpriseValue > 0 ? totalDebt / enterpriseValue : 0;
  const solvency = enterpriseValue >= totalDebt ? 'solvent' : 'insolvent';

  // Auto-populate memo sections on first load
  useEffect(() => {
    if (!autoPopulated && runway > 0 && totalDebt > 0) {
      const generatedSections = generateMemoSections();
      onUpdate({
        ...data,
        sections: generatedSections
      });
      setAutoPopulated(true);
    }
  }, [runway, totalDebt, autoPopulated]);

  const generateMemoSections = (): MemoSection[] => {
    const runwayCategory = runway < 13 ? 'urgent' : runway < 26 ? 'manageable' : 'strategic';
    const techniqueType = selectedTechnique.id || 'strategic-sale';

    return [
      {
        title: 'Executive Summary',
        content: `${companyName} (${ticker}) is facing ${runwayCategory} liquidity constraints with approximately ${runway.toFixed(1)} weeks of runway based on ${availableLiquidity.toLocaleString()}K in available liquidity against a weekly cash burn of ${liquidity.weeklyBurn || 0}K. The company carries ${totalDebt.toLocaleString()}K in total debt against an estimated enterprise value of ${enterpriseValue.toLocaleString()}K, resulting in a leverage ratio of ${leverageRatio.toFixed(1)}x and rendering the capital structure ${solvency}.

Key Observations:
• Liquidity: ${runwayCategory === 'urgent' ? 'Critical - Less than 13 weeks of runway requires immediate action' : runwayCategory === 'manageable' ? 'Manageable - 13-26 week window allows for structured process' : 'Strategic - Sufficient runway to explore multiple options'}
• Capital Structure: ${solvency === 'insolvent' ? 'Insolvent - Debt exceeds enterprise value' : 'Solvent - Enterprise value covers debt obligations'}
• Recommended Path: ${techniqueType === 'strategic-sale' ? 'Strategic Sale or M&A' : techniqueType === 'amend-extend' ? 'Out-of-Court Amendment & Extension' : techniqueType === 'debt-for-equity' ? 'Debt-for-Equity Swap' : techniqueType === 'prepack-ch11' ? 'Pre-Packaged Chapter 11' : techniqueType === 'section-363' ? 'Section 363 Asset Sale' : 'Chapter 11 Restructuring'}`
      },
      {
        title: 'Central Thesis',
        content: getCentralThesisTemplate(runwayCategory, solvency, techniqueType)
      },
      {
        title: 'Operating Performance',
        content: `${companyName} has experienced significant operational headwinds including:

• Revenue Trends: [Insert revenue analysis from 10-K/10-Q]
• Margin Compression: [Insert gross margin and EBITDA margin trends]
• Competitive Position: [Insert market share and competitive dynamics]
• Cost Structure: [Insert fixed vs. variable cost breakdown]

The current cash burn rate of ${liquidity.weeklyBurn || 0}K per week (approximately ${((liquidity.weeklyBurn || 0) * 52 / 1000).toFixed(1)}M annually) reflects [describe primary burn drivers: operating losses, working capital needs, capex requirements].

Management's turnaround plan includes [insert key initiatives], though execution risk remains high given the ${runway.toFixed(1)}-week liquidity runway.`
      },
      {
        title: 'Capital Structure',
        content: generateCapStructureSection()
      },
      {
        title: 'Restructuring Alternatives',
        content: generateAlternativesSection(runwayCategory, solvency, techniqueType)
      },
      {
        title: 'Expected Outcome & Timeline',
        content: `Based on the analysis above, we expect ${companyName} to pursue ${techniqueType === 'strategic-sale' ? 'a strategic sale or merger within the next 8-12 weeks' : techniqueType === 'amend-extend' ? 'an out-of-court amendment and extension, targeting completion in 4-8 weeks' : techniqueType === 'debt-for-equity' ? 'a debt-for-equity exchange, likely completing in 6-10 weeks' : techniqueType === 'prepack-ch11' ? 'a pre-packaged Chapter 11 filing within 4-8 weeks' : techniqueType === 'section-363' ? 'a Section 363 sale process, likely through Chapter 11' : 'a traditional Chapter 11 restructuring'}.

Key Milestones:
• T+0 to T+2 weeks: ${techniqueType.includes('sale') ? 'Engage financial advisor, prepare marketing materials' : 'Secure DIP financing commitments, engage restructuring advisors'}
• T+2 to T+6 weeks: ${techniqueType.includes('sale') ? 'First round bids, management presentations' : 'Negotiate with creditor steering committee, finalize plan terms'}
• T+6 to T+10 weeks: ${techniqueType.includes('sale') ? 'Final bids, definitive agreements' : 'Solicitation period, vote on plan'}
• T+10+ weeks: ${techniqueType.includes('sale') ? 'Closing (may require Ch11 if assuming liabilities)' : 'Court confirmation, emergence'}

Investment Implications:
${generateInvestmentImplications(solvency, leverageRatio)}`
      }
    ];
  };

  const getCentralThesisTemplate = (runway: string, solvency: string, technique: string): string => {
    if (runway === 'urgent' && solvency === 'insolvent') {
      return `${companyName} faces an urgent liquidity crisis with less than 13 weeks of runway and an insolvent capital structure. The fulcrum security appears to be [identify where enterprise value runs out in the waterfall].

Given the compressed timeline and lack of negotiating leverage, we believe the most likely outcome is ${technique === 'strategic-sale' ? 'a rapid strategic sale process, potentially culminating in a stalking horse 363 sale through Chapter 11 if no out-of-court buyer emerges' : technique === 'section-363' ? 'a Section 363 asset sale through Chapter 11, with the sale process likely pre-marketed to strategic buyers' : 'a filing-ready restructuring plan negotiated with senior creditors, as junior creditors lack leverage to block'}.

The key risk is a fire sale at depressed valuations if the process extends beyond available liquidity.`;
    } else if (runway === 'manageable' && solvency === 'insolvent') {
      return `${companyName} has a manageable 13-26 week liquidity runway, providing sufficient time to explore out-of-court alternatives while retaining the option to file Chapter 11 if negotiations stall.

The capital structure is insolvent, with enterprise value insufficient to cover all debt obligations. This creates a natural fulcrum at [identify tranche], suggesting that [describe expected allocation - e.g., "senior lenders recover in full while junior debt receives equity in the reorganized entity"].

We expect ${technique === 'debt-for-equity' ? 'creditors to negotiate a consensual debt-for-equity exchange, converting junior debt into equity while extending/amending senior facilities' : technique === 'amend-extend' ? 'an amendment and extension with senior lenders, likely including equity infusions from existing sponsors or new investors' : 'a pre-packaged Chapter 11 with terms pre-negotiated among major creditor constituencies'}.`;
    } else if (solvency === 'solvent') {
      return `${companyName} maintains a solvent capital structure with enterprise value exceeding total debt obligations. The primary challenge is liquidity management rather than solvency.

With ${runway.toFixed(1)} weeks of runway, management has ${runway < 13 ? 'limited but sufficient' : 'adequate'} time to execute ${technique === 'amend-extend' ? 'an out-of-court amendment and extension with existing lenders' : technique === 'strategic-sale' ? 'a strategic sale process to a buyer with better cost synergies or operational expertise' : 'a capital raise or asset monetization to bridge the liquidity gap'}.

The solvent structure suggests that all creditors should recover par (or close to it), reducing intercreditor conflict and facilitating a consensual solution.`;
    } else {
      return `${companyName}'s situation requires [insert central thesis based on specific facts]. Key considerations include the ${runway.toFixed(1)}-week liquidity runway, ${solvency} capital structure, and [insert company-specific factors].

[Develop thesis around most likely outcome and supporting rationale.]`;
    }
  };

  const generateCapStructureSection = (): string => {
    const tranches = capStructure.tranches || [];

    let section = `${companyName}'s capital structure consists of:\n\n`;

    tranches.forEach((tranche: any) => {
      section += `• ${tranche.facility}: $${tranche.parValue?.toLocaleString() || 0}K par, ${tranche.coupon || 'N/A'} coupon, ${tranche.maturity} maturity`;
      if (tranche.tradingPrice) {
        section += `, trading at ${tranche.tradingPrice}¢`;
      }
      section += `\n`;
    });

    section += `\nTotal Debt: $${totalDebt.toLocaleString()}K`;
    section += `\nEnterprise Value (Estimate): $${enterpriseValue.toLocaleString()}K`;
    section += `\nNet Leverage: ${leverageRatio.toFixed(1)}x`;
    section += `\nSolvency Assessment: ${solvency === 'insolvent' ? 'INSOLVENT - Debt exceeds enterprise value' : 'SOLVENT - Enterprise value covers debt'}`;

    if (capStructure.recoveryWaterfall && capStructure.recoveryWaterfall.length > 0) {
      section += `\n\nRecovery Waterfall Analysis:\n`;
      capStructure.recoveryWaterfall.forEach((item: any) => {
        section += `• ${item.facility}: ${item.recovery.toFixed(0)}% recovery ($${item.recoveryAmount?.toLocaleString() || 0}K)\n`;
      });
    }

    section += `\n\nKey Observations:\n`;
    if (leverageRatio > 6) {
      section += `• Highly leveraged at ${leverageRatio.toFixed(1)}x - limited cushion for operational challenges\n`;
    }
    if (solvency === 'insolvent') {
      section += `• Insolvent structure points to debt-for-equity swap or creditor ownership post-restructuring\n`;
    }

    const nearTermMaturities = tranches.filter((t: any) => {
      const year = parseInt(t.maturity);
      return !isNaN(year) && year <= new Date().getFullYear() + 1;
    });

    if (nearTermMaturities.length > 0) {
      section += `• Maturity wall: ${nearTermMaturities.map((t: any) => `$${t.parValue?.toLocaleString()}K ${t.facility} due ${t.maturity}`).join(', ')}\n`;
    }

    return section;
  };

  const generateAlternativesSection = (runway: string, solvency: string, technique: string): string => {
    let section = `We have evaluated the following restructuring alternatives:\n\n`;

    // Primary recommendation
    section += `1. PRIMARY RECOMMENDATION: ${technique === 'strategic-sale' ? 'Strategic Sale / M&A' : technique === 'amend-extend' ? 'Out-of-Court Amendment & Extension' : technique === 'debt-for-equity' ? 'Debt-for-Equity Exchange' : technique === 'prepack-ch11' ? 'Pre-Packaged Chapter 11' : technique === 'section-363' ? 'Section 363 Asset Sale' : 'Chapter 11 Restructuring'}\n`;
    section += `   Rationale: ${runway === 'urgent' ? 'Given the critical liquidity situation with less than 13 weeks of runway, immediate action is required. A strategic sale offers the fastest path to a value-maximizing outcome.' : 'Based on the liquidity profile and capital structure, this approach balances speed, cost, and stakeholder alignment.'}\n`;
    section += `   Timeline: ${technique.includes('sale') ? '8-12 weeks' : technique === 'amend-extend' ? '4-8 weeks' : '6-12 weeks'}\n`;
    section += `   Estimated Costs: ${technique.includes('ch11') ? '$2-5M (advisor fees, legal, filing costs)' : technique.includes('sale') ? '$1-3M (banker fees, legal)' : '$500K-1.5M (legal, advisor fees)'}\n\n`;

    // Alternative options
    section += `2. ALTERNATIVE: ${runway === 'urgent' ? 'Section 363 Sale Through Chapter 11' : 'Debt-for-Equity Exchange'}\n`;
    section += `   Pros: ${runway === 'urgent' ? 'Bankruptcy auction process may generate competitive tension; DIP financing provides liquidity bridge' : 'Consensual process avoids Chapter 11 costs and stigma; faster than court process'}\n`;
    section += `   Cons: ${runway === 'urgent' ? 'Higher costs; bankruptcy stigma may depress bids; requires DIP financing' : 'Requires high creditor participation (typically 90%+); holdouts can block deal'}\n\n`;

    section += `3. FALLBACK: ${ technique === 'section-363' || runway === 'urgent' ? 'Traditional Chapter 11' : 'Chapter 11 with Pre-Arranged Plan'}\n`;
    section += `   Use Case: If primary and alternative paths fail or negotiations break down\n`;
    section += `   Risk: ${runway === 'urgent' ? 'May exhaust remaining liquidity before emergence; requires DIP facility' : 'More expensive and time-consuming; potential for creditor conflicts'}\n\n`;

    section += `NOT RECOMMENDED:\n`;
    if (runway === 'urgent') {
      section += `• Out-of-Court Workout: Insufficient time given ${runway.toFixed(1)}-week runway\n`;
      section += `• Operational Turnaround: Requires 12-18 months; liquidity will be exhausted\n`;
    } else if (solvency === 'insolvent') {
      section += `• Asset-Based Lending Amendment Only: Does not address insolvency; kicks can down the road\n`;
      section += `• Operational Turnaround Alone: Capital structure must be fixed before operations can stabilize\n`;
    }

    return section;
  };

  const generateInvestmentImplications = (solvency: string, leverage: number): string => {
    if (solvency === 'insolvent') {
      return `• Senior Secured: Expected recovery near par; minimal downside risk
• Junior Debt: Trading at significant discount reflects impairment; recovery likely 30-60¢ depending on enterprise value
• Equity: Out of the money; expect dilution or wipeout in restructuring
• RX Play: Consider long junior debt at current distressed levels if enterprise value estimate proves conservative`;
    } else {
      return `• All Debt Tranches: Expected to recover par or close to it given solvent structure
• Equity: Retains value but may face dilution if new capital is raised
• Senior Debt: Limited upside as likely to be refinanced or paid off
• Junior Debt: Best risk/reward if trading below par, as solvency supports full recovery`;
    }
  };

  // AI Full Memo Generation
  const handleGenerateAIMemo = async () => {
    setIsGeneratingAI(true);
    try {
      const companyData = {
        companyName,
        ticker,
        sector: data.sector || 'Retail',
        industry: data.industry || 'Home Furnishings',
        marketCap: capStructure.marketCap || 0,
        totalDebt: capStructure.totalDebt || totalDebt,
        cash: liquidity.cash || 0,
        revenue: capStructure.revenue || 0,
        ebitda: capStructure.ltmEbitda || ltmEbitda,
        runway,
        solvency
      };

      const aiMemoContent = await generateFullMemo(companyData);

      if (aiMemoContent) {
        // Parse the AI-generated memo into sections
        const aiSections = parseAIMemoIntoSections(aiMemoContent);
        onUpdate({ ...data, sections: aiSections });
        setAutoPopulated(true);
      }
    } catch (error) {
      console.error('AI memo generation error:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Parse AI memo text into structured sections
  const parseAIMemoIntoSections = (memoText: string): MemoSection[] => {
    const sections: MemoSection[] = [];
    const sectionTitles = [
      'Executive Summary',
      'Central Thesis',
      'Operating Performance',
      'Capital Structure',
      'Restructuring Alternatives',
      'Expected Outcome & Timeline'
    ];

    let currentSection = '';
    let currentContent = '';

    const lines = memoText.split('\n');

    for (const line of lines) {
      // Check if line is a section header
      const matchedTitle = sectionTitles.find(title =>
        line.includes(title) || line.includes(title.toUpperCase())
      );

      if (matchedTitle) {
        // Save previous section if exists
        if (currentSection && currentContent) {
          sections.push({
            title: currentSection,
            content: currentContent.trim()
          });
        }
        currentSection = matchedTitle;
        currentContent = '';
      } else if (currentSection) {
        // Add line to current section
        currentContent += line + '\n';
      }
    }

    // Add the last section
    if (currentSection && currentContent) {
      sections.push({
        title: currentSection,
        content: currentContent.trim()
      });
    }

    // If parsing failed, return the whole text as Executive Summary
    if (sections.length === 0) {
      sections.push({
        title: 'Executive Summary',
        content: memoText
      });
    }

    return sections;
  };

  // Initialize sections if not present
  const sections: MemoSection[] = data.sections || [];

  const updateSection = (index: number, content: string) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], content };
    onUpdate({ ...data, sections: updatedSections });
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Objective:</strong> Generate a structured investment memo based on your analysis.
          Sections auto-populate from your inputs but can be fully edited to match your specific insights.
        </AlertDescription>
      </Alert>

      {/* Auto-populate Button */}
      {sections.length === 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Generate Memo from Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Choose how to generate your investment memo:
            </p>

            {/* AI-Powered Generation */}
            {isGeminiAvailable() && (
              <div className="p-4 border-2 border-purple-500/30 bg-purple-500/5 rounded-lg space-y-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">AI-Powered Memo (Recommended)</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Generate a comprehensive, professional-grade investment memo written in the style of
                      a Fulcrum Memo using Gemini AI. Includes detailed analysis across all 6 sections.
                    </p>
                    <Button
                      onClick={handleGenerateAIMemo}
                      disabled={isGeneratingAI}
                      className="w-full"
                      variant="default"
                    >
                      {isGeneratingAI ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating AI Memo...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate AI-Powered Memo
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Template-Based Generation */}
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">Template-Based Memo</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Auto-populate using pre-built templates based on your liquidity analysis, capital structure,
                    and selected restructuring technique. Faster but less detailed.
                  </p>
                  <Button
                    onClick={() => {
                      const generatedSections = generateMemoSections();
                      onUpdate({ ...data, sections: generatedSections });
                      setAutoPopulated(true);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Template Memo
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Memo Header */}
      {sections.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Investment Memo: {companyName}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{ticker}</Badge>
                <Badge variant={runway < 13 ? 'destructive' : runway < 26 ? 'default' : 'secondary'}>
                  {runway.toFixed(1)} Week Runway
                </Badge>
                <Badge variant={solvency === 'insolvent' ? 'destructive' : 'secondary'}>
                  {solvency === 'insolvent' ? 'Insolvent' : 'Solvent'}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Editable Sections */}
      {sections.map((section, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={section.content}
              onChange={(e) => updateSection(index, e.target.value)}
              rows={section.title === 'Executive Summary' ? 12 : section.title === 'Central Thesis' ? 10 : 15}
              className="font-mono text-sm"
              placeholder={`Enter ${section.title.toLowerCase()} details...`}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {section.title === 'Executive Summary' && 'Synthesize key findings: liquidity, solvency, and recommended path'}
              {section.title === 'Central Thesis' && 'State your investment thesis and expected outcome'}
              {section.title === 'Operating Performance' && 'Analyze revenue trends, margins, cost structure, and burn drivers'}
              {section.title === 'Capital Structure' && 'Detail debt stack, recoveries, and structural observations'}
              {section.title === 'Restructuring Alternatives' && 'Compare restructuring options with pros/cons/timeline'}
              {section.title === 'Expected Outcome & Timeline' && 'Project timeline and investment implications for each tranche'}
            </p>
          </CardContent>
        </Card>
      ))}

      {/* Export & Save Options */}
      {sections.length > 0 && (
        <ExportAndSaveCard
          companyName={companyName}
          ticker={ticker}
          sections={sections}
          data={data}
        />
      )}
    </div>
  );
};

// Export and Save Card Component
interface ExportAndSaveCardProps {
  companyName: string;
  ticker: string;
  sections: MemoSection[];
  data: any;
}

const ExportAndSaveCard = ({ companyName, ticker, sections, data }: ExportAndSaveCardProps) => {
  const { saveAnalysis } = usePortfolio();
  const { toast } = useToast();

  const handleExportPDF = () => {
    exportToPDF({
      companyName,
      ticker,
      sections,
      date: new Date().toLocaleDateString(),
      analyst: 'Your Name'
    });
    toast({
      title: 'PDF Exported',
      description: `Investment memo for ${ticker} has been downloaded.`
    });
  };

  const handleExportPPTX = () => {
    exportToPPTX({
      companyName,
      ticker,
      sections,
      date: new Date().toLocaleDateString(),
      analyst: 'Your Name'
    });
    toast({
      title: 'PPTX Exported',
      description: `Pitch deck for ${ticker} has been downloaded.`
    });
  };

  const handleExportBoth = () => {
    exportBoth({
      companyName,
      ticker,
      sections,
      date: new Date().toLocaleDateString(),
      analyst: 'Your Name'
    });
    toast({
      title: 'Both Exported',
      description: `PDF and PPTX for ${ticker} have been downloaded.`
    });
  };

  const handleSaveToPortfolio = () => {
    const analysisId = `${ticker}-${Date.now()}`;
    saveAnalysis({
      id: analysisId,
      companyName,
      ticker,
      caseStudyId: ticker.toLowerCase(),
      completedDate: new Date().toISOString(),
      sections,
      liquidity: data.liquidity,
      capitalStructure: data.capitalStructure,
      recommendation: sections.find(s => s.title === 'Executive Summary')?.content.substring(0, 200)
    });
    toast({
      title: 'Saved to Portfolio',
      description: `Analysis for ${ticker} has been saved. View it in your Portfolio.`,
      action: {
        label: 'View Portfolio',
        onClick: () => window.location.href = '/FulcrumMemo/portfolio'
      }
    });
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Download className="h-4 w-4 text-primary" />
          Export & Save Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Export Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={handleExportPDF} className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleExportPPTX} className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Export PPTX
          </Button>
        </div>

        <Button variant="outline" onClick={handleExportBoth} className="w-full justify-start">
          <Download className="h-4 w-4 mr-2" />
          Export Both (PDF + PPTX)
        </Button>

        {/* Save to Portfolio */}
        <div className="pt-3 border-t">
          <Button onClick={handleSaveToPortfolio} className="w-full" variant="default">
            <Save className="h-4 w-4 mr-2" />
            Save to Portfolio
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Save your analysis to view, export, and compare later
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
