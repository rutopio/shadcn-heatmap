"use client";

import { createContext, Fragment, use, useMemo } from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";

import type { Locale, Day as WeekDay } from "date-fns";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type WeekdayHour =
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

export type WeekdayHourlyActivity = {
  weekday: number; // 0–6 (Sun–Sat)
  hour: number; // 0–23
  value: number;
};

type WeekdayHourlyActivityWithLevel = WeekdayHourlyActivity & {
  level: number;
};

export type WeekdayExtraRowSpec = {
  label: ReactNode;
  compute: (data: WeekdayHourlyActivity[]) => number[]; // length 24
};

export type WeekdayExtraColumnSpec = {
  label: ReactNode;
  compute: (data: WeekdayHourlyActivity[]) => number[]; // length 7, indexed by weekday 0–6
};

type ResolvedExtraRow = {
  label: ReactNode;
  values: { hour: number; value: number; level: number }[];
};

type ResolvedExtraColumn = {
  label: ReactNode;
  values: { weekday: number; value: number; level: number }[];
};

type WeekdayHeatmapContextType = {
  data: WeekdayHourlyActivityWithLevel[];
  extraRow: ResolvedExtraRow | null;
  extraColumn: ResolvedExtraColumn | null;
  blockMargin: number;
  blockRadius: number;
  blockSize: number;
  blockAspectRatio: number;
  blockWidth: number;
  fontSize: number;
  labels: WeekdayHeatmapLabels;
  labelWidth: number;
  labelHeight: number;
  levels: number;
  isNormalized: boolean;
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
  stat?: string; // Stat text template. Placeholder: {{value}}
  cellLabel?: string; // aria-label template. Placeholders: {{weekday}}, {{hour}}, {{value}}
};

export type ColorConfig = {
  empty?: string;
  scale?: string;
};

// Non-normalized: 1 empty + (levels-1) colored steps. Normalized: levels colored steps, no empty.
const colorStepCount = (levels: number, isNormalized: boolean) =>
  Math.max(1, isNormalized ? levels : levels - 1);

const calculateLevel = (
  value: number,
  minValue: number,
  maxValue: number,
  levels: number,
  isNormalized: boolean
): number => {
  const steps = colorStepCount(levels, isNormalized);
  if (!Number.isFinite(value)) return isNormalized ? 1 : 0;
  if (isNormalized) {
    if (maxValue <= minValue) return 1;
    const percentage = (value - minValue) / (maxValue - minValue);
    return Math.max(1, Math.min(steps, Math.ceil(percentage * steps)));
  }
  if (value <= 0 || maxValue <= 0) return 0;
  const percentage = value / maxValue;
  return Math.max(1, Math.min(steps, Math.ceil(percentage * steps)));
};

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
  data: WeekdayHourlyActivity[];
  weekStart?: WeekDay;
  use12Hour?: boolean;
  blockSize?: number;
  blockMargin?: number;
  blockRadius?: number;
  blockAspectRatio?: number;
  levels?: number;
  isNormalized?: boolean;
  colors?: ColorConfig;
  locale?: Locale;
  labels?: WeekdayHeatmapLabels;
  fontSize?: number;
  emptyState?: ReactNode;
  totalCount?: number;
  extraRow?: WeekdayExtraRowSpec;
  extraColumn?: WeekdayExtraColumnSpec;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
};

