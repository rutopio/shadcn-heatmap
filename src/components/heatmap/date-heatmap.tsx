"use client";

import { createContext, Fragment, use, useMemo } from "react";

import { formatDateWithWeekday } from "@/lib/time";
import { cn } from "@/lib/utils";

import type { Locale } from "date-fns";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type DateHourlyActivity = {
  date: string; // YYYY-MM-DD, or "sum" for hourly sum row
  hour: number; // 0-23, 24 for daily sum column
  value: number; // Total time in seconds
};

type DateHourlyActivityWithLevel = DateHourlyActivity & {
  level: number; // 0-4 intensity level
};

type DateHeatmapContextType = {
  data: DateHourlyActivityWithLevel[];
  dates: string[]; // Sorted list of unique dates
  blockMargin: number;
  blockRadius: number;
  blockSize: number;
  blockSizeRatio: number;
  blockWidth: number;
  fontSize: number;
  labels: DateHeatmapLabels;
  labelWidth: number;
  labelHeight: number;
  maxLevel: number;
  totalCount: number;
  width: number;
  height: number;
  dateFormat: string;
  locale?: Locale;
  colors?: ColorConfig;
};

export type DateHeatmapLabels = {
  hours?: string[];
  endHour?: string | null; // null = hide the end hour label
  sum?: string;
  legend?: {
    less?: string;
    more?: string;
  };
};

export type ColorConfig = {
  empty?: string;
  scale?: string;
};

const getLevelFill = (
  level: number,
  maxLevel: number,
  highlighted = false,
  colors?: ColorConfig
): string => {
  const emptyColor = colors?.empty ?? "var(--color-secondary)";
  const scaleColor = colors?.scale ?? "var(--color-chart-1)";

  if (level === 0) return emptyColor;
  const opacity = Math.round((level * 100) / maxLevel);
  const finalOpacity = highlighted ? Math.round(opacity * 0.6) : opacity;
  return `color-mix(in oklch, ${scaleColor} ${finalOpacity}%, transparent)`;
};

const calculateLevel = (
  value: number,
  minValue: number,
  maxValue: number,
  maxLevel: number,
  isNormalized: boolean
): number => {
  if (isNormalized) {
    if (maxValue <= minValue) return 1;
    const percentage = (value - minValue) / (maxValue - minValue);
    return Math.max(1, Math.min(maxLevel, Math.ceil(percentage * maxLevel)));
  }
  if (value <= 0 || maxValue <= 0) return 0;
  const percentage = value / maxValue;
  return Math.max(1, Math.min(maxLevel, Math.ceil(percentage * maxLevel)));
};

const DEFAULT_HOUR_LABELS = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0")
);

const TWELVE_HOUR_LABELS = Array.from({ length: 24 }, (_, i) => {
  if (i === 0) return "AM";
  if (i < 12) return String(i);
  if (i === 12) return "PM";
  return String(i - 12);
});

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const EMPTY_STYLE: CSSProperties = {};
const LABEL_MARGIN = 8;
const PADDING = 20;

const DateHeatmapContext = createContext<DateHeatmapContextType | null>(null);

const useDateHeatmap = () => {
  const context = use(DateHeatmapContext);

  if (!context) {
    throw new Error("DateHeatmap components must be used within a DateHeatmap");
  }

  return context;
};

export type DateHeatmapProps = HTMLAttributes<HTMLDivElement> & {
  data: DateHourlyActivity[];
  use12Hour?: boolean;
  dateFormat?: string;
  blockSize?: number;
  blockMargin?: number;
  blockRadius?: number;
  blockSizeRatio?: number;
  maxLevel?: number;
  isNormalized?: boolean;
  colors?: ColorConfig;
  locale?: Locale;
  labels?: DateHeatmapLabels;
  fontSize?: number;
  emptyState?: ReactNode;
  totalCount?: number;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
};

