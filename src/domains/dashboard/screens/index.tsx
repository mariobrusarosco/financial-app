import { useAuth } from '@/domains/auth/hooks/use-auth';
import { Calendar } from 'lucide-react';

export const DashboardIndexScreen = () => {
  const { user } = useAuth();

  // Format date as "Nov 29th, 2025"
  const formatDate = () => {
    const date = new Date();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();

    // Add ordinal suffix (st, nd, rd, th)
    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };

    return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
  };

  return (
    <div data-ui="dashboard-index-screen" className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Hello, {user?.name || 'User'}</h1>
        <div className="flex items-center gap-2 text-lg text-muted-foreground">
          <Calendar className="h-5 w-5" />
          <p>{formatDate()}</p>
        </div>
      </div>
    </div>
  );
};
