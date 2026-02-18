import { useState, useRef } from 'react';
import { GlassCard } from '@/components/layout/GlassCard';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CoinSearchSelect } from '@/components/coins/CoinSearchSelect';
import { ShareTradePlanButton } from '@/components/share/ShareTradePlanButton';
import { TradePlanCard } from '@/components/share/TradePlanCard';
import { useCoinMarketData } from '@/hooks/useCoinGecko';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import { calculateMoonMath } from '@/lib/calculators/moonMath';
import { formatUSD, formatNumber } from '@/lib/format';
import { Rocket, AlertCircle, Loader2 } from 'lucide-react';

interface MoonMathState {
  coinAId: string | null;
  coinAName: string;
  coinASymbol: string;
  coinBId: string | null;
  coinBName: string;
  coinBSymbol: string;
}

const defaultState: MoonMathState = {
  coinAId: null,
  coinAName: '',
  coinASymbol: '',
  coinBId: null,
  coinBName: '',
  coinBSymbol: '',
};

export function MoonMathModule() {
  const [state, setState] = useLocalStorageState(STORAGE_KEYS.MOONMATH, defaultState);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const { data: coinAData, isLoading: isLoadingA, error: errorA } = useCoinMarketData(state.coinAId);
  const { data: coinBData, isLoading: isLoadingB, error: errorB } = useCoinMarketData(state.coinBId);

  const handleCoinASelect = (coinId: string, coinName: string, coinSymbol: string) => {
    setState(prev => ({ ...prev, coinAId: coinId, coinAName: coinName, coinASymbol: coinSymbol }));
  };

  const handleCoinBSelect = (coinId: string, coinName: string, coinSymbol: string) => {
    setState(prev => ({ ...prev, coinBId: coinId, coinBName: coinName, coinBSymbol: coinSymbol }));
  };

  const outputs = coinAData && coinBData ? calculateMoonMath({
    coinAPrice: coinAData.current_price,
    coinASupply: coinAData.circulating_supply,
    coinBMarketCap: coinBData.market_cap,
  }) : null;

  const isValid = outputs && outputs.impliedPrice > 0;
  const hasSupplyIssue = coinAData && coinAData.circulating_supply <= 0;

  return (
    <div className="space-y-6">
      <GlassCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Moon Math & Market Cap Reality Check
          </CardTitle>
          <CardDescription>
            Compare market caps to estimate potential price targets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Coin A Selection */}
          <div className="space-y-2">
            <Label>Coin A (Your Coin)</Label>
            <CoinSearchSelect
              value={state.coinAId}
              onSelect={handleCoinASelect}
              placeholder="Select Coin A..."
            />
            {isLoadingA && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading market data...
              </div>
            )}
            {errorA && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Failed to fetch Coin A data</AlertDescription>
              </Alert>
            )}
            {coinAData && (
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Price: {formatUSD(coinAData.current_price)}</Badge>
                <Badge variant="outline">Market Cap: {formatUSD(coinAData.market_cap)}</Badge>
                <Badge variant="outline">Supply: {formatNumber(coinAData.circulating_supply, 0)}</Badge>
              </div>
            )}
          </div>

          {/* Coin B Selection */}
          <div className="space-y-2">
            <Label>Coin B (Target Market Cap)</Label>
            <CoinSearchSelect
              value={state.coinBId}
              onSelect={handleCoinBSelect}
              placeholder="Select Coin B..."
            />
            {isLoadingB && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading market data...
              </div>
            )}
            {errorB && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Failed to fetch Coin B data</AlertDescription>
              </Alert>
            )}
            {coinBData && (
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Market Cap: {formatUSD(coinBData.market_cap)}</Badge>
              </div>
            )}
          </div>

          {/* Supply Issue Warning */}
          {hasSupplyIssue && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Circulating supply data is unavailable for {state.coinAName}. Cannot calculate implied price.
              </AlertDescription>
            </Alert>
          )}

          {/* Outputs */}
          {isValid && !hasSupplyIssue ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {state.coinAName} at {state.coinBName} Market Cap
                  </p>
                  <p className="text-2xl font-bold text-primary">{formatUSD(outputs.impliedPrice)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Implied Multiple</p>
                  <p className="text-2xl font-bold text-green-500">{formatNumber(outputs.impliedMultiple, 2)}x</p>
                </div>
              </div>

              {/* Share Button */}
              <div className="pt-4">
                <ShareTradePlanButton cardRef={cardRef} filename="cryptowise-moonmath-plan.png" />
              </div>
            </>
          ) : !hasSupplyIssue && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Select both coins to see the market cap comparison
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </GlassCard>

      {/* Hidden Trade Plan Card for Export */}
      {isValid && !hasSupplyIssue && coinAData && coinBData && (
        <div className="fixed -left-[9999px]">
          <TradePlanCard
            ref={cardRef}
            title="Moon Math Analysis"
            coinName={state.coinAName}
            coinSymbol={state.coinASymbol}
            data={[
              { label: 'Current Price', value: formatUSD(coinAData.current_price) },
              { label: 'Current Market Cap', value: formatUSD(coinAData.market_cap) },
              { label: 'Target Market Cap', value: formatUSD(coinBData.market_cap) },
              { label: 'Implied Price', value: formatUSD(outputs.impliedPrice), highlight: true },
              { label: 'Implied Multiple', value: `${formatNumber(outputs.impliedMultiple, 2)}x`, highlight: true },
            ]}
          />
        </div>
      )}
    </div>
  );
}
