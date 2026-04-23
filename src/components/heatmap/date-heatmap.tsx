"use client";

import { createContext, Fragment, use, useMemo } from "react";

import { formatDateWithWeekday } from "@/lib/time";
import { cn } from "@/lib/utils";

import type { Locale } from "date-fns";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type DateHour =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23;

export type DateHourlyActivity = {
  date: string; // YYYY-MM-DD
  hour: number; // 0–23
  value: number;
};

type DateHourlyActivityWithLevel = DateHourlyActivity & {
  level: number;
};

export type DateExtraRowSpec = {
  label: ReactNode;
  compute: (data: DateHourlyActivity[]) => number[]; // length 24
};

export type DateExtraColumnSpec = {
  label: ReactNode;
  compute: (data: DateHourlyActivity[], dates: string[]) => number[]; // length = dates.length
};

type ResolvedDateExtraRow = {
  label: ReactNode;
  values: { hour: number; value: number; level: number }[];
};

type ResolvedDateExtraColumn = {
  label: ReactNode;
  values: { date: string; value: number; level: number }[];
};

type DateHeatmapContextType = {
  data: DateHourlyActivityWithLevel[];
  dates: string[]; // Sorted list of unique dates
  extraRow: ResolvedDateExtraRow | null;
  extraColumn: ResolvedDateExtraColumn | null;
  blockMargin: number;
  blockRadius: number;
  blockSize: number;
  blockSizeRatio: number;
  blockWidth: number;
  fontSize: number;
  labels: DateHeatmapLabels;
  labelWidth: number;
  labelHeight: number;
  levels: number;
  isNormalized: boolean;
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
  stat?: string; // Stat text template. Placeholder: {{value}}
  cellLabel?: string; // aria-label template. Placeholders: {{date}}, {{hour}}, {{value}}
};

export type ColorConfig = {
  empty?: string;
  scale?: string;
};

// Non-normalized: 1 empty + (levels-1) colored steps. Normalized: levels colored steps, no empty.
const colorStepCount = (levels: number, isNormalized: boolean) =>
  Math.max(1, isNormalized ? levels : levels - 1);

const getLevelFill = (
  level: number,
  levels: number,
  isNormalized: boolean,
  highlighted = false,
  colors?: ColorConfig
): string => {
  const emptyColor = colors?.empty ?? "var(--color-secondary)";
  const scaleColor = colors?.scale ?? "var(--color-chart-1)";

  if (level === 0) return emptyColor;
  const steps = colorStepCount(levels, isNormalized);
  const opacity =
    steps === 1 ? 100 : Math.round(20 + ((level - 1) * 80) / (steps - 1));
  const finalOpacity = highlighted ? Math.round(opacity * 0.6) : opacity;
  return `color-mix(in oklch, ${scaleColor} ${finalOpacity}%, transparent)`;
};

