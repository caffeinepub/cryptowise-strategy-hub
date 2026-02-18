const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

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
}

export async function searchCoins(query: string): Promise<CoinSearchResult[]> {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(`${COINGECKO_API_BASE}/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      throw new Error('Failed to search coins');
    }
    
    const data = await response.json();
    return data.coins?.slice(0, 10) || [];
  } catch (error) {
    console.error('CoinGecko search error:', error);
    throw error;
  }
}

export async function getCoinPrice(coinId: string): Promise<number> {
  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}/simple/price?ids=${coinId}&vs_currencies=usd`
    );
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      throw new Error('Failed to fetch coin price');
    }
    
    const data = await response.json();
    return data[coinId]?.usd || 0;
  } catch (error) {
    console.error('CoinGecko price error:', error);
    throw error;
  }
}

export async function getCoinMarketData(coinId: string): Promise<CoinMarketData | null> {
  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&sparkline=false`
    );
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      throw new Error('Failed to fetch coin market data');
    }
    
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('CoinGecko market data error:', error);
    throw error;
  }
}
