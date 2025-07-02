
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TrendingUp, TrendingDown, Activity, RefreshCw } from 'lucide-react';

interface ForexPair {
  id: number;
  symbol: string;
  enabled: boolean;
  timeframe: string;
}

interface TechnicalData {
  candle: string;
  rsi: number;
  stochastic: number;
  atr: number;
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
}

const ForexScreener = () => {
  const [pairs, setPairs] = useState<ForexPair[]>([
    { id: 1, symbol: 'EURUSD', enabled: true, timeframe: '1m' },
    { id: 2, symbol: 'GBPUSD', enabled: true, timeframe: '1m' },
    { id: 3, symbol: 'USDJPY', enabled: true, timeframe: '1m' },
    { id: 4, symbol: 'USDCHF', enabled: true, timeframe: '1m' },
    { id: 5, symbol: 'AUDUSD', enabled: true, timeframe: '1m' },
    { id: 6, symbol: 'USDCAD', enabled: true, timeframe: '1m' },
    { id: 7, symbol: 'NZDUSD', enabled: true, timeframe: '1m' },
    { id: 8, symbol: 'EURJPY', enabled: true, timeframe: '1m' },
    { id: 9, symbol: 'GBPJPY', enabled: true, timeframe: '1m' },
    { id: 10, symbol: 'EURGBP', enabled: true, timeframe: '1m' }
  ]);

  const [globalTimeframe, setGlobalTimeframe] = useState('1m');
  const [useIndividualTF, setUseIndividualTF] = useState(false);
  const [signalThreshold, setSignalThreshold] = useState(3);
  const [binomoThreshold, setBinomoThreshold] = useState(3);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [technicalData, setTechnicalData] = useState<Record<string, TechnicalData>>({});

  const timeframes = [
    { value: '1m', label: '1 Dakika' },
    { value: '5m', label: '5 Dakika' },
    { value: '15m', label: '15 Dakika' },
    { value: '30m', label: '30 Dakika' },
    { value: '1h', label: '1 Saat' },
    { value: '4h', label: '4 Saat' },
    { value: '1d', label: '1 Gün' }
  ];

  // Simulated technical analysis function
  const generateTechnicalData = (symbol: string): TechnicalData => {
    const rsi = Math.random() * 100;
    const stochastic = Math.random() * 100;
    const atr = Math.random() * 0.01;
    const bollingerPosition = Math.random() * 100;
    const macdHist = (Math.random() - 0.5) * 0.001;
    
    const candleTypes = ['Bull', 'Bear', 'Doji', 'Bull Pin', 'Bear Pin', 'Bull Engulf', 'Bear Engulf', 'Piercing', 'Dark Cloud'];
    const candle = candleTypes[Math.floor(Math.random() * candleTypes.length)];
    
    let buyConditions = 0;
    let sellConditions = 0;
    let binomoBuyConditions = 0;
    let binomoSellConditions = 0;

    // Original signal conditions
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

    // Binomo signal conditions (additional indicators)
    if (Math.random() > 0.5) binomoBuyConditions++;
    if (Math.random() > 0.5) binomoSellConditions++;
    binomoBuyConditions += buyConditions;
    binomoSellConditions += sellConditions;

    let signal = 'NÖTR';
    let binomoSignal = 'NÖTR';

    if (buyConditions >= 4) signal = 'GÜÇLÜ AL';
    else if (sellConditions >= 4) signal = 'GÜÇLÜ SAT';
    else if (buyConditions >= signalThreshold) signal = 'AL';
    else if (sellConditions >= signalThreshold) signal = 'SAT';

    if (binomoBuyConditions >= 4) binomoSignal = 'GÜÇLÜ AL';
    else if (binomoSellConditions >= 4) binomoSignal = 'GÜÇLÜ SAT';
    else if (binomoBuyConditions >= binomoThreshold) binomoSignal = 'AL';
    else if (binomoSellConditions >= binomoThreshold) binomoSignal = 'SAT';

    return {
      candle,
      rsi: parseFloat(rsi.toFixed(2)),
      stochastic: parseFloat(stochastic.toFixed(2)),
      atr: parseFloat(atr.toFixed(5)),
      bollinger: {
        status: bollingerPosition > 80 ? 'Above' : bollingerPosition < 20 ? 'Below' : 'Inside',
        position: parseFloat(bollingerPosition.toFixed(1))
      },
      macd: {
        signal: macdHist > 0 ? 'Bullish' : 'Bearish',
        histogram: parseFloat(macdHist.toFixed(5))
      },
      signal,
      binomoSignal
    };
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newData: Record<string, TechnicalData> = {};
    pairs.forEach(pair => {
      if (pair.enabled) {
        newData[pair.symbol] = generateTechnicalData(pair.symbol);
      }
    });
    
    setTechnicalData(newData);
    setIsRefreshing(false);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [pairs, signalThreshold, binomoThreshold]);

  const togglePair = (id: number) => {
    setPairs(prev => prev.map(pair => 
      pair.id === id ? { ...pair, enabled: !pair.enabled } : pair
    ));
  };

  const updatePairTimeframe = (id: number, timeframe: string) => {
    setPairs(prev => prev.map(pair => 
      pair.id === id ? { ...pair, timeframe } : pair
    ));
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'GÜÇLÜ AL': return 'signal-strong-buy';
      case 'AL': return 'signal-buy';
      case 'GÜÇLÜ SAT': return 'signal-strong-sell';
      case 'SAT': return 'signal-sell';
      default: return 'signal-neutral';
    }
  };

  const getCandleColor = (candle: string) => {
    if (candle.includes('Bull') || candle === 'Piercing') return 'text-green-400';
    if (candle.includes('Bear') || candle === 'Dark Cloud') return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
            ♦ Enhanced Forex Multi-Indicator Screener ♦
          </h1>
          <p className="text-slate-400">Gelişmiş Teknik Analiz ve Sinyal Sistemi</p>
        </div>

        {/* Controls */}
        <Card className="trading-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Ayarlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Global Zaman Dilimi</Label>
                <Select value={globalTimeframe} onValueChange={setGlobalTimeframe}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframes.map(tf => (
                      <SelectItem key={tf.value} value={tf.value}>{tf.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Sinyal Eşiği</Label>
                <Select value={signalThreshold.toString()} onValueChange={(value) => setSignalThreshold(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Binomo Eşiği</Label>
                <Select value={binomoThreshold.toString()} onValueChange={(value) => setBinomoThreshold(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="individual-tf" 
                  checked={useIndividualTF} 
                  onCheckedChange={setUseIndividualTF}
                />
                <Label htmlFor="individual-tf">Bireysel Zaman Dilimleri</Label>
              </div>
              
              <Button 
                onClick={refreshData} 
                disabled={isRefreshing}
                className="bg-green-600 hover:bg-green-700"
              >
                {isRefreshing ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Yenile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pairs Configuration */}
        <Card className="trading-card mb-6">
          <CardHeader>
            <CardTitle>Döviz Çiftleri Yapılandırması</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {pairs.map(pair => (
                <div key={pair.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={pair.enabled} 
                      onCheckedChange={() => togglePair(pair.id)}
                    />
                    <Label className="font-semibold">{pair.symbol}</Label>
                  </div>
                  {useIndividualTF && pair.enabled && (
                    <Select 
                      value={pair.timeframe} 
                      onValueChange={(value) => updatePairTimeframe(pair.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeframes.map(tf => (
                          <SelectItem key={tf.value} value={tf.value}>{tf.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="trading-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50 border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">No</th>
                    <th className="px-4 py-3 text-left font-semibold">Sembol</th>
                    <th className="px-4 py-3 text-left font-semibold">Zaman</th>
                    <th className="px-4 py-3 text-left font-semibold">Mum</th>
                    <th className="px-4 py-3 text-left font-semibold">RSI</th>
                    <th className="px-4 py-3 text-left font-semibold">Stochastic</th>
                    <th className="px-4 py-3 text-left font-semibold">ATR</th>
                    <th className="px-4 py-3 text-left font-semibold">Bollinger B.</th>
                    <th className="px-4 py-3 text-left font-semibold">MACD</th>
                    <th className="px-4 py-3 text-left font-semibold">Sinyal</th>
                    <th className="px-4 py-3 text-left font-semibold">Binomo</th>
                  </tr>
                </thead>
                <tbody>
                  {pairs.filter(pair => pair.enabled).map((pair, index) => {
                    const data = technicalData[pair.symbol];
                    if (!data) return null;
                    
                    return (
                      <tr key={pair.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors animate-slide-up">
                        <td className="px-4 py-3 text-slate-300">{index + 1}</td>
                        <td className="px-4 py-3 font-semibold text-white">{pair.symbol}</td>
                        <td className="px-4 py-3 text-slate-300">{useIndividualTF ? pair.timeframe : globalTimeframe}</td>
                        <td className={`px-4 py-3 font-medium ${getCandleColor(data.candle)}`}>{data.candle}</td>
                        <td className={`px-4 py-3 ${data.rsi > 70 ? 'text-red-400' : data.rsi < 30 ? 'text-green-400' : 'text-slate-300'}`}>
                          {data.rsi}
                        </td>
                        <td className={`px-4 py-3 ${data.stochastic > 80 ? 'text-red-400' : data.stochastic < 20 ? 'text-green-400' : 'text-slate-300'}`}>
                          {data.stochastic}
                        </td>
                        <td className="px-4 py-3 text-slate-300">{data.atr}</td>
                        <td className={`px-4 py-3 ${data.bollinger.status === 'Above' ? 'text-red-400' : data.bollinger.status === 'Below' ? 'text-green-400' : 'text-slate-300'}`}>
                          {data.bollinger.status} ({data.bollinger.position}%)
                        </td>
                        <td className={`px-4 py-3 ${data.macd.signal === 'Bullish' ? 'text-green-400' : 'text-red-400'}`}>
                          {data.macd.signal} ({data.macd.histogram})
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`signal-badge ${getSignalColor(data.signal)}`}>
                            {data.signal}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`signal-badge ${getSignalColor(data.binomoSignal)}`}>
                            {data.binomoSignal}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500">
          <p>© 2024 Enhanced Forex Screener - Gerçek zamanlı teknik analiz</p>
        </div>
      </div>
    </div>
  );
};

export default ForexScreener;
