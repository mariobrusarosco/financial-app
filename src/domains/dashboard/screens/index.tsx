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
    const weekday = date.toLocaleString('en-US', { weekday: 'long' });

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

    return {
      weekday,
      month,
      day,
      year,
    };
  };

  return (
    <div data-ui="dashboard-index-screen" className="h-full flex flex-col  pt-20 relative">
      <div className="grid place-content-center place-items-center max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-7xl font-thin">Hello, {user?.full_name || 'User'}</h1>
        <div className="flex flex-col items-center pt-6 text-muted-foreground font-thin tracking-widest uppercase">
          <span className="text-2xl">
            {formatDate().weekday} {formatDate().month} {formatDate().day}
          </span>
          <span className="text-md font-light">{formatDate().year}</span>
        </div>
        <div className="mt-12 spinner w-20 h-20 text-center rounded-full" data-ui="spinner">
          <div className="spinner1"></div>
        </div>
      </div>

      <footer className="mt-auto pb-8 flex justify-center">
        <svg
          viewBox="0 0 70 69"
          className="w-[200px] h-[200px]"
          xmlns="http://www.w3.org/2000/svg"
          data-ui="footer-circle"
        >
          {/* Circle - color controlled via Tailwind fill-* classes */}
          <circle cx="35" cy="34.5" r="34.5" className="fill-teal-700" />

          {/* Arch - path that follows circle circumference exactly */}
          <path
            d="M 10 10.724 A 34.5 34.5 0 0 1 60 10.724"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="arch-path stroke-white"
          />
        </svg>
      </footer>
    </div>
  );
};
