import { useRef } from 'react';
import { GlassCard } from '@/components/layout/GlassCard';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShareTradePlanButton } from '@/components/share/ShareTradePlanButton';
import { TradePlanCard } from '@/components/share/TradePlanCard';
import { DCAEntryRow } from '@/components/forms/DCAEntryRow';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import { calculateDCA, type DCAEntry } from '@/lib/calculators/dca';
import { formatUSD, formatTokens } from '@/lib/format';
import { TrendingDown, Plus, AlertCircle } from 'lucide-react';

interface DCAState {
  entries: DCAEntry[];
}

const defaultState: DCAState = {
  entries: [
    { id: '1', buyPrice: 0, amount: 0 },
    { id: '2', buyPrice: 0, amount: 0 },
    { id: '3', buyPrice: 0, amount: 0 },
  ],
};

export function DCAModule() {
  const [state, setState] = useLocalStorageState(STORAGE_KEYS.DCA, defaultState);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const outputs = calculateDCA(state.entries);
  const isValid = outputs.totalTokens > 0;

  const addEntry = () => {
    setState(prev => ({
      ...prev,
      entries: [...prev.entries, { id: Date.now().toString(), buyPrice: 0, amount: 0 }],
    }));
  };

  const removeEntry = (id: string) => {
    if (state.entries.length <= 1) return;
    setState(prev => ({
      ...prev,
      entries: prev.entries.filter(e => e.id !== id),
    }));
  };

  const updateEntry = (id: string, field: 'buyPrice' | 'amount', value: number) => {
    setState(prev => ({
      ...prev,
      entries: prev.entries.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Advanced DCA Planner
          </CardTitle>
          <CardDescription>
            Calculate your average entry price across multiple buy-ins
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Entry Rows */}
          <div className="space-y-3">
            {state.entries.map((entry, index) => (
              <DCAEntryRow
                key={entry.id}
                entry={entry}
                index={index}
                onUpdate={updateEntry}
                onRemove={removeEntry}
                canRemove={state.entries.length > 1}
              />
            ))}
          </div>

          {/* Add Entry Button */}
          <Button onClick={addEntry} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>

          {/* Outputs */}
          {isValid ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Invested</p>
                  <p className="text-2xl font-bold">{formatUSD(outputs.totalInvested)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Tokens</p>
                  <p className="text-2xl font-bold">{formatTokens(outputs.totalTokens)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Average Entry Price</p>
                  <p className="text-2xl font-bold text-primary">{formatUSD(outputs.averageEntryPrice)}</p>
                </div>
              </div>

              {/* Share Button */}
              <div className="pt-4">
                <ShareTradePlanButton cardRef={cardRef} filename="cryptowise-dca-plan.png" />
              </div>
            </>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Enter valid buy prices and amounts to see your DCA calculation
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
            title="DCA Strategy Plan"
            data={[
              { label: 'Total Invested', value: formatUSD(outputs.totalInvested) },
              { label: 'Total Tokens', value: formatTokens(outputs.totalTokens) },
              { label: 'Average Entry', value: formatUSD(outputs.averageEntryPrice), highlight: true },
              { label: 'Number of Entries', value: state.entries.filter(e => e.buyPrice > 0 && e.amount > 0).length.toString() },
            ]}
          />
        </div>
      )}
    </div>
  );
}
