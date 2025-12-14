import type { ReactNode } from 'react';

export interface GaugeChartSVGProps {
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
   * @default "currentColor"
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
   * @default 12
   */
  strokeWidth?: number;
  /**
   * Percentage of the circle to show (0-1)
   * 1 = full circle, 0.8 = C-shape with 20% gap
   * @default 0.8
   */
  arcPercentage?: number;
  /**
   * Rotation offset in degrees (to position the gap)
   * @default -90 (gap at top for C-shape)
   */
  rotationOffset?: number;
  /**
   * Class name for the container
   */
  className?: string;
}

/**
 * GaugeChartSVG - A minimal C-shaped arc gauge using pure SVG
 *
 * Uses SVG circles with stroke-dasharray and stroke-dashoffset for:
 * - Smaller bundle size (no Recharts dependency)
 * - Better performance
 * - Simpler code
 * - Smooth CSS animations
 *
 * Perfect for fitness tracker-style gauges and progress rings.
 *
 * @example
 * ```tsx
 * <GaugeChartSVG
 *   value={75}
 *   max={100}
 *   displayValue="75"
 *   size={180}
 *   strokeWidth={12}
 * />
 * ```
 */
export function GaugeChartSVG({
  value,
  max,
  icon,
  displayValue,
  subtitle,
  color = '#000000',
  backgroundColor = '#e5e7eb',
  size = 140,
  strokeWidth = 2,
  arcPercentage = 0.25, // Semi-circle (180 degrees)
  rotationOffset = 153,
  className,
}: GaugeChartSVGProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const displayText = displayValue ?? `${Math.round(percentage)}%`;

  // Use viewBox coordinate system (0-100)
  const viewBoxSize = 100;
  const center = viewBoxSize / 2;
  const radius = (viewBoxSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Arc length (e.g., 80% of circle for C-shape)
  const arcLength = circumference * arcPercentage;
  console.log({ arcLength, circumference });

  // Progress length based on percentage (fills the background arc)
  const progressLength = (percentage / 100) * arcLength;

  // Offset to position the arc (gap at top for C-shape)
  // Quarter turn (0.25) positions start at bottom
  const dashOffset = circumference * 0.2;

  return (
    <svg
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      style={{
        transform: `rotate(${rotationOffset}deg)`,
        // position: 'absolute',
        // width: '100%',
        // height: '100%',
      }}
    >
      {/* Background arc (empty state) */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
        strokeDasharray={`${arcLength} ${circumference}`}
        strokeDashoffset={-dashOffset}
        strokeLinecap="round"
        style={{
          stroke: backgroundColor,
        }}
      />

      {/* Progress arc (filled state) */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${progressLength} ${circumference}`}
        strokeDashoffset={-dashOffset}
        strokeLinecap="round"
        style={{
          stroke: color,
          transition: 'stroke-dasharray 0.3s ease',
        }}
      />
    </svg>
  );
}
