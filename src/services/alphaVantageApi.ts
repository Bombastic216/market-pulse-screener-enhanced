
const API_KEY = 'KSTCTRZ2W6U0IHQG';
const BASE_URL = 'https://www.alphavantage.co/query';

export interface ForexRealTimeData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export interface TechnicalIndicatorData {
  rsi: number;
  sma: number;
  ema: number;
  timestamp: string;
}

// Forex gerçek zamanlı veri çekme
export const fetchForexRealTime = async (fromSymbol: string, toSymbol: string): Promise<ForexRealTimeData | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromSymbol}&to_currency=${toSymbol}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      console.warn('Alpha Vantage API limit or error:', data);
      return null;
    }
    
    const exchangeRate = data['Realtime Currency Exchange Rate'];
    if (!exchangeRate) {
      console.warn('No exchange rate data found');
      return null;
    }
    
    return {
      symbol: `${fromSymbol}${toSymbol}`,
      price: parseFloat(exchangeRate['5. Exchange Rate']),
      change: 0, // Alpha Vantage doesn't provide direct change in this endpoint
      changePercent: 0,
      timestamp: exchangeRate['6. Last Refreshed']
    };
  } catch (error) {
    console.error('Error fetching forex data:', error);
    return null;
  }
};

// RSI teknik göstergesi çekme
export const fetchRSI = async (symbol: string, interval: string = 'daily'): Promise<number | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=RSI&symbol=${symbol}&interval=${interval}&time_period=14&series_type=close&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      console.warn('Alpha Vantage RSI API limit or error:', data);
      return null;
    }
    
    const technicalAnalysis = data['Technical Analysis: RSI'];
    if (!technicalAnalysis) {
      return null;
    }
    
    // En son RSI değerini al
    const latestDate = Object.keys(technicalAnalysis)[0];
    const rsiValue = parseFloat(technicalAnalysis[latestDate]['RSI']);
    
    return rsiValue;
  } catch (error) {
    console.error('Error fetching RSI data:', error);
    return null;
  }
};

// SMA (Simple Moving Average) çekme
export const fetchSMA = async (symbol: string, interval: string = 'daily', timePeriod: number = 20): Promise<number | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=SMA&symbol=${symbol}&interval=${interval}&time_period=${timePeriod}&series_type=close&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      console.warn('Alpha Vantage SMA API limit or error:', data);
      return null;
    }
    
    const technicalAnalysis = data['Technical Analysis: SMA'];
    if (!technicalAnalysis) {
      return null;
    }
    
    const latestDate = Object.keys(technicalAnalysis)[0];
    const smaValue = parseFloat(technicalAnalysis[latestDate]['SMA']);
    
    return smaValue;
  } catch (error) {
    console.error('Error fetching SMA data:', error);
    return null;
  }
};

// MACD çekme
export const fetchMACD = async (symbol: string, interval: string = 'daily'): Promise<{ macd: number; signal: number; histogram: number } | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=MACD&symbol=${symbol}&interval=${interval}&series_type=close&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      console.warn('Alpha Vantage MACD API limit or error:', data);
      return null;
    }
    
    const technicalAnalysis = data['Technical Analysis: MACD'];
    if (!technicalAnalysis) {
      return null;
    }
    
    const latestDate = Object.keys(technicalAnalysis)[0];
    const macdData = technicalAnalysis[latestDate];
    
    return {
      macd: parseFloat(macdData['MACD']),
      signal: parseFloat(macdData['MACD_Signal']),
      histogram: parseFloat(macdData['MACD_Hist'])
    };
  } catch (error) {
    console.error('Error fetching MACD data:', error);
    return null;
  }
};

// Forex çiftlerini Alpha Vantage formatına çevirme
export const convertForexPairToAlphaVantage = (pair: string): { from: string; to: string } => {
  const forexMap: Record<string, { from: string; to: string }> = {
    'EURUSD': { from: 'EUR', to: 'USD' },
    'GBPUSD': { from: 'GBP', to: 'USD' },
    'USDJPY': { from: 'USD', to: 'JPY' },
    'USDCHF': { from: 'USD', to: 'CHF' },
    'AUDUSD': { from: 'AUD', to: 'USD' },
    'USDCAD': { from: 'USD', to: 'CAD' },
    'NZDUSD': { from: 'NZD', to: 'USD' },
    'EURJPY': { from: 'EUR', to: 'JPY' },
    'GBPJPY': { from: 'GBP', to: 'JPY' },
    'EURGBP': { from: 'EUR', to: 'GBP' },
  };
  
  return forexMap[pair] || { from: pair.slice(0, 3), to: pair.slice(3, 6) };
};
