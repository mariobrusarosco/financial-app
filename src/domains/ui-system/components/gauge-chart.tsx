import type { ReactNode } from 'react';
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';
import { ChartContainer } from '@ui-system/components/chart';
import type { ChartConfig } from '@ui-system/components/chart';

export interface GaugeChartProps {
  /**
   * Current value (e.g., 750 for $750 spent)
   */
  value: number;
  /**
   * Maximum value (e.g., 1000 for $1000 budget)
   */
  max: number;
  /**
   * Icon to display in the center (React component)
   */
  icon?: ReactNode;
  /**
   * Display value in the center
   * If not provided, shows percentage
   */
  displayValue?: string | number;
  /**
   * Small subtitle text below the value
   */
  subtitle?: string;
  /**
   * Color of the gauge arc
   * @default "hsl(var(--chart-1))"
   */
  color?: string;
  /**
   * Background color for the empty portion of the gauge
   * @default "hsl(var(--muted) / 0.15)"
   */
  backgroundColor?: string;
  /**
   * Size of the gauge in pixels
   * @default 140
   */
  size?: number;
  /**
   * Thickness of the arc stroke
   * @default 8
   */
  strokeWidth?: number;
  /**
   * Class name for the container
   */
  className?: string;
}

/**
 * GaugeChart - A minimal C-shaped arc gauge inspired by fitness trackers
 *
 * Creates a partial circular arc (like a horseshoe or C-shape) with:
 * - Thin, elegant stroke
 * - Icon + value in the center
 * - Minimal, clean design
 *
 * @example
 * ```tsx
 * <GaugeChart
 *   value={75}
 *   max={100}
 *   displayValue="9"
 *   icon={<Flame className="w-5 h-5" />}
 * />
 * ```
 */
export function GaugeChart({
  value,
  max,
  color = 'hsl(var(--foreground))',
  backgroundColor = 'hsl(var(--muted) / 0.15)',
  size = 140,
  strokeWidth = 8,
  className,
}: GaugeChartProps) {
  const percentage = (value / max) * 100;

  // Single data point for the radial bar
  const chartData = [{ value: percentage, fill: color }];

  const chartConfig = {
    value: { color },
  } satisfies ChartConfig;

  // Arc starts at bottom-left and goes to bottom-right (C-shape like fitness watch)
  const startAngle = 180; // Bottom-left
  const endAngle = 0; // Bottom-right (creates C-shape opening at top)

  return (
    <div className={className} style={{ width: size, height: size, position: 'relative' }}>
      <ChartContainer config={chartConfig} style={{ width: size, height: size }}>
        <RadialBarChart
          width={size}
          height={size}
          data={chartData}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={size * 0.35}
          outerRadius={size * 0.45}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />

          {/* Background arc (empty state) */}
          <RadialBar
            background={{ fill: backgroundColor }}
            dataKey="value"
            cornerRadius={strokeWidth / 2}
            fill={''}
          />
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
}
