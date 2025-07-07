
import { CANDLESTICK_TYPES } from '@/config/forexConfig';

export const calculateSignalConditions = (
  rsi: number,
  stochastic: number,
  bollingerPosition: number,
  macdHist: number,
  candle: string
) => {
  let buyConditions = 0;
  let sellConditions = 0;

  if (rsi < 30) buyConditions++;
  if (rsi > 70) sellConditions++;
  if (stochastic < 20) buyConditions++;
  if (stochastic > 80) sellConditions++;
  if (bollingerPosition < 20) buyConditions++;
  if (bollingerPosition > 80) sellConditions++;
  if (macdHist > 0) buyConditions++;
  if (macdHist < 0) sellConditions++;
  if (candle.includes('Bull') || candle === 'Piercing') buyConditions++;
  if (candle.includes('Bear') || candle === 'Dark Cloud') sellConditions++;

  return { buyConditions, sellConditions };
};

export const determineSignal = (
  buyConditions: number,
  sellConditions: number,
  threshold: number
): string => {
  if (buyConditions >= 4) return 'GÜÇLÜ AL';
  if (sellConditions >= 4) return 'GÜÇLÜ SAT';
  if (buyConditions >= threshold) return 'AL';
  if (sellConditions >= threshold) return 'SAT';
  return 'NÖTR';
};

export const getSignalColor = (signal: string): string => {
  switch (signal) {
    case 'GÜÇLÜ AL': return 'signal-strong-buy';
    case 'AL': return 'signal-buy';
    case 'GÜÇLÜ SAT': return 'signal-strong-sell';
    case 'SAT': return 'signal-sell';
    default: return 'signal-neutral';
  }
};

export const getCandleColor = (candle: string): string => {
  if (candle.includes('Bull') || candle === 'Piercing') return 'text-green-400';
  if (candle.includes('Bear') || candle === 'Dark Cloud') return 'text-red-400';
  return 'text-yellow-400';
};

export const getRandomCandle = (): string => {
  return CANDLESTICK_TYPES[Math.floor(Math.random() * CANDLESTICK_TYPES.length)];
};
