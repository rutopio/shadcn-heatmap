"use client";

import type { Locale, Day as WeekDay } from "date-fns";
import {
  eachDayOfInterval,
  format,
  formatISO,
  getDay,
  getMonth,
  getYear,
  isValid,
  parseISO,
} from "date-fns";
import type {
  ComponentPropsWithRef,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";
import { createContext, Fragment, use, useMemo } from "react";
import { cn } from "@/lib/utils";

export type Activity = {
  date: string;
  value: number;
};

type ActivityWithLevel = Activity & {
  level: number;
};

export type CalendarActivity = Activity;
export type CalendarActivityWithLevel = ActivityWithLevel;

type Week = Array<ActivityWithLevel | undefined>;

type YearRow = {
  year: number;
  weeks: Week[];
};

export type Labels = {
  months?: string[];
  weekdays?: string[];
  stat?: string; // Stat text template. Placeholders: {{value}}, {{year}}
  cellLabel?: string; // aria-label template. Placeholders: {{date}}, {{value}}
  heatmapLabel?: string; // aria-label for the heatmap SVG. Placeholder: {{year}}
  legendLabel?: string; // aria-label for the legend fieldset
  legendLevelLabel?: string; // aria-label template for legend swatches. Placeholder: {{level}}
};

export type CalendarHeatmapLabels = Labels;

export type ColorConfig = {
  empty?: string;
  scale?: string;
};

type MonthLabel = {
  weekIndex: number;
  label: string;
  year?: number;
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
    const range = maxValue - minValue;
    // Halving keeps opposite-signed finite extremes from overflowing.
    const percentage = Number.isFinite(range)
      ? (value - minValue) / range
      : (value / 2 - minValue / 2) / (maxValue / 2 - minValue / 2);
    return Math.max(1, Math.min(steps, Math.ceil(percentage * steps)));
  }
  if (value <= 0 || maxValue <= 0) return 0;
  const percentage = value / maxValue;
  return Math.max(1, Math.min(steps, Math.ceil(percentage * steps)));
};

const generateMonthLabels = (locale?: Locale): string[] => {
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2000, i, 1);
    if (locale) return format(date, "LLL", { locale });
    return date.toLocaleString("en-US", { month: "short" });
  });
};

const generateWeekdayLabels = (locale?: Locale): string[] => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2000, 0, 2 + i);
    if (locale) return format(date, "EEE", { locale });
    return date.toLocaleString("en-US", { weekday: "short" });
  });
};

type CalendarHeatmapContextType = {
  data: ActivityWithLevel[];
  weeks: Week[];
  yearRows: YearRow[];
  blockMargin: number;
  blockRadius: number;
  blockSize: number;
  blockAspectRatio: number;
  blockWidth: number;
  fontSize: number;
  labels: Labels;
  labelHeight: number;
  levels: number;
  isNormalized: boolean;
  totalCount: number;
  weekStart: WeekDay;
  year: number;
  width: number;
  height: number;
  hasEmptyColumn: boolean;
  continuousMonths: boolean;
  locale?: Locale;
  colors?: ColorConfig;
};

const normalizeData = (data: Activity[]): Activity[] => {
  const cells = new Map<string, Activity>();
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
    cells.set(activity.date, activity);
  }
  return [...cells.values()].sort((a, b) => a.date.localeCompare(b.date));
};

const EMPTY_STYLE: CSSProperties = {};
const LABEL_MARGIN = 8;

const CalendarHeatmapContext = createContext<CalendarHeatmapContextType | null>(
  null,
);

const useCalendarHeatmap = () => {
  const context = use(CalendarHeatmapContext);

  if (!context) {
    throw new Error(
      "CalendarHeatmap components must be used within a CalendarHeatmap",
    );
  }

  return context;
};

const fillHoles = (activities: ActivityWithLevel[]): ActivityWithLevel[] => {
  if (activities.length === 0) {
    return [];
  }

  const sortedActivities = [...activities].sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  const calendar = new Map<string, ActivityWithLevel>(
    activities.map((a) => [a.date, a]),
  );

  const firstActivity = sortedActivities[0] as ActivityWithLevel;
  const lastActivity = sortedActivities.at(-1);

  if (!lastActivity) {
    return [];
  }

  return eachDayOfInterval({
    start: parseISO(firstActivity.date),
    end: parseISO(lastActivity.date),
  }).map((day) => {
    const date = formatISO(day, { representation: "date" });

    if (calendar.has(date)) {
      return calendar.get(date) as ActivityWithLevel;
    }

    return {
      date,
      value: 0,
      level: 0,
    };
  });
};

