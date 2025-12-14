import { useAuth } from '@/domains/auth/hooks/use-auth';
import { GaugeChart } from '@ui-system/components/gauge-chart';
import { GaugeChartSVG } from '@ui-system/components/gauge-chart-svg';

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
          <div className="spinner1" />
        </div>

        {/* Option 1: Gauge Chart SVG */}
        {/* <footer
          className="flex flex-col items-center gap-2 bg-gray-200 rounded-full fixed  bottom-[0%] p-[15px] w-[130vw]
        translate-x-[0]
        translate-y-[110vw]
        scale-110
        xl:w-[1550px]
        xl:translate-y-[1400px]
        xl:scale-120
          "
        >
          <GaugeChartSVG
            value={50}
            max={100}
            size={500}
            strokeWidth={0.8}
            backgroundColor="#d4d4d4"
            color="#000000"
          />
        </footer> */}
      </div>
    </div>
  );
};
