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

interface CoinSearchSelectProps {
  value: string | null;
  onSelect: (coinId: string, coinName: string, coinSymbol: string) => void;
  placeholder?: string;
}

export function CoinSearchSelect({ value, onSelect, placeholder = 'Search coin...' }: CoinSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');

  const { data: coins, isLoading } = useCoinSearch(search);

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
          className="w-full justify-between"
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Type to search..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {!isLoading && search.length >= 2 && (!coins || coins.length === 0) && (
              <CommandEmpty>No coins found.</CommandEmpty>
            )}
            {!isLoading && search.length < 2 && (
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
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === coin.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {coin.name} ({coin.symbol.toUpperCase()})
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
