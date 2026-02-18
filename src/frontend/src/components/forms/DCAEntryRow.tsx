import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { type DCAEntry } from '@/lib/calculators/dca';

interface DCAEntryRowProps {
  entry: DCAEntry;
  index: number;
  onUpdate: (id: string, field: 'buyPrice' | 'amount', value: number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export function DCAEntryRow({ entry, index, onUpdate, onRemove, canRemove }: DCAEntryRowProps) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1 space-y-2">
        <Label htmlFor={`price-${entry.id}`} className="text-xs">
          Entry #{index + 1} - Buy Price ($)
        </Label>
        <Input
          id={`price-${entry.id}`}
          type="number"
          placeholder="0.50"
          step="0.00000001"
          value={entry.buyPrice || ''}
          onChange={(e) => onUpdate(entry.id, 'buyPrice', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="flex-1 space-y-2">
        <Label htmlFor={`amount-${entry.id}`} className="text-xs">
          Amount ($)
        </Label>
        <Input
          id={`amount-${entry.id}`}
          type="number"
          placeholder="1000"
          value={entry.amount || ''}
          onChange={(e) => onUpdate(entry.id, 'amount', parseFloat(e.target.value) || 0)}
        />
      </div>
      {canRemove && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onRemove(entry.id)}
          className="shrink-0"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
