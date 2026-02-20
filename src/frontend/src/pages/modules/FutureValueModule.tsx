import { useRef } from 'react';
import { GlassCard } from '@/components/layout/GlassCard';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShareTradePlanButton } from '@/components/share/ShareTradePlanButton';
import { TradePlanCard } from '@/components/share/TradePlanCard';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useActor } from '@/hooks/useActor';
import { useQuery } from '@tanstack/react-query';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import { formatUSD, formatPercent } from '@/lib/format';
import { SEO_CONFIG } from '@/lib/seo';
import { TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import type { Investment, FutureValueResult, Cashflow } from '@/backend';

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
  const [inflationRate, setInflationRate] = useLocalStorageState(STORAGE_KEYS.FUTURE_VALUE_INFLATION_RATE, '3');
  const [taxRate, setTaxRate] = useLocalStorageState(STORAGE_KEYS.FUTURE_VALUE_TAX_RATE, '20');
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { actor, isFetching: isActorFetching } = useActor();
  
  usePageMeta(SEO_CONFIG.futureValue);

  const initialAmount = parseFloat(state.initialAmount) || 0;
  const monthlyContribution = parseFloat(state.monthlyContribution) || 0;
  const years = parseFloat(state.years) || 0;
  const annualRate = parseFloat(state.annualRate) || 0;
  const inflation = parseFloat(inflationRate) || 0;
  const tax = parseFloat(taxRate) || 0;

  // Build cashflows array for monthly contributions
  const cashflows: Cashflow[] = [];
  if (monthlyContribution > 0 && years > 0) {
    for (let year = 1; year <= years; year++) {
      cashflows.push({
        amount: monthlyContribution * 12,
        year: BigInt(year),
      });
    }
  }

  const investment: Investment = {
    initialInvestment: initialAmount,
    interestRate: annualRate / 100,
    years: BigInt(Math.floor(years)),
    cashflows,
    compoundingFrequency: BigInt(12),
    inflationRate: inflation / 100,
    taxRate: tax / 100,
  };

  const { data: result, isLoading } = useQuery<FutureValueResult>({
    queryKey: ['futureValue', initialAmount, monthlyContribution, years, annualRate, inflation, tax],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.futureValue(investment);
    },
    enabled: !!actor && !isActorFetching && years > 0,
  });

  const isValid = years > 0 && result !== undefined;
  const totalContributed = result?.principalWithoutInterest || 0;
  const nominalValue = result?.preTaxFutureValue || 0;
  const realValue = result?.realFutureValue || 0;
  const afterTaxValue = result?.afterTaxFutureValue || 0;
  const gains = nominalValue - totalContributed;
  const taxAmount = gains * (tax / 100);

  return (
    <div className="space-y-4 sm:space-y-6">
      <GlassCard>
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            Future Value Projection
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Calculate long-term growth with compound interest, inflation, and taxes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="initial" className="text-xs sm:text-sm">Initial Amount ($)</Label>
              <Input
                id="initial"
                type="number"
                placeholder="10000"
                value={state.initialAmount}
                onChange={(e) => setState(prev => ({ ...prev, initialAmount: e.target.value }))}
                className="h-9 sm:h-10 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly" className="text-xs sm:text-sm">Monthly Contribution ($)</Label>
              <Input
                id="monthly"
                type="number"
                placeholder="500"
                value={state.monthlyContribution}
                onChange={(e) => setState(prev => ({ ...prev, monthlyContribution: e.target.value }))}
                className="h-9 sm:h-10 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years" className="text-xs sm:text-sm">Time Horizon (Years)</Label>
              <Input
                id="years"
                type="number"
                placeholder="10"
                value={state.years}
                onChange={(e) => setState(prev => ({ ...prev, years: e.target.value }))}
                className="h-9 sm:h-10 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate" className="text-xs sm:text-sm">Annual Growth Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                placeholder="10"
                step="0.1"
                value={state.annualRate}
                onChange={(e) => setState(prev => ({ ...prev, annualRate: e.target.value }))}
                className="h-9 sm:h-10 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inflation" className="text-xs sm:text-sm">Inflation Rate (%)</Label>
              <Input
                id="inflation"
                type="number"
                placeholder="3"
                step="0.1"
                min="0"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                className="h-9 sm:h-10 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax" className="text-xs sm:text-sm">Tax Rate (%)</Label>
              <Input
                id="tax"
                type="number"
                placeholder="20"
                step="0.1"
                min="0"
                max="100"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="h-9 sm:h-10 text-sm"
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && years > 0 && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {/* Calculation Results - Neatly Formatted */}
          {isValid && !isLoading ? (
            <div className="space-y-6 pt-4 border-t border-border/50">
              {/* Principal Calculation */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Principal Contributions
                </h3>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2 font-mono text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Initial Investment</span>
                    <span className="font-semibold tabular-nums">{formatUSD(initialAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Monthly Contributions</span>
                    <span className="font-semibold tabular-nums">
                      {formatUSD(monthlyContribution)} × {years * 12} months
                    </span>
                  </div>
                  <div className="border-t border-border/50 pt-2 mt-2 flex justify-between items-center">
                    <span className="font-semibold">Total Principal</span>
                    <span className="text-lg font-bold tabular-nums">{formatUSD(totalContributed)}</span>
                  </div>
                </div>
              </div>

              {/* Nominal Future Value */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Nominal Future Value
                </h3>
                <div className="bg-primary/10 rounded-lg p-4 space-y-2 font-mono text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Growth Rate</span>
                    <span className="font-semibold tabular-nums">{annualRate}% annually</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Compounding</span>
                    <span className="font-semibold tabular-nums">Monthly for {years} years</span>
                  </div>
                  <div className="border-t border-border/50 pt-2 mt-2 flex justify-between items-center">
                    <span className="font-semibold">Nominal Value</span>
                    <span className="text-lg font-bold text-primary tabular-nums">{formatUSD(nominalValue)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Total Gains</span>
                    <span className="font-semibold text-green-500 tabular-nums">{formatUSD(gains)}</span>
                  </div>
                </div>
              </div>

              {/* Real Value (After Inflation) */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Real Value (Inflation-Adjusted)
                </h3>
                <div className="bg-orange-500/10 rounded-lg p-4 space-y-2 font-mono text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Inflation Rate</span>
                    <span className="font-semibold tabular-nums">{inflation}% annually</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Real Interest Rate</span>
                    <span className="font-semibold tabular-nums">
                      {((1 + annualRate / 100) / (1 + inflation / 100) - 1).toFixed(2)}%
                    </span>
                  </div>
                  <div className="border-t border-border/50 pt-2 mt-2 flex justify-between items-center">
                    <span className="font-semibold">Real Value</span>
                    <span className="text-lg font-bold text-orange-500 tabular-nums">{formatUSD(realValue)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Purchasing Power Loss</span>
                    <span className="font-semibold text-orange-400 tabular-nums">
                      {formatUSD(nominalValue - realValue)}
                    </span>
                  </div>
                </div>
              </div>

              {/* After-Tax Value */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  After-Tax Value
                </h3>
                <div className="bg-green-500/10 rounded-lg p-4 space-y-2 font-mono text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Nominal Value</span>
                    <span className="font-semibold tabular-nums">{formatUSD(nominalValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Capital Gains</span>
                    <span className="font-semibold tabular-nums">{formatUSD(gains)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tax Rate</span>
                    <span className="font-semibold tabular-nums">{tax}%</span>
                  </div>
                  <div className="flex justify-between items-center text-destructive">
                    <span className="text-muted-foreground">Tax Amount</span>
                    <span className="font-semibold tabular-nums">− {formatUSD(taxAmount)}</span>
                  </div>
                  <div className="border-t border-border/50 pt-2 mt-2 flex justify-between items-center">
                    <span className="font-semibold">After-Tax Value</span>
                    <span className="text-lg font-bold text-green-500 tabular-nums">{formatUSD(afterTaxValue)}</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-lg p-4 sm:p-6 border-2 border-primary/30">
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-center">Investment Summary</h3>
                  <div className="grid grid-cols-2 gap-4 font-mono text-sm">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">You Invest</p>
                      <p className="text-xl sm:text-2xl font-bold tabular-nums">{formatUSD(totalContributed)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">You Get (After Tax)</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-500 tabular-nums">
                        {formatUSD(afterTaxValue)}
                      </p>
                    </div>
                  </div>
                  <div className="text-center pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-500 tabular-nums">
                      {formatUSD(afterTaxValue - totalContributed)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((afterTaxValue / totalContributed - 1) * 100).toFixed(2)}% return
                    </p>
                  </div>
                </div>
              </div>

              {/* Share Button */}
              <div className="pt-2">
                <ShareTradePlanButton cardRef={cardRef} filename="cryptowise-future-value-plan.png" />
              </div>
            </div>
          ) : !isLoading && years > 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">
                Unable to calculate projection. Please check your inputs.
              </AlertDescription>
            </Alert>
          ) : !isLoading ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">
                Enter valid values including a time horizon to see your projection
              </AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </GlassCard>

      {/* Hidden Trade Plan Card for Export */}
      {isValid && !isLoading && (
        <div className="fixed -left-[9999px]">
          <TradePlanCard
            ref={cardRef}
            title="Future Value Projection"
            data={[
              { label: 'Initial Amount', value: formatUSD(initialAmount) },
              { label: 'Monthly Contribution', value: formatUSD(monthlyContribution) },
              { label: 'Time Horizon', value: `${state.years} years` },
              { label: 'Annual Rate', value: `${state.annualRate}%` },
              { label: 'Inflation Rate', value: `${inflationRate}%` },
              { label: 'Tax Rate', value: `${taxRate}%` },
              { label: 'Total Contributed', value: formatUSD(totalContributed) },
              { label: 'Nominal Future Value', value: formatUSD(nominalValue), highlight: true },
              { label: 'Real Value (After Inflation)', value: formatUSD(realValue), highlight: true },
              { label: 'After-Tax Value', value: formatUSD(afterTaxValue), highlight: true },
              { label: 'Total Gains', value: formatUSD(gains), highlight: true },
            ]}
          />
        </div>
      )}
    </div>
  );
}
