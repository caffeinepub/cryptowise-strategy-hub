import { ReactNode } from 'react';
import { AppLogo } from '@/components/branding/AppLogo';
import { ClearSavedDataButton } from '@/components/actions/ClearSavedDataButton';
import { OfflineIndicator } from '@/components/feedback/OfflineIndicator';
import { Heart } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'cryptowise-hub'
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-30"
        style={{
          backgroundImage: 'url(/assets/generated/cryptowise-bg.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Offline Indicator */}
      <OfflineIndicator />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-md bg-card/30">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <AppLogo />
            <div className="min-w-0">
              <h1 className="text-sm sm:text-xl font-bold text-foreground truncate">CryptoWise Strategy Hub</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden xs:block">Beyond the Calculator – Data-Driven Investing</p>
            </div>
          </div>
          <ClearSavedDataButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 backdrop-blur-md bg-card/30 py-3 sm:py-4">
        <div className="container mx-auto px-3 sm:px-4 text-center text-xs sm:text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1 flex-wrap">
            <span>© {currentYear} CryptoWise.</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 fill-red-500" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors underline"
              >
                caffeine.ai
              </a>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
