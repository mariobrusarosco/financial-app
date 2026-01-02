import * as React from 'react';
import { cn } from '@/domains/ui-system/utils';

export interface CurrencyProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The amount to display (string, number, or undefined)
   */
  value: string | number | undefined;
  /**
   * Currency code (default: USD)
   */
  currency?: string;
  /**
   * Display variant
   */
  variant?: 'default' | 'large' | 'small' | 'compact';
  /**
   * Color scheme
   */
  color?: 'default' | 'positive' | 'negative' | 'muted';
  /**
   * Whether to show +/- signs
   */
  showSign?: boolean;
  /**
   * Whether to force display as positive (removes - sign)
   */
  forcePositive?: boolean;
  /**
   * Locale for number formatting (default: en-US)
   */
  locale?: string;
  /**
   * Whether to show decimal places even for whole numbers
   */
  showDecimals?: boolean;
  /**
   * Show loading placeholder when value is undefined
   */
  showLoading?: boolean;
  /**
   * Automatically color positive/negative values (without requiring showSign)
   */
  autoColor?: boolean;
}

const Currency = React.forwardRef<HTMLSpanElement, CurrencyProps>(
  (
    {
      className,
      value,
      currency = 'USD',
      variant = 'default',
      color = 'default',
      showSign = false,
      forcePositive = false,
      locale = 'en-US',
      showDecimals = true,
      showLoading = true,
      autoColor = false,
      ...props
    },
    ref
  ) => {
    // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
    // (Rules of Hooks: hooks must be called in the same order every render)

    // Determine size classes first
    const sizeClasses = React.useMemo(() => {
      switch (variant) {
        case 'large':
          return 'text-2xl font-bold';
        case 'small':
          return 'text-sm font-medium';
        case 'compact':
          return 'text-xs font-medium';
        case 'default':
        default:
          return 'text-base font-semibold';
      }
    }, [variant]);

    // Convert to number and handle edge cases
    const numericValue = React.useMemo(() => {
      if (value === undefined || value === null) return 0;
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    }, [value]);

    // Determine if value is negative
    const isNegative = numericValue < 0;
    const absoluteValue = Math.abs(numericValue);

    // Format currency
    const formattedCurrency = React.useMemo(() => {
      try {
        const formatter = new Intl.NumberFormat(locale, {
          style: 'currency',
          currency,
          minimumFractionDigits: showDecimals ? 2 : 0,
          maximumFractionDigits: showDecimals ? 2 : 0,
        });

        return formatter.format(absoluteValue);
      } catch (error) {
        // Fallback formatting
        return `$${absoluteValue.toFixed(showDecimals ? 2 : 0)}`;
      }
    }, [absoluteValue, currency, locale, showDecimals]);

    // Determine sign to display
    const signToShow = React.useMemo(() => {
      if (forcePositive) return '';
      if (!showSign) return '';
      if (numericValue === 0) return '';
      return isNegative ? '-' : '+';
    }, [showSign, isNegative, numericValue, forcePositive]);

    // Determine color class
    const colorClass = React.useMemo(() => {
      switch (color) {
        case 'positive':
          return 'text-teal-600 dark:text-teal-400';
        case 'negative':
          return 'text-red-600 dark:text-red-400';
        case 'muted':
          return 'text-muted-foreground';
        case 'default':
        default:
          // Auto-detect color based on value
          if ((showSign || autoColor) && numericValue !== 0) {
            return isNegative
              ? 'text-red-600 dark:text-red-400'
              : 'text-teal-600 dark:text-teal-400';
          }
          return 'text-foreground';
      }
    }, [color, isNegative, showSign, numericValue, autoColor]);

    // Handle loading state for undefined values
    // (Placed after all hooks to comply with Rules of Hooks)
    if ((value === undefined || value === null) && showLoading) {
      return (
        <span
          className={cn(
            'tabular-nums inline-flex items-baseline animate-pulse',
            sizeClasses,
            'text-muted-foreground',
            className
          )}
          ref={ref}
          {...props}
        >
          <span className="bg-muted rounded h-4 w-16"></span>
        </span>
      );
    }

    return (
      <span
        className={cn(
          'tabular-nums inline-flex items-baseline',
          colorClass,
          sizeClasses,
          className
        )}
        ref={ref}
        {...props}
      >
        {signToShow && (
          <span className="mr-0.5" aria-hidden="true">
            {signToShow}
          </span>
        )}
        <span>{formattedCurrency}</span>
      </span>
    );
  }
);

Currency.displayName = 'Currency';

export { Currency };
