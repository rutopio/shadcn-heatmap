"use client";

import { createContext, Fragment, use, useMemo } from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";

import type { Locale } from "date-fns";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

// Status values: 0 = no-data, 1 = error, 2 = warning, 3 = normal
export type StatusValue = 0 | 1 | 2 | 3;

export type StatusActivity = {
  date: string; // YYYY-MM-DD
  value: StatusValue; // Status: 0=no-data, 1=error, 2=warning, 3=normal
};

type StatusHeatmapContextType = {
  data: StatusActivity[];
  dates: string[];
  blockMargin: number;
  blockRadius: number;
  blockSize: number;
  blockSizeRatio: number;
  blockWidth: number;
  fontSize: number;
  labels: StatusHeatmapLabels;
  normalDays: number;
  width: number;
  height: number;
  dateFormat: string;
  locale?: Locale;
  colors?: ColorConfig;
};

export type StatusHeatmapLabels = {
  statuses?: {
    noData?: string;
    error?: string;
    warning?: string;
    normal?: string;
  };
  normalDays?: string;
};

export type ColorConfig = {
  error?: string;
  warning?: string;
  normal?: string;
};

const DEFAULT_COLORS = {
  noData: "var(--color-secondary)",
  error: "oklch(57.7% 0.245 27.325)", //red-600
  warning: "oklch(82.8% 0.189 84.429)", // amber-400
  normal: "oklch(72.3% 0.219 149.579)", // green-500
};

const getStatusFill = (value: StatusValue, colors?: ColorConfig): string => {
  switch (value) {
    case 0:
      return DEFAULT_COLORS.noData;
    case 1:
      return colors?.error ?? DEFAULT_COLORS.error;
    case 2:
      return colors?.warning ?? DEFAULT_COLORS.warning;
    case 3:
      return colors?.normal ?? DEFAULT_COLORS.normal;
    default:
      return DEFAULT_COLORS.noData;
  }
};

const EMPTY_STYLE: CSSProperties = {};
const PADDING = 20;

const StatusHeatmapContext = createContext<StatusHeatmapContextType | null>(
  null
);

const useStatusHeatmap = () => {
  const context = use(StatusHeatmapContext);

  if (!context) {
    throw new Error(
      "StatusHeatmap components must be used within a StatusHeatmap"
    );
  }

  return context;
};

export type StatusHeatmapProps = HTMLAttributes<HTMLDivElement> & {
  data: StatusActivity[];
  dateFormat?: string;
  blockSize?: number;
  blockMargin?: number;
  blockRadius?: number;
  blockSizeRatio?: number;
  colors?: ColorConfig;
  locale?: Locale;
  labels?: StatusHeatmapLabels;
  fontSize?: number;
  emptyState?: ReactNode;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
};

/**
 * Status Heatmap
 *
 * A timeline indicator showing daily status over a period (e.g., 90 days).
 * Similar to Atlassian Statuspage - each day is represented by a vertical bar.
 * Supports 4 status values: 0=no-data, 1=error, 2=warning, 3=normal
 *
 * @example
 * ```tsx
 * <StatusHeatmap data={data} blockSizeRatio={0.2}>
 *   <StatusHeatmapBody>
 *     {({ activity, dayIndex }) => (
 *       <StatusHeatmapBlock
 *         activity={activity}
 *         dayIndex={dayIndex}
 *       />
 *     )}
 *   </StatusHeatmapBody>
 *   <StatusHeatmapFooter>
 *     <StatusHeatmapNormalDays />
 *     <StatusHeatmapLegend />
 *   </StatusHeatmapFooter>
 * </StatusHeatmap>
 * ```
 *
 * @param data - Array of activities with date (YYYY-MM-DD) and status value (0-3)
 * @param dateFormat - Date format string for tooltips. Default: "MMM d"
 * @param blockSizeRatio - Width/height ratio of blocks. Default: 0.2 (narrow vertical bars)
 * @param colors - Custom colors for error, warning, and normal states
 */
