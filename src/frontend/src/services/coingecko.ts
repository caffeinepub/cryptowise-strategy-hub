const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';
const REQUEST_TIMEOUT = 10000; // 10 seconds

export interface CoinSearchResult {
  id: string;
  symbol: string;
  name: string;
  thumb?: string;
}

export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  circulating_supply: number;
  price_change_percentage_24h?: number;
}

class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

async function fetchWithTimeout(url: string, timeout = REQUEST_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new NetworkError('Request timed out. Please check your internet connection and try again.');
    }
    throw new NetworkError('Unable to connect to cryptocurrency data service. Please check your internet connection.');
  }
}

export async function searchCoins(query: string): Promise<CoinSearchResult[]> {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetchWithTimeout(`${COINGECKO_API_BASE}/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new RateLimitError('Rate limit exceeded. Please wait a moment and try again.');
      }
      if (response.status >= 500) {
        throw new NetworkError('Cryptocurrency data service is temporarily unavailable. Please try again later.');
      }
      throw new NetworkError('Failed to search coins. Please try again.');
    }
    
    const data = await response.json();
    return data.coins?.slice(0, 10) || [];
  } catch (error) {
    if (error instanceof NetworkError || error instanceof RateLimitError) {
      throw error;
    }
    console.error('CoinGecko search error:', error);
    throw new NetworkError('Unable to search coins. Please check your internet connection.');
  }
}

export async function getCoinPrice(coinId: string): Promise<number> {
  try {
    const response = await fetchWithTimeout(
      `${COINGECKO_API_BASE}/simple/price?ids=${coinId}&vs_currencies=usd`
    );
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new RateLimitError('Rate limit exceeded. Please wait a moment and try again.');
      }
      if (response.status >= 500) {
        throw new NetworkError('Cryptocurrency data service is temporarily unavailable. Please try again later.');
      }
      throw new NetworkError('Failed to fetch coin price. Please try again.');
    }
    
    const data = await response.json();
    return data[coinId]?.usd || 0;
  } catch (error) {
    if (error instanceof NetworkError || error instanceof RateLimitError) {
      throw error;
    }
    console.error('CoinGecko price error:', error);
    throw new NetworkError('Unable to fetch coin price. Please check your internet connection.');
  }
}

export async function getCoinMarketData(coinId: string): Promise<CoinMarketData | null> {
  try {
    const response = await fetchWithTimeout(
      `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new RateLimitError('Rate limit exceeded. Please wait a moment and try again.');
      }
      if (response.status >= 500) {
        throw new NetworkError('Cryptocurrency data service is temporarily unavailable. Please try again later.');
      }
      throw new NetworkError('Failed to fetch coin market data. Please try again.');
    }
    
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    if (error instanceof NetworkError || error instanceof RateLimitError) {
      throw error;
    }
    console.error('CoinGecko market data error:', error);
    throw new NetworkError('Unable to fetch market data. Please check your internet connection.');
  }
}