const toWeeks = (
  activities: ActivityWithLevel[],
  weekStart: WeekDay,
): Week[] => {
  const first = activities[0];
  if (!first) return [];
  const leadingDays = (getDay(parseISO(first.date)) - weekStart + 7) % 7;
  const padded: Week = [
    ...Array<undefined>(leadingDays).fill(undefined),
    ...activities,
  ];
  return Array.from({ length: Math.ceil(padded.length / 7) }, (_, index) =>
    padded.slice(index * 7, index * 7 + 7),
  );
};

const groupYears = (
  activities: ActivityWithLevel[],
): Map<number, ActivityWithLevel[]> => {
  const years = new Map<number, ActivityWithLevel[]>();
  for (const activity of fillHoles(activities)) {
    const year = getYear(parseISO(activity.date));
    const entries = years.get(year) ?? [];
    entries.push(activity);
    years.set(year, entries);
  }
  return years;
};

const groupByYearAndMonth = (
  activities: ActivityWithLevel[],
  weekStart: WeekDay,
  hasEmptyColumn: boolean,
): YearRow[] =>
  [...groupYears(activities)].map(([year, entries]) => {
    const months = new Map<number, ActivityWithLevel[]>();
    for (const activity of entries) {
      const month = getMonth(parseISO(activity.date));
      const days = months.get(month) ?? [];
      days.push(activity);
      months.set(month, days);
    }
    const weeks: Week[] = [];
    for (const days of months.values()) {
      if (hasEmptyColumn && weeks.length)
        weeks.push(Array<undefined>(7).fill(undefined));
      weeks.push(...toWeeks(days, weekStart));
    }
    return { year, weeks };
  });

const groupContinuous = (
  activities: ActivityWithLevel[],
  weekStart: WeekDay,
): YearRow[] =>
  [...groupYears(activities)].map(([year, entries]) => ({
    year,
    weeks: toWeeks(entries, weekStart),
  }));

const getMonthLabels = (
  weeks: Week[],
  monthNames: string[] = generateMonthLabels(),
): MonthLabel[] => {
  return weeks
    .reduce<MonthLabel[]>((labels, week, weekIndex) => {
      const firstActivity = week.find((activity) => activity !== undefined);

      if (!firstActivity) {
        return labels;
      }

      const month = monthNames[getMonth(parseISO(firstActivity.date))];

      if (!month) {
        const monthName = parseISO(firstActivity.date).toLocaleString("en-US", {
          month: "short",
        });
        throw new Error(
          `Unexpected error: undefined month label for ${monthName}.`,
        );
      }

      const prevLabel = labels.at(-1);

      if (weekIndex === 0 || !prevLabel || prevLabel.label !== month) {
        return labels.concat({ weekIndex, label: month });
      }

      return labels;
    }, [])
    .filter(({ weekIndex }, index, labels) => {
      const minWeeks = 3;

      if (index === 0) {
        return (labels[1]?.weekIndex ?? weeks.length) - weekIndex >= minWeeks;
      }

      if (index === labels.length - 1) {
        return weeks.slice(weekIndex).length >= minWeeks;
      }

      return true;
    });
};

export type CalendarHeatmapProps = HTMLAttributes<HTMLDivElement> & {
  data: Activity[];
  weekStart?: WeekDay;
  continuousMonths?: boolean;
  hasEmptyColumn?: boolean;
  blockSize?: number;
  blockMargin?: number;
  blockRadius?: number;
  blockAspectRatio?: number;
  levels?: number;
  isNormalized?: boolean;
  colors?: ColorConfig;
  locale?: Locale;
  labels?: Labels;
  fontSize?: number;
  emptyState?: ReactNode;
  totalCount?: number;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
};

