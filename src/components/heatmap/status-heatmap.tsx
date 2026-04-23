"use client";

import { createContext, Fragment, use, useMemo } from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";

import type { Locale } from "date-fns";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

// Status values. 0 is reserved for no-data. Defaults: 1=critical, 2=degraded, 3=healthy.
// Extend by passing `colors` / `labels.statuses` keyed by the numeric value.
export type StatusValue = number;

export type StatusActivity = {
  date: string; // YYYY-MM-DD
  value: StatusValue;
};

type StatusHeatmapContextType = {
  data: StatusActivity[];
  dates: string[];
  blockMargin: number;
  blockRadius: number;
  blockSize: number;
  blockAspectRatio: number;
  blockWidth: number;
  fontSize: number;
  labels: StatusHeatmapLabels;
  statusValues: StatusValue[];
  healthyValue: StatusValue;
  width: number;
  height: number;
  dateFormat: string;
  locale?: Locale;
  colors?: StatusColorConfig;
};

export type StatusHeatmapLabels = {
  statuses?: Record<number, string> & {
    noData?: string;
    critical?: string;
    degraded?: string;
    healthy?: string;
  };
  stat?: string; // Stat text template. Placeholder: {{value}}
  cellLabel?: string; // aria-label template. Placeholders: {{date}}, {{status}}
};

export type StatusColorConfig = Record<number, string> & {
  noData?: string;
  critical?: string;
  degraded?: string;
  healthy?: string;
};

const DEFAULT_COLORS: Record<number, string> = {
  0: "var(--color-secondary)",
  1: "oklch(57.7% 0.245 27.325)", // red-600 (critical)
  2: "oklch(82.8% 0.189 84.429)", // amber-400 (degraded)
  3: "oklch(72.3% 0.219 149.579)", // green-500 (healthy)
};

const SEMANTIC_KEYS: Record<
  number,
  "noData" | "critical" | "degraded" | "healthy"
> = {
  0: "noData",
  1: "critical",
  2: "degraded",
  3: "healthy",
};

const resolveColor = (value: StatusValue, colors?: StatusColorConfig): string => {
  const semanticKey = SEMANTIC_KEYS[value];
  if (colors) {
    const numeric = colors[value];
    if (typeof numeric === "string") return numeric;
    if (semanticKey) {
      const semantic = colors[semanticKey];
      if (typeof semantic === "string") return semantic;
    }
  }
  return DEFAULT_COLORS[value] ?? DEFAULT_COLORS[0];
};

const resolveStatusLabel = (
  value: StatusValue,
  labels?: StatusHeatmapLabels["statuses"]
): string => {
  if (labels) {
    const numeric = labels[value];
    if (typeof numeric === "string") return numeric;
    const semanticKey = SEMANTIC_KEYS[value];
    if (semanticKey) {
      const semantic = labels[semanticKey];
      if (typeof semantic === "string") return semantic;
    }
  }
  switch (value) {
    case 0:
      return "No Data";
    case 1:
      return "Critical";
    case 2:
      return "Degraded";
    case 3:
      return "Healthy";
    default:
      return `Status ${value}`;
  }
};

const getStatusFill = (
  value: StatusValue,
  colors?: StatusColorConfig,
  highlighted = false
): string => {
  const base = resolveColor(value, colors);
  if (!highlighted) return base;
  return `color-mix(in oklch, ${base} 60%, transparent)`;
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
  blockAspectRatio?: number;
  colors?: StatusColorConfig;
  locale?: Locale;
  labels?: StatusHeatmapLabels;
  fontSize?: number;
  emptyState?: ReactNode;
  statusValues?: StatusValue[]; // Legend order. Defaults to [0, 1, 2, 3]
  healthyValue?: StatusValue; // Value counted by the default StatusHeatmapStat compute. Default: 3
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
};

