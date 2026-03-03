// Financial Modeling Prep API Service
// Get free API key: https://site.financialmodelingprep.com/developer/docs

const FMP_API_KEY = import.meta.env.VITE_FMP_API_KEY;
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

export interface FMPFinancials {
  cash: number;
  restrictedCash: number;
  totalDebt: number;
  shortTermDebt: number;
  longTermDebt: number;
  totalAssets: number;
  totalLiabilities: number;
  revenue: number;
  ebitda: number;
  netIncome: number;
  operatingCashFlow: number;
  freeCashFlow: number;
  error?: string;
}

export const fetchFinancials = async (ticker: string): Promise<FMPFinancials | null> => {
  if (!FMP_API_KEY) {
    console.warn('FMP API key not configured. Using fallback data.');
    return null;
  }

  try {
    const [balanceSheet, incomeStatement, cashFlow] = await Promise.all([
      fetch(`${BASE_URL}/balance-sheet-statement/${ticker}?limit=1&apikey=${FMP_API_KEY}`),
      fetch(`${BASE_URL}/income-statement/${ticker}?limit=1&apikey=${FMP_API_KEY}`),
      fetch(`${BASE_URL}/cash-flow-statement/${ticker}?limit=1&apikey=${FMP_API_KEY}`)
    ]);

    if (!balanceSheet.ok || !incomeStatement.ok || !cashFlow.ok) {
      throw new Error('FMP API request failed');
    }

    const bs = await balanceSheet.json();
    const is = await incomeStatement.json();
    const cf = await cashFlow.json();

    if (!bs[0] || !is[0] || !cf[0]) {
      throw new Error('No financial data available');
    }

    return {
      // Balance Sheet (in thousands)
      cash: (bs[0].cashAndCashEquivalents || 0) / 1000,
      restrictedCash: (bs[0].restrictedCash || 0) / 1000,
      totalDebt: (bs[0].totalDebt || 0) / 1000,
      shortTermDebt: (bs[0].shortTermDebt || 0) / 1000,
      longTermDebt: (bs[0].longTermDebt || 0) / 1000,
      totalAssets: (bs[0].totalAssets || 0) / 1000,
      totalLiabilities: (bs[0].totalLiabilities || 0) / 1000,

      // Income Statement (in thousands)
      revenue: (is[0].revenue || 0) / 1000,
      ebitda: (is[0].ebitda || 0) / 1000,
      netIncome: (is[0].netIncome || 0) / 1000,

      // Cash Flow (in thousands)
      operatingCashFlow: (cf[0].operatingCashFlow || 0) / 1000,
      freeCashFlow: (cf[0].freeCashFlow || 0) / 1000
    };
  } catch (error) {
    console.error('FMP fetch error:', error);
    return null;
  }
};

// Get company profile
export const fetchCompanyProfile = async (ticker: string) => {
  if (!FMP_API_KEY) return null;

  try {
    const response = await fetch(
      `${BASE_URL}/profile/${ticker}?apikey=${FMP_API_KEY}`
    );

    if (!response.ok) throw new Error('Profile fetch failed');

    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('FMP profile fetch error:', error);
    return null;
  }
};

// Get key metrics
export const fetchKeyMetrics = async (ticker: string) => {
  if (!FMP_API_KEY) return null;

  try {
    const response = await fetch(
      `${BASE_URL}/key-metrics/${ticker}?limit=1&apikey=${FMP_API_KEY}`
    );

    if (!response.ok) throw new Error('Metrics fetch failed');

    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('FMP metrics fetch error:', error);
    return null;
  }
};