const calculateLevel = (
  value: number,
  minValue: number,
  maxValue: number,
  levels: number,
  isNormalized: boolean
): number => {
  const steps = colorStepCount(levels, isNormalized);
  if (isNormalized) {
    if (maxValue <= minValue) return 1;
    const percentage = (value - minValue) / (maxValue - minValue);
    return Math.max(1, Math.min(steps, Math.ceil(percentage * steps)));
  }
  if (value <= 0 || maxValue <= 0) return 0;
  const percentage = value / maxValue;
  return Math.max(1, Math.min(steps, Math.ceil(percentage * steps)));
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
  levels?: number;
  isNormalized?: boolean;
  colors?: ColorConfig;
  locale?: Locale;
  labels?: DateHeatmapLabels;
  fontSize?: number;
  emptyState?: ReactNode;
  totalCount?: number;
  extraRow?: DateExtraRowSpec;
  extraColumn?: DateExtraColumnSpec;
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
 *     <DateHeatmapStat />
 *     <DateHeatmapLegend />
 *   </DateHeatmapFooter>
 * </DateHeatmap>
 * ```
 *
 * @param data - Array of activities with date (YYYY-MM-DD or "sum" for hourly sum row), hour (0-23, 24 for daily sum column), and count
 * @param use12Hour - Use 12-hour format for hour labels. Default: false
 * @param dateFormat - Date format string for date labels. Default: "MMM dd, yyyy"
 * @param blockSizeRatio - Width/height ratio of blocks. Default: 1
 * @param levels - Total number of legend cells (including empty when not normalized). Default: 5
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
  levels: levelsProp = 5,
  isNormalized = false,
  colors,
  locale,
  labels: labelsProp,
  fontSize = 14,
  emptyState,
  totalCount: totalCountProp,
  extraRow,
  extraColumn,
  style = EMPTY_STYLE,
  className,
  children,
  ...props
}: DateHeatmapProps) => {
  const levels = Math.max(1, levelsProp);

  const dataWithLevels = useMemo((): DateHourlyActivityWithLevel[] => {
    if (data.length === 0) return [];

    const maxRegular = data.reduce((m, d) => Math.max(m, d.value), 1);
    const minRegular = isNormalized
      ? data.reduce((m, d) => Math.min(m, d.value), Infinity)
      : 0;

    return data.map((activity) => ({
      ...activity,
      level: calculateLevel(
        activity.value,
        minRegular,
        maxRegular,
        levels,
        isNormalized
      ),
    }));
  }, [data, levels, isNormalized]);

  const labels = useMemo<DateHeatmapLabels>(
    () => ({
      hours: use12Hour ? TWELVE_HOUR_LABELS : DEFAULT_HOUR_LABELS,
      endHour: use12Hour ? "12" : "00",
      cellLabel: "{{date}} {{hour}}: {{value}}",
      ...labelsProp,
    }),
    [use12Hour, labelsProp]
  );
  const labelWidth = fontSize * 7.5 + LABEL_MARGIN;

  const dates = useMemo(() => {
    const uniqueDates = new Set<string>();
    dataWithLevels.forEach((activity) => uniqueDates.add(activity.date));
    return Array.from(uniqueDates).sort();
  }, [dataWithLevels]);

  const resolvedExtraRow = useMemo<ResolvedDateExtraRow | null>(() => {
    if (!extraRow) return null;
    const values = extraRow.compute(data);
    const maxVal = values.reduce((m, v) => Math.max(m, v), 1);
    const minVal = isNormalized
      ? values.reduce((m, v) => Math.min(m, v), Infinity)
      : 0;
    return {
      label: extraRow.label,
      values: values.map((value, hour) => ({
        hour,
        value,
        level: calculateLevel(value, minVal, maxVal, levels, isNormalized),
      })),
    };
  }, [extraRow, data, levels, isNormalized]);

  const resolvedExtraColumn = useMemo<ResolvedDateExtraColumn | null>(() => {
    if (!extraColumn) return null;
    const values = extraColumn.compute(data, dates);
    const maxVal = values.reduce((m, v) => Math.max(m, v), 1);
    const minVal = isNormalized
      ? values.reduce((m, v) => Math.min(m, v), Infinity)
      : 0;
    return {
      label: extraColumn.label,
      values: values.map((value, i) => ({
        date: dates[i] ?? "",
        value,
        level: calculateLevel(value, minVal, maxVal, levels, isNormalized),
      })),
    };
  }, [extraColumn, data, dates, levels, isNormalized]);

  const totalCount =
    typeof totalCountProp === "number"
      ? totalCountProp
      : dataWithLevels.reduce((sum, activity) => sum + activity.value, 0);

  const hasExtraRow = resolvedExtraRow !== null;
  const hasExtraColumn = resolvedExtraColumn !== null;

  const blockWidth = blockSize * blockSizeRatio;
  const labelHeight = fontSize + LABEL_MARGIN;
  const width =
    24 * (blockWidth + blockMargin) +
    (hasExtraColumn
      ? blockSize / 2 + (blockWidth + blockMargin) + blockWidth
      : 0) -
    blockMargin +
    labelWidth;
  const height =
    dates.length * (blockSize + blockMargin) -
    blockMargin +
    labelHeight +
    (hasExtraRow ? blockSize + blockMargin + (blockSize + blockMargin) : 0);

  const contextValue = useMemo<DateHeatmapContextType>(
    () => ({
      data: dataWithLevels,
      dates,
      extraRow: resolvedExtraRow,
      extraColumn: resolvedExtraColumn,
      blockMargin,
      blockRadius,
      blockSize,
      blockSizeRatio,
      blockWidth,
      fontSize,
      labels,
      labelWidth,
      labelHeight,
      levels,
      isNormalized,
      totalCount,
      width,
      height,
      dateFormat,
      locale,
      colors,
    }),
    [
      dataWithLevels,
      dates,
      resolvedExtraRow,
      resolvedExtraColumn,
      blockMargin,
      blockRadius,
      blockSize,
      blockSizeRatio,
      blockWidth,
      fontSize,
      labels,
      labelWidth,
      labelHeight,
      levels,
      isNormalized,
      totalCount,
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
    <DateHeatmapContext value={contextValue}>
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
  extra?: "row" | "column";
  highlighted?: boolean;
  onCellClick?: (activity: DateHourlyActivityWithLevel) => void;
  onCellHover?: (activity: DateHourlyActivityWithLevel | null) => void;
  className?: string;
};

export const DateHeatmapBlock = ({
  ref,
  activity,
  dateIndex,
  extra,
  highlighted = false,
  onCellClick,
  onCellHover,
  onClick,
  onMouseEnter,
  onMouseLeave,
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
    labels,
    levels,
    isNormalized,
    colors,
  } = useDateHeatmap();

  const level = Math.max(
    0,
    Math.min(colorStepCount(levels, isNormalized), activity.level)
  );

  const isExtraRow = extra === "row";
  const isExtraColumn = extra === "column";

  const extraRowGap = isExtraRow ? blockSize + blockMargin : 0;
  const yPosition =
    labelHeight + (blockSize + blockMargin) * dateIndex + extraRowGap;

  const extraColumnGap = isExtraColumn ? blockWidth + blockMargin : 0;
  const xPosition = isExtraColumn
    ? labelWidth +
      24 * (blockWidth + blockMargin) +
      blockSize / 2 +
      extraColumnGap
    : labelWidth + (blockWidth + blockMargin) * activity.hour;

  const dateToken = isExtraRow ? "extra" : activity.date;
  const hourToken = isExtraColumn
    ? "extra"
    : `${String(activity.hour).padStart(2, "0")}:00`;
  const ariaLabel = (labels.cellLabel ?? "{{date}} {{hour}}: {{value}}")
    .replace("{{date}}", dateToken)
    .replace("{{hour}}", hourToken)
    .replace("{{value}}", String(activity.value));

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
      data-date={isExtraRow ? "extra" : activity.date}
      data-hour={isExtraColumn ? "extra" : activity.hour}
      data-level={level}
      data-highlighted={highlighted || undefined}
      height={blockSize}
      rx={blockRadius}
      ry={blockRadius}
      width={blockWidth}
      x={xPosition}
      y={yPosition}
      style={{
        fill: getLevelFill(level, levels, isNormalized, highlighted, colors),
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
DateHeatmapBlock.displayName = "DateHeatmapBlock";

export type DateHeatmapBodyProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  hideDateLabels?: boolean;
  hideHourLabels?: boolean;
  className?: string;
  labelClassName?: string;
  children: (props: {
    activity: DateHourlyActivityWithLevel;
    dateIndex: number;
  }) => ReactNode;
  renderExtraRow?: (props: {
    activity: DateHourlyActivityWithLevel;
    dateIndex: number;
  }) => ReactNode;
  renderExtraColumn?: (props: {
    activity: DateHourlyActivityWithLevel;
    dateIndex: number;
  }) => ReactNode;
};

export const DateHeatmapBody = ({
  hideDateLabels = false,
  hideHourLabels = false,
  className,
  labelClassName,
  children,
  renderExtraRow,
  renderExtraColumn,
  ...props
}: DateHeatmapBodyProps) => {
  const {
    data,
    dates,
    extraRow,
    extraColumn,
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

  const hasExtraRow = extraRow !== null;
  const hasExtraColumn = extraColumn !== null;

  const extraRowGap = hasExtraRow ? blockSize + blockMargin : 0;

  const svgWidth = width;
  const svgHeight = height;

  const activityMap = useMemo(() => {
    const map = new Map<string, DateHourlyActivityWithLevel>();
    data.forEach((activity) => {
      const key = `${activity.date}-${activity.hour}`;
      map.set(key, activity);
    });
    return map;
  }, [data]);

  const extraColumnMap = useMemo(() => {
    if (!extraColumn) return null;
    const map = new Map<
      string,
      { date: string; value: number; level: number }
    >();
    extraColumn.values.forEach((v) => map.set(v.date, v));
    return map;
  }, [extraColumn]);

  const regularActivities = useMemo(() => {
    const activities: {
      activity: DateHourlyActivityWithLevel;
      dateIndex: number;
    }[] = [];
    dates.forEach((date, dateIndex) => {
      for (let hour = 0; hour < 24; hour++) {
        activities.push({
          activity: activityMap.get(`${date}-${hour}`) ?? {
            date,
            hour,
            value: 0,
            level: 0,
          },
          dateIndex,
        });
      }
    });
    return activities;
  }, [dates, activityMap]);

  const extraColumnActivities = useMemo(() => {
    if (!extraColumnMap) return [];
    return dates
      .map((date, dateIndex) => {
        const entry = extraColumnMap.get(date);
        return entry
          ? {
              activity: {
                date,
                hour: 0,
                value: entry.value,
                level: entry.level,
              },
              dateIndex,
            }
          : null;
      })
      .filter(
        (
          a
        ): a is { activity: DateHourlyActivityWithLevel; dateIndex: number } =>
          a !== null
      );
  }, [dates, extraColumnMap]);

  const extraRowActivities = useMemo(() => {
    if (!extraRow) return [];
    return extraRow.values.map(({ hour, value, level }) => ({
      activity: { date: dates[0] ?? "", hour, value, level },
      dateIndex: dates.length,
    }));
  }, [extraRow, dates]);

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
              labelClassName
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
            {hasExtraRow && (
              <text
                key="date-extra"
                x={labelWidth - 8}
                y={
                  labelHeight +
                  (blockSize + blockMargin) * dates.length +
                  extraRowGap +
                  blockSize / 2
                }
                dominantBaseline="middle"
                textAnchor="end"
                style={{ fontSize: `${fontSize * 0.75}px` }}
              >
                {extraRow?.label}
              </text>
            )}
          </g>
        )}

        {!hideHourLabels && (
          <g className={cn("fill-current font-mono", labelClassName)}>
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
            {hasExtraColumn && (
              <text
                key="extra-col-label"
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
                {extraColumn?.label}
              </text>
            )}
          </g>
        )}

        {regularActivities.map(({ activity, dateIndex }) => (
          <Fragment key={`${activity.date}-${activity.hour}`}>
            {children({ activity, dateIndex })}
          </Fragment>
        ))}
        {extraColumnActivities.map(({ activity, dateIndex }) => (
          <Fragment key={`extra-col-${activity.date}`}>
            {(renderExtraColumn ?? children)({ activity, dateIndex })}
          </Fragment>
        ))}
        {extraRowActivities.map(({ activity, dateIndex }) => (
          <Fragment key={`extra-row-${activity.hour}`}>
            {(renderExtraRow ?? children)({ activity, dateIndex })}
          </Fragment>
        ))}
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

export type DateHeatmapStatProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  compute?: (data: DateHourlyActivityWithLevel[]) => number | string;
  label?: string; // Template overriding labels.stat. Placeholder: {{value}}
  children?: (result: {
    value: number | string;
    data: DateHourlyActivityWithLevel[];
  }) => ReactNode;
};

export const DateHeatmapStat = ({
  compute,
  label,
  className,
  children,
  ...props
}: DateHeatmapStatProps) => {
  const { data, totalCount, labels } = useDateHeatmap();

  const value = compute ? compute(data) : totalCount;

  if (children) {
    return <>{children({ value, data })}</>;
  }

  const template = label ?? labels.stat ?? "{{value}} contributions";

  return (
    <div
      className={cn("text-muted-foreground tabular-nums", className)}
      {...props}
    >
      {template.replace("{{value}}", String(value))}
    </div>
  );
};

export type DateHeatmapLegendProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  labels?: { less?: string; more?: string };
  children?: (props: { level: number }) => ReactNode;
};

export const DateHeatmapLegend = ({
  labels: labelsProp,
  className,
  children,
  ...props
}: DateHeatmapLegendProps) => {
  const { levels, isNormalized, blockSize, blockWidth, blockRadius, colors } =
    useDateHeatmap();

  const lessLabel = labelsProp?.less ?? "Less";
  const moreLabel = labelsProp?.more ?? "More";

  const legendLevels = Array.from({ length: levels }, (_, i) =>
    isNormalized ? i + 1 : i
  );

  return (
    <div
      role="group"
      aria-label="Activity intensity legend"
      className={cn(
        "text-muted-foreground ml-auto flex items-center gap-1",
        className
      )}
      {...props}
    >
      <span className="mr-1 text-xs font-medium">{lessLabel}</span>
      {legendLevels.map((level) =>
        children ? (
          <Fragment key={`legend-level-${level}`}>
            {children({ level })}
          </Fragment>
        ) : (
          <svg
            role="img"
            aria-label={`${level} contributions`}
            height={blockSize}
            key={`legend-level-${level}`}
            width={blockWidth}
          >
            <rect
              data-level={level}
              height={blockSize}
              rx={blockRadius}
              ry={blockRadius}
              width={blockWidth}
              style={{
                fill: getLevelFill(level, levels, isNormalized, false, colors),
              }}
            />
          </svg>
        )
      )}
      <span className="ml-1 text-xs font-medium">{moreLabel}</span>
    </div>
  );
};
