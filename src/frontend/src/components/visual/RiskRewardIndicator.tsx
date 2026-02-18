import { Badge } from '@/components/ui/badge';

interface RiskRewardIndicatorProps {
  ratio: number;
}

export function RiskRewardIndicator({ ratio }: RiskRewardIndicatorProps) {
  const getColor = (ratio: number) => {
    if (ratio >= 3) return 'bg-green-500';
    if (ratio >= 2) return 'bg-yellow-500';
    return 'bg-red-500';
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
              className="bg-red-500/70 h-full"
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
              className="bg-green-500/70 h-full"
              style={{ width: `${rewardWidth}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
