import { useRef } from 'react';
import { GlassCard } from '@/components/layout/GlassCard';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShareTradePlanButton } from '@/components/share/ShareTradePlanButton';
import { TradePlanCard } from '@/components/share/TradePlanCard';
import { RiskRewardIndicator } from '@/components/visual/RiskRewardIndicator';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import { calculateRisk } from '@/lib/calculators/risk';
import { formatUSD, formatPercent, formatNumber } from '@/lib/format';
import { Shield, AlertCircle } from 'lucide-react';

interface RiskState {
  entryPrice: string;
  stopLoss: string;
  totalCapital: string;
  riskPercent: string;
  targetPrice: string;
}

const defaultState: RiskState = {
  entryPrice: '',
  stopLoss: '',
  totalCapital: '',
  riskPercent: '1',
  targetPrice: '',
};

export function RiskModule() {
  const [state, setState] = useLocalStorageState(STORAGE_KEYS.RISK, defaultState);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const outputs = calculateRisk({
    entryPrice: parseFloat(state.entryPrice) || 0,
    stopLoss: parseFloat(state.stopLoss) || 0,
    totalCapital: parseFloat(state.totalCapital) || 0,
    riskPercent: parseFloat(state.riskPercent) || 0,
    targetPrice: state.targetPrice ? parseFloat(state.targetPrice) : undefined,
  });

  const isValid = outputs.positionSize > 0;
  const hasInvalidStopLoss = parseFloat(state.stopLoss) >= parseFloat(state.entryPrice) && state.stopLoss && state.entryPrice;

  return (
    <div className="space-y-6">
      <GlassCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Risk Management & Position Sizing
          </CardTitle>
          <CardDescription>
            Calculate your optimal position size based on risk tolerance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price ($)</Label>
              <Input
                id="entryPrice"
                type="number"
                placeholder="1.00"
                step="0.00000001"
                value={state.entryPrice}
                onChange={(e) => setState(prev => ({ ...prev, entryPrice: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop-Loss / Invalidation Point ($)</Label>
              <Input
                id="stopLoss"
                type="number"
                placeholder="0.90"
                step="0.00000001"
                value={state.stopLoss}
                onChange={(e) => setState(prev => ({ ...prev, stopLoss: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCapital">Total Capital ($)</Label>
              <Input
                id="totalCapital"
                type="number"
                placeholder="10000"
                value={state.totalCapital}
                onChange={(e) => setState(prev => ({ ...prev, totalCapital: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskPercent">Risk Amount (% of Capital)</Label>
              <Input
                id="riskPercent"
                type="number"
                placeholder="1"
                step="0.1"
                value={state.riskPercent}
                onChange={(e) => setState(prev => ({ ...prev, riskPercent: e.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="targetPrice">Target / Sell Price ($ - Optional)</Label>
              <Input
                id="targetPrice"
                type="number"
                placeholder="1.50"
                step="0.00000001"
                value={state.targetPrice}
                onChange={(e) => setState(prev => ({ ...prev, targetPrice: e.target.value }))}
              />
            </div>
          </div>

          {/* Validation */}
          {hasInvalidStopLoss && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Stop-loss must be below entry price for a long position
              </AlertDescription>
            </Alert>
          )}

          {/* Outputs */}
          {isValid && !hasInvalidStopLoss ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Max Position Size</p>
                  <p className="text-2xl font-bold text-primary">{formatUSD(outputs.positionSize)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Stop Distance</p>
                  <p className="text-2xl font-bold">{formatPercent(outputs.stopDistancePercent)}</p>
                </div>
              </div>

              {outputs.riskRewardRatio !== null && (
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Risk:Reward Ratio</p>
                      <p className="text-2xl font-bold">1:{formatNumber(outputs.riskRewardRatio, 2)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Potential Profit</p>
                      <p className="text-2xl font-bold text-green-500">{formatUSD(outputs.potentialProfit!)}</p>
                    </div>
                  </div>
                  <RiskRewardIndicator ratio={outputs.riskRewardRatio} />
                </div>
              )}

              {/* Share Button */}
              <div className="pt-4">
                <ShareTradePlanButton cardRef={cardRef} filename="cryptowise-risk-plan.png" />
              </div>
            </>
          ) : !hasInvalidStopLoss && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Enter valid values to see your risk calculation
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </GlassCard>

      {/* Hidden Trade Plan Card for Export */}
      {isValid && !hasInvalidStopLoss && (
        <div className="fixed -left-[9999px]">
          <TradePlanCard
            ref={cardRef}
            title="Risk Management Plan"
            data={[
              { label: 'Entry Price', value: formatUSD(parseFloat(state.entryPrice) || 0) },
              { label: 'Stop-Loss', value: formatUSD(parseFloat(state.stopLoss) || 0) },
              { label: 'Total Capital', value: formatUSD(parseFloat(state.totalCapital) || 0) },
              { label: 'Risk %', value: `${state.riskPercent}%` },
              { label: 'Position Size', value: formatUSD(outputs.positionSize), highlight: true },
              { label: 'Stop Distance', value: formatPercent(outputs.stopDistancePercent) },
              ...(outputs.riskRewardRatio !== null ? [
                { label: 'R:R Ratio', value: `1:${formatNumber(outputs.riskRewardRatio, 2)}`, highlight: true },
              ] : []),
            ]}
          />
        </div>
      )}
    </div>
  );
}
