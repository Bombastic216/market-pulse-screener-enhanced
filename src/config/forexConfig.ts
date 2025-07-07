
import { ForexPair, TimeframeOption } from '@/types/forex';

export const INITIAL_PAIRS: ForexPair[] = [
  { id: 1, symbol: 'EURUSD', enabled: true, timeframe: '30s' },
  { id: 2, symbol: 'AUDCAD', enabled: true, timeframe: '30s' },
  { id: 3, symbol: 'CHFJPY', enabled: true, timeframe: '30s' },
  { id: 4, symbol: 'GBPUSD', enabled: true, timeframe: '30s' },
  { id: 5, symbol: 'USDJPY', enabled: true, timeframe: '30s' },
  { id: 6, symbol: 'USDCHF', enabled: true, timeframe: '30s' },
  { id: 7, symbol: 'AUDUSD', enabled: true, timeframe: '30s' },
  { id: 8, symbol: 'USDCAD', enabled: true, timeframe: '30s' },
  { id: 9, symbol: 'NZDUSD', enabled: false, timeframe: '1m' },
  { id: 10, symbol: 'EURJPY', enabled: false, timeframe: '1m' },
  { id: 11, symbol: 'GBPJPY', enabled: false, timeframe: '1m' },
  { id: 12, symbol: 'EURGBP', enabled: false, timeframe: '1m' }
];

export const timeframes: TimeframeOption[] = [
  { value: '30s', label: '30 Saniye' },
  { value: '1m', label: '1 Dakika' },
  { value: '5m', label: '5 Dakika' },
  { value: '15m', label: '15 Dakika' },
  { value: '30m', label: '30 Dakika' },
  { value: '1h', label: '1 Saat' },
  { value: '4h', label: '4 Saat' },
  { value: '1d', label: '1 Gün' }
];

export const CANDLESTICK_TYPES = [
  'Bull', 'Bear', 'Doji', 'Bull Pin', 'Bear Pin', 
  'Bull Engulf', 'Bear Engulf', 'Piercing', 'Dark Cloud'
];
