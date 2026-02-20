import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ApiErrorDisplayProps {
  error: Error | null;
  onRetry?: () => void;
  message?: string;
}

export function ApiErrorDisplay({ error, onRetry, message }: ApiErrorDisplayProps) {
  if (!error) return null;

  const errorMessage = message || error.message || 'An error occurred while fetching data';

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between gap-2">
        <span className="text-xs sm:text-sm flex-1">{errorMessage}</span>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="shrink-0 h-7 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
