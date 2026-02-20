import { useRef } from 'react';
import { GlassCard } from '@/components/layout/GlassCard';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShareTradePlanButton } from '@/components/share/ShareTradePlanButton';
import { TradePlanCard } from '@/components/share/TradePlanCard';
import { DCAEntryRow } from '@/components/forms/DCAEntryRow';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { usePageMeta } from '@/hooks/usePageMeta';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import { calculateDCA, type DCAEntry } from '@/lib/calculators/dca';
import { formatCurrency, formatToken } from '@/lib/format';
import { SEO_CONFIG } from '@/lib/seo';
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
  const isOnline = useOnlineStatus();
  
  usePageMeta(SEO_CONFIG.dca);

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
    <div className="space-y-4 sm:space-y-6">
      <GlassCard>
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
            Advanced DCA Planner
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Calculate your average entry price across multiple buy-ins
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
          {/* Entry Rows */}
          <div className="space-y-2 sm:space-y-3">
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
          <Button onClick={addEntry} variant="outline" className="w-full text-xs sm:text-sm h-9 sm:h-10">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Add Entry
          </Button>

          {/* Outputs */}
          {isValid ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-border/50">
                <div className="space-y-1 min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Invested</p>
                  <p className="text-xl sm:text-2xl font-bold truncate">{formatCurrency(outputs.totalInvested)}</p>
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Tokens</p>
                  <p className="text-xl sm:text-2xl font-bold truncate">{formatToken(outputs.totalTokens)}</p>
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Average Entry Price</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary truncate">{formatCurrency(outputs.averageEntryPrice)}</p>
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
              <AlertDescription className="text-xs sm:text-sm">
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
              { label: 'Total Invested', value: formatCurrency(outputs.totalInvested) },
              { label: 'Total Tokens', value: formatToken(outputs.totalTokens) },
              { label: 'Average Entry', value: formatCurrency(outputs.averageEntryPrice), highlight: true },
              { label: 'Number of Entries', value: state.entries.filter(e => e.buyPrice > 0 && e.amount > 0).length.toString() },
            ]}
          />
        </div>
      )}
    </div>
  );
}