export const StatusHeatmap = ({
  data,
  dateFormat = "MMM d",
  blockSize = 40,
  blockMargin = 2,
  blockRadius = 2,
  blockSizeRatio = 0.2,
  colors,
  locale,
  labels: labelsProp,
  fontSize = 14,
  emptyState,
  style = EMPTY_STYLE,
  className,
  children,
  ...props
}: StatusHeatmapProps) => {
  const labels = {
    statuses: {
      noData: "No Data",
      error: "Error",
      warning: "Warning",
      normal: "Normal",
    },
    normalDays: "{{count}} days normal",
    ...labelsProp,
  };

  const dates = useMemo(() => {
    const uniqueDates = new Set<string>();
    data.forEach((activity) => {
      uniqueDates.add(activity.date);
    });
    return Array.from(uniqueDates).sort();
  }, [data]);

  const normalDays = useMemo(() => {
    return data.filter((activity) => activity.value === 3).length;
  }, [data]);

  const blockWidth = blockSize * blockSizeRatio;
  const width = dates.length * (blockWidth + blockMargin) - blockMargin;
  const height = blockSize;

  if (data.length === 0 || dates.length === 0) {
    return emptyState ? <>{emptyState}</> : null;
  }

  return (
    <StatusHeatmapContext
      value={{
        data,
        dates,
        blockMargin,
        blockRadius,
        blockSize,
        blockSizeRatio,
        blockWidth,
        fontSize,
        labels,
        normalDays,
        width,
        height,
        dateFormat,
        locale,
        colors,
      }}
    >
      <div
        className={cn("flex w-max max-w-full flex-col gap-2", className)}
        style={{ fontSize, ...style }}
        {...props}
      >
        {children}
      </div>
    </StatusHeatmapContext>
  );
};

export type StatusHeatmapBlockProps = HTMLAttributes<SVGRectElement> & {
  activity: StatusActivity;
  dayIndex: number;
  className?: string;
};

export const StatusHeatmapBlock = ({
  ref,
  activity,
  dayIndex,
  className,
  style: styleProp,
  ...props
}: StatusHeatmapBlockProps & {
  ref?: React.RefObject<SVGRectElement | null>;
}) => {
  const { blockSize, blockWidth, blockMargin, blockRadius, colors } =
    useStatusHeatmap();

  if (activity.value < 0 || activity.value > 3) {
    throw new RangeError(
      `Invalid status value ${activity.value} for date ${activity.date}. Must be 0 (no-data), 1 (error), 2 (warning), or 3 (normal).`
    );
  }

  const xPosition = (blockWidth + blockMargin) * dayIndex;

  return (
    <rect
      ref={ref}
      className={cn(
        "hover:stroke-foreground transition-all hover:stroke-1",
        className
      )}
      data-value={activity.value}
      data-date={activity.date}
      height={blockSize}
      rx={blockRadius}
      ry={blockRadius}
      width={blockWidth}
      x={xPosition}
      y={0}
      style={{
        fill: getStatusFill(activity.value, colors),
        ...styleProp,
      }}
      {...props}
    />
  );
};
StatusHeatmapBlock.displayName = "StatusHeatmapBlock";

export type StatusHeatmapBodyProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  showDateLabels?: boolean;
  labelInterval?: number; // Show label every N days
  className?: string;
  labelTextClass?: string;
  children: (props: {
    activity: StatusActivity;
    dayIndex: number;
  }) => ReactNode;
};

