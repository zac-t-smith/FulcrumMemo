// Combined Live Company Data Service
import { fetchStockData, type YahooStockData } from './yahooFinance';
import { fetchFinancials, fetchCompanyProfile, type FMPFinancials } from './fmp';
import { getCompanyByTicker, type CompanyData } from './financialDataService';

export interface LiveCompanyData extends CompanyData {
  dataSource: 'live' | 'demo' | 'hybrid';
  lastUpdated: string;
  yahooData?: YahooStockData;
  fmpData?: FMPFinancials;
}

export const fetchLiveCompanyData = async (ticker: string): Promise<LiveCompanyData | null> => {
  try {
    // Fetch from both APIs in parallel
    const [yahooData, fmpData, profile] = await Promise.all([
      fetchStockData(ticker),
      fetchFinancials(ticker),
      fetchCompanyProfile(ticker)
    ]);

    // Get demo data as fallback
    const demoData = await getCompanyByTicker(ticker);

    // If no live data at all, return demo data
    if (!yahooData && !fmpData) {
      if (demoData) {
        return {
          ...demoData,
          dataSource: 'demo',
          lastUpdated: demoData.lastUpdated || new Date().toISOString()
        };
      }
      return null;
    }

    // Combine live and demo data
    const companyName = yahooData?.companyName || profile?.companyName || demoData?.name || ticker;
    const sector = profile?.sector || demoData?.sector || 'Unknown';
    const industry = profile?.industry || demoData?.industry || 'Unknown';

    // Calculate metrics
    const marketCap = yahooData?.marketCap || demoData?.marketCap || 0;
    const price = yahooData?.stockPrice || demoData?.price || 0;
    const cash = fmpData?.cash || demoData?.cash || 0;
    const totalDebt = fmpData?.totalDebt || demoData?.totalDebt || 0;
    const revenue = fmpData?.revenue || demoData?.revenue || 0;
    const ebitda = fmpData?.ebitda || demoData?.ebitda || 0;

    // Calculate enterprise value
    const enterpriseValue = marketCap + totalDebt - cash;

    // Calculate distress metrics
    const debtToEquity = marketCap > 0 ? totalDebt / marketCap : 0;
    const currentRatio = fmpData
      ? (fmpData.totalAssets - fmpData.totalLiabilities) / fmpData.shortTermDebt || 1
      : demoData?.currentRatio || 1;

    // Estimate distress score
    const distressScore = calculateDistressScore({
      debtToEquity,
      currentRatio,
      ebitda,
      revenue,
      totalDebt,
      marketCap
    });

    const isDistressed = distressScore > 50;

    const liveData: LiveCompanyData = {
      ticker: ticker.toUpperCase(),
      name: companyName,
      exchange: yahooData ? 'NASDAQ/NYSE' : demoData?.exchange || 'Unknown',
      sector,
      industry,
      marketCap,
      price,
      beta: demoData?.beta || 1.0,
      revenue,
      ebitda,
      totalDebt,
      cash,
      enterpriseValue,
      debtToEquity,
      currentRatio,
      isDistressed,
      distressScore,
      description: profile?.description || demoData?.description,
      dataSource: yahooData && fmpData ? 'live' : 'hybrid',
      lastUpdated: new Date().toISOString(),
      yahooData: yahooData || undefined,
      fmpData: fmpData || undefined
    };

    return liveData;
  } catch (error) {
    console.error('Error fetching live company data:', error);

    // Fallback to demo data
    const demoData = await getCompanyByTicker(ticker);
    if (demoData) {
      return {
        ...demoData,
        dataSource: 'demo',
        lastUpdated: new Date().toISOString()
      };
    }

    return null;
  }
};

// Calculate distress score based on financial metrics
const calculateDistressScore = (metrics: {
  debtToEquity: number;
  currentRatio: number;
  ebitda: number;
  revenue: number;
  totalDebt: number;
  marketCap: number;
}): number => {
  let score = 0;

  // Debt/Equity ratio (0-30 points)
  if (metrics.debtToEquity > 10) score += 30;
  else if (metrics.debtToEquity > 5) score += 25;
  else if (metrics.debtToEquity > 3) score += 15;
  else if (metrics.debtToEquity > 1.5) score += 5;

  // Current ratio (0-20 points)
  if (metrics.currentRatio < 0.5) score += 20;
  else if (metrics.currentRatio < 0.8) score += 15;
  else if (metrics.currentRatio < 1.0) score += 10;
  else if (metrics.currentRatio < 1.5) score += 5;

  // EBITDA health (0-25 points)
  if (metrics.ebitda < 0) score += 25;
  else if (metrics.ebitda < metrics.revenue * 0.05) score += 15;
  else if (metrics.ebitda < metrics.revenue * 0.10) score += 10;

  // Market cap relative to debt (0-25 points)
  const debtToMC = metrics.totalDebt / Math.max(metrics.marketCap, 1);
  if (debtToMC > 10) score += 25;
  else if (debtToMC > 5) score += 20;
  else if (debtToMC > 2) score += 15;
  else if (debtToMC > 1) score += 10;

  return Math.min(100, Math.max(0, score));
};

// Cache for API responses (5 minute TTL)
const cache = new Map<string, { data: LiveCompanyData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const fetchLiveCompanyDataCached = async (ticker: string): Promise<LiveCompanyData | null> => {
  const cached = cache.get(ticker.toUpperCase());
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`Using cached data for ${ticker}`);
    return cached.data;
  }

  const data = await fetchLiveCompanyData(ticker);
  if (data) {
    cache.set(ticker.toUpperCase(), { data, timestamp: Date.now() });
  }
  return data;
};
