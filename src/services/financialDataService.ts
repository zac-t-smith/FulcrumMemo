// Financial Data Service - Hybrid approach with demo data and API integration

export interface CompanyData {
  ticker: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  marketCap: number;
  price: number;
  beta: number;
  // Financial metrics
  revenue: number;
  ebitda: number;
  totalDebt: number;
  cash: number;
  enterpriseValue: number;
  // Distress indicators
  debtToEquity: number;
  currentRatio: number;
  isDistressed: boolean;
  distressScore?: number; // 0-100, higher = more distressed
  // Additional context
  description?: string;
  lastUpdated?: string;
}

// Demo data for common distressed/RX case study companies
const demoCompanyDatabase: Record<string, CompanyData> = {
  'KIRK': {
    ticker: 'KIRK',
    name: "Kirkland's, Inc.",
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    industry: 'Specialty Retail',
    marketCap: 12000, // $12M
    price: 2.15,
    beta: 1.8,
    revenue: 380000, // $380M
    ebitda: 7000, // $7M
    totalDebt: 53000, // $53M
    cash: 5200, // $5.2M
    enterpriseValue: 35000, // $35M
    debtToEquity: 4.5,
    currentRatio: 0.8,
    isDistressed: true,
    distressScore: 85,
    description: 'Specialty retailer of home décor and furnishings. Facing margin compression and e-commerce competition.',
    lastUpdated: '2024-01-15'
  },
  'PTCY': {
    ticker: 'PTCY',
    name: 'Party City Holdco Inc.',
    exchange: 'NYSE',
    sector: 'Consumer Cyclical',
    industry: 'Specialty Retail',
    marketCap: 8000, // $8M
    price: 0.12,
    beta: 2.1,
    revenue: 2100000, // $2.1B
    ebitda: 85000, // $85M
    totalDebt: 1750000, // $1.75B
    cash: 45000, // $45M
    enterpriseValue: 950000, // $950M
    debtToEquity: 12.5,
    currentRatio: 0.6,
    isDistressed: true,
    distressScore: 95,
    description: 'Party supplies retailer with high debt load and declining brick-and-mortar traffic. Multiple restructuring attempts.',
    lastUpdated: '2024-01-15'
  },
  'EXPR': {
    ticker: 'EXPR',
    name: 'Express, Inc.',
    exchange: 'NYSE',
    sector: 'Consumer Cyclical',
    industry: 'Apparel Retail',
    marketCap: 15000,
    price: 0.85,
    beta: 1.9,
    revenue: 1850000, // $1.85B
    ebitda: 42000, // $42M
    totalDebt: 385000, // $385M
    cash: 28000, // $28M
    enterpriseValue: 320000, // $320M
    debtToEquity: 8.2,
    currentRatio: 0.75,
    isDistressed: true,
    distressScore: 82,
    description: 'Fashion apparel retailer facing competition from fast fashion and e-commerce. Mall-based footprint under pressure.',
    lastUpdated: '2024-01-15'
  },
  'BBBY': {
    ticker: 'BBBY',
    name: 'Bed Bath & Beyond Inc.',
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    industry: 'Home Improvement',
    marketCap: 2500,
    price: 0.05,
    beta: 2.5,
    revenue: 7900000, // $7.9B
    ebitda: -450000, // -$450M (negative)
    totalDebt: 2850000, // $2.85B
    cash: 75000, // $75M
    enterpriseValue: 450000, // $450M (deeply distressed)
    debtToEquity: 25.0,
    currentRatio: 0.45,
    isDistressed: true,
    distressScore: 98,
    description: 'Home goods retailer in severe distress. Liquidity crisis and potential bankruptcy filing imminent.',
    lastUpdated: '2024-01-15'
  },
  'TUEM': {
    ticker: 'TUEM',
    name: 'Tuesday Morning Corporation',
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    industry: 'Discount Stores',
    marketCap: 3200,
    price: 0.18,
    beta: 1.6,
    revenue: 785000, // $785M
    ebitda: -12000, // -$12M
    totalDebt: 125000, // $125M
    cash: 8500, // $8.5M
    enterpriseValue: 65000, // $65M
    debtToEquity: 6.8,
    currentRatio: 0.55,
    isDistressed: true,
    distressScore: 88,
    description: 'Closeout/discount retailer with liquidity challenges and operational losses.',
    lastUpdated: '2024-01-15'
  },
  'RGS': {
    ticker: 'RGS',
    name: "Regis Corporation",
    exchange: 'NYSE',
    sector: 'Consumer Cyclical',
    industry: 'Personal Services',
    marketCap: 18500,
    price: 1.25,
    beta: 1.4,
    revenue: 680000, // $680M
    ebitda: 38000, // $38M
    totalDebt: 245000, // $245M
    cash: 15000, // $15M
    enterpriseValue: 185000, // $185M
    debtToEquity: 4.2,
    currentRatio: 0.9,
    isDistressed: true,
    distressScore: 72,
    description: 'Hair salon operator (Supercuts, SmartStyle) with declining mall traffic and high debt.',
    lastUpdated: '2024-01-15'
  },
  // Add some healthy companies for comparison
  'WMT': {
    ticker: 'WMT',
    name: 'Walmart Inc.',
    exchange: 'NYSE',
    sector: 'Consumer Defensive',
    industry: 'Discount Stores',
    marketCap: 412000000, // $412B
    price: 155.50,
    beta: 0.5,
    revenue: 611000000, // $611B
    ebitda: 38500000, // $38.5B
    totalDebt: 52500000, // $52.5B
    cash: 14500000, // $14.5B
    enterpriseValue: 450000000, // $450B
    debtToEquity: 0.6,
    currentRatio: 0.95,
    isDistressed: false,
    distressScore: 10,
    description: 'World\'s largest retailer with strong balance sheet and omnichannel strategy.',
    lastUpdated: '2024-01-15'
  },
  'AAPL': {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    marketCap: 2950000000, // $2.95T
    price: 185.25,
    beta: 1.2,
    revenue: 394000000, // $394B
    ebitda: 125000000, // $125B
    totalDebt: 95000000, // $95B
    cash: 162000000, // $162B
    enterpriseValue: 2880000000, // $2.88T
    debtToEquity: 1.8,
    currentRatio: 1.05,
    isDistressed: false,
    distressScore: 5,
    description: 'Leading technology company with fortress balance sheet and strong cash generation.',
    lastUpdated: '2024-01-15'
  }
};

