import { useState, useEffect, useRef } from 'react';
import { GlassCard } from '@/components/layout/GlassCard';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CoinSearchSelect } from '@/components/coins/CoinSearchSelect';
import { ShareTradePlanButton } from '@/components/share/ShareTradePlanButton';
import { TradePlanCard } from '@/components/share/TradePlanCard';
import { useCoinPrice } from '@/hooks/useCoinGecko';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import { calculatePnL } from '@/lib/calculators/pnl';
import { formatUSD, formatPercent, formatTokens } from '@/lib/format';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface PnLState {
  investmentAmount: string;
  buyPrice: string;
  sellPrice: string;
  tradingFees: string;
  selectedCoinId: string | null;
  selectedCoinName: string;
  selectedCoinSymbol: string;
}

const defaultState: PnLState = {
  investmentAmount: '',
  buyPrice: '',
  sellPrice: '',
  tradingFees: '0.1',
  selectedCoinId: null,
  selectedCoinName: '',
  selectedCoinSymbol: '',
};

export function PnLModule() {
  const [state, setState] = useLocalStorageState(STORAGE_KEYS.PNL, defaultState);
  const [livePriceUsed, setLivePriceUsed] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const { data: livePrice, isLoading: isPriceLoading, error: priceError } = useCoinPrice(state.selectedCoinId);

  useEffect(() => {
    if (livePrice && livePrice > 0 && !livePriceUsed) {
      setState(prev => ({ ...prev, buyPrice: livePrice.toString() }));
      setLivePriceUsed(true);
    }
  }, [livePrice, livePriceUsed, setState]);

  const handleCoinSelect = (coinId: string, coinName: string, coinSymbol: string) => {
    setState(prev => ({
      ...prev,
      selectedCoinId: coinId,
      selectedCoinName: coinName,
      selectedCoinSymbol: coinSymbol,
    }));
    setLivePriceUsed(false);
  };

  const outputs = calculatePnL({
    investmentAmount: parseFloat(state.investmentAmount) || 0,
    buyPrice: parseFloat(state.buyPrice) || 0,
    sellPrice: parseFloat(state.sellPrice) || 0,
    tradingFees: parseFloat(state.tradingFees) || 0,
  });

  const isValid = outputs.tokenQuantity > 0;

  return (
    <div className="space-y-6">
      <GlassCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Smart Entry & Exit Engine (P&L)
          </CardTitle>
          <CardDescription>
            Calculate your profit/loss with trading fees included
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Coin Selection */}
          <div className="space-y-2">
            <Label>Select Coin (Optional - for live price)</Label>
            <CoinSearchSelect
              value={state.selectedCoinId}
              onSelect={handleCoinSelect}
              placeholder="Search for a coin..."
            />
            {isPriceLoading && (
              <p className="text-sm text-muted-foreground">Loading live price...</p>
            )}
            {priceError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {priceError.message || 'Failed to fetch live price'}
                </AlertDescription>
              </Alert>
            )}
            {livePrice && livePrice > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-accent/20">
                  Live Price: {formatUSD(livePrice)}
                </Badge>
              </div>
            )}
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="investment">Investment Amount ($)</Label>
              <Input
                id="investment"
                type="number"
                placeholder="1000"
                value={state.investmentAmount}
                onChange={(e) => setState(prev => ({ ...prev, investmentAmount: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyPrice">Buy Price ($)</Label>
              <Input
                id="buyPrice"
                type="number"
                placeholder="0.50"
                step="0.00000001"
                value={state.buyPrice}
                onChange={(e) => setState(prev => ({ ...prev, buyPrice: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellPrice">Sell Price / Target ($)</Label>
              <Input
                id="sellPrice"
                type="number"
                placeholder="1.00"
                step="0.00000001"
                value={state.sellPrice}
                onChange={(e) => setState(prev => ({ ...prev, sellPrice: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fees">Trading Fees (%)</Label>
              <Input
                id="fees"
                type="number"
                placeholder="0.1"
                step="0.01"
                value={state.tradingFees}
                onChange={(e) => setState(prev => ({ ...prev, tradingFees: e.target.value }))}
              />
            </div>
          </div>

          {/* Outputs */}
          {isValid ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Token Quantity</p>
                <p className="text-2xl font-bold">{formatTokens(outputs.tokenQuantity)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className={`text-2xl font-bold ${outputs.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatUSD(outputs.netProfit)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">ROI</p>
                <p className={`text-2xl font-bold ${outputs.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercent(outputs.roi)}
                </p>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Enter valid values to see your P&L calculation
              </AlertDescription>
            </Alert>
          )}

          {/* Share Button */}
          {isValid && (
            <div className="pt-4">
              <ShareTradePlanButton cardRef={cardRef} filename="cryptowise-pnl-plan.png" />
            </div>
          )}
        </CardContent>
      </GlassCard>

      {/* Hidden Trade Plan Card for Export */}
      {isValid && (
        <div className="fixed -left-[9999px]">
          <TradePlanCard
            ref={cardRef}
            title="P&L Trade Plan"
            coinName={state.selectedCoinName || 'Crypto'}
            coinSymbol={state.selectedCoinSymbol}
            data={[
              { label: 'Investment', value: formatUSD(parseFloat(state.investmentAmount) || 0) },
              { label: 'Buy Price', value: formatUSD(parseFloat(state.buyPrice) || 0) },
              { label: 'Sell Price', value: formatUSD(parseFloat(state.sellPrice) || 0) },
              { label: 'Trading Fees', value: `${state.tradingFees}%` },
              { label: 'Token Quantity', value: formatTokens(outputs.tokenQuantity) },
              { label: 'Net Profit', value: formatUSD(outputs.netProfit), highlight: true },
              { label: 'ROI', value: formatPercent(outputs.roi), highlight: true },
            ]}
          />
        </div>
      )}
    </div>
  );
}
