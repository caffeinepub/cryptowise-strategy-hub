import { useMemo } from 'react';
import { GlassCard } from '@/components/layout/GlassCard';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CoinSearchSelect } from '@/components/coins/CoinSearchSelect';
import { ApiErrorDisplay } from '@/components/feedback/ApiErrorDisplay';
import { useCoinPrice, useCoinMarketData } from '@/hooks/useCoinGecko';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { usePageMeta } from '@/hooks/usePageMeta';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import { calculateDecision } from '@/lib/calculators/decision';
import { formatUSD } from '@/lib/format';
import { SEO_CONFIG } from '@/lib/seo';
import { Brain, WifiOff, Check, X } from 'lucide-react';

interface DecisionState {
  selectedCoinId: string | null;
  selectedCoinName: string;
  selectedCoinSymbol: string;
  minROI: string;
  maxRisk: string;
  priceTarget: string;
  minMarketCap: string;
  minPriceChange: string;
  maxPriceChange: string;
}

const defaultState: DecisionState = {
  selectedCoinId: null,
  selectedCoinName: '',
  selectedCoinSymbol: '',
  minROI: '',
  maxRisk: '',
  priceTarget: '',
  minMarketCap: '',
  minPriceChange: '',
  maxPriceChange: '',
};

export function DecisionModule() {
  const [state, setState] = useLocalStorageState(STORAGE_KEYS.DECISION, defaultState);
  const isOnline = useOnlineStatus();
  
  usePageMeta(SEO_CONFIG.decision);

  const { data: livePrice, isLoading: isPriceLoading, error: priceError, refetch: refetchPrice } = useCoinPrice(state.selectedCoinId);
  const { data: marketData, isLoading: isMarketLoading, error: marketError, refetch: refetchMarket } = useCoinMarketData(state.selectedCoinId);

  const handleCoinSelect = (coinId: string, coinName: string, coinSymbol: string) => {
    setState(prev => ({
      ...prev,
      selectedCoinId: coinId,
      selectedCoinName: coinName,
      selectedCoinSymbol: coinSymbol,
    }));
  };

  const decision = useMemo(() => {
    return calculateDecision({
      minROI: state.minROI ? parseFloat(state.minROI) : undefined,
      maxRisk: state.maxRisk ? parseFloat(state.maxRisk) : undefined,
      priceTarget: state.priceTarget ? parseFloat(state.priceTarget) : undefined,
      currentPrice: livePrice || undefined,
      minMarketCap: state.minMarketCap ? parseFloat(state.minMarketCap) * 1e9 : undefined,
      currentMarketCap: marketData?.market_cap || undefined,
      priceChange24h: marketData?.price_change_percentage_24h !== undefined ? marketData.price_change_percentage_24h : undefined,
      minPriceChange: state.minPriceChange ? parseFloat(state.minPriceChange) : undefined,
      maxPriceChange: state.maxPriceChange ? parseFloat(state.maxPriceChange) : undefined,
    });
  }, [state, livePrice, marketData]);

  const hasAnyCriteria = decision.criteria.length > 0;

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Buy':
        return 'bg-green-500 hover:bg-green-600';
      case 'Sell':
        return 'bg-red-500 hover:bg-red-600';
      case 'Hold':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Wait':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <GlassCard>
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
            Decision Engine
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Set your criteria and get automated trading recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
          {/* Coin Selection */}
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">Select Coin (Required for live data)</Label>
            <CoinSearchSelect
              value={state.selectedCoinId}
              onSelect={handleCoinSelect}
              placeholder="Search for a coin..."
            />
            {!isOnline && state.selectedCoinId && (
              <Alert>
                <WifiOff className="h-4 w-4" />
                <AlertDescription className="text-xs sm:text-sm">
                  Live data unavailable offline. Decision engine requires live market data.
                </AlertDescription>
              </Alert>
            )}
            {isOnline && (isPriceLoading || isMarketLoading) && (
              <p className="text-xs sm:text-sm text-muted-foreground">Loading market data...</p>
            )}
            {isOnline && priceError && (
              <ApiErrorDisplay 
                error={priceError as Error} 
                onRetry={() => refetchPrice()}
              />
            )}
            {isOnline && marketError && !priceError && (
              <ApiErrorDisplay 
                error={marketError as Error} 
                onRetry={() => refetchMarket()}
              />
            )}
            {isOnline && livePrice && livePrice > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="bg-accent/20 text-xs">
                  Current Price: {formatUSD(livePrice)}
                </Badge>
                {marketData?.market_cap && (
                  <Badge variant="outline" className="bg-accent/20 text-xs">
                    Market Cap: ${(marketData.market_cap / 1e9).toFixed(2)}B
                  </Badge>
                )}
                {marketData?.price_change_percentage_24h !== undefined && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${marketData.price_change_percentage_24h >= 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
                  >
                    24h: {marketData.price_change_percentage_24h.toFixed(2)}%
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Criteria Inputs */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-semibold">Decision Criteria (All Optional)</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="minROI" className="text-xs sm:text-sm">Minimum ROI (%)</Label>
                <Input
                  id="minROI"
                  type="number"
                  placeholder="e.g., 20"
                  step="0.1"
                  value={state.minROI}
                  onChange={(e) => setState(prev => ({ ...prev, minROI: e.target.value }))}
                  className="h-9 sm:h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxRisk" className="text-xs sm:text-sm">Maximum Risk (%)</Label>
                <Input
                  id="maxRisk"
                  type="number"
                  placeholder="e.g., 10"
                  step="0.1"
                  value={state.maxRisk}
                  onChange={(e) => setState(prev => ({ ...prev, maxRisk: e.target.value }))}
                  className="h-9 sm:h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceTarget" className="text-xs sm:text-sm">Price Target ($)</Label>
                <Input
                  id="priceTarget"
                  type="number"
                  placeholder="e.g., 1.50"
                  step="0.00000001"
                  value={state.priceTarget}
                  onChange={(e) => setState(prev => ({ ...prev, priceTarget: e.target.value }))}
                  className="h-9 sm:h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minMarketCap" className="text-xs sm:text-sm">Minimum Market Cap (Billions $)</Label>
                <Input
                  id="minMarketCap"
                  type="number"
                  placeholder="e.g., 1"
                  step="0.1"
                  value={state.minMarketCap}
                  onChange={(e) => setState(prev => ({ ...prev, minMarketCap: e.target.value }))}
                  className="h-9 sm:h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minPriceChange" className="text-xs sm:text-sm">Min 24h Price Change (%)</Label>
                <Input
                  id="minPriceChange"
                  type="number"
                  placeholder="e.g., -5"
                  step="0.1"
                  value={state.minPriceChange}
                  onChange={(e) => setState(prev => ({ ...prev, minPriceChange: e.target.value }))}
                  className="h-9 sm:h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPriceChange" className="text-xs sm:text-sm">Max 24h Price Change (%)</Label>
                <Input
                  id="maxPriceChange"
                  type="number"
                  placeholder="e.g., 15"
                  step="0.1"
                  value={state.maxPriceChange}
                  onChange={(e) => setState(prev => ({ ...prev, maxPriceChange: e.target.value }))}
                  className="h-9 sm:h-10 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Decision Output */}
          {hasAnyCriteria ? (
            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold mb-1">Recommendation</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Based on {decision.criteria.length} criteria
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${getRecommendationColor(decision.recommendation)} text-white text-base sm:text-lg px-4 py-2`}>
                    {decision.recommendation}
                  </Badge>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className="text-lg sm:text-xl font-bold">{decision.score.toFixed(0)}%</p>
                  </div>
                </div>
              </div>

              {/* Criteria Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground">Criteria Breakdown</h4>
                <div className="space-y-1.5">
                  {decision.criteria.map((criterion, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 rounded-md bg-accent/5 border border-border/30"
                    >
                      {criterion.passed ? (
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium">{criterion.name}</p>
                        <p className="text-xs text-muted-foreground">{criterion.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertDescription className="text-xs sm:text-sm">
                Set at least one criterion above to get a trading recommendation
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </GlassCard>
    </div>
  );
}