// Search companies by ticker or name
export const searchCompanies = async (query: string): Promise<CompanyData[]> => {
  const normalizedQuery = query.toUpperCase().trim();

  if (!normalizedQuery) return [];

  // Search in demo database
  const results = Object.values(demoCompanyDatabase).filter(company =>
    company.ticker.includes(normalizedQuery) ||
    company.name.toUpperCase().includes(normalizedQuery)
  );

  // Sort: exact ticker matches first, then alphabetically
  return results.sort((a, b) => {
    if (a.ticker === normalizedQuery) return -1;
    if (b.ticker === normalizedQuery) return 1;
    return a.ticker.localeCompare(b.ticker);
  });
};

// Get company by ticker
export const getCompanyByTicker = async (ticker: string): Promise<CompanyData | null> => {
  const normalizedTicker = ticker.toUpperCase().trim();
  return demoCompanyDatabase[normalizedTicker] || null;
};

// Get all distressed companies
export const getDistressedCompanies = (): CompanyData[] => {
  return Object.values(demoCompanyDatabase)
    .filter(c => c.isDistressed)
    .sort((a, b) => (b.distressScore || 0) - (a.distressScore || 0));
};

// Calculate additional metrics
export const calculateMetrics = (company: CompanyData) => {
  return {
    // Leverage
    leverageRatio: company.enterpriseValue > 0 ? company.totalDebt / company.enterpriseValue : 0,
    netDebt: company.totalDebt - company.cash,
    debtToEBITDA: company.ebitda > 0 ? company.totalDebt / company.ebitda : Infinity,

    // Solvency
    isSolvent: company.enterpriseValue >= company.totalDebt,
    equityValue: Math.max(0, company.enterpriseValue - company.totalDebt),

    // Valuation
    evToRevenue: company.revenue > 0 ? company.enterpriseValue / company.revenue : 0,
    evToEBITDA: company.ebitda > 0 ? company.enterpriseValue / company.ebitda : Infinity,

    // Liquidity
    estimatedRunway: calculateRunway(company),

    // Distress classification
    distressLevel: getDistressLevel(company.distressScore || 0)
  };
};

const calculateRunway = (company: CompanyData): string => {
  // Rough estimate based on cash and EBITDA
  if (company.ebitda <= 0) {
    const quarterlyBurn = Math.abs(company.ebitda) / 4;
    const weeksOfRunway = quarterlyBurn > 0 ? (company.cash / quarterlyBurn) * 13 : 0;
    if (weeksOfRunway < 13) return `~${Math.round(weeksOfRunway)} weeks (URGENT)`;
    if (weeksOfRunway < 26) return `~${Math.round(weeksOfRunway)} weeks`;
    return `${Math.round(weeksOfRunway / 4)} months`;
  }
  return 'Positive EBITDA';
};

const getDistressLevel = (score: number): string => {
  if (score >= 90) return 'Severe Distress';
  if (score >= 75) return 'High Distress';
  if (score >= 50) return 'Moderate Distress';
  if (score >= 25) return 'Mild Stress';
  return 'Healthy';
};

// Future: API integration for real-time data
export const fetchRealTimeData = async (ticker: string, apiKey?: string): Promise<CompanyData | null> => {
  // Placeholder for future API integration (Financial Modeling Prep, Alpha Vantage, etc.)
  // For now, return null - users will use demo data

  if (!apiKey) {
    console.log('No API key provided. Using demo data.');
    return null;
  }

  // Example: Financial Modeling Prep API
  // const response = await fetch(`https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${apiKey}`);
  // const data = await response.json();
  // return transformToCompanyData(data);

  return null;
};

// Get suggested companies for case studies
export const getSuggestedCaseStudies = (): CompanyData[] => {
  return ['KIRK', 'PTCY', 'EXPR', 'BBBY', 'TUEM', 'RGS']
    .map(ticker => demoCompanyDatabase[ticker])
    .filter((c): c is CompanyData => c !== undefined);
};
