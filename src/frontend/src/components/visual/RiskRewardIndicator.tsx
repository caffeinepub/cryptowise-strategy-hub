import { Badge } from '@/components/ui/badge';

interface RiskRewardIndicatorProps {
  ratio: number;
}

export function RiskRewardIndicator({ ratio }: RiskRewardIndicatorProps) {
  const getColor = (ratio: number) => {
    if (ratio >= 3) return 'bg-primary';
    if (ratio >= 2) return 'bg-accent';
    return 'bg-muted-foreground';
  };

  const getMessage = (ratio: number) => {
    if (ratio >= 3) return 'Excellent R:R';
    if (ratio >= 2) return 'Good R:R';
    return 'Poor R:R';
  };

  const riskWidth = 20;
  const rewardWidth = Math.min(ratio * riskWidth, 80);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={`${getColor(ratio)} text-white border-0`}>
          {getMessage(ratio)}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-1">
          <span className="text-xs text-muted-foreground w-12">Risk</span>
          <div className="flex-1 h-6 bg-muted rounded-sm overflow-hidden flex">
            <div 
              className="bg-muted-foreground/70 h-full"
              style={{ width: `${riskWidth}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-1">
          <span className="text-xs text-muted-foreground w-12">Reward</span>
          <div className="flex-1 h-6 bg-muted rounded-sm overflow-hidden flex">
            <div 
              className="bg-primary/70 h-full"
              style={{ width: `${rewardWidth}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
