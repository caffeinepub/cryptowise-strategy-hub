import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppShell } from '@/components/layout/AppShell';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { PnLModule } from '@/pages/modules/PnLModule';
import { RiskModule } from '@/pages/modules/RiskModule';
import { DCAModule } from '@/pages/modules/DCAModule';
import { MoonMathModule } from '@/pages/modules/MoonMathModule';
import { FutureValueModule } from '@/pages/modules/FutureValueModule';
import { DecisionModule } from '@/pages/modules/DecisionModule';

function App() {
  const [activeModule, setActiveModule] = useState('pnl');

  return (
    <ErrorBoundary>
      <AppShell>
        <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2 bg-transparent h-auto p-1">
            <TabsTrigger 
              value="pnl" 
              className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent-foreground backdrop-blur-sm border border-border/50 text-xs sm:text-sm px-2 py-2 sm:px-3 sm:py-2.5"
            >
              P&L
            </TabsTrigger>
            <TabsTrigger 
              value="risk"
              className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent-foreground backdrop-blur-sm border border-border/50 text-xs sm:text-sm px-2 py-2 sm:px-3 sm:py-2.5"
            >
              Risk
            </TabsTrigger>
            <TabsTrigger 
              value="dca"
              className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent-foreground backdrop-blur-sm border border-border/50 text-xs sm:text-sm px-2 py-2 sm:px-3 sm:py-2.5"
            >
              DCA
            </TabsTrigger>
            <TabsTrigger 
              value="moonmath"
              className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent-foreground backdrop-blur-sm border border-border/50 text-xs sm:text-sm px-2 py-2 sm:px-3 sm:py-2.5"
            >
              Moon Math
            </TabsTrigger>
            <TabsTrigger 
              value="future"
              className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent-foreground backdrop-blur-sm border border-border/50 text-xs sm:text-sm px-2 py-2 sm:px-3 sm:py-2.5"
            >
              Future Value
            </TabsTrigger>
            <TabsTrigger 
              value="decision"
              className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent-foreground backdrop-blur-sm border border-border/50 text-xs sm:text-sm px-2 py-2 sm:px-3 sm:py-2.5"
            >
              Decision
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pnl" className="mt-4 sm:mt-6">
            <PnLModule />
          </TabsContent>

          <TabsContent value="risk" className="mt-4 sm:mt-6">
            <RiskModule />
          </TabsContent>

          <TabsContent value="dca" className="mt-4 sm:mt-6">
            <DCAModule />
          </TabsContent>

          <TabsContent value="moonmath" className="mt-4 sm:mt-6">
            <MoonMathModule />
          </TabsContent>

          <TabsContent value="future" className="mt-4 sm:mt-6">
            <FutureValueModule />
          </TabsContent>

          <TabsContent value="decision" className="mt-4 sm:mt-6">
            <DecisionModule />
          </TabsContent>
        </Tabs>
      </AppShell>
    </ErrorBoundary>
  );
}

export default App;