export const CalendarHeatmap = ({
  data: inputData,
  weekStart = 0,
  continuousMonths = true,
  hasEmptyColumn = false,
  blockSize = 12,
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
  style = EMPTY_STYLE,
  className,
  children,
  ...props
}: CalendarHeatmapProps) => {
  const data = useMemo(() => normalizeData(inputData), [inputData]);
  for (const [name, value] of Object.entries({
    blockSize,
    blockAspectRatio,
    fontSize,
  })) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new RangeError(`${name} must be a finite number greater than 0.`);
    }
  }
  for (const [name, value] of Object.entries({ blockMargin, blockRadius })) {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError(
        `${name} must be a finite number greater than or equal to 0.`,
      );
    }
  }

  if (!Number.isInteger(weekStart) || weekStart < 0 || weekStart > 6) {
    throw new RangeError("weekStart must be an integer from 0 to 6.");
  }
  const levels = levelsProp;
  if (!Number.isInteger(levels) || levels < (isNormalized ? 1 : 2)) {
    throw new RangeError(
      "levels must be a positive integer, at least 2 when not normalized.",
    );
  }

  const dataWithLevels = useMemo((): ActivityWithLevel[] => {
    if (data.length === 0) return [];

    const maxCount = data.reduce((max, d) => Math.max(max, d.value), -Infinity);
    const minCount = isNormalized
      ? data.reduce((min, d) => Math.min(min, d.value), Infinity)
      : 0;

    return data.map((activity) => ({
      ...activity,
      level: calculateLevel(
        activity.value,
        minCount,
        maxCount,
        levels,
        isNormalized,
      ),
    }));
  }, [data, levels, isNormalized]);

  const yearRows = useMemo(
    () =>
      continuousMonths
        ? groupContinuous(dataWithLevels, weekStart)
        : groupByYearAndMonth(dataWithLevels, weekStart, hasEmptyColumn),
    [dataWithLevels, weekStart, hasEmptyColumn, continuousMonths],
  );
  const weeks = useMemo(() => yearRows.flatMap((r) => r.weeks), [yearRows]);

  const labels = useMemo(
    () => ({
      months: generateMonthLabels(locale),
      weekdays: generateWeekdayLabels(locale),
      cellLabel: "{{date}}: contributions {{value}}",
      heatmapLabel: "Contribution heatmap for {{year}}",
      legendLabel: "Activity intensity legend",
      legendLevelLabel: "Level {{level}}",
      ...labelsProp,
    }),
    [locale, labelsProp],
  );
  const labelHeight = fontSize + LABEL_MARGIN;

  const year =
    data.length > 0
      ? getYear(parseISO(data[0].date))
      : new Date().getFullYear();

  const totalCount =
    totalCountProp !== undefined
      ? totalCountProp
      : dataWithLevels.reduce((sum, activity) => sum + activity.value, 0);
  if (!Number.isFinite(totalCount)) {
    throw new RangeError(
      "totalCount and the sum of heatmap values must be finite numbers.",
    );
  }

  const blockWidth = blockSize * blockAspectRatio;
  const width = weeks.length * (blockWidth + blockMargin) - blockMargin;
  const height = labelHeight + (blockSize + blockMargin) * 7 - blockMargin;

  if (![blockWidth, width, height].every(Number.isFinite)) {
    throw new RangeError("Heatmap layout dimensions must remain finite.");
  }

  const contextValue = useMemo<CalendarHeatmapContextType>(
    () => ({
      data: dataWithLevels,
      weeks,
      yearRows,
      blockMargin,
      blockRadius,
      blockSize,
      blockAspectRatio,
      blockWidth,
      fontSize,
      labels,
      labelHeight,
      levels,
      isNormalized,
      totalCount,
      weekStart,
      year,
      width,
      height,
      hasEmptyColumn,
      continuousMonths,
      locale,
      colors,
    }),
    [
      dataWithLevels,
      weeks,
      yearRows,
      blockMargin,
      blockRadius,
      blockSize,
      blockAspectRatio,
      blockWidth,
      fontSize,
      labels,
      labelHeight,
      levels,
      isNormalized,
      totalCount,
      weekStart,
      year,
      width,
      height,
      hasEmptyColumn,
      continuousMonths,
      locale,
      colors,
    ],
  );

  if (data.length === 0) {
    return emptyState ?? null;
  }

  return (
    <CalendarHeatmapContext value={contextValue}>
      <div
        data-slot="calendar-heatmap"
        className={cn("flex w-max max-w-full flex-col gap-2 p-4", className)}
        style={{ fontSize, ...style }}
        {...props}
      >
        {children}
      </div>
    </CalendarHeatmapContext>
  );
};

export type CalendarHeatmapBlockProps = ComponentPropsWithRef<"rect"> & {
  activity: ActivityWithLevel;
  dayIndex: number;
  weekIndex: number;
  highlighted?: boolean;
  onCellClick?: (activity: ActivityWithLevel) => void;
  onCellHover?: (activity: ActivityWithLevel | null) => void;
};

