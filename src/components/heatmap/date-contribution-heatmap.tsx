"use client";

import { createContext, forwardRef, Fragment, use, useMemo } from "react";

import { formatDateWithWeekday } from "@/lib/time";
import { cn } from "@/lib/utils";

import type { Locale } from "date-fns";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type DateHourlyActivity = {
  date: string; // YYYY-MM-DD
  hour: number; // 0-23, 24 for daily sum column
  count: number; // Total time in seconds
};

type DateHourlyActivityWithLevel = DateHourlyActivity & {
  level: number; // 0-4 intensity level
};

type DateContributionHeatmapContextType = {
  data: DateHourlyActivityWithLevel[];
  dates: string[]; // Sorted list of unique dates
  blockMargin: number;
  blockRadius: number;
  blockSize: number;
  blockSizeRatio: number;
  blockWidth: number;
  fontSize: number;
  labels: DateContributionHeatmapLabels;
  labelWidth: number;
  maxLevel: number;
  totalCount: number;
  width: number;
  height: number;
  dateFormat: string;
  locale?: Locale;
  colors?: ColorConfig;
};

export type DateContributionHeatmapLabels = {
  hours?: string[];
  endHour?: string | null; // null = hide the end hour label
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
  colors?: ColorConfig,
): string => {
  const emptyColor = colors?.empty ?? "var(--color-secondary)";
  const scaleColor = colors?.scale ?? "var(--color-chart-1)";

  if (level === 0) return emptyColor;
  const opacity = Math.round((level * 100) / maxLevel);
  const finalOpacity = highlighted ? Math.round(opacity * 0.6) : opacity;
  return `color-mix(in oklch, ${scaleColor} ${finalOpacity}%, transparent)`;
};

const calculateLevel = (value: number, maxValue: number, maxLevel: number): number => {
  if (value < 1 || maxValue <= 0) return 0;

  const percentage = value / maxValue;
  return Math.max(1, Math.min(maxLevel, Math.ceil(percentage * maxLevel)));
};

const DEFAULT_HOUR_LABELS = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);

const TWELVE_HOUR_LABELS = Array.from({ length: 24 }, (_, i) => {
  if (i === 0) return "AM";
  if (i < 12) return String(i);
  if (i === 12) return "PM";
  return String(i - 12);
});

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const EMPTY_STYLE: CSSProperties = {};

const DateContributionHeatmapContext =
  createContext<DateContributionHeatmapContextType | null>(null);

const useDateContributionHeatmap = () => {
  const context = use(DateContributionHeatmapContext);

  if (!context) {
    throw new Error(
      "DateContributionHeatmap components must be used within a DateContributionHeatmap",
    );
  }

  return context;
};

export type DateContributionHeatmapProps = HTMLAttributes<HTMLDivElement> & {
  data: DateHourlyActivity[];
  use12Hour?: boolean;
  dateFormat?: string;
  blockSize?: number;
  blockMargin?: number;
  blockRadius?: number;
  blockSizeRatio?: number;
  maxLevel?: number;
  colors?: ColorConfig;
  locale?: Locale;
  labels?: DateContributionHeatmapLabels;
  fontSize?: number;
  emptyState?: ReactNode;
  totalCount?: number;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
};

/**
 * Date Contribution Heatmap
 *
 * A time-range analysis heatmap showing hourly activity across specific dates.
 * Each row represents a date, columns represent hours (0-23), with optional daily sum column.
 *
 * @example
 * ```tsx
 * <DateContributionHeatmap data={data} use12Hour dateFormat="MMM dd, yyyy">
 *   <DateContributionHeatmapCalendar>
 *     {({ activity, dateIndex }) => (
 *       <DateContributionHeatmapBlock
 *         activity={activity}
 *         dateIndex={dateIndex}
 *       />
 *     )}
 *   </DateContributionHeatmapCalendar>
 *   <DateContributionHeatmapFooter>
 *     <DateContributionHeatmapTotalCount />
 *     <DateContributionHeatmapLegend />
 *   </DateContributionHeatmapFooter>
 * </DateContributionHeatmap>
 * ```
 *
 * @param data - Array of activities with date (YYYY-MM-DD), hour (0-23, 24 for daily sum), and count
 * @param use12Hour - Use 12-hour format for hour labels. Default: false
 * @param dateFormat - Date format string for date labels. Default: "MMM dd, yyyy"
 * @param blockSizeRatio - Width/height ratio of blocks. Default: 2
 * @param maxLevel - Maximum intensity level (0 to maxLevel). Default: 4
 */
