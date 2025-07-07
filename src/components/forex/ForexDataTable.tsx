
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ForexPair, TechnicalData } from '@/types/forex';
import { getSignalColor, getCandleColor } from '@/utils/signalUtils';

interface ForexDataTableProps {
  pairs: ForexPair[];
  technicalData: Record<string, TechnicalData>;
  globalTimeframe: string;
  useIndividualTF: boolean;
}

const ForexDataTable: React.FC<ForexDataTableProps> = ({
  pairs,
  technicalData,
  globalTimeframe,
  useIndividualTF
}) => {
  return (
    <Card className="trading-card">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">No</th>
                <th className="px-4 py-3 text-left font-semibold">Sembol</th>
                <th className="px-4 py-3 text-left font-semibold">Fiyat</th>
                <th className="px-4 py-3 text-left font-semibold">Zaman</th>
                <th className="px-4 py-3 text-left font-semibold">Mum</th>
                <th className="px-4 py-3 text-left font-semibold">RSI</th>
                <th className="px-4 py-3 text-left font-semibold">Stochastic</th>
                <th className="px-4 py-3 text-left font-semibold">ATR</th>
                <th className="px-4 py-3 text-left font-semibold">Bollinger B.</th>
                <th className="px-4 py-3 text-left font-semibold">MACD</th>
                <th className="px-4 py-3 text-left font-semibold">Sinyal</th>
                <th className="px-4 py-3 text-left font-semibold">Binomo</th>
                <th className="px-4 py-3 text-left font-semibold">Durum</th>
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
                    <td className="px-4 py-3 font-mono text-green-400">{data.price}</td>
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
                    <td className="px-4 py-3">
                      {data.isRealData ? (
                        <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                          Gerçek
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/30">
                          Simüle
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForexDataTable;
