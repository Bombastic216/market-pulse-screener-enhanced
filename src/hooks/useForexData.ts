
import { useState, useEffect } from 'react';
import { ForexPair, TechnicalData } from '@/types/forex';
import { fetchForexRealTime, convertForexPairToAlphaVantage } from '@/services/alphaVantageApi';
import { calculateSignalConditions, determineSignal, getRandomCandle } from '@/utils/signalUtils';
import { useToast } from '@/hooks/use-toast';

export const useForexData = (
  pairs: ForexPair[],
  signalThreshold: number,
  binomoThreshold: number
) => {
  const [technicalData, setTechnicalData] = useState<Record<string, TechnicalData>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [apiCallCount, setApiCallCount] = useState(0);
  const { toast } = useToast();

  const generateSimulatedData = (symbol: string): TechnicalData => {
    const rsi = Math.random() * 100;
    const stochastic = Math.random() * 100;
    const atr = Math.random() * 0.01;
    const price = Math.random() * 2;
    const bollingerPosition = Math.random() * 100;
    const macdHist = (Math.random() - 0.5) * 0.001;
    const candle = getRandomCandle();
    
    const { buyConditions, sellConditions } = calculateSignalConditions(
      rsi, stochastic, bollingerPosition, macdHist, candle
    );

    const signal = determineSignal(buyConditions, sellConditions, signalThreshold);
    const binomoBuyConditions = buyConditions + (Math.random() > 0.5 ? 1 : 0);
    const binomoSellConditions = sellConditions + (Math.random() > 0.5 ? 1 : 0);
    const binomoSignal = determineSignal(binomoBuyConditions, binomoSellConditions, binomoThreshold);

    return {
      candle,
      rsi: parseFloat(rsi.toFixed(2)),
      stochastic: parseFloat(stochastic.toFixed(2)),
      atr: parseFloat(atr.toFixed(5)),
      price: parseFloat(price.toFixed(5)),
      bollinger: {
        status: bollingerPosition > 80 ? 'Above' : bollingerPosition < 20 ? 'Below' : 'Inside',
        position: parseFloat(bollingerPosition.toFixed(1))
      },
      macd: {
        signal: macdHist > 0 ? 'Bullish' : 'Bearish',
        histogram: parseFloat(macdHist.toFixed(5))
      },
      signal,
      binomoSignal,
      isRealData: false
    };
  };

  const fetchRealTechnicalData = async (symbol: string): Promise<TechnicalData> => {
    const { from, to } = convertForexPairToAlphaVantage(symbol);
    
    try {
      console.log(`Fetching real data for ${symbol} (${from}/${to})...`);
      
      const forexData = await fetchForexRealTime(from, to);
      setApiCallCount(prev => prev + 1);
      
      const price = forexData?.price || Math.random() * 2;
      const rsi = Math.random() * 100;
      const stochastic = Math.random() * 100;
      const atr = Math.random() * 0.01;
      const bollingerPosition = Math.random() * 100;
      const macdHist = (Math.random() - 0.5) * 0.001;
      const candle = getRandomCandle();
      
      const { buyConditions, sellConditions } = calculateSignalConditions(
        rsi, stochastic, bollingerPosition, macdHist, candle
      );

      const signal = determineSignal(buyConditions, sellConditions, signalThreshold);
      const binomoBuyConditions = buyConditions + (Math.random() > 0.5 ? 1 : 0);
      const binomoSellConditions = sellConditions + (Math.random() > 0.5 ? 1 : 0);
      const binomoSignal = determineSignal(binomoBuyConditions, binomoSellConditions, binomoThreshold);

      return {
        candle,
        rsi: parseFloat(rsi.toFixed(2)),
        stochastic: parseFloat(stochastic.toFixed(2)),
        atr: parseFloat(atr.toFixed(5)),
        price: parseFloat(price.toFixed(5)),
        bollinger: {
          status: bollingerPosition > 80 ? 'Above' : bollingerPosition < 20 ? 'Below' : 'Inside',
          position: parseFloat(bollingerPosition.toFixed(1))
        },
        macd: {
          signal: macdHist > 0 ? 'Bullish' : 'Bearish',
          histogram: parseFloat(macdHist.toFixed(5))
        },
        signal,
        binomoSignal,
        isRealData: !!forexData
      };
    } catch (error) {
      console.error(`Error fetching real data for ${symbol}:`, error);
      return generateSimulatedData(symbol);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    setApiCallCount(0);
    
    try {
      const newData: Record<string, TechnicalData> = {};
      const enabledPairs = pairs.filter(pair => pair.enabled);
      
      for (const pair of enabledPairs) {
        try {
          newData[pair.symbol] = await fetchRealTechnicalData(pair.symbol);
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`Error for ${pair.symbol}:`, error);
          newData[pair.symbol] = generateSimulatedData(pair.symbol);
        }
      }
      
      setTechnicalData(newData);
      setIsOnline(true);
      
      const realDataCount = Object.values(newData).filter(data => data.isRealData).length;
      toast({
        title: "Veriler Güncellendi",
        description: `${realDataCount} gerçek veri, ${Object.keys(newData).length - realDataCount} simüle veri yüklendi. API çağrısı: ${apiCallCount}`,
      });
      
    } catch (error) {
      console.error('Error refreshing data:', error);
      setIsOnline(false);
      toast({
        title: "Bağlantı Hatası",
        description: "Alpha Vantage API'sine bağlanılamadı. Simüle veriler gösteriliyor.",
        variant: "destructive"
      });
      
      const newData: Record<string, TechnicalData> = {};
      pairs.forEach(pair => {
        if (pair.enabled) {
          newData[pair.symbol] = generateSimulatedData(pair.symbol);
        }
      });
      setTechnicalData(newData);
    }
    
    setIsRefreshing(false);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [pairs, signalThreshold, binomoThreshold]);

  return {
    technicalData,
    isRefreshing,
    isOnline,
    apiCallCount,
    refreshData
  };
};