export const DateContributionHeatmap = ({
  data,
  use12Hour = false,
  dateFormat = "MMM dd, yyyy",
  blockSize = 12,
  blockMargin = 4,
  blockRadius = 2,
  blockSizeRatio = 2,
  maxLevel: maxLevelProp = 4,
  colors,
  locale,
  labels: labelsProp = undefined,
  fontSize = 14,
  emptyState,
  totalCount: totalCountProp = undefined,
  style = EMPTY_STYLE,
  className,
  children,
  ...props
}: DateContributionHeatmapProps) => {
  const maxLevel = Math.max(1, maxLevelProp);

  const dataWithLevels = useMemo((): DateHourlyActivityWithLevel[] => {
    if (data.length === 0) return [];

    const regularCells = data.filter((a) => a.hour < 24);
    const dailySumColumn = data.filter((a) => a.hour === 24);

    const maxRegular = Math.max(...regularCells.map((d) => d.count), 1);
    const maxDailySum = Math.max(...dailySumColumn.map((d) => d.count), 1);

    return data.map((activity) => {
      const maxCount = activity.hour < 24 ? maxRegular : maxDailySum;

      return {
        ...activity,
        level: calculateLevel(activity.count, maxCount, maxLevel),
      };
    });
  }, [data, maxLevel]);

  const LABEL_MARGIN = 8;

  const labels = {
    hours: use12Hour ? TWELVE_HOUR_LABELS : DEFAULT_HOUR_LABELS,
    endHour: use12Hour ? "12" : "00",
    legend: { less: "Less", more: "More" },
    ...labelsProp,
  };
  const labelWidth = fontSize * 7.5 + LABEL_MARGIN;

  const dates = useMemo(() => {
    const uniqueDates = new Set<string>();
    dataWithLevels.forEach((activity) => {
      uniqueDates.add(activity.date);
    });
    return Array.from(uniqueDates).sort();
  }, [dataWithLevels]);

  const totalCount =
    typeof totalCountProp === "number"
      ? totalCountProp
      : dataWithLevels.reduce((sum, activity) => sum + activity.count, 0);

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
    <DateContributionHeatmapContext
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
    </DateContributionHeatmapContext>
  );
};

export type DateContributionHeatmapBlockProps =
  HTMLAttributes<SVGRectElement> & {
    activity: DateHourlyActivityWithLevel;
    dateIndex: number;
    className?: string;
  };

export const DateContributionHeatmapBlock = forwardRef<
  SVGRectElement,
  DateContributionHeatmapBlockProps
>(({ activity, dateIndex, className, style: styleProp, ...props }, ref) => {
  const {
    blockSize,
    blockWidth,
    blockMargin,
    blockRadius,
    labelWidth,
    maxLevel,
    fontSize,
    colors,
  } = useDateContributionHeatmap();

  if (activity.level < 0 || activity.level > maxLevel) {
    throw new RangeError(
      `Provided activity level ${activity.level} for date ${activity.date} hour ${activity.hour} is out of range. It must be between 0 and ${maxLevel}.`,
    );
  }

  const labelHeight = fontSize + 8;
  const yPosition = labelHeight + (blockSize + blockMargin) * dateIndex;

  const xPosition =
    activity.hour === 24
      ? labelWidth + 24 * (blockWidth + blockMargin) + blockSize / 2
      : labelWidth + (blockWidth + blockMargin) * activity.hour;

  const isHighlighted =
    (props as Record<string, unknown>)["data-highlighted"] === "true";

  return (
    <rect
      ref={ref}
      className={cn(className)}
      data-count={activity.count}
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
});
DateContributionHeatmapBlock.displayName = "DateContributionHeatmapBlock";

export type DateContributionHeatmapCalendarProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  hideDateLabels?: boolean;
  hideHourLabels?: boolean;
  hideSumColumn?: boolean;
  className?: string;
  labelTextClass?: string;
  renderTooltip?: (activity: DateHourlyActivityWithLevel, children: ReactNode) => ReactNode;
  children: (props: {
    activity: DateHourlyActivityWithLevel;
    dateIndex: number;
  }) => ReactNode;
};