/**
 * Weekday Heatmap
 *
 * A GitHub punch card style heatmap showing activity distribution by weekday (rows) and hour (columns).
 * Renders a 7 × 24 grid with optional extra row (aggregated per hour) and extra column (aggregated per weekday).
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
 *     <WeekdayHeatmapStat />
 *     <WeekdayHeatmapLegend />
 *   </WeekdayHeatmapFooter>
 * </WeekdayHeatmap>
 * ```
 *
 * @param data - Array of activities with weekday (0-6 for Sun-Sat), hour (0-23), and numeric value
 * @param weekStart - First day of week (0=Sunday, 1=Monday). Default: 0
 * @param use12Hour - Use 12-hour format for hour labels. Default: false
 * @param blockSize - Block height in pixels. Default: 24
 * @param blockAspectRatio - Block width/height ratio. Default: 1 (square)
 * @param levels - Total number of legend cells (including empty when not normalized). Default: 5
 * @param isNormalized - When true, uses min-max normalization across the dataset (suitable for signed values like temperature). When false (default), treats 0 as empty and scales from 0 to max.
 * @param extraRow - Appends an aggregated row below the grid. `compute` receives all activities and must return 24 values (one per hour). Rendered through `renderExtraRow` on the body, or falls back to `children`.
 * @param extraColumn - Appends an aggregated column to the right of the grid. `compute` receives all activities and must return 7 values indexed by weekday 0–6. Rendered through `renderExtraColumn` on the body, or falls back to `children`.
 */
