import { useQuery } from '@tanstack/react-query';
import { searchCoins, getCoinPrice, getCoinMarketData, type CoinSearchResult, type CoinMarketData } from '@/services/coingecko';

export function useCoinSearch(query: string) {
  return useQuery<CoinSearchResult[]>({
    queryKey: ['coinSearch', query],
    queryFn: () => searchCoins(query),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on rate limit errors
      if (error instanceof Error && error.name === 'RateLimitError') {
        return false;
      }
      // Retry network errors up to 2 times
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}

export function useCoinPrice(coinId: string | null) {
  return useQuery<number>({
    queryKey: ['coinPrice', coinId],
    queryFn: () => getCoinPrice(coinId!),
    enabled: !!coinId,
    staleTime: 60 * 1000, // 1 minute
    retry: (failureCount, error) => {
      if (error instanceof Error && error.name === 'RateLimitError') {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}

export function useCoinMarketData(coinId: string | null) {
  return useQuery<CoinMarketData | null>({
    queryKey: ['coinMarketData', coinId],
    queryFn: () => getCoinMarketData(coinId!),
    enabled: !!coinId,
    staleTime: 60 * 1000, // 1 minute
    retry: (failureCount, error) => {
      if (error instanceof Error && error.name === 'RateLimitError') {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}