export const CalendarHeatmapBlock = ({
  ref,
  activity,
  dayIndex,
  weekIndex,
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
}: CalendarHeatmapBlockProps) => {
  const {
    blockSize,
    blockWidth,
    blockMargin,
    blockRadius,
    labelHeight,
    labels,
    levels,
    isNormalized,
    colors,
  } = useCalendarHeatmap();

  const level = Math.max(
    0,
    Math.min(colorStepCount(levels, isNormalized), activity.level),
  );

  const ariaLabel = (labels.cellLabel ?? "{{date}}: contributions {{value}}")
    .replaceAll("{{date}}", () => activity.date)
    .replaceAll("{{value}}", String(activity.value));

  return (
    <rect
      ref={ref}
      data-slot="calendar-heatmap-block"
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
      data-date={activity.date}
      data-level={level}
      data-highlighted={highlighted || undefined}
      height={blockSize}
      rx={blockRadius}
      ry={blockRadius}
      width={blockWidth}
      x={(blockWidth + blockMargin) * weekIndex}
      y={labelHeight + (blockSize + blockMargin) * dayIndex}
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
CalendarHeatmapBlock.displayName = "CalendarHeatmapBlock";

export type CalendarHeatmapBodyProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  hideMonthLabels?: boolean;
  hideWeekdayLabels?: boolean;
  hideYearLabels?: boolean;
  className?: string;
  labelClassName?: string;
  yearClassName?: string;
  children: (props: {
    activity: ActivityWithLevel;
    dayIndex: number;
    weekIndex: number;
  }) => ReactNode;
  renderYearFooter?: (props: { year: number; totalCount: number }) => ReactNode;
};

export const CalendarHeatmapBody = ({
  hideMonthLabels = false,
  hideWeekdayLabels = false,
  hideYearLabels = false,
  className,
  labelClassName,
  yearClassName,
  children,
  renderYearFooter,
  ...props
}: CalendarHeatmapBodyProps) => {
  const {
    yearRows,
    blockSize,
    blockWidth,
    blockMargin,
    labels,
    labelHeight,
    fontSize,
    weekStart,
    data,
  } = useCalendarHeatmap();

  const weekdayLabelWidth = hideWeekdayLabels ? 0 : 40;
  const strokePadding = 3;

  const rowData = useMemo(() => {
    return yearRows.map((yearRow) => {
      const width =
        yearRow.weeks.length * (blockWidth + blockMargin) - blockMargin;
      const height = labelHeight + (blockSize + blockMargin) * 7 - blockMargin;
      const monthLabels = getMonthLabels(yearRow.weeks, labels.months);
      const yearTotalCount = data
        .filter((activity) => getYear(parseISO(activity.date)) === yearRow.year)
        .reduce((sum, activity) => sum + activity.value, 0);
      if (!Number.isFinite(yearTotalCount)) {
        throw new RangeError(
          "The sum of heatmap values for each year must be finite.",
        );
      }

      return {
        yearRow,
        width,
        height,
        monthLabels,
        yearTotalCount,
      };
    });
  }, [
    yearRows,
    blockSize,
    blockWidth,
    blockMargin,
    labelHeight,
    labels.months,
    data,
  ]);

  const maxWidth = Math.max(...rowData.map((r) => r.width));
  const totalWidth = weekdayLabelWidth + maxWidth + strokePadding * 2;

  return (
    <div
      data-slot="calendar-heatmap-body"
      className={cn(
        "flex max-w-full flex-col gap-6 overflow-x-auto overflow-y-hidden py-4",
        className,
      )}
      {...props}
    >
      {rowData.map(({ yearRow, height, monthLabels, yearTotalCount }) => (
        <div key={`year-row-${yearRow.year}`}>
          {!hideYearLabels && (
            <div className={cn("text-muted-foreground mb-2", yearClassName)}>
              {yearRow.year}
            </div>
          )}
          <svg
            role="group"
            aria-label={(
              labels.heatmapLabel ?? "Contribution heatmap for {{year}}"
            ).replaceAll("{{year}}", String(yearRow.year))}
            className="focus-visible:ring-ring block overflow-visible rounded-sm focus-visible:ring-2 focus-visible:outline-none"
            height={height + strokePadding * 2}
            viewBox={`0 0 ${totalWidth} ${height + strokePadding * 2}`}
            width={totalWidth}
          >
            <g transform={`translate(0, ${strokePadding})`}>
              {!hideMonthLabels && (
                <g className={cn("fill-current font-mono", labelClassName)}>
                  {monthLabels.map(({ label, weekIndex }) => (
                    <text
                      dominantBaseline="hanging"
                      key={`${yearRow.year}-${weekIndex}`}
                      x={
                        weekdayLabelWidth +
                        strokePadding +
                        (blockWidth + blockMargin) * weekIndex
                      }
                      style={{ fontSize: `${fontSize * 0.75}px` }}
                    >
                      {label}
                    </text>
                  ))}
                </g>
              )}
              {!hideWeekdayLabels && (
                <g
                  className={cn(
                    "fill-current font-mono text-xs",
                    labelClassName,
                  )}
                >
                  {labels.weekdays?.map((label, dayIndex) => {
                    const adjustedIndex = (dayIndex + weekStart) % 7;
                    const adjustedLabel =
                      labels.weekdays?.[adjustedIndex] || label;

                    return (
                      <text
                        key={`weekday-${yearRow.year}-${label}`}
                        x={0}
                        y={
                          labelHeight +
                          (blockSize + blockMargin) * dayIndex +
                          blockSize / 2
                        }
                        dominantBaseline="middle"
                        textAnchor="start"
                        style={{ fontSize: `${fontSize * 0.75}px` }}
                      >
                        {adjustedLabel}
                      </text>
                    );
                  })}
                </g>
              )}
              <g
                transform={`translate(${weekdayLabelWidth + strokePadding}, 0)`}
              >
                {yearRow.weeks.map((week, weekIndex) =>
                  week.map((activity, dayIndex) => {
                    if (!activity) {
                      return null;
                    }

                    return (
                      <Fragment key={`${yearRow.year}-${activity.date}`}>
                        {children({ activity, dayIndex, weekIndex })}
                      </Fragment>
                    );
                  }),
                )}
              </g>
            </g>
          </svg>
          {renderYearFooter?.({
            year: yearRow.year,
            totalCount: yearTotalCount,
          })}
        </div>
      ))}
    </div>
  );
};

export type CalendarHeatmapFooterProps = HTMLAttributes<HTMLDivElement>;

export const CalendarHeatmapFooter = ({
  className,
  ...props
}: CalendarHeatmapFooterProps) => (
  <div
    data-slot="calendar-heatmap-footer"
    className={cn(
      "flex flex-wrap gap-1 whitespace-nowrap sm:gap-x-4",
      className,
    )}
    {...props}
  />
);

export type CalendarHeatmapStatProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  compute?: (data: ActivityWithLevel[]) => number | string;
  label?: string; // Template overriding labels.stat. Placeholders: {{value}}, {{year}}
  children?: (result: {
    value: number | string;
    data: ActivityWithLevel[];
    year: number;
  }) => ReactNode;
};