export const WeekdayHeatmap = ({
  data,
  weekStart = 0,
  use12Hour = false,
  blockSize = 24,
  blockMargin = 4,
  blockRadius = 2,
  blockAspectRatio = 1,
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
}: WeekdayHeatmapProps) => {
  const levels = Math.max(1, levelsProp);

  const dataWithLevels = useMemo((): WeekdayHourlyActivityWithLevel[] => {
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

  const resolvedExtraRow = useMemo<ResolvedExtraRow | null>(() => {
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

  const resolvedExtraColumn = useMemo<ResolvedExtraColumn | null>(() => {
    if (!extraColumn) return null;
    const values = extraColumn.compute(data);
    const maxVal = values.reduce((m, v) => Math.max(m, v), 1);
    const minVal = isNormalized
      ? values.reduce((m, v) => Math.min(m, v), Infinity)
      : 0;
    return {
      label: extraColumn.label,
      values: values.map((value, weekday) => ({
        weekday,
        value,
        level: calculateLevel(value, minVal, maxVal, levels, isNormalized),
      })),
    };
  }, [extraColumn, data, levels, isNormalized]);

  const labels = useMemo<WeekdayHeatmapLabels>(() => {
    const weekdayLabels = locale
      ? generateWeekdayLabels(locale)
      : DEFAULT_WEEKDAY_LABELS;

    return {
      hours: use12Hour ? TWELVE_HOUR_LABELS : DEFAULT_HOUR_LABELS,
      endHour: use12Hour ? "12" : "00",
      weekdays: weekdayLabels,
      cellLabel: "{{weekday}} {{hour}}: {{value}}",
      ...labelsProp,
    };
  }, [locale, use12Hour, labelsProp]);

  const labelWidth = fontSize * 3.5 + LABEL_MARGIN;

  const totalCount =
    typeof totalCountProp === "number"
      ? totalCountProp
      : dataWithLevels.reduce((sum, a) => sum + a.value, 0);

  const blockWidth = blockSize * blockAspectRatio;
  const labelHeight = fontSize + LABEL_MARGIN;
  const hasExtraColumn = resolvedExtraColumn !== null;
  const hasExtraRow = resolvedExtraRow !== null;
  const width =
    24 * (blockWidth + blockMargin) +
    (hasExtraColumn ? blockSize / 2 + (blockWidth + blockMargin) * 2 : 0) -
    blockMargin +
    labelWidth;
  const rowCount = hasExtraRow ? 8 : 7;
  const extraRowGap = hasExtraRow ? blockSize + blockMargin : 0;
  const height =
    rowCount * (blockSize + blockMargin) +
    extraRowGap -
    blockMargin +
    labelHeight;

  const contextValue = useMemo<WeekdayHeatmapContextType>(
    () => ({
      data: dataWithLevels,
      extraRow: resolvedExtraRow,
      extraColumn: resolvedExtraColumn,
      blockMargin,
      blockRadius,
      blockSize,
      blockAspectRatio,
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
      weekStart,
      colors,
    }),
    [
      dataWithLevels,
      resolvedExtraRow,
      resolvedExtraColumn,
      blockMargin,
      blockRadius,
      blockSize,
      blockAspectRatio,
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
      weekStart,
      colors,
    ]
  );

  if (data.length === 0) {
    return emptyState ? <>{emptyState}</> : null;
  }

  return (
    <WeekdayHeatmapContext value={contextValue}>
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
  activity: WeekdayHourlyActivityWithLevel;
  extra?: "row" | "column";
  highlighted?: boolean;
  onCellClick?: (activity: WeekdayHourlyActivityWithLevel) => void;
  onCellHover?: (activity: WeekdayHourlyActivityWithLevel | null) => void;
  className?: string;
};

export const WeekdayHeatmapBlock = ({
  ref,
  activity,
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
    levels,
    isNormalized,
    weekStart,
    labels,
    colors,
  } = useWeekdayHeatmap();

  const level = Math.max(
    0,
    Math.min(colorStepCount(levels, isNormalized), activity.level)
  );

  const isExtraRow = extra === "row";
  const isExtraColumn = extra === "column";

  const rowIndex = isExtraRow ? 7 : (activity.weekday - weekStart + 7) % 7;
  const extraRowGap = isExtraRow ? blockSize + blockMargin : 0;
  const yPosition =
    labelHeight + (blockSize + blockMargin) * rowIndex + extraRowGap;

  const extraColumnGap = isExtraColumn ? blockWidth + blockMargin : 0;
  const xPosition = isExtraColumn
    ? labelWidth +
      24 * (blockWidth + blockMargin) +
      blockSize / 2 +
      extraColumnGap
    : labelWidth + (blockWidth + blockMargin) * activity.hour;

  const weekdayToken = isExtraRow
    ? "extra"
    : (labels.weekdays?.[activity.weekday] ?? String(activity.weekday));
  const hourToken = isExtraColumn
    ? "extra"
    : `${String(activity.hour).padStart(2, "0")}:00`;
  const ariaLabel = (labels.cellLabel ?? "{{weekday}} {{hour}}: {{value}}")
    .replace("{{weekday}}", weekdayToken)
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
      data-weekday={isExtraRow ? "extra" : activity.weekday}
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
WeekdayHeatmapBlock.displayName = "WeekdayHeatmapBlock";

export type WeekdayHeatmapBodyProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  hideHourLabels?: boolean;
  hideWeekdayLabels?: boolean;
  className?: string;
  labelClassName?: string;
  children: (props: {
    activity: WeekdayHourlyActivityWithLevel;
    weekdayIndex: number;
  }) => ReactNode;
  renderExtraRow?: (props: {
    activity: WeekdayHourlyActivityWithLevel;
    weekdayIndex: number;
  }) => ReactNode;
  renderExtraColumn?: (props: {
    activity: WeekdayHourlyActivityWithLevel;
    weekdayIndex: number;
  }) => ReactNode;
};

export const WeekdayHeatmapBody = ({
  hideHourLabels = false,
  hideWeekdayLabels = false,
  className,
  labelClassName,
  children,
  renderExtraRow,
  renderExtraColumn,
  ...props
}: WeekdayHeatmapBodyProps) => {
  const {
    data,
    extraRow,
    extraColumn,
    blockSize,
    blockWidth,
    blockMargin,
    labels,
    labelWidth,
    labelHeight,
    fontSize,
    weekStart,
  } = useWeekdayHeatmap();

  const hasExtraRow = extraRow !== null;
  const hasExtraColumn = extraColumn !== null;

  const activityMap = useMemo(() => {
    const map = new Map<string, WeekdayHourlyActivityWithLevel>();
    data.forEach((activity) => {
      map.set(`${activity.weekday}-${activity.hour}`, activity);
    });
    return map;
  }, [data]);

  const extraColumnMap = useMemo(() => {
    if (!extraColumn) return null;
    const map = new Map<
      number,
      { weekday: number; value: number; level: number }
    >();
    extraColumn.values.forEach((v) => map.set(v.weekday, v));
    return map;
  }, [extraColumn]);

  const regularActivities = useMemo(() => {
    const activities: {
      activity: WeekdayHourlyActivityWithLevel;
      weekdayIndex: number;
    }[] = [];
    for (let di = 0; di < 7; di++) {
      const weekday = (weekStart + di) % 7;
      for (let hour = 0; hour < 24; hour++) {
        activities.push({
          activity: activityMap.get(`${weekday}-${hour}`) ?? {
            weekday,
            hour,
            value: 0,
            level: 0,
          },
          weekdayIndex: di,
        });
      }
    }
    return activities;
  }, [activityMap, weekStart]);

  const extraColumnActivities = useMemo(() => {
    if (!extraColumnMap) return [];
    return Array.from({ length: 7 }, (_, di) => {
      const weekday = (weekStart + di) % 7;
      const entry = extraColumnMap.get(weekday);
      return entry
        ? {
            activity: {
              weekday,
              hour: 0,
              value: entry.value,
              level: entry.level,
            },
            weekdayIndex: di,
          }
        : null;
    }).filter(
      (
        a
      ): a is {
        activity: WeekdayHourlyActivityWithLevel;
        weekdayIndex: number;
      } => a !== null
    );
  }, [extraColumnMap, weekStart]);

  const extraRowActivities = useMemo(() => {
    if (!extraRow) return [];
    return extraRow.values.map(({ hour, value, level }) => ({
      activity: { weekday: 0, hour, value, level },
      weekdayIndex: 7,
    }));
  }, [extraRow]);

  const rowCount = hasExtraRow ? 8 : 7;
  const extraRowGap = hasExtraRow ? blockSize + blockMargin : 0;
  const svgHeight =
    rowCount * (blockSize + blockMargin) +
    extraRowGap -
    blockMargin +
    labelHeight;
  const extraColumnGap = hasExtraColumn ? blockWidth + blockMargin : 0;
  const svgWidth = hasExtraColumn
    ? labelWidth +
      24 * (blockWidth + blockMargin) +
      blockSize / 2 +
      (blockWidth + blockMargin) +
      extraColumnGap
    : labelWidth + 24 * (blockWidth + blockMargin) - blockMargin;

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

        {!hideWeekdayLabels && (
          <g className={cn("fill-current font-mono", labelClassName)}>
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
            {hasExtraRow && (
              <text
                key="weekday-extra"
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
                {extraRow?.label}
              </text>
            )}
          </g>
        )}

        {regularActivities.map(({ activity, weekdayIndex }) => (
          <Fragment key={`${activity.weekday}-${activity.hour}`}>
            {children({ activity, weekdayIndex })}
          </Fragment>
        ))}
        {extraColumnActivities.map(({ activity, weekdayIndex }) => (
          <Fragment key={`extra-column-${activity.weekday}`}>
            {(renderExtraColumn ?? children)({ activity, weekdayIndex })}
          </Fragment>
        ))}
        {extraRowActivities.map(({ activity, weekdayIndex }) => (
          <Fragment key={`extra-row-${activity.hour}`}>
            {(renderExtraRow ?? children)({ activity, weekdayIndex })}
          </Fragment>
        ))}
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

export type WeekdayHeatmapStatProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  compute?: (data: WeekdayHourlyActivityWithLevel[]) => number | string;
  label?: string; // Template overriding labels.stat. Placeholder: {{value}}
  children?: (result: {
    value: number | string;
    data: WeekdayHourlyActivityWithLevel[];
  }) => ReactNode;
};

export const WeekdayHeatmapStat = ({
  compute,
  label,
  className,
  children,
  ...props
}: WeekdayHeatmapStatProps) => {
  const { data, totalCount, labels } = useWeekdayHeatmap();

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

export type WeekdayHeatmapLegendProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  labels?: { less?: string; more?: string };
  children?: (props: { level: number }) => ReactNode;
};

export const WeekdayHeatmapLegend = ({
  labels: labelsProp,
  className,
  children,
  ...props
}: WeekdayHeatmapLegendProps) => {
  const { levels, isNormalized, blockSize, blockWidth, blockRadius, colors } =
    useWeekdayHeatmap();

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
