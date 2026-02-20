import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCoinSearch } from '@/hooks/useCoinGecko';
import { ApiErrorDisplay } from '@/components/feedback/ApiErrorDisplay';

interface CoinSearchSelectProps {
  value: string | null;
  onSelect: (coinId: string, coinName: string, coinSymbol: string) => void;
  placeholder?: string;
}

export function CoinSearchSelect({ value, onSelect, placeholder = 'Search coin...' }: CoinSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');

  const { data: coins, isLoading, error, refetch } = useCoinSearch(search);

  useEffect(() => {
    if (value && coins) {
      const coin = coins.find(c => c.id === value);
      if (coin) {
        setSelectedLabel(`${coin.name} (${coin.symbol.toUpperCase()})`);
      }
    }
  }, [value, coins]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9 sm:h-10 text-xs sm:text-sm"
        >
          <span className="truncate">{selectedLabel || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-2rem)] sm:w-full max-w-md p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Type to search..." 
            value={search}
            onValueChange={setSearch}
            className="text-xs sm:text-sm"
          />
          <CommandList className="max-h-[200px] sm:max-h-[300px]">
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {error && search.length >= 2 && (
              <div className="p-2">
                <ApiErrorDisplay 
                  error={error as Error} 
                  onRetry={() => refetch()}
                  message="Failed to search coins"
                />
              </div>
            )}
            {!isLoading && !error && search.length >= 2 && (!coins || coins.length === 0) && (
              <CommandEmpty>No coins found.</CommandEmpty>
            )}
            {!isLoading && !error && search.length < 2 && (
              <CommandEmpty>Type at least 2 characters to search.</CommandEmpty>
            )}
            {coins && coins.length > 0 && (
              <CommandGroup>
                {coins.map((coin) => (
                  <CommandItem
                    key={coin.id}
                    value={coin.id}
                    onSelect={() => {
                      onSelect(coin.id, coin.name, coin.symbol);
                      setSelectedLabel(`${coin.name} (${coin.symbol.toUpperCase()})`);
                      setOpen(false);
                    }}
                    className="text-xs sm:text-sm"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-3 w-3 sm:h-4 sm:w-4',
                        value === coin.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex items-center gap-2 min-w-0">
                      {coin.thumb && (
                        <img src={coin.thumb} alt={coin.name} className="w-4 h-4 sm:w-5 sm:h-5 rounded-full shrink-0" />
                      )}
                      <span className="truncate">{coin.name}</span>
                      <span className="text-muted-foreground uppercase shrink-0">({coin.symbol})</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
