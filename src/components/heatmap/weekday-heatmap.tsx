"use client";

import { createContext, Fragment, use, useMemo } from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";

import type { Locale, Day as WeekDay } from "date-fns";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type HeatmapActivity = {
  weekday: number; // 0-6 = Sun-Sat, 7 = hourly avg row
  hour: number; // 0-23 = hour of day, 24 = daily avg column
  value: number;
};

type HeatmapActivityWithLevel = HeatmapActivity & {
  level: number;
};

type WeekdayHeatmapContextType = {
  data: HeatmapActivityWithLevel[];
  blockMargin: number;
  blockRadius: number;
  blockSize: number;
  blockSizeRatio: number;
  blockWidth: number;
  fontSize: number;
  labels: Required<WeekdayHeatmapLabels>;
  labelWidth: number;
  labelHeight: number;
  maxLevel: number;
  totalCount: number;
  width: number;
  height: number;
  weekStart: WeekDay;
  colors?: ColorConfig;
};

export type WeekdayHeatmapLabels = {
  hours?: string[];
  endHour?: string | null;
  weekdays?: string[];
  avg?: string;
  legend?: {
    less?: string;
    more?: string;
  };
};

export type ColorConfig = {
  empty?: string;
  scale?: string;
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

const DEFAULT_WEEKDAY_LABELS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

const generateWeekdayLabels = (locale: Locale): string[] =>
  Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2000, 0, 2 + i); // Jan 2, 2000 is Sunday
    return format(date, "EEE", { locale });
  });

const EMPTY_STYLE: CSSProperties = {};
const LABEL_MARGIN = 8;
const PADDING = 20;

const WeekdayHeatmapContext = createContext<WeekdayHeatmapContextType | null>(
  null
);

const useWeekdayHeatmap = () => {
  const context = use(WeekdayHeatmapContext);

  if (!context) {
    throw new Error(
      "WeekdayHeatmap components must be used within a WeekdayHeatmap"
    );
  }

  return context;
};

export type WeekdayHeatmapProps = HTMLAttributes<HTMLDivElement> & {
  data: HeatmapActivity[];
  weekStart?: WeekDay;
  use12Hour?: boolean;
  blockSize?: number;
  blockMargin?: number;
  blockRadius?: number;
  blockSizeRatio?: number;
  maxLevel?: number;
  isNormalized?: boolean;
  colors?: ColorConfig;
  locale?: Locale;
  labels?: WeekdayHeatmapLabels;
  fontSize?: number;
  emptyState?: ReactNode;
  totalCount?: number;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
};

/**
 * Weekday Heatmap
 *
 * A GitHub punch card style heatmap showing activity distribution by weekday (rows) and hour (columns).
 * Displays intensity levels with optional avg row and avg column for daily and hourly totals.
 *
 * @example
 * ```tsx
 * <WeekdayHeatmap data={data} weekStart={1} use12Hour>
 *   <WeekdayHeatmapBody>
 *     {({ activity }) => (
 *       <WeekdayHeatmapBlock activity={activity} />
 *     )}
 *   </WeekdayHeatmapBody>
 *   <WeekdayHeatmapFooter>
 *     <WeekdayHeatmapTotalCount />
 *     <WeekdayHeatmapLegend />
 *   </WeekdayHeatmapFooter>
 * </WeekdayHeatmap>
 * ```
 *
 * @param data - Array of activities with weekday (0-6 for Sun-Sat, 7 for avg row), hour (0-23, 24 for avg column), and count
 * @param weekStart - First day of week (0=Sunday, 1=Monday). Default: 0
 * @param use12Hour - Use 12-hour format for hour labels. Default: false
 * @param blockSizeRatio - Width/height ratio of blocks. Default: 1
 * @param maxLevel - Maximum intensity level (0 to maxLevel). Default: 4
 * @param isNormalized - When true, uses min-max normalization across the dataset (suitable for signed values like temperature). When false (default), treats 0 as empty and scales from 0 to max.
 */
