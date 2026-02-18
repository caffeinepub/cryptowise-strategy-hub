import { useRef } from 'react';
import { GlassCard } from '@/components/layout/GlassCard';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShareTradePlanButton } from '@/components/share/ShareTradePlanButton';
import { TradePlanCard } from '@/components/share/TradePlanCard';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import { calculateFutureValue } from '@/lib/calculators/futureValue';
import { formatUSD } from '@/lib/format';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface FutureValueState {
  initialAmount: string;
  monthlyContribution: string;
  years: string;
  annualRate: string;
}

const defaultState: FutureValueState = {
  initialAmount: '',
  monthlyContribution: '',
  years: '',
  annualRate: '10',
};

export function FutureValueModule() {
  const [state, setState] = useLocalStorageState(STORAGE_KEYS.FUTURE_VALUE, defaultState);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const outputs = calculateFutureValue({
    initialAmount: parseFloat(state.initialAmount) || 0,
    monthlyContribution: parseFloat(state.monthlyContribution) || 0,
    years: parseFloat(state.years) || 0,
    annualRate: parseFloat(state.annualRate) || 0,
  });

  const isValid = outputs.futureValue > 0 && parseFloat(state.years) > 0;
  const gains = outputs.futureValue - outputs.totalContributed;

  return (
    <div className="space-y-6">
      <GlassCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Future Value Projection
          </CardTitle>
          <CardDescription>
            Calculate long-term growth with compound interest
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initial">Initial Amount ($)</Label>
              <Input
                id="initial"
                type="number"
                placeholder="10000"
                value={state.initialAmount}
                onChange={(e) => setState(prev => ({ ...prev, initialAmount: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly">Monthly Contribution ($)</Label>
              <Input
                id="monthly"
                type="number"
                placeholder="500"
                value={state.monthlyContribution}
                onChange={(e) => setState(prev => ({ ...prev, monthlyContribution: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years">Time Horizon (Years)</Label>
              <Input
                id="years"
                type="number"
                placeholder="10"
                value={state.years}
                onChange={(e) => setState(prev => ({ ...prev, years: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Annual Growth Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                placeholder="10"
                step="0.1"
                value={state.annualRate}
                onChange={(e) => setState(prev => ({ ...prev, annualRate: e.target.value }))}
              />
            </div>
          </div>

          {/* Outputs */}
          {isValid ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Contributed</p>
                  <p className="text-2xl font-bold">{formatUSD(outputs.totalContributed)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Future Value</p>
                  <p className="text-2xl font-bold text-primary">{formatUSD(outputs.futureValue)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Gains</p>
                  <p className="text-2xl font-bold text-green-500">{formatUSD(gains)}</p>
                </div>
              </div>

              {/* Share Button */}
              <div className="pt-4">
                <ShareTradePlanButton cardRef={cardRef} filename="cryptowise-future-value-plan.png" />
              </div>
            </>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Enter valid values including a time horizon to see your projection
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </GlassCard>

      {/* Hidden Trade Plan Card for Export */}
      {isValid && (
        <div className="fixed -left-[9999px]">
          <TradePlanCard
            ref={cardRef}
            title="Future Value Projection"
            data={[
              { label: 'Initial Amount', value: formatUSD(parseFloat(state.initialAmount) || 0) },
              { label: 'Monthly Contribution', value: formatUSD(parseFloat(state.monthlyContribution) || 0) },
              { label: 'Time Horizon', value: `${state.years} years` },
              { label: 'Annual Rate', value: `${state.annualRate}%` },
              { label: 'Total Contributed', value: formatUSD(outputs.totalContributed) },
              { label: 'Future Value', value: formatUSD(outputs.futureValue), highlight: true },
              { label: 'Total Gains', value: formatUSD(gains), highlight: true },
            ]}
          />
        </div>
      )}
    </div>
  );
}
