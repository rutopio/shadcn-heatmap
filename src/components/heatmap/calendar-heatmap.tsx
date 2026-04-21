"use client";

import { createContext, Fragment, use, useMemo } from "react";
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  formatISO,
  getDay,
  getMonth,
  getYear,
  nextDay,
  parseISO,
  subWeeks,
} from "date-fns";

import { cn } from "@/lib/utils";

import type { Locale, Day as WeekDay } from "date-fns";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type Activity = {
  date: string;
  value: number;
};

type ActivityWithLevel = Activity & {
  level: number;
};

type Week = Array<ActivityWithLevel | undefined>;

type YearRow = {
  year: number;
  startMonth: number;
  weeks: Week[];
};

export type Labels = {
  months?: string[];
  weekdays?: string[];
  totalCount?: string;
  legend?: {
    less?: string;
    more?: string;
  };
};

export type ColorConfig = {
  empty?: string;
  scale?: string;
};

type MonthLabel = {
  weekIndex: number;
  label: string;
  year?: number;
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
  maxValue: number,
  maxLevel: number
): number => {
  if (value <= 0 || maxValue <= 0) return 0;

  const percentage = value / maxValue;
  return Math.max(1, Math.min(maxLevel, Math.ceil(percentage * maxLevel)));
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

type ContributionGraphContextType = {
  data: ActivityWithLevel[];
  weeks: Week[];
  yearRows: YearRow[];
  blockMargin: number;
  blockRadius: number;
  blockSize: number;
  blockSizeRatio: number;
  blockWidth: number;
  fontSize: number;
  labels: Labels;
  labelHeight: number;
  maxLevel: number;
  totalCount: number;
  weekStart: WeekDay;
  year: number;
  width: number;
  height: number;
  hasEmptyColumn: boolean;
  continuousMonths: boolean;
  locale?: Locale;
  dateFormat: string;
  colors?: ColorConfig;
};

const EMPTY_STYLE: CSSProperties = {};
const LABEL_MARGIN = 8;

const ContributionGraphContext =
  createContext<ContributionGraphContextType | null>(null);

const useContributionGraph = () => {
  const context = use(ContributionGraphContext);

  if (!context) {
    throw new Error(
      "ContributionGraph components must be used within a ContributionGraph"
    );
  }

  return context;
};

const fillHoles = (activities: ActivityWithLevel[]): ActivityWithLevel[] => {
  if (activities.length === 0) {
    return [];
  }

  const sortedActivities = [...activities].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const calendar = new Map<string, ActivityWithLevel>(
    activities.map((a) => [a.date, a])
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

const groupByYearAndMonth = (
  activities: ActivityWithLevel[],
  weekStart: WeekDay = 0,
  hasEmptyColumn = false
): YearRow[] => {
  if (activities.length === 0) {
    return [];
  }

  const normalizedActivities = fillHoles(activities);

  const activitiesByYearMonth = new Map<string, ActivityWithLevel[]>();

  for (const activity of normalizedActivities) {
    const date = parseISO(activity.date);
    const year = getYear(date);
    const month = getMonth(date);
    const key = `${year}-${String(month).padStart(2, "0")}`;

    if (!activitiesByYearMonth.has(key)) {
      activitiesByYearMonth.set(key, []);
    }
    activitiesByYearMonth.get(key)!.push(activity);
  }

  const sortedKeys = Array.from(activitiesByYearMonth.keys()).sort();

  if (sortedKeys.length === 0) {
    return [];
  }

  const firstKey = sortedKeys[0];
  const [firstYearStr, firstMonthStr] = firstKey.split("-");
  const startYear = parseInt(firstYearStr, 10);
  const startMonth = parseInt(firstMonthStr, 10);

  const yearRows: YearRow[] = [];
  let currentYear = startYear;
  let currentMonth = startMonth;

  while (true) {
    const rowWeeks: Week[] = [];
    let hasData = false;

    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      const monthIndex = (currentMonth + monthOffset) % 12;
      const yearOffset = Math.floor((currentMonth + monthOffset) / 12);
      const year = currentYear + yearOffset;
      const key = `${year}-${String(monthIndex).padStart(2, "0")}`;

      const monthActivities = activitiesByYearMonth.get(key) || [];

      if (monthActivities.length > 0) {
        hasData = true;

        const firstActivity = monthActivities[0] as ActivityWithLevel;
        const firstDate = parseISO(firstActivity.date);
        const firstCalendarDate =
          getDay(firstDate) === weekStart
            ? firstDate
            : subWeeks(nextDay(firstDate, weekStart), 1);

        const paddedActivities: Array<ActivityWithLevel | undefined> = [
          ...new Array(
            differenceInCalendarDays(firstDate, firstCalendarDate)
          ).fill(undefined),
          ...monthActivities,
        ];

        const numberOfWeeks = Math.ceil(paddedActivities.length / 7);
        const monthWeeks: Week[] = new Array(numberOfWeeks)
          .fill(undefined)
          .map((_, weekIndex) =>
            paddedActivities.slice(weekIndex * 7, weekIndex * 7 + 7)
          );

        if (hasEmptyColumn && rowWeeks.length > 0) {
          rowWeeks.push(new Array(7).fill(undefined) as Week);
        }

        rowWeeks.push(...monthWeeks);
      }
    }

    if (!hasData) {
      break;
    }

    yearRows.push({
      year: currentYear,
      startMonth: currentMonth,
      weeks: rowWeeks,
    });

    currentYear++;
    currentMonth = startMonth;

    const hasNextYearData = sortedKeys.some((key) => {
      const [yearStr] = key.split("-");
      return parseInt(yearStr, 10) >= currentYear;
    });

    if (!hasNextYearData) {
      break;
    }
  }

  return yearRows;
};

const groupContinuous = (
  activities: ActivityWithLevel[],
  weekStart: WeekDay = 0
): YearRow[] => {
  if (activities.length === 0) return [];

  const normalizedActivities = fillHoles(activities);

  const first = normalizedActivities[0] as ActivityWithLevel;
  const firstDate = parseISO(first.date);
  const firstCalendarDate =
    getDay(firstDate) === weekStart
      ? firstDate
      : subWeeks(nextDay(firstDate, weekStart), 1);

  const leadingPad = differenceInCalendarDays(firstDate, firstCalendarDate);

  const padded: Array<ActivityWithLevel | undefined> = [
    ...new Array(leadingPad).fill(undefined),
    ...normalizedActivities,
  ];

  const numberOfWeeks = Math.ceil(padded.length / 7);
  const allWeeks: Week[] = new Array(numberOfWeeks)
    .fill(undefined)
    .map((_, i) => padded.slice(i * 7, i * 7 + 7));

  const yearMap = new Map<number, Week[]>();
  for (const week of allWeeks) {
    const firstActivity = week.find((a) => a !== undefined);
    const year = firstActivity
      ? getYear(parseISO(firstActivity.date))
      : undefined;
    if (year !== undefined) {
      if (!yearMap.has(year)) yearMap.set(year, []);
      yearMap.get(year)!.push(week);
    }
  }

  return Array.from(yearMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, weeks]) => ({
      year,
      startMonth: 0,
      weeks,
    }));
};

