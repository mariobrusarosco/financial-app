import { AlertTriangle } from 'lucide-react';

export const BetaBanner = () => {
  return (
    <div className="fixed top-0 right-0 left-0 z-50 h-7 border-b border-amber-200/70 bg-amber-100 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
      <div className="flex items-center justify-center h-full px-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Beta preview</span>
        </div>
      </div>
    </div>
  );
};
