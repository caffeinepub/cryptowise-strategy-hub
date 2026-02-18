import { useQuery } from '@tanstack/react-query';
import { searchCoins, getCoinPrice, getCoinMarketData, type CoinSearchResult, type CoinMarketData } from '@/services/coingecko';

export function useCoinSearch(query: string) {
  return useQuery<CoinSearchResult[]>({
    queryKey: ['coinSearch', query],
    queryFn: () => searchCoins(query),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCoinPrice(coinId: string | null) {
  return useQuery<number>({
    queryKey: ['coinPrice', coinId],
    queryFn: () => getCoinPrice(coinId!),
    enabled: !!coinId,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useCoinMarketData(coinId: string | null) {
  return useQuery<CoinMarketData | null>({
    queryKey: ['coinMarketData', coinId],
    queryFn: () => getCoinMarketData(coinId!),
    enabled: !!coinId,
    staleTime: 60 * 1000, // 1 minute
  });
}
