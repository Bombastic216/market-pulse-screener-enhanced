
export interface ForexPair {
  id: number;
  symbol: string;
  enabled: boolean;
  timeframe: string;
}

export interface TechnicalData {
  candle: string;
  rsi: number;
  stochastic: number;
  atr: number;
  price: number;
  bollinger: {
    status: string;
    position: number;
  };
  macd: {
    signal: string;
    histogram: number;
  };
  signal: string;
  binomoSignal: string;
  isRealData: boolean;
}

export interface TimeframeOption {
  value: string;
  label: string;
}