/**
 * Date Heatmap
 *
 * A time-range analysis heatmap showing hourly activity across specific dates.
 * Each row represents a date, columns represent hours (0-23), with optional daily sum column and hourly sum row.
 *
 * @example
 * ```tsx
 * <DateHeatmap data={data} use12Hour dateFormat="MMM dd, yyyy">
 *   <DateHeatmapBody>
 *     {({ activity, dateIndex }) => (
 *       <DateHeatmapBlock
 *         activity={activity}
 *         dateIndex={dateIndex}
 *       />
 *     )}
 *   </DateHeatmapBody>
 *   <DateHeatmapFooter>
 *     <DateHeatmapTotalCount />
 *     <DateHeatmapLegend />
 *   </DateHeatmapFooter>
 * </DateHeatmap>
 * ```
 *
 * @param data - Array of activities with date (YYYY-MM-DD or "sum" for hourly sum row), hour (0-23, 24 for daily sum column), and count
 * @param use12Hour - Use 12-hour format for hour labels. Default: false
 * @param dateFormat - Date format string for date labels. Default: "MMM dd, yyyy"
 * @param blockSizeRatio - Width/height ratio of blocks. Default: 1
 * @param maxLevel - Maximum intensity level (0 to maxLevel). Default: 4
 * @param isNormalized - When true, uses min-max normalization across the dataset (suitable for signed values). When false (default), treats 0 as empty and scales from 0 to max.
 */
