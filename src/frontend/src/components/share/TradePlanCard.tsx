import { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface TradePlanData {
  label: string;
  value: string;
  highlight?: boolean;
}

interface TradePlanCardProps {
  title: string;
  coinName?: string;
  coinSymbol?: string;
  data: TradePlanData[];
}

export const TradePlanCard = forwardRef<HTMLDivElement, TradePlanCardProps>(
  ({ title, coinName, coinSymbol, data }, ref) => {
    return (
      <div ref={ref} className="w-[600px] bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-white">{title}</CardTitle>
              {coinName && (
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{coinName}</p>
                  {coinSymbol && (
                    <p className="text-sm text-slate-400">{coinSymbol.toUpperCase()}</p>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.map((item, index) => (
              <div key={index}>
                {index > 0 && <Separator className="my-3 bg-slate-700" />}
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-base">{item.label}</span>
                  <span className={`font-bold text-lg ${item.highlight ? 'text-green-400' : 'text-white'}`}>
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
            <Separator className="my-4 bg-slate-700" />
            <div className="text-center text-xs text-slate-500 pt-2">
              CryptoWise Strategy Hub • cryptowise.app
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);

TradePlanCard.displayName = 'TradePlanCard';
