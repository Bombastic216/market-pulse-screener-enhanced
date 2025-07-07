
import React, { useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { INITIAL_PAIRS } from '@/config/forexConfig';
import { useForexData } from '@/hooks/useForexData';
import ForexControls from '@/components/forex/ForexControls';
import PairsConfiguration from '@/components/forex/PairsConfiguration';
import ForexDataTable from '@/components/forex/ForexDataTable';

const ForexScreener = () => {
  const [pairs, setPairs] = useState(INITIAL_PAIRS);
  const [globalTimeframe, setGlobalTimeframe] = useState('30s');
  const [useIndividualTF, setUseIndividualTF] = useState(false);
  const [signalThreshold, setSignalThreshold] = useState(3);
  const [binomoThreshold, setBinomoThreshold] = useState(3);

  const { technicalData, isRefreshing, isOnline, apiCallCount, refreshData } = useForexData(
    pairs,
    signalThreshold,
    binomoThreshold
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              ♦ Enhanced Forex Multi-Indicator Screener ♦
            </h1>
            {isOnline ? (
              <Wifi className="w-6 h-6 text-green-400" />
            ) : (
              <WifiOff className="w-6 h-6 text-red-400" />
            )}
          </div>
          <p className="text-slate-400">
            Alpha Vantage API ile Gerçek Zamanlı Teknik Analiz - 30 Saniye Güncelleme
            {apiCallCount > 0 && (
              <span className="ml-2 text-xs bg-blue-500/20 px-2 py-1 rounded">
                API Çağrısı: {apiCallCount}
              </span>
            )}
          </p>
        </div>

        {/* Controls */}
        <ForexControls
          globalTimeframe={globalTimeframe}
          setGlobalTimeframe={setGlobalTimeframe}
          signalThreshold={signalThreshold}
          setSignalThreshold={setSignalThreshold}
          binomoThreshold={binomoThreshold}
          setBinomoThreshold={setBinomoThreshold}
          useIndividualTF={useIndividualTF}
          setUseIndividualTF={setUseIndividualTF}
          isRefreshing={isRefreshing}
          onRefresh={refreshData}
        />

        {/* Pairs Configuration */}
        <PairsConfiguration
          pairs={pairs}
          onTogglePair={togglePair}
          onUpdatePairTimeframe={updatePairTimeframe}
          useIndividualTF={useIndividualTF}
        />

        {/* Data Table */}
        <ForexDataTable
          pairs={pairs}
          technicalData={technicalData}
          globalTimeframe={globalTimeframe}
          useIndividualTF={useIndividualTF}
        />

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500">
          <p>© 2024 Enhanced Forex Screener - Alpha Vantage API ile gerçek zamanlı teknik analiz</p>
          <p className="text-xs mt-1">API Anahtarı: KSTCTRZ2W6U0IHQG (İlk 3 çift için gerçek veri)</p>
        </div>
      </div>
    </div>
  );
};

export default ForexScreener;
