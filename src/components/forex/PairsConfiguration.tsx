
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ForexPair } from '@/types/forex';
import { timeframes } from '@/config/forexConfig';

interface PairsConfigurationProps {
  pairs: ForexPair[];
  onTogglePair: (id: number) => void;
  onUpdatePairTimeframe: (id: number, timeframe: string) => void;
  useIndividualTF: boolean;
}

const PairsConfiguration: React.FC<PairsConfigurationProps> = ({
  pairs,
  onTogglePair,
  onUpdatePairTimeframe,
  useIndividualTF
}) => {
  return (
    <Card className="trading-card mb-6">
      <CardHeader>
        <CardTitle>Döviz Çiftleri Yapılandırması</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {pairs.map(pair => (
            <div key={pair.id} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={pair.enabled} 
                  onCheckedChange={() => onTogglePair(pair.id)}
                />
                <Label className={`font-semibold ${pair.enabled ? 'text-green-400' : 'text-slate-400'}`}>
                  {pair.symbol}
                </Label>
              </div>
              {useIndividualTF && pair.enabled && (
                <Select 
                  value={pair.timeframe} 
                  onValueChange={(value) => onUpdatePairTimeframe(pair.id, value)}
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
  );
};

export default PairsConfiguration;
