import { useState, useRef } from 'react';
import { GlassCard } from '@/components/layout/GlassCard';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CoinSearchSelect } from '@/components/coins/CoinSearchSelect';
import { ApiErrorDisplay } from '@/components/feedback/ApiErrorDisplay';
import { ShareTradePlanButton } from '@/components/share/ShareTradePlanButton';
import { TradePlanCard } from '@/components/share/TradePlanCard';
import { useCoinMarketData } from '@/hooks/useCoinGecko';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { usePageMeta } from '@/hooks/usePageMeta';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import { calculateMoonMath } from '@/lib/calculators/moonMath';
import { formatUSD, formatNumber } from '@/lib/format';
import { SEO_CONFIG } from '@/lib/seo';
import { Rocket, AlertCircle, Loader2, WifiOff } from 'lucide-react';

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
  const isOnline = useOnlineStatus();
  
  usePageMeta(SEO_CONFIG.moonMath);

  const { data: coinAData, isLoading: isLoadingA, error: errorA, refetch: refetchA } = useCoinMarketData(state.coinAId);
  const { data: coinBData, isLoading: isLoadingB, error: errorB, refetch: refetchB } = useCoinMarketData(state.coinBId);

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
    <div className="space-y-4 sm:space-y-6">
      <GlassCard>
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
            Moon Math & Market Cap Reality Check
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Compare market caps to estimate potential price targets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
          {!isOnline && (
            <Alert>
              <WifiOff className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">
                This feature requires internet connection to fetch market data.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Coin A Selection */}
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">Coin A (Your Coin)</Label>
            <CoinSearchSelect
              value={state.coinAId}
              onSelect={handleCoinASelect}
              placeholder="Select Coin A..."
            />
            {isOnline && isLoadingA && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                Loading market data...
              </div>
            )}
            {isOnline && errorA && (
              <ApiErrorDisplay 
                error={errorA as Error} 
                onRetry={() => refetchA()}
                message="Failed to fetch Coin A data"
              />
            )}
            {coinAData && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <Badge variant="outline" className="text-xs">Price: {formatUSD(coinAData.current_price)}</Badge>
                <Badge variant="outline" className="text-xs">Market Cap: {formatUSD(coinAData.market_cap)}</Badge>
                <Badge variant="outline" className="text-xs">Supply: {formatNumber(coinAData.circulating_supply, 0)}</Badge>
              </div>
            )}
          </div>

          {/* Coin B Selection */}
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">Coin B (Target Market Cap)</Label>
            <CoinSearchSelect
              value={state.coinBId}
              onSelect={handleCoinBSelect}
              placeholder="Select Coin B..."
            />
            {isOnline && isLoadingB && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                Loading market data...
              </div>
            )}
            {isOnline && errorB && (
              <ApiErrorDisplay 
                error={errorB as Error} 
                onRetry={() => refetchB()}
                message="Failed to fetch Coin B data"
              />
            )}
            {coinBData && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <Badge variant="outline" className="text-xs">Market Cap: {formatUSD(coinBData.market_cap)}</Badge>
              </div>
            )}
          </div>

          {/* Supply Issue Warning */}
          {hasSupplyIssue && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">
                Circulating supply data is unavailable for {state.coinAName}. Cannot calculate implied price.
              </AlertDescription>
            </Alert>
          )}

          {/* Outputs */}
          {isValid && !hasSupplyIssue ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-border/50">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {state.coinAName} at {state.coinBName} Market Cap
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">{formatUSD(outputs.impliedPrice)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">Implied Multiple</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-500">{formatNumber(outputs.impliedMultiple, 2)}x</p>
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
              <AlertDescription className="text-xs sm:text-sm">
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