export const DateHeatmap = ({
  data,
  use12Hour = false,
  dateFormat = "MMM dd, yyyy",
  blockSize = 24,
  blockMargin = 4,
  blockRadius = 2,
  blockSizeRatio = 1,
  maxLevel: maxLevelProp = 4,
  isNormalized = false,
  colors,
  locale,
  labels: labelsProp,
  fontSize = 14,
  emptyState,
  totalCount: totalCountProp,
  style = EMPTY_STYLE,
  className,
  children,
  ...props
}: DateHeatmapProps) => {
  const maxLevel = Math.max(1, maxLevelProp);

  const dataWithLevels = useMemo((): DateHourlyActivityWithLevel[] => {
    if (data.length === 0) return [];

    const regularCells = data.filter((a) => a.date !== "sum" && a.hour < 24);
    const dailySumColumn = data.filter(
      (a) => a.date !== "sum" && a.hour === 24
    );
    const hourlySumRow = data.filter((a) => a.date === "sum" && a.hour < 24);

    const maxRegular = Math.max(...regularCells.map((d) => d.value), 1);
    const maxDailySum = Math.max(...dailySumColumn.map((d) => d.value), 1);
    const maxHourlySum = Math.max(...hourlySumRow.map((d) => d.value), 1);

    const minRegular = isNormalized
      ? Math.min(...regularCells.map((d) => d.value), Infinity)
      : 0;
    const minDailySum = isNormalized
      ? Math.min(...dailySumColumn.map((d) => d.value), Infinity)
      : 0;
    const minHourlySum = isNormalized
      ? Math.min(...hourlySumRow.map((d) => d.value), Infinity)
      : 0;

    return data.map((activity) => {
      let maxCount: number, minCount: number;
      if (activity.date === "sum") {
        maxCount = maxHourlySum;
        minCount = minHourlySum;
      } else if (activity.hour === 24) {
        maxCount = maxDailySum;
        minCount = minDailySum;
      } else {
        maxCount = maxRegular;
        minCount = minRegular;
      }

      return {
        ...activity,
        level: calculateLevel(
          activity.value,
          minCount,
          maxCount,
          maxLevel,
          isNormalized
        ),
      };
    });
  }, [data, maxLevel, isNormalized]);

  const labels = {
    hours: use12Hour ? TWELVE_HOUR_LABELS : DEFAULT_HOUR_LABELS,
    endHour: use12Hour ? "12" : "00",
    sum: "Total",
    legend: { less: "Less", more: "More" },
    ...labelsProp,
  };
  const labelWidth = fontSize * 7.5 + LABEL_MARGIN;

  const dates = useMemo(() => {
    const uniqueDates = new Set<string>();
    dataWithLevels.forEach((activity) => {
      if (activity.date !== "sum") {
        uniqueDates.add(activity.date);
      }
    });
    return Array.from(uniqueDates).sort();
  }, [dataWithLevels]);

  const totalCount =
    typeof totalCountProp === "number"
      ? totalCountProp
      : dataWithLevels.reduce((sum, activity) => sum + activity.value, 0);

  const blockWidth = blockSize * blockSizeRatio;
  const labelHeight = fontSize + LABEL_MARGIN;
  const width =
    24 * (blockWidth + blockMargin) +
    blockSize / 2 +
    (blockWidth + blockMargin) -
    blockMargin +
    labelWidth;
  const height =
    dates.length * (blockSize + blockMargin) - blockMargin + labelHeight;

  if (data.length === 0 || dates.length === 0) {
    return emptyState ? <>{emptyState}</> : null;
  }

  return (
    <DateHeatmapContext
      value={{
        data: dataWithLevels,
        dates,
        blockMargin,
        blockRadius,
        blockSize,
        blockSizeRatio,
        blockWidth,
        fontSize,
        labels,
        labelWidth,
        labelHeight,
        maxLevel,
        totalCount,
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
    </DateHeatmapContext>
  );
};

export type DateHeatmapBlockProps = HTMLAttributes<SVGRectElement> & {
  activity: DateHourlyActivityWithLevel;
  dateIndex: number;
  className?: string;
};

export const DateHeatmapBlock = ({
  ref,
  activity,
  dateIndex,
  className,
  style: styleProp,
  ...props
}: DateHeatmapBlockProps & {
  ref?: React.RefObject<SVGRectElement | null>;
}) => {
  const {
    blockSize,
    blockWidth,
    blockMargin,
    blockRadius,
    labelWidth,
    labelHeight,
    maxLevel,
    colors,
  } = useDateHeatmap();

  if (activity.level < 0 || activity.level > maxLevel) {
    throw new RangeError(
      `Provided activity level ${activity.level} for date ${activity.date} hour ${activity.hour} is out of range. It must be between 0 and ${maxLevel}.`
    );
  }
  const sumRowGap = activity.date === "sum" ? blockSize + blockMargin : 0;
  const yPosition =
    labelHeight + (blockSize + blockMargin) * dateIndex + sumRowGap;

  const sumColumnGap = activity.hour === 24 ? blockWidth + blockMargin : 0;
  const xPosition =
    activity.hour === 24
      ? labelWidth +
        24 * (blockWidth + blockMargin) +
        blockSize / 2 +
        sumColumnGap
      : labelWidth + (blockWidth + blockMargin) * activity.hour;

  const isHighlighted =
    (props as Record<string, unknown>)["data-highlighted"] === "true";

  return (
    <rect
      ref={ref}
      role="img"
      tabIndex={0}
      aria-label={`${activity.date} ${activity.hour}:00: ${activity.value}`}
      className={cn(
        "motion-safe:transition-opacity motion-safe:hover:opacity-70",
        className
      )}
      data-value={activity.value}
      data-date={activity.date}
      data-hour={activity.hour}
      data-level={activity.level}
      height={blockSize}
      rx={blockRadius}
      ry={blockRadius}
      width={blockWidth}
      x={xPosition}
      y={yPosition}
      style={{
        fill: getLevelFill(activity.level, maxLevel, isHighlighted, colors),
        ...styleProp,
      }}
      {...props}
    />
  );
};
DateHeatmapBlock.displayName = "DateHeatmapBlock";

export type DateHeatmapBodyProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  hideDateLabels?: boolean;
  hideHourLabels?: boolean;
  hideSumColumn?: boolean;
  hideSumRow?: boolean;
  className?: string;
  labelTextClass?: string;
  children: (props: {
    activity: DateHourlyActivityWithLevel;
    dateIndex: number;
  }) => ReactNode;
};

export const DateHeatmapBody = ({
  hideDateLabels = false,
  hideHourLabels = false,
  hideSumColumn = false,
  hideSumRow = false,
  className,
  labelTextClass,
  children,
  ...props
}: DateHeatmapBodyProps) => {
  const {
    data,
    dates,
    width,
    height,
    blockSize,
    blockWidth,
    blockMargin,
    labels,
    labelWidth,
    labelHeight,
    fontSize,
    dateFormat,
    locale,
  } = useDateHeatmap();

  const sumRowGap = hideSumRow ? 0 : blockSize + blockMargin;
  const sumColumnGap = hideSumColumn ? 0 : blockWidth + blockMargin;

  const svgWidth = hideSumColumn
    ? width - (blockWidth + blockMargin) - blockSize / 2
    : width + sumColumnGap;

  const svgHeight = hideSumRow
    ? height
    : height + (blockSize + blockMargin) + sumRowGap;

  const activityMap = useMemo(() => {
    const map = new Map<string, DateHourlyActivityWithLevel>();
    data.forEach((activity) => {
      const key = `${activity.date}-${activity.hour}`;
      map.set(key, activity);
    });
    return map;
  }, [data]);

  const dateIndexMap = useMemo(
    () => new Map(dates.map((date, i) => [date, i])),
    [dates]
  );

  const allActivities = useMemo(() => {
    const activities: DateHourlyActivityWithLevel[] = [];
    const maxHour = hideSumColumn ? 23 : 24;

    dates.forEach((date) => {
      for (let hour = 0; hour <= maxHour; hour++) {
        const key = `${date}-${hour}`;
        const existing = activityMap.get(key);
        activities.push(
          existing || {
            date,
            hour,
            value: 0,
            level: 0,
          }
        );
      }
    });

    if (!hideSumRow) {
      for (let hour = 0; hour < 24; hour++) {
        const key = `sum-${hour}`;
        const existing = activityMap.get(key);
        activities.push(
          existing || {
            date: "sum",
            hour,
            value: 0,
            level: 0,
          }
        );
      }
    }

    return activities;
  }, [dates, activityMap, hideSumColumn, hideSumRow]);

  return (
    <div
      className={cn("max-w-full overflow-x-auto overflow-y-hidden", className)}
      {...props}
    >
      <svg
        role="img"
        aria-label="Activity heatmap by date and hour"
        className="block overflow-visible"
        height={svgHeight + PADDING * 2}
        viewBox={`${-PADDING} ${-PADDING} ${svgWidth + PADDING * 2} ${svgHeight + PADDING * 2}`}
        width={svgWidth + PADDING * 2}
      >
        {!hideDateLabels && (
          <g
            className={cn(
              "fill-current font-mono text-sm font-medium",
              labelTextClass
            )}
          >
            {dates.map((date, dateIndex) => {
              const yPosition =
                labelHeight +
                (blockSize + blockMargin) * dateIndex +
                blockSize / 2;

              return (
                <text
                  key={`date-${date}`}
                  x={labelWidth - 8}
                  y={yPosition}
                  dominantBaseline="middle"
                  textAnchor="end"
                  style={{ fontSize: `${fontSize * 0.75}px` }}
                >
                  {formatDateWithWeekday(date, dateFormat, locale)}
                </text>
              );
            })}
            {!hideSumRow && (
              <text
                key="date-sum"
                x={labelWidth - 8}
                y={
                  labelHeight +
                  (blockSize + blockMargin) * dates.length +
                  sumRowGap +
                  blockSize / 2
                }
                dominantBaseline="middle"
                textAnchor="end"
                style={{ fontSize: `${fontSize * 0.75}px` }}
              >
                {labels.sum}
              </text>
            )}
          </g>
        )}

        {!hideHourLabels && (
          <g className={cn("fill-current font-mono", labelTextClass)}>
            {HOURS.map((hour) => {
              const label = labels.hours?.[hour] ?? "";
              return (
                <text
                  key={`hour-${hour}`}
                  x={labelWidth + (blockWidth + blockMargin) * hour}
                  y={0}
                  textAnchor="middle"
                  dominantBaseline="hanging"
                  style={{ fontSize: `${fontSize * 0.75}px` }}
                >
                  {label}
                </text>
              );
            })}
            {labels.endHour != null && (
              <text
                key="hour-end"
                x={labelWidth + (blockWidth + blockMargin) * 24}
                y={0}
                textAnchor="middle"
                dominantBaseline="hanging"
                style={{ fontSize: `${fontSize * 0.75}px` }}
              >
                {labels.endHour}
              </text>
            )}
            {!hideSumColumn && (
              <text
                key="sum-label"
                x={
                  labelWidth +
                  24 * (blockWidth + blockMargin) +
                  blockSize / 2 +
                  (blockWidth + blockMargin) +
                  blockWidth / 2
                }
                y={0}
                textAnchor="middle"
                dominantBaseline="hanging"
                style={{ fontSize: `${fontSize * 0.75}px` }}
              >
                {labels.sum}
              </text>
            )}
          </g>
        )}

        {allActivities.map((activity) => {
          const dateIndex =
            activity.date === "sum"
              ? dates.length
              : (dateIndexMap.get(activity.date) ?? dates.length);
          const key = `${activity.date}-${activity.hour}`;
          return (
            <Fragment key={key}>{children({ activity, dateIndex })}</Fragment>
          );
        })}
      </svg>
    </div>
  );
};

export type DateHeatmapFooterProps = HTMLAttributes<HTMLDivElement>;

export const DateHeatmapFooter = ({
  className,
  ...props
}: DateHeatmapFooterProps) => (
  <div
    className={cn(
      "flex flex-wrap gap-1 whitespace-nowrap sm:gap-x-4",
      className
    )}
    {...props}
  />
);

export type DateHeatmapTotalCountProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children?: (props: { totalCount: number }) => ReactNode;
};