export const StatusHeatmapBody = ({
  showDateLabels = false,
  labelInterval = 30,
  className,
  labelTextClass,
  children,
  ...props
}: StatusHeatmapBodyProps) => {
  const {
    data,
    dates,
    width,
    height,
    blockWidth,
    blockMargin,
    fontSize,
    dateFormat,
    locale,
  } = useStatusHeatmap();

  const activityMap = useMemo(() => {
    const map = new Map<string, StatusActivity>();
    data.forEach((activity) => {
      map.set(activity.date, activity);
    });
    return map;
  }, [data]);

  const allActivities = useMemo(() => {
    return dates.map((date) => {
      const existing = activityMap.get(date);
      return (
        existing || {
          date,
          value: 0 as StatusValue,
        }
      );
    });
  }, [dates, activityMap]);

  const labelHeight = showDateLabels ? fontSize * 2 : 0;

  return (
    <div
      className={cn("max-w-full overflow-x-auto overflow-y-hidden", className)}
      {...props}
    >
      <svg
        className="block overflow-visible"
        height={height + labelHeight + PADDING * 2}
        viewBox={`${-PADDING} ${-PADDING} ${width + PADDING * 2} ${height + labelHeight + PADDING * 2}`}
        width={width + PADDING * 2}
      >
        {showDateLabels && (
          <g className={cn("fill-current font-mono text-xs", labelTextClass)}>
            {dates.map((date, dayIndex) => {
              if (dayIndex % labelInterval !== 0) return null;

              const xPosition =
                (blockWidth + blockMargin) * dayIndex + blockWidth / 2;

              return (
                <text
                  key={`date-${date}`}
                  x={xPosition}
                  y={height + fontSize}
                  dominantBaseline="hanging"
                  textAnchor="middle"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {format(new Date(date), dateFormat, { locale })}
                </text>
              );
            })}
          </g>
        )}

        {allActivities.map((activity, dayIndex) => {
          const key = activity.date;
          return (
            <Fragment key={key}>{children({ activity, dayIndex })}</Fragment>
          );
        })}
      </svg>
    </div>
  );
};

export type StatusHeatmapFooterProps = HTMLAttributes<HTMLDivElement>;

export const StatusHeatmapFooter = ({
  className,
  ...props
}: StatusHeatmapFooterProps) => (
  <div
    className={cn(
      "flex flex-wrap gap-1 whitespace-nowrap sm:gap-x-4",
      className
    )}
    {...props}
  />
);

export type StatusHeatmapNormalDaysProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children?: (props: { normalDays: number }) => ReactNode;
};

export const StatusHeatmapNormalDays = ({
  className,
  children,
  ...props
}: StatusHeatmapNormalDaysProps) => {
  const { normalDays, labels } = useStatusHeatmap();

  if (children) {
    return <>{children({ normalDays })}</>;
  }

  return (
    <div className={cn("text-muted-foreground", className)} {...props}>
      {labels.normalDays?.replace("{{count}}", String(normalDays)) ??
        `${normalDays} days normal`}
    </div>
  );
};

// Backwards compatibility alias
export const StatusHeatmapTotalCount = StatusHeatmapNormalDays;

export type StatusHeatmapLegendProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children?: (props: { value: StatusValue; label: string }) => ReactNode;
};

export const StatusHeatmapLegend = ({
  className,
  children,
  ...props
}: StatusHeatmapLegendProps) => {
  const { labels, blockSize, blockSizeRatio, blockRadius, colors } =
    useStatusHeatmap();

  const statuses: Array<{ value: StatusValue; label: string }> = [
    { value: 0, label: labels.statuses?.noData || "No Data" },
    { value: 1, label: labels.statuses?.error || "Error" },
    { value: 2, label: labels.statuses?.warning || "Warning" },
    { value: 3, label: labels.statuses?.normal || "Normal" },
  ];

  return (
    <div
      className={cn("ml-auto flex items-center gap-2", className)}
      {...props}
    >
      {statuses.map((status) =>
        children ? (
          <Fragment key={`status-${status.value}`}>
            {children({ value: status.value, label: status.label })}
          </Fragment>
        ) : (
          <div
            key={`status-${status.value}`}
            className="flex items-center gap-1"
          >
            <svg height={blockSize / 2} width={blockSize * blockSizeRatio}>
              <title>{status.label}</title>
              <rect
                data-value={status.value}
                height={blockSize / 2}
                rx={blockRadius}
                ry={blockRadius}
                width={blockSize * blockSizeRatio}
                style={{ fill: getStatusFill(status.value, colors) }}
              />
            </svg>
            <span className="text-muted-foreground text-xs font-medium">
              {status.label}
            </span>
          </div>
        )
      )}
    </div>
  );
};
