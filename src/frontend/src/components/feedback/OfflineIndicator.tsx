import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-3 sm:pt-4">
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="text-xs sm:text-sm">
          No internet connection. Some features may be unavailable. Your saved data remains accessible.
        </AlertDescription>
      </Alert>
    </div>
  );
}
