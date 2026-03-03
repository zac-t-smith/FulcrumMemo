// Yahoo Finance API Service - Free, no API key required

export interface YahooStockData {
  companyName: string;
  ticker: string;
  stockPrice: number;
  marketCap: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  error?: string;
}

export const fetchStockData = async (ticker: string): Promise<YahooStockData | null> => {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${ticker.toUpperCase()}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.chart?.result?.[0]) {
      throw new Error('No data found for ticker');
    }

    const result = data.chart.result[0];
    const meta = result.meta;
    const quote = result.indicators?.quote?.[0];

    return {
      companyName: meta.longName || meta.shortName || ticker,
      ticker: ticker.toUpperCase(),
      stockPrice: meta.regularMarketPrice || meta.previousClose || 0,
      marketCap: meta.marketCap || 0,
      previousClose: meta.previousClose || meta.chartPreviousClose || 0,
      dayHigh: meta.regularMarketDayHigh || 0,
      dayLow: meta.regularMarketDayLow || 0,
      volume: meta.regularMarketVolume || 0
    };
  } catch (error) {
    console.error('Yahoo Finance fetch error:', error);
    return null;
  }
};

// Get basic quote with retry logic
export const fetchQuickQuote = async (ticker: string, retries = 2): Promise<YahooStockData | null> => {
  for (let i = 0; i <= retries; i++) {
    const data = await fetchStockData(ticker);
    if (data) return data;

    // Wait before retry (exponential backoff)
    if (i < retries) {
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
  return null;
};