export const DateContributionHeatmapCalendar = ({
  hideDateLabels = false,
  hideHourLabels = false,
  hideSumColumn = false,
  className,
  labelTextClass,
  renderTooltip,
  children,
  ...props
}: DateContributionHeatmapCalendarProps) => {
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
    fontSize,
    dateFormat,
    locale,
  } = useDateContributionHeatmap();

  const PADDING = 20;

  const svgWidth = hideSumColumn
    ? width - (blockWidth + blockMargin) - blockSize / 2
    : width;

  const activityMap = useMemo(() => {
    const map = new Map<string, DateHourlyActivityWithLevel>();
    data.forEach((activity) => {
      const key = `${activity.date}-${activity.hour}`;
      map.set(key, activity);
    });
    return map;
  }, [data]);

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
            count: 0,
            level: 0,
          },
        );
      }
    });
    return activities;
  }, [dates, activityMap, hideSumColumn]);

  return (
    <div
      className={cn("max-w-full overflow-x-auto overflow-y-hidden", className)}
      {...props}
    >
      <svg
        className="block overflow-visible"
        height={height + PADDING * 2}
        viewBox={`${-PADDING} ${-PADDING} ${svgWidth + PADDING * 2} ${height + PADDING * 2}`}
        width={svgWidth + PADDING * 2}
      >
        {!hideDateLabels && (
          <g className={cn("fill-current font-mono text-sm font-medium", labelTextClass)}>
            {dates.map((date, dateIndex) => {
              const labelHeight = fontSize + 8;
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
                  blockWidth / 2
                }
                y={0}
                textAnchor="middle"
                dominantBaseline="hanging"
                style={{ fontSize: `${fontSize * 0.75}px` }}
              >
                Sum
              </text>
            )}
          </g>
        )}

        {allActivities.map((activity) => {
          const dateIndex = dates.indexOf(activity.date);
          const key = `${activity.date}-${activity.hour}`;
          const block = children({ activity, dateIndex });
          return (
            <Fragment key={key}>
              {renderTooltip ? renderTooltip(activity, block) : block}
            </Fragment>
          );
        })}
      </svg>
    </div>
  );
};

export type DateContributionHeatmapFooterProps = HTMLAttributes<HTMLDivElement>;

export const DateContributionHeatmapFooter = ({
  className,
  ...props
}: DateContributionHeatmapFooterProps) => (
  <div
    className={cn(
      "flex flex-wrap gap-1 whitespace-nowrap sm:gap-x-4",
      className,
    )}
    {...props}
  />
);

export type DateContributionHeatmapTotalCountProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children?: (props: { totalCount: number }) => ReactNode;
};

export const DateContributionHeatmapTotalCount = ({
  className,
  children,
  ...props
}: DateContributionHeatmapTotalCountProps) => {
  const { totalCount } = useDateContributionHeatmap();

  if (children) {
    return <>{children({ totalCount })}</>;
  }

  return (
    <div className={cn("text-muted-foreground", className)} {...props}>
      {`${totalCount} contributions`}
    </div>
  );
};

export type DateContributionHeatmapLegendProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children?: (props: { level: number }) => ReactNode;
};

export const DateContributionHeatmapLegend = ({
  className,
  children,
  ...props
}: DateContributionHeatmapLegendProps) => {
  const { labels, maxLevel, blockSize, blockSizeRatio, blockRadius, colors } =
    useDateContributionHeatmap();

  return (
    <div
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
            height={blockSize}
            key={`legend-level-${level}`}
            width={blockSize * blockSizeRatio}
          >
            <title>{`Level ${level}`}</title>
            <rect
              data-level={level}
              height={blockSize}
              rx={blockRadius}
              ry={blockRadius}
              width={blockSize * blockSizeRatio}
              style={{ fill: getLevelFill(level, maxLevel, false, colors) }}
            />
          </svg>
        ),
      )}
      <span className="text-muted-foreground ml-1 text-xs font-medium">
        {labels.legend?.more || "More"}
      </span>
    </div>
  );
};