/**
 * Status Heatmap
 *
 * A timeline indicator showing daily status over a period (e.g., 90 days).
 * Similar to Atlassian Statuspage - each day is represented by a vertical bar.
 * Supports 4 status values: 0=no-data, 1=critical, 2=degraded, 3=healthy
 *
 * @example
 * ```tsx
 * <StatusHeatmap data={data} blockAspectRatio={0.2}>
 *   <StatusHeatmapBody>
 *     {({ activity, dayIndex }) => (
 *       <StatusHeatmapBlock
 *         activity={activity}
 *         dayIndex={dayIndex}
 *       />
 *     )}
 *   </StatusHeatmapBody>
 *   <StatusHeatmapFooter>
 *     <StatusHeatmapStat />
 *     <StatusHeatmapLegend />
 *   </StatusHeatmapFooter>
 * </StatusHeatmap>
 * ```
 *
 * @param data - Array of activities with date (YYYY-MM-DD) and status value (0-3)
 * @param dateFormat - Date format string for tooltips. Default: "MMM d"
 * @param blockAspectRatio - Width/height ratio of blocks. Default: 0.2 (narrow vertical bars)
 * @param colors - Custom colors for critical, degraded, and healthy states
 */
export const StatusHeatmap = ({
  data,
  dateFormat = "MMM d",
  blockSize = 40,
  blockMargin = 2,
  blockRadius = 2,
  blockAspectRatio = 0.2,
  colors,
  locale,
  labels: labelsProp,
  fontSize = 14,
  emptyState,
  statusValues = [0, 1, 2, 3],
  healthyValue = 3,
  style = EMPTY_STYLE,
  className,
  children,
  ...props
}: StatusHeatmapProps) => {
  const labels = useMemo<StatusHeatmapLabels>(
    () => ({
      statuses: {
        noData: "No Data",
        critical: "Critical",
        degraded: "Degraded",
        healthy: "Healthy",
      },
      cellLabel: "{{date}}: {{status}}",
      ...labelsProp,
    }),
    [labelsProp]
  );

  const dates = useMemo(() => {
    const uniqueDates = new Set<string>();
    data.forEach((activity) => {
      uniqueDates.add(activity.date);
    });
    return Array.from(uniqueDates).sort();
  }, [data]);

  const blockWidth = blockSize * blockAspectRatio;
  const width = dates.length * (blockWidth + blockMargin) - blockMargin;
  const height = blockSize;

  const contextValue = useMemo<StatusHeatmapContextType>(
    () => ({
      data,
      dates,
      blockMargin,
      blockRadius,
      blockSize,
      blockAspectRatio,
      blockWidth,
      fontSize,
      labels,
      statusValues,
      healthyValue,
      width,
      height,
      dateFormat,
      locale,
      colors,
    }),
    [
      data,
      dates,
      blockMargin,
      blockRadius,
      blockSize,
      blockAspectRatio,
      blockWidth,
      fontSize,
      labels,
      statusValues,
      healthyValue,
      width,
      height,
      dateFormat,
      locale,
      colors,
    ]
  );

  if (data.length === 0 || dates.length === 0) {
    return emptyState ? <>{emptyState}</> : null;
  }

  return (
    <StatusHeatmapContext value={contextValue}>
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
  highlighted?: boolean;
  onCellClick?: (activity: StatusActivity) => void;
  onCellHover?: (activity: StatusActivity | null) => void;
  className?: string;
};

export const StatusHeatmapBlock = ({
  ref,
  activity,
  dayIndex,
  highlighted = false,
  onCellClick,
  onCellHover,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
  style: styleProp,
  ...props
}: StatusHeatmapBlockProps & {
  ref?: React.RefObject<SVGRectElement | null>;
}) => {
  const { blockSize, blockWidth, blockMargin, blockRadius, labels, colors } =
    useStatusHeatmap();

  const statusText = resolveStatusLabel(activity.value, labels.statuses);

  const ariaLabel = (labels.cellLabel ?? "{{date}}: {{status}}")
    .replace("{{date}}", activity.date)
    .replace("{{status}}", statusText);

  const xPosition = (blockWidth + blockMargin) * dayIndex;

  return (
    <rect
      ref={ref}
      role="img"
      tabIndex={0}
      aria-label={ariaLabel}
      className={cn(
        "motion-safe:transition-opacity motion-safe:hover:opacity-70",
        className
      )}
      data-value={activity.value}
      data-date={activity.date}
      data-highlighted={highlighted || undefined}
      height={blockSize}
      rx={blockRadius}
      ry={blockRadius}
      width={blockWidth}
      x={xPosition}
      y={0}
      style={{
        fill: getStatusFill(activity.value, colors, highlighted),
        ...styleProp,
      }}
      onClick={(event) => {
        onCellClick?.(activity);
        onClick?.(event);
      }}
      onMouseEnter={(event) => {
        onCellHover?.(activity);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        onCellHover?.(null);
        onMouseLeave?.(event);
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
  hideDateLabels?: boolean;
  labelInterval?: number; // Show label every N days
  className?: string;
  labelClassName?: string;
  children: (props: {
    activity: StatusActivity;
    dayIndex: number;
  }) => ReactNode;
};

export const StatusHeatmapBody = ({
  hideDateLabels = false,
  labelInterval = 30,
  className,
  labelClassName,
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

  const labelFontSize = fontSize * 0.75;
  const labelHeight = hideDateLabels ? 0 : labelFontSize * 2;

  return (
    <div
      className={cn("max-w-full overflow-x-auto overflow-y-hidden", className)}
      {...props}
    >
      <svg
        role="img"
        aria-label="Status heatmap"
        className="block overflow-visible"
        height={height + labelHeight + PADDING * 2}
        viewBox={`${-PADDING} ${-PADDING} ${width + PADDING * 2} ${height + labelHeight + PADDING * 2}`}
        width={width + PADDING * 2}
      >
        {!hideDateLabels && (
          <g className={cn("fill-current font-mono", labelClassName)}>
            {dates.map((date, dayIndex) => {
              const isFirst = dayIndex === 0;
              const isLast = dayIndex === dates.length - 1;
              if (dayIndex % labelInterval !== 0 && !isLast) return null;

              const blockLeft = (blockWidth + blockMargin) * dayIndex;
              const xPosition = isFirst
                ? blockLeft
                : isLast
                  ? blockLeft + blockWidth
                  : blockLeft + blockWidth / 2;
              const anchor = isFirst ? "start" : isLast ? "end" : "middle";

              return (
                <text
                  key={`date-${date}`}
                  x={xPosition}
                  y={height + labelFontSize}
                  dominantBaseline="hanging"
                  textAnchor={anchor}
                  style={{ fontSize: `${labelFontSize}px` }}
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

export type StatusHeatmapStatProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  compute?: (data: StatusActivity[]) => number | string;
  label?: string; // Template overriding labels.stat. Placeholder: {{value}}
  children?: (result: {
    value: number | string;
    data: StatusActivity[];
  }) => ReactNode;
};

export const StatusHeatmapStat = ({
  compute,
  label,
  className,
  children,
  ...props
}: StatusHeatmapStatProps) => {
  const { data, healthyValue, labels } = useStatusHeatmap();

  const value = compute
    ? compute(data)
    : data.filter((a) => a.value === healthyValue).length;

  if (children) {
    return <>{children({ value, data })}</>;
  }

  const template = label ?? labels.stat ?? "{{value}} days healthy";

  return (
    <div
      className={cn("text-muted-foreground tabular-nums", className)}
      {...props}
    >
      {template.replace("{{value}}", String(value))}
    </div>
  );
};

export type StatusHeatmapLegendProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  labels?: StatusHeatmapLabels["statuses"];
  children?: (props: { value: StatusValue; label: string }) => ReactNode;
};

export const StatusHeatmapLegend = ({
  labels: labelsProp,
  className,
  children,
  ...props
}: StatusHeatmapLegendProps) => {
  const { labels, statusValues, blockSize, blockWidth, blockRadius, colors } =
    useStatusHeatmap();

  const statuses = statusValues.map((value) => ({
    value,
    label: resolveStatusLabel(value, labelsProp ?? labels.statuses),
  }));

  return (
    <div
      role="group"
      aria-label="Status legend"
      className={cn("ml-auto flex items-center gap-1", className)}
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
            <svg aria-hidden="true" height={blockSize / 2} width={blockWidth}>
              <rect
                data-value={status.value}
                height={blockSize / 2}
                rx={blockRadius}
                ry={blockRadius}
                width={blockWidth}
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
