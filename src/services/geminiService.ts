// Gemini AI Service for Expert RX Analysis
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('Gemini API key not configured. AI features will be disabled.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Generate expert liquidity analysis
export const generateLiquidityAnalysis = async (data: {
  companyName: string;
  ticker: string;
  cash: number;
  revolver: number;
  revolverDrawn: number;
  weeklyBurn: number;
  runway: number;
}): Promise<string | null> => {
  if (!genAI) return null;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a senior restructuring analyst at Evercore. Analyze the following liquidity situation:

Company: ${data.companyName} (${data.ticker})
Cash on Hand: $${data.cash.toLocaleString()}K
Revolver Capacity: $${data.revolver.toLocaleString()}K
Revolver Drawn: $${data.revolverDrawn.toLocaleString()}K
Weekly Cash Burn: $${data.weeklyBurn.toLocaleString()}K
Calculated Runway: ${data.runway.toFixed(1)} weeks

Provide a concise 2-3 paragraph analysis covering:
1. Urgency assessment (< 13 weeks = urgent, 13-26 weeks = manageable, > 26 weeks = strategic)
2. Key liquidity concerns and red flags
3. Immediate recommendations for management

Write in the style of a Fulcrum Memo - professional, direct, and actionable.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
};

// Generate capital structure analysis
export const generateCapStructureAnalysis = async (data: {
  companyName: string;
  ticker: string;
  totalDebt: number;
  enterpriseValue: number;
  tranches: Array<{ facility: string; parValue: number; security: string; tradingPrice?: number }>;
}): Promise<string | null> => {
  if (!genAI) return null;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const leverageRatio = data.totalDebt / data.enterpriseValue;
    const solvency = data.enterpriseValue >= data.totalDebt ? 'Solvent' : 'Insolvent';

    const trancheDetails = data.tranches.map(t =>
      `- ${t.facility}: $${t.parValue.toLocaleString()}K (${t.security})${t.tradingPrice ? ` trading at ${t.tradingPrice}¢` : ''}`
    ).join('\n');

    const prompt = `You are a senior restructuring analyst. Analyze this capital structure:

Company: ${data.companyName} (${data.ticker})
Total Debt: $${data.totalDebt.toLocaleString()}K
Enterprise Value: $${data.enterpriseValue.toLocaleString()}K
Leverage Ratio: ${leverageRatio.toFixed(2)}x
Solvency: ${solvency}

Debt Tranches:
${trancheDetails}

Provide a concise 2-3 paragraph analysis covering:
1. Capital structure assessment and leverage commentary
2. Recovery analysis - which tranches are money good vs. impaired
3. Implications for restructuring approach

Focus on practical RX insights. Be direct and specific.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
};

// Generate restructuring recommendation
export const generateRecommendation = async (data: {
  companyName: string;
  ticker: string;
  runway: number;
  solvency: string;
  leverage: number;
  sector: string;
}): Promise<string | null> => {
  if (!genAI) return null;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a senior restructuring analyst providing a final recommendation for a distressed company.

Company: ${data.companyName} (${data.ticker})
Sector: ${data.sector}
Liquidity Runway: ${data.runway.toFixed(1)} weeks
Solvency: ${data.solvency}
Leverage: ${data.leverage.toFixed(2)}x

Based on these facts, provide:
1. **Primary Recommendation** (1-2 sentences): The best restructuring path (e.g., Strategic Sale, A&E, D4E, Prepack Ch11, 363 Sale)
2. **Rationale** (2-3 sentences): Why this is the optimal approach given runway, solvency, and market conditions
3. **Alternative Options** (2-3 bullet points): Backup plans if primary recommendation fails
4. **Expected Timeline** (1 sentence): How long this process will take

Be decisive and specific. Reference the company's specific situation.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
};

// Generate full investment memo
export const generateFullMemo = async (data: {
  companyName: string;
  ticker: string;
  sector: string;
  industry: string;
  marketCap: number;
  totalDebt: number;
  cash: number;
  revenue: number;
  ebitda: number;
  runway?: number;
  solvency?: string;
}): Promise<string | null> => {
  if (!genAI) return null;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `You are writing a restructuring credit memo in the style of Zac Smith's Fulcrum Memo.

Company: ${data.companyName} (${data.ticker})
Sector: ${data.sector} / ${data.industry}
Market Cap: $${(data.marketCap / 1000).toFixed(1)}M
Total Debt: $${(data.totalDebt / 1000).toFixed(1)}M
Cash: $${(data.cash / 1000).toFixed(1)}M
Revenue: $${(data.revenue / 1000).toFixed(1)}M
EBITDA: $${(data.ebitda / 1000).toFixed(1)}M
${data.runway ? `Runway: ${data.runway.toFixed(1)} weeks` : ''}
${data.solvency ? `Solvency: ${data.solvency}` : ''}

Write a comprehensive investment memo with these sections:

## Executive Summary
(3-4 paragraphs synthesizing the situation, key metrics, and primary recommendation)

## Central Thesis
(2-3 paragraphs stating your investment view and expected outcome)

## Operating Performance
(3-4 paragraphs on revenue trends, margins, competitive position, and cash burn drivers)

## Capital Structure
(3-4 paragraphs detailing the debt stack, recoveries, and structural observations)

## Restructuring Alternatives
(4-5 paragraphs comparing options: primary recommendation, 2 alternatives, and why others won't work)

## Expected Outcome & Timeline
(2-3 paragraphs projecting timeline, key milestones, and investment implications for each tranche)

Style: Professional, direct, actionable. Use specific numbers. Reference comparable situations where relevant. Write like you're presenting to an investment committee.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
};

// Quick expert insight for any prompt
export const generateQuickInsight = async (prompt: string): Promise<string | null> => {
  if (!genAI) return null;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const enhancedPrompt = `You are a senior restructuring analyst at Evercore. ${prompt}

Provide a concise, actionable response (2-3 paragraphs max). Be specific and use RX terminology.`;

    const result = await model.generateContent(enhancedPrompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
};

// Check if Gemini is available
export const isGeminiAvailable = (): boolean => {
  return !!genAI;
};
