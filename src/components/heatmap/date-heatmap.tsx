"use client";

import type { Locale } from "date-fns";
import { format, formatISO, isValid, parseISO } from "date-fns";
import type {
  ComponentPropsWithRef,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";
import { createContext, Fragment, use, useMemo } from "react";
import { cn } from "@/lib/utils";

function formatDateLabel(
  date: Date | string,
  dateFormat: string = "EEE, MMM dd, yyyy",
  locale?: Locale,
): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, dateFormat, locale ? { locale } : undefined);
}

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
  hour: number; // 0 to 23
  value: number;
};

export type DateHourlyActivityWithLevel = DateHourlyActivity & {
  level: number;
  extra?: "row" | "column";
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
  blockAspectRatio: number;
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
  heatmapLabel?: string; // aria-label for the heatmap SVG
  legendLabel?: string; // aria-label for the legend fieldset
  legendLevelLabel?: string; // aria-label template for legend swatches. Placeholder: {{level}}
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
  colors?: ColorConfig,
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
  isNormalized: boolean,
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

const normalizeData = (data: DateHourlyActivity[]): DateHourlyActivity[] => {
  const cells = new Map<string, DateHourlyActivity>();
  for (const activity of data) {
    if (!Number.isFinite(activity.value)) {
      throw new RangeError("Heatmap values must be finite numbers.");
    }
    const date = parseISO(activity.date);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(activity.date) ||
      !isValid(date) ||
      formatISO(date, { representation: "date" }) !== activity.date
    ) {
      throw new RangeError("Heatmap dates must be valid YYYY-MM-DD strings.");
    }
    if (
      !Number.isInteger(activity.hour) ||
      activity.hour < 0 ||
      activity.hour > 23
    ) {
      throw new RangeError("Heatmap hours must be integers from 0 to 23.");
    }
    cells.set(`${activity.date}:${activity.hour}`, activity);
  }
  return [...cells.values()].sort(
    (a, b) => a.date.localeCompare(b.date) || a.hour - b.hour,
  );
};

const validateAggregate = (values: number[], expectedLength: number) => {
  if (values.length !== expectedLength || !values.every(Number.isFinite)) {
    throw new RangeError(
      `Aggregate must return exactly ${expectedLength} finite values.`,
    );
  }
};

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
  blockAspectRatio?: number;
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

export const DateHeatmap = ({
  data: inputData,
  use12Hour = false,
  dateFormat = "MMM dd, yyyy",
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
}: DateHeatmapProps) => {
  const data = useMemo(() => normalizeData(inputData), [inputData]);
  const levels = levelsProp;
  if (!Number.isInteger(levels) || levels < (isNormalized ? 1 : 2)) {
    throw new RangeError(
      "levels must be a positive integer, at least 2 when not normalized.",
    );
  }

  const dataWithLevels = useMemo((): DateHourlyActivityWithLevel[] => {
    if (data.length === 0) return [];

    const maxRegular = data.reduce((m, d) => Math.max(m, d.value), -Infinity);
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
        isNormalized,
      ),
    }));
  }, [data, levels, isNormalized]);

  const labels = useMemo<DateHeatmapLabels>(
    () => ({
      hours: use12Hour ? TWELVE_HOUR_LABELS : DEFAULT_HOUR_LABELS,
      endHour: use12Hour ? "12" : "00",
      cellLabel: "{{date}} {{hour}}: {{value}}",
      heatmapLabel: "Activity heatmap by date and hour",
      legendLabel: "Activity intensity legend",
      legendLevelLabel: "Level {{level}}",
      ...labelsProp,
    }),
    [use12Hour, labelsProp],
  );
  const labelWidth = fontSize * 7.5 + LABEL_MARGIN;

  const dates = useMemo(() => {
    const uniqueDates = new Set<string>();
    dataWithLevels.forEach((activity) => {
      uniqueDates.add(activity.date);
    });
    return Array.from(uniqueDates).sort();
  }, [dataWithLevels]);

  const resolvedExtraRow = useMemo<ResolvedDateExtraRow | null>(() => {
    if (!extraRow) return null;
    const values = extraRow.compute(data);
    validateAggregate(values, 24);
    const maxVal = values.reduce((m, v) => Math.max(m, v), -Infinity);
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
    validateAggregate(values, dates.length);
    const maxVal = values.reduce((m, v) => Math.max(m, v), -Infinity);
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

  const blockWidth = blockSize * blockAspectRatio;
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
      dateFormat,
      locale,
      colors,
    ],
  );

  if (data.length === 0 || dates.length === 0) {
    return emptyState ?? null;
  }

  return (
    <DateHeatmapContext value={contextValue}>
      <div
        data-slot="date-heatmap"
        className={cn("flex w-max max-w-full flex-col gap-2 p-4", className)}
        style={{ fontSize, ...style }}
        {...props}
      >
        {children}
      </div>
    </DateHeatmapContext>
  );
};