export const CalendarHeatmapStat = ({
  compute,
  label,
  className,
  children,
  ...props
}: CalendarHeatmapStatProps) => {
  const { data, totalCount, year, yearRows, labels } = useCalendarHeatmap();

  const value = compute ? compute(data) : totalCount;

  if (typeof value !== "string" && !Number.isFinite(value)) {
    throw new RangeError(
      "Stat compute must return a finite number or a string.",
    );
  }

  if (children) {
    return <>{children({ value, data, year })}</>;
  }

  const period =
    yearRows.length > 1 ? `${year} to ${yearRows.at(-1)?.year}` : String(year);
  const template =
    label ?? labels.stat ?? "Contributions in {{year}}: {{value}}";

  return (
    <div
      data-slot="calendar-heatmap-stat"
      className={cn("text-muted-foreground tabular-nums", className)}
      {...props}
    >
      {template
        .replaceAll("{{value}}", () => String(value))
        .replaceAll("{{year}}", () => period)}
    </div>
  );
};

export type CalendarHeatmapLegendProps = Omit<
  HTMLAttributes<HTMLFieldSetElement>,
  "children"
> & {
  labels?: { less?: string; more?: string };
  children?: (props: { level: number }) => ReactNode;
};

export const CalendarHeatmapLegend = ({
  labels: labelsProp,
  className,
  children,
  ...props
}: CalendarHeatmapLegendProps) => {
  const {
    levels,
    isNormalized,
    blockSize,
    blockWidth,
    blockRadius,
    colors,
    labels,
  } = useCalendarHeatmap();

  const lessLabel = labelsProp?.less ?? "Less";
  const moreLabel = labelsProp?.more ?? "More";

  const legendLevels = Array.from({ length: levels }, (_, i) =>
    isNormalized ? i + 1 : i,
  );

  return (
    <fieldset
      data-slot="calendar-heatmap-legend"
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
            role="group"
            aria-label={(
              labels.legendLevelLabel ?? "Level {{level}}"
            ).replaceAll("{{level}}", String(level))}
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
