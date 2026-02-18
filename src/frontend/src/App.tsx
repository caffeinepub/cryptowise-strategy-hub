import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppShell } from '@/components/layout/AppShell';
import { PnLModule } from '@/pages/modules/PnLModule';
import { RiskModule } from '@/pages/modules/RiskModule';
import { DCAModule } from '@/pages/modules/DCAModule';
import { MoonMathModule } from '@/pages/modules/MoonMathModule';
import { FutureValueModule } from '@/pages/modules/FutureValueModule';

function App() {
  const [activeModule, setActiveModule] = useState('pnl');

  return (
    <AppShell>
      <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2 bg-transparent h-auto p-1">
          <TabsTrigger 
            value="pnl" 
            className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent-foreground backdrop-blur-sm border border-border/50"
          >
            P&L
          </TabsTrigger>
          <TabsTrigger 
            value="risk"
            className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent-foreground backdrop-blur-sm border border-border/50"
          >
            Risk
          </TabsTrigger>
          <TabsTrigger 
            value="dca"
            className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent-foreground backdrop-blur-sm border border-border/50"
          >
            DCA
          </TabsTrigger>
          <TabsTrigger 
            value="moonmath"
            className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent-foreground backdrop-blur-sm border border-border/50"
          >
            Moon Math
          </TabsTrigger>
          <TabsTrigger 
            value="future"
            className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent-foreground backdrop-blur-sm border border-border/50"
          >
            Future Value
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pnl" className="mt-6">
          <PnLModule />
        </TabsContent>

        <TabsContent value="risk" className="mt-6">
          <RiskModule />
        </TabsContent>

        <TabsContent value="dca" className="mt-6">
          <DCAModule />
        </TabsContent>

        <TabsContent value="moonmath" className="mt-6">
          <MoonMathModule />
        </TabsContent>

        <TabsContent value="future" className="mt-6">
          <FutureValueModule />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

export default App;