const getMonthLabels = (
  weeks: Week[],
  monthNames: string[] = generateMonthLabels()
): MonthLabel[] => {
  return weeks
    .reduce<MonthLabel[]>((labels, week, weekIndex) => {
      const firstActivity = week.find((activity) => activity !== undefined);

      if (!firstActivity) {
        return labels;
      }

      const month = monthNames[getMonth(parseISO(firstActivity.date))];

      if (!month) {
        const monthName = new Date(firstActivity.date).toLocaleString("en-US", {
          month: "short",
        });
        throw new Error(
          `Unexpected error: undefined month label for ${monthName}.`
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
        return labels[1] && labels[1].weekIndex - weekIndex >= minWeeks;
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
  dateFormat?: string;
  continuousMonths?: boolean;
  hasEmptyColumn?: boolean;
  blockSize?: number;
  blockMargin?: number;
  blockRadius?: number;
  blockSizeRatio?: number;
  maxLevel?: number;
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

/**
 * Calendar Heatmap
 *
 * A GitHub-style contribution calendar showing daily activity over months and years.
 * Each cell represents one day, arranged in weeks (rows) and months (columns).
 *
 * @example
 * ```tsx
 * <CalendarHeatmap data={data} weekStart={1} continuousMonths>
 *   <CalendarHeatmapBody>
 *     {({ activity, dayIndex, weekIndex }) => (
 *       <CalendarHeatmapBlock
 *         activity={activity}
 *         dayIndex={dayIndex}
 *         weekIndex={weekIndex}
 *       />
 *     )}
 *   </CalendarHeatmapBody>
 *   <CalendarHeatmapFooter>
 *     <CalendarHeatmapTotalCount />
 *     <CalendarHeatmapLegend />
 *   </CalendarHeatmapFooter>
 * </CalendarHeatmap>
 * ```
 *
 * @param data - Array of activities with date (YYYY-MM-DD) and value
 * @param weekStart - First day of week (0=Sunday, 1=Monday). Default: 0
 * @param continuousMonths - Display months continuously vs. grouped by year. Default: true
 * @param hasEmptyColumn - Add empty column between months. Default: false
 * @param blockSizeRatio - Width/height ratio of blocks. Default: 1
 * @param maxLevel - Maximum intensity level (0 to maxLevel). Default: 4
 */
export const CalendarHeatmap = ({
  data,
  weekStart = 0,
  dateFormat = "PPP",
  continuousMonths = true,
  hasEmptyColumn = false,
  blockSize = 12,
  blockMargin = 4,
  blockRadius = 2,
  blockSizeRatio = 1,
  maxLevel: maxLevelProp = 4,
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
  const maxLevel = Math.max(1, maxLevelProp);

  const dataWithLevels = useMemo((): ActivityWithLevel[] => {
    if (data.length === 0) return [];

    const maxCount = data.reduce((max, d) => Math.max(max, d.value), 1);

    return data.map((activity) => ({
      ...activity,
      level: calculateLevel(activity.value, maxCount, maxLevel),
    }));
  }, [data, maxLevel]);

  const yearRows = useMemo(
    () =>
      continuousMonths
        ? groupContinuous(dataWithLevels, weekStart)
        : groupByYearAndMonth(dataWithLevels, weekStart, hasEmptyColumn),
    [dataWithLevels, weekStart, hasEmptyColumn, continuousMonths]
  );
  const weeks = useMemo(() => yearRows.flatMap((r) => r.weeks), [yearRows]);

  const labels = useMemo(
    () => ({
      months: generateMonthLabels(locale),
      weekdays: generateWeekdayLabels(locale),
      totalCount: "{{count}} contributions in {{year}}",
      legend: { less: "Less", more: "More" },
      ...labelsProp,
    }),
    [locale, labelsProp]
  );
  const labelHeight = fontSize + LABEL_MARGIN;

  const year =
    data.length > 0
      ? getYear(parseISO(data[0].date))
      : new Date().getFullYear();

  const totalCount =
    typeof totalCountProp === "number"
      ? totalCountProp
      : dataWithLevels.reduce((sum, activity) => sum + activity.value, 0);

  const blockWidth = blockSize * blockSizeRatio;
  const width = weeks.length * (blockWidth + blockMargin) - blockMargin;
  const height = labelHeight + (blockSize + blockMargin) * 7 - blockMargin;

  if (data.length === 0) {
    return emptyState ? <>{emptyState}</> : null;
  }

  return (
    <ContributionGraphContext
      value={{
        data: dataWithLevels,
        weeks,
        yearRows,
        blockMargin,
        blockRadius,
        blockSize,
        blockSizeRatio,
        blockWidth,
        fontSize,
        labels,
        labelHeight,
        maxLevel,
        totalCount,
        weekStart,
        year,
        width,
        height,
        hasEmptyColumn,
        continuousMonths,
        locale,
        dateFormat,
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
    </ContributionGraphContext>
  );
};

export type CalendarHeatmapBlockProps = HTMLAttributes<SVGRectElement> & {
  activity: ActivityWithLevel;
  dayIndex: number;
  weekIndex: number;
};

export const CalendarHeatmapBlock = ({
  ref,
  activity,
  dayIndex,
  weekIndex,
  className,
  style: styleProp,
  ...props
}: CalendarHeatmapBlockProps & {
  ref?: React.RefObject<SVGRectElement | null>;
}) => {
  const {
    blockSize,
    blockWidth,
    blockMargin,
    blockRadius,
    labelHeight,
    maxLevel,
    colors,
  } = useContributionGraph();

  if (activity.level < 0 || activity.level > maxLevel) {
    throw new RangeError(
      `Provided activity level ${activity.level} for ${activity.date} is out of range. It must be between 0 and ${maxLevel}.`
    );
  }

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
      data-date={activity.date}
      data-level={activity.level}
      height={blockSize}
      rx={blockRadius}
      ry={blockRadius}
      width={blockWidth}
      x={(blockWidth + blockMargin) * weekIndex}
      y={labelHeight + (blockSize + blockMargin) * dayIndex}
      style={{
        fill: getLevelFill(activity.level, maxLevel, isHighlighted, colors),
        ...styleProp,
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
  className?: string;
  labelTextClass?: string;
  yearTextClass?: string;
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
  className,
  labelTextClass,
  yearTextClass,
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
  } = useContributionGraph();

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
      className={cn(
        "flex max-w-full flex-col gap-6 overflow-x-auto overflow-y-hidden p-4",
        className
      )}
      {...props}
    >
      {rowData.map(({ yearRow, height, monthLabels, yearTotalCount }) => (
        <div key={`year-row-${yearRow.year}`}>
          <div className={cn("text-muted-foreground mb-2", yearTextClass)}>
            {yearRow.year}
          </div>
          <svg
            role="img"
            aria-label={`Contribution heatmap for ${yearRow.year}`}
            className="block overflow-visible"
            height={height + strokePadding * 2}
            viewBox={`0 0 ${totalWidth} ${height + strokePadding * 2}`}
            width={totalWidth}
          >
            <title>Contribution Graph {yearRow.year}</title>
            <g transform={`translate(0, ${strokePadding})`}>
              {!hideMonthLabels && (
                <g className={cn("fill-current font-mono", labelTextClass)}>
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
                    labelTextClass
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
                  })
                )}
              </g>
            </g>
          </svg>
          {renderYearFooter &&
            renderYearFooter({
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
    className={cn(
      "flex flex-wrap gap-1 whitespace-nowrap sm:gap-x-4",
      className
    )}
    {...props}
  />
);

export type CalendarHeatmapTotalCountProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children?: (props: { totalCount: number; year: number }) => ReactNode;
};

export const CalendarHeatmapTotalCount = ({
  className,
  children,
  ...props
}: CalendarHeatmapTotalCountProps) => {
  const { totalCount, year, labels } = useContributionGraph();

  if (children) {
    return <>{children({ totalCount, year })}</>;
  }

  return (
    <div className={cn("text-muted-foreground", className)} {...props}>
      {labels.totalCount
        ? labels.totalCount
            .replace("{{count}}", String(totalCount))
            .replace("{{year}}", String(year))
        : `${totalCount} contributions in ${year}`}
    </div>
  );
};

export type CalendarHeatmapLegendProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children?: (props: { level: number }) => ReactNode;
};

export const CalendarHeatmapLegend = ({
  className,
  children,
  ...props
}: CalendarHeatmapLegendProps) => {
  const { labels, maxLevel, blockSize, blockWidth, blockRadius, colors } =
    useContributionGraph();

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
            width={blockWidth}
            style={{ borderRadius: blockRadius }}
          >
            <title>{`${level} contributions`}</title>
            <rect
              data-level={level}
              height={blockSize}
              rx={blockRadius}
              ry={blockRadius}
              width={blockWidth}
              style={{
                borderRadius: blockRadius,
                fill: getLevelFill(level, maxLevel, false, colors),
              }}
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