export const WeekdayHeatmap = ({
  data,
  weekStart = 0,
  use12Hour = false,
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
}: WeekdayHeatmapProps) => {
  const maxLevel = Math.max(1, maxLevelProp);

  const dataWithLevels = useMemo((): HeatmapActivityWithLevel[] => {
    if (data.length === 0) return [];

    const regularCells = data.filter((a) => a.weekday < 7 && a.hour < 24);
    const avgColumn = data.filter((a) => a.weekday < 7 && a.hour === 24);
    const avgRow = data.filter((a) => a.weekday === 7 && a.hour < 24);

    const regularValues = regularCells.map((d) => d.value);
    const minRegular = Math.min(...regularValues);
    const maxRegular = Math.max(...regularValues);

    const avgColValues = avgColumn.map((d) => d.value);
    const minAvgColumn = Math.min(...avgColValues);
    const maxAvgColumn = Math.max(...avgColValues);

    const avgRowValues = avgRow.map((d) => d.value);
    const minAvgRow = Math.min(...avgRowValues);
    const maxAvgRow = Math.max(...avgRowValues);

    return data.map((activity) => {
      let minCount: number, maxCount: number;
      if (activity.weekday === 7) {
        minCount = minAvgRow;
        maxCount = maxAvgRow;
      } else if (activity.hour === 24) {
        minCount = minAvgColumn;
        maxCount = maxAvgColumn;
      } else {
        minCount = minRegular;
        maxCount = maxRegular;
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

  const weekdayLabels = locale
    ? generateWeekdayLabels(locale)
    : DEFAULT_WEEKDAY_LABELS;

  const labels: Required<WeekdayHeatmapLabels> = {
    hours: use12Hour ? TWELVE_HOUR_LABELS : DEFAULT_HOUR_LABELS,
    endHour: use12Hour ? "12" : "00",
    weekdays: weekdayLabels,
    avg: "Avg",
    legend: { less: "Less", more: "More" },
    ...labelsProp,
  };

  const labelWidth = fontSize * 3.5 + LABEL_MARGIN;

  const totalCount =
    typeof totalCountProp === "number"
      ? totalCountProp
      : dataWithLevels
          .filter((a) => a.weekday < 7 && a.hour < 24)
          .reduce((sum, a) => sum + a.value, 0);

  const blockWidth = blockSize * blockSizeRatio;
  const labelHeight = fontSize + LABEL_MARGIN;
  const width =
    24 * (blockWidth + blockMargin) +
    blockSize / 2 +
    (blockWidth + blockMargin) * 2 -
    blockMargin +
    labelWidth;
  // 7 weekdays + 1 avg row = 8 rows + extra gap before avg row
  const height =
    8 * (blockSize + blockMargin) +
    (blockSize + blockMargin) -
    blockMargin +
    labelHeight;

  if (data.length === 0) {
    return emptyState ? <>{emptyState}</> : null;
  }

  return (
    <WeekdayHeatmapContext
      value={{
        data: dataWithLevels,
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
        weekStart,
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
    </WeekdayHeatmapContext>
  );
};

export type WeekdayHeatmapBlockProps = HTMLAttributes<SVGRectElement> & {
  activity: HeatmapActivityWithLevel;
  className?: string;
};

export const WeekdayHeatmapBlock = ({
  ref,
  activity,
  className,
  style: styleProp,
  ...props
}: WeekdayHeatmapBlockProps & {
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
    weekStart,
    colors,
  } = useWeekdayHeatmap();

  if (activity.level < 0 || activity.level > maxLevel) {
    throw new RangeError(
      `Provided activity level ${activity.level} for weekday ${activity.weekday} hour ${activity.hour} is out of range. It must be between 0 and ${maxLevel}.`
    );
  }

  const rowIndex =
    activity.weekday === 7 ? 7 : (activity.weekday - weekStart + 7) % 7;
  const avgRowGap = activity.weekday === 7 ? blockSize + blockMargin : 0;
  const yPosition =
    labelHeight + (blockSize + blockMargin) * rowIndex + avgRowGap;

  const avgColumnGap = activity.hour === 24 ? blockWidth + blockMargin : 0;
  const xPosition =
    activity.hour === 24
      ? labelWidth +
        24 * (blockWidth + blockMargin) +
        blockSize / 2 +
        avgColumnGap
      : labelWidth + (blockWidth + blockMargin) * activity.hour;

  const isHighlighted =
    (props as Record<string, unknown>)["data-highlighted"] === "true";

  return (
    <rect
      ref={ref}
      className={cn(
        "hover:stroke-foreground transition-[stroke,stroke-width] hover:stroke-1",
        className
      )}
      data-value={activity.value}
      data-weekday={activity.weekday}
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
WeekdayHeatmapBlock.displayName = "WeekdayHeatmapBlock";

export type WeekdayHeatmapBodyProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  hideAvgRow?: boolean;
  hideAvgColumn?: boolean;
  hideHourLabels?: boolean;
  hideWeekdayLabels?: boolean;
  className?: string;
  labelTextClass?: string;
  children: (props: { activity: HeatmapActivityWithLevel }) => ReactNode;
};

export const WeekdayHeatmapBody = ({
  hideAvgRow = false,
  hideAvgColumn = false,
  hideHourLabels = false,
  hideWeekdayLabels = false,
  className,
  labelTextClass,
  children,
  ...props
}: WeekdayHeatmapBodyProps) => {
  const {
    data,
    blockSize,
    blockWidth,
    blockMargin,
    labels,
    labelWidth,
    labelHeight,
    fontSize,
    weekStart,
  } = useWeekdayHeatmap();

  const activityMap = useMemo(() => {
    const map = new Map<string, HeatmapActivityWithLevel>();
    data.forEach((activity) => {
      map.set(`${activity.weekday}-${activity.hour}`, activity);
    });
    return map;
  }, [data]);

  const allActivities = useMemo(() => {
    const activities: HeatmapActivityWithLevel[] = [];
    const maxHour = hideAvgColumn ? 23 : 24;

    for (let di = 0; di < 7; di++) {
      const weekday = (weekStart + di) % 7;
      for (let hour = 0; hour <= maxHour; hour++) {
        const key = `${weekday}-${hour}`;
        activities.push(
          activityMap.get(key) ?? { weekday, hour, value: 0, level: 0 }
        );
      }
    }

    if (!hideAvgRow) {
      for (let hour = 0; hour < 24; hour++) {
        const key = `7-${hour}`;
        activities.push(
          activityMap.get(key) ?? { weekday: 7, hour, value: 0, level: 0 }
        );
      }
    }

    return activities;
  }, [activityMap, hideAvgRow, hideAvgColumn, weekStart]);

  const rowCount = hideAvgRow ? 7 : 8;
  const avgRowGap = hideAvgRow ? 0 : blockSize + blockMargin;
  const svgHeight =
    rowCount * (blockSize + blockMargin) +
    avgRowGap -
    blockMargin +
    labelHeight;
  const avgColumnGap = hideAvgColumn ? 0 : blockWidth + blockMargin;
  const svgWidth = hideAvgColumn
    ? labelWidth + 24 * (blockWidth + blockMargin) - blockMargin
    : labelWidth +
      24 * (blockWidth + blockMargin) +
      blockSize / 2 +
      (blockWidth + blockMargin) +
      avgColumnGap;

  const orderedWeekdayIndices = Array.from(
    { length: 7 },
    (_, i) => (weekStart + i) % 7
  );

  return (
    <div
      className={cn("max-w-full overflow-x-auto overflow-y-hidden", className)}
      {...props}
    >
      <svg
        role="img"
        aria-label="Activity heatmap by weekday and hour"
        className="block overflow-visible"
        height={svgHeight + PADDING * 2}
        viewBox={`${-PADDING} ${-PADDING} ${svgWidth + PADDING * 2} ${svgHeight + PADDING * 2}`}
        width={svgWidth + PADDING * 2}
      >
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
            {!hideAvgColumn && (
              <text
                key="avg-col-label"
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
                {labels.avg}
              </text>
            )}
          </g>
        )}

        {!hideWeekdayLabels && (
          <g className={cn("fill-current font-mono", labelTextClass)}>
            {orderedWeekdayIndices.map((weekday, displayIndex) => {
              const label = labels.weekdays?.[weekday] ?? "";
              const yPosition =
                labelHeight +
                (blockSize + blockMargin) * displayIndex +
                blockSize / 2;
              return (
                <text
                  key={`weekday-${weekday}`}
                  x={labelWidth - 8}
                  y={yPosition}
                  dominantBaseline="middle"
                  textAnchor="end"
                  style={{ fontSize: `${fontSize * 0.75}px` }}
                >
                  {label}
                </text>
              );
            })}
            {!hideAvgRow && (
              <text
                key="weekday-avg"
                x={labelWidth - 8}
                y={
                  labelHeight +
                  (blockSize + blockMargin) * 7 +
                  (blockSize + blockMargin) +
                  blockSize / 2
                }
                dominantBaseline="middle"
                textAnchor="end"
                style={{ fontSize: `${fontSize * 0.75}px` }}
              >
                {labels.avg}
              </text>
            )}
          </g>
        )}

        {allActivities.map((activity) => {
          const key = `${activity.weekday}-${activity.hour}`;
          return <Fragment key={key}>{children({ activity })}</Fragment>;
        })}
      </svg>
    </div>
  );
};

export type WeekdayHeatmapFooterProps = HTMLAttributes<HTMLDivElement>;

export const WeekdayHeatmapFooter = ({
  className,
  ...props
}: WeekdayHeatmapFooterProps) => (
  <div
    className={cn(
      "flex flex-wrap gap-1 whitespace-nowrap sm:gap-x-4",
      className
    )}
    {...props}
  />
);

export type WeekdayHeatmapTotalCountProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children?: (props: { totalCount: number }) => ReactNode;
};

export const WeekdayHeatmapTotalCount = ({
  className,
  children,
  ...props
}: WeekdayHeatmapTotalCountProps) => {
  const { totalCount } = useWeekdayHeatmap();

  if (children) {
    return <>{children({ totalCount })}</>;
  }

  return (
    <div className={cn("text-muted-foreground", className)} {...props}>
      {`${totalCount} contributions`}
    </div>
  );
};

export type WeekdayHeatmapLegendProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children?: (props: { level: number }) => ReactNode;
};

export const WeekdayHeatmapLegend = ({
  className,
  children,
  ...props
}: WeekdayHeatmapLegendProps) => {
  const { labels, maxLevel, blockSize, blockSizeRatio, blockRadius, colors } =
    useWeekdayHeatmap();

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
            role="img"
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
        )
      )}
      <span className="text-muted-foreground ml-1 text-xs font-medium">
        {labels.legend?.more || "More"}
      </span>
    </div>
  );
};
