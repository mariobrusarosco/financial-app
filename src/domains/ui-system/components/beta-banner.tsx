import { AlertTriangle } from 'lucide-react';

export const BetaBanner = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-8 bg-amber-200 border-b border-amber-200 shadow-sm opacity-70">
      <div className="flex items-center justify-center h-full px-4">
        <div className="flex items-center gap-2 text-amber-800">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">
            This is a beta project. Layouts are not final.
          </span>
        </div>
      </div>
    </div>
  );
};
