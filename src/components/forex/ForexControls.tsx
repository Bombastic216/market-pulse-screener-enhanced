
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Activity, RefreshCw } from 'lucide-react';
import { timeframes } from '@/config/forexConfig';

interface ForexControlsProps {
  globalTimeframe: string;
  setGlobalTimeframe: (value: string) => void;
  signalThreshold: number;
  setSignalThreshold: (value: number) => void;
  binomoThreshold: number;
  setBinomoThreshold: (value: number) => void;
  useIndividualTF: boolean;
  setUseIndividualTF: (value: boolean) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
}

const ForexControls: React.FC<ForexControlsProps> = ({
  globalTimeframe,
  setGlobalTimeframe,
  signalThreshold,
  setSignalThreshold,
  binomoThreshold,
  setBinomoThreshold,
  useIndividualTF,
  setUseIndividualTF,
  isRefreshing,
  onRefresh
}) => {
  return (
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
            onClick={onRefresh} 
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
  );
};

export default ForexControls;