export type DateHeatmapBlockProps = ComponentPropsWithRef<"rect"> & {
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
  extra = activity.extra,
  highlighted = false,
  onCellClick,
  onCellHover,
  onClick,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  className,
  style: styleProp,
  ...props
}: DateHeatmapBlockProps) => {
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
    extraRow,
    extraColumn,
  } = useDateHeatmap();

  const level = Math.max(
    0,
    Math.min(colorStepCount(levels, isNormalized), activity.level),
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

  const dateToken = isExtraRow
    ? typeof extraRow?.label === "string"
      ? extraRow.label
      : "Aggregate"
    : activity.date;
  const hourToken = isExtraColumn
    ? typeof extraColumn?.label === "string"
      ? extraColumn.label
      : "Aggregate"
    : `${String(activity.hour).padStart(2, "0")}:00`;
  const ariaLabel = (labels.cellLabel ?? "{{date}} {{hour}}: {{value}}")
    .replace("{{date}}", dateToken)
    .replace("{{hour}}", hourToken)
    .replace("{{value}}", String(activity.value));

  return (
    <rect
      ref={ref}
      data-slot="date-heatmap-block"
      role={onCellClick ? "button" : "img"}
      tabIndex={onCellClick ? 0 : -1}
      aria-label={ariaLabel}
      className={cn(
        "focus-visible:stroke-current focus-visible:stroke-2 focus-visible:outline-none motion-safe:transition-opacity motion-safe:hover:opacity-70",
        onCellClick &&
          "focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none",
        className,
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
      onKeyDown={(event) => {
        if (onCellClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onCellClick(activity);
        }
        onKeyDown?.(event);
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
    extraColumn.values.forEach((v) => {
      map.set(v.date, v);
    });
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
                extra: "column" as const,
                date,
                hour: 0,
                value: entry.value,
                level: entry.level,
              },
              dateIndex,
            }
          : null;
      })
      .filter((a): a is NonNullable<typeof a> => a !== null);
  }, [dates, extraColumnMap]);

  const extraRowActivities = useMemo(() => {
    if (!extraRow) return [];
    return extraRow.values.map(({ hour, value, level }) => ({
      activity: {
        extra: "row" as const,
        date: dates[0] ?? "",
        hour,
        value,
        level,
      },
      dateIndex: dates.length,
    }));
  }, [extraRow, dates]);

  return (
    <div
      data-slot="date-heatmap-body"
      className={cn("max-w-full overflow-x-auto overflow-y-hidden", className)}
      {...props}
    >
      <svg
        role="group"
        aria-label={labels.heatmapLabel ?? "Activity heatmap by date and hour"}
        className="focus-visible:ring-ring block overflow-visible rounded-sm focus-visible:ring-2 focus-visible:outline-none"
        height={svgHeight + PADDING * 2}
        viewBox={`${-PADDING} ${-PADDING} ${svgWidth + PADDING * 2} ${svgHeight + PADDING * 2}`}
        width={svgWidth + PADDING * 2}
      >
        {!hideDateLabels && (
          <g
            className={cn(
              "fill-current font-mono text-sm font-medium",
              labelClassName,
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
                  {formatDateLabel(date, dateFormat, locale)}
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
    data-slot="date-heatmap-footer"
    className={cn(
      "flex flex-wrap gap-1 whitespace-nowrap sm:gap-x-4",
      className,
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

  const template = label ?? labels.stat ?? "Contributions: {{value}}";

  return (
    <div
      data-slot="date-heatmap-stat"
      className={cn("text-muted-foreground tabular-nums", className)}
      {...props}
    >
      {template.replace("{{value}}", String(value))}
    </div>
  );
};

export type DateHeatmapLegendProps = Omit<
  HTMLAttributes<HTMLFieldSetElement>,
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
  const {
    levels,
    isNormalized,
    blockSize,
    blockWidth,
    blockRadius,
    colors,
    labels,
  } = useDateHeatmap();

  const lessLabel = labelsProp?.less ?? "Less";
  const moreLabel = labelsProp?.more ?? "More";

  const legendLevels = Array.from({ length: levels }, (_, i) =>
    isNormalized ? i + 1 : i,
  );

  return (
    <fieldset
      data-slot="date-heatmap-legend"
      aria-label={labels.legendLabel ?? "Activity intensity legend"}
      className={cn(
        "text-muted-foreground ml-auto flex items-center gap-1",
        className,
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
            aria-label={(labels.legendLevelLabel ?? "Level {{level}}").replace(
              "{{level}}",
              String(level),
            )}
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
        ),
      )}
      <span className="ml-1 text-xs font-medium">{moreLabel}</span>
    </fieldset>
  );
};
