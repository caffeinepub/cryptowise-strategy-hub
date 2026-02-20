import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <Card className={cn(
      'backdrop-blur-xl bg-card/40 border-border/50 shadow-xl',
      'w-full max-w-full overflow-hidden',
      className
    )}>
      {children}
    </Card>
  );
}
