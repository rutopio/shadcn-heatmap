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
    stat?: string; // Stat text template. Placeholders: {{value}}, {{year}}
    cellLabel?: string; // aria-label template. Placeholders: {{date}}, {{value}}
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
    blockSizeRatio: number;
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

const EMPTY_STYLE: CSSProperties = {};
const LABEL_MARGIN = 8;

const CalendarHeatmapContext =
    createContext<CalendarHeatmapContextType | null>(null);

const useCalendarHeatmap = () => {
    const context = use(CalendarHeatmapContext);

    if (!context) {
        throw new Error(
            "CalendarHeatmap components must be used within a CalendarHeatmap"
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
    continuousMonths?: boolean;
    hasEmptyColumn?: boolean;
    blockSize?: number;
    blockMargin?: number;
    blockRadius?: number;
    blockSizeRatio?: number;
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
 *     <CalendarHeatmapStat />
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
 * @param levels - Total number of legend cells (including empty when not normalized). Default: 5
 * @param isNormalized - When true, uses min-max normalization across the dataset (suitable for signed values). When false (default), treats 0 as empty and scales from 0 to max.
 */
export const CalendarHeatmap = ({
    data,
    weekStart = 0,
    continuousMonths = true,
    hasEmptyColumn = false,
    blockSize = 12,
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
    style = EMPTY_STYLE,
    className,
    children,
    ...props
}: CalendarHeatmapProps) => {
    const levels = Math.max(1, levelsProp);

    const dataWithLevels = useMemo((): ActivityWithLevel[] => {
        if (data.length === 0) return [];

        const maxCount = data.reduce((max, d) => Math.max(max, d.value), 1);
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
                isNormalized
            ),
        }));
    }, [data, levels, isNormalized]);

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
            cellLabel: "{{date}}: {{value}} contributions",
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

    const contextValue = useMemo<CalendarHeatmapContextType>(
        () => ({
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
            blockSizeRatio,
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
        ]
    );

    if (data.length === 0) {
        return emptyState ? <>{emptyState}</> : null;
    }

    return (
        <CalendarHeatmapContext value={contextValue}>
            <div
                className={cn("flex w-max max-w-full flex-col gap-2 px-4", className)}
                style={{ fontSize, ...style }}
                {...props}
            >
                {children}
            </div>
        </CalendarHeatmapContext>
    );
};

export type CalendarHeatmapBlockProps = HTMLAttributes<SVGRectElement> & {
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
    onMouseEnter,
    onMouseLeave,
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
        labels,
        levels,
        isNormalized,
        colors,
    } = useCalendarHeatmap();

    const level = Math.max(
        0,
        Math.min(colorStepCount(levels, isNormalized), activity.level)
    );

    const ariaLabel = (labels.cellLabel ?? "{{date}}: {{value}} contributions")
        .replace("{{date}}", activity.date)
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
                "flex max-w-full flex-col gap-6 overflow-x-auto overflow-y-hidden py-4",
                className
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
                        role="img"
                        aria-label={`Contribution heatmap for ${yearRow.year}`}
                        className="block overflow-visible"
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
                                        labelClassName
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
    const { data, totalCount, year, labels } = useCalendarHeatmap();

    const value = compute ? compute(data) : totalCount;

    if (children) {
        return <>{children({ value, data, year })}</>;
    }

    const template =
        label ?? labels.stat ?? "{{value}} contributions in {{year}}";

    return (
        <div
            className={cn("text-muted-foreground tabular-nums", className)}
            {...props}
        >
            {template
                .replace("{{value}}", String(value))
                .replace("{{year}}", String(year))}
        </div>
    );
};

export type CalendarHeatmapLegendProps = Omit<
    HTMLAttributes<HTMLDivElement>,
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
    const { levels, isNormalized, blockSize, blockWidth, blockRadius, colors } =
        useCalendarHeatmap();

    const lessLabel = labelsProp?.less ?? "Less";
    const moreLabel = labelsProp?.more ?? "More";

    const legendLevels = Array.from({ length: levels }, (_, i) =>
        isNormalized ? i + 1 : i
    );

    return (
        <div
            role="group"
            aria-label="Activity intensity legend"
            className={cn("text-muted-foreground ml-auto flex items-center gap-1", className)}
            {...props}
        >
            <span className="mr-1 text-xs font-medium">
                {lessLabel}
            </span>
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
            <span className="ml-1 text-xs font-medium">
                {moreLabel}
            </span>
        </div>
    );
};