export const DateHeatmapTotalCount = ({
  className,
  children,
  ...props
}: DateHeatmapTotalCountProps) => {
  const { totalCount } = useDateHeatmap();

  if (children) {
    return <>{children({ totalCount })}</>;
  }

  return (
    <div
      className={cn("text-muted-foreground tabular-nums", className)}
      {...props}
    >
      {`${totalCount} contributions`}
    </div>
  );
};

export type DateHeatmapLegendProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children?: (props: { level: number }) => ReactNode;
};

export const DateHeatmapLegend = ({
  className,
  children,
  ...props
}: DateHeatmapLegendProps) => {
  const { labels, maxLevel, blockSize, blockSizeRatio, blockRadius, colors } =
    useDateHeatmap();

  return (
    <div
      role="group"
      aria-label="Activity intensity legend"
      className={cn("ml-auto flex items-center gap-[3px]", className)}
      {...props}
    >
      <span className="text-muted-foreground mr-1 text-xs font-medium">
        {labels.legend?.less || "Less"}
      </span>
      {Array.from({ length: maxLevel + 1 }, (_, i) => i).map((level) =>
        children ? (
          <Fragment key={`legend-level-${level}`}>
            {children({ level })}
          </Fragment>
        ) : (
          <svg
            role="img"
            aria-label={`Level ${level}`}
            height={blockSize}
            key={`legend-level-${level}`}
            width={blockSize * blockSizeRatio}
          >
            <rect
              data-level={level}
              height={blockSize}
              rx={blockRadius}
              ry={blockRadius}
              width={blockSize * blockSizeRatio}
              style={{ fill: getLevelFill(level, maxLevel, false, colors) }}
            />
          </svg>
        )
      )}
      <span className="text-muted-foreground ml-1 text-xs font-medium">
        {labels.legend?.more || "More"}
      </span>
    </div>
  );
};
