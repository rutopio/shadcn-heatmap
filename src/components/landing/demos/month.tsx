import { de } from "date-fns/locale";
import { format, parseISO } from "date-fns";

import {
    MonthContributionHeatmap,
    MonthContributionHeatmapBlock,
    MonthContributionHeatmapCalendar,
    MonthContributionHeatmapFooter,
    MonthContributionHeatmapLegend,
    MonthContributionHeatmapTotalCount,
} from "@/components/heatmap/month-contribution-heatmap";
import { generateMonthSample } from "@/data/month-sample";

import {
    HeatmapTooltip,
    MonthBinaryTooltipContent,
    MonthTooltipContent,
    TooltipProvider,
} from "./shared";

const monthData = generateMonthSample(42, 2025);

export function MonthDefaultDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <MonthContributionHeatmap data={monthData}>
                <MonthContributionHeatmapCalendar>
                    {({ activity, dayIndex, weekIndex }) => (
                        <HeatmapTooltip
                            content={<MonthTooltipContent activity={activity} />}
                        >
                            <MonthContributionHeatmapBlock
                                activity={activity}
                                dayIndex={dayIndex}
                                weekIndex={weekIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </MonthContributionHeatmapCalendar>
                <MonthContributionHeatmapFooter>
                    <MonthContributionHeatmapTotalCount />
                    <MonthContributionHeatmapLegend />
                </MonthContributionHeatmapFooter>
            </MonthContributionHeatmap>
        </TooltipProvider>
    );
}

export function MonthMondayStartDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <MonthContributionHeatmap data={monthData} weekStart={1}>
                <MonthContributionHeatmapCalendar>
                    {({ activity, dayIndex, weekIndex }) => (
                        <HeatmapTooltip
                            content={<MonthTooltipContent activity={activity} />}
                        >
                            <MonthContributionHeatmapBlock
                                activity={activity}
                                dayIndex={dayIndex}
                                weekIndex={weekIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </MonthContributionHeatmapCalendar>
                <MonthContributionHeatmapFooter>
                    <MonthContributionHeatmapTotalCount />
                    <MonthContributionHeatmapLegend />
                </MonthContributionHeatmapFooter>
            </MonthContributionHeatmap>
        </TooltipProvider>
    );
}

export function MonthChunkyDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <MonthContributionHeatmap
                data={monthData}
                continuousMonths={false}
            >
                <MonthContributionHeatmapCalendar>
                    {({ activity, dayIndex, weekIndex }) => (
                        <HeatmapTooltip
                            content={<MonthTooltipContent activity={activity} />}
                        >
                            <MonthContributionHeatmapBlock
                                activity={activity}
                                dayIndex={dayIndex}
                                weekIndex={weekIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </MonthContributionHeatmapCalendar>
                <MonthContributionHeatmapFooter>
                    <MonthContributionHeatmapTotalCount />
                    <MonthContributionHeatmapLegend />
                </MonthContributionHeatmapFooter>
            </MonthContributionHeatmap>
        </TooltipProvider>
    );
}

export function MonthBinaryDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <MonthContributionHeatmap
                data={monthData}
                maxLevel={1}
                labels={{
                    legend: { less: "Disabled", more: "Enabled" },
                }}
            >
                <MonthContributionHeatmapCalendar>
                    {({ activity, dayIndex, weekIndex }) => (
                        <HeatmapTooltip
                            content={<MonthBinaryTooltipContent activity={activity} locale={undefined} />}
                        >
                            <MonthContributionHeatmapBlock
                                activity={activity}
                                dayIndex={dayIndex}
                                weekIndex={weekIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </MonthContributionHeatmapCalendar>
                <MonthContributionHeatmapFooter>
                    <MonthContributionHeatmapTotalCount />
                    <MonthContributionHeatmapLegend />
                </MonthContributionHeatmapFooter>
            </MonthContributionHeatmap>
        </TooltipProvider>
    );
}

export function MonthTenLevelsDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <MonthContributionHeatmap data={monthData} maxLevel={10}>
                <MonthContributionHeatmapCalendar>
                    {({ activity, dayIndex, weekIndex }) => (
                        <HeatmapTooltip
                            content={<MonthTooltipContent activity={activity} />}
                        >
                            <MonthContributionHeatmapBlock
                                activity={activity}
                                dayIndex={dayIndex}
                                weekIndex={weekIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </MonthContributionHeatmapCalendar>
                <MonthContributionHeatmapFooter>
                    <MonthContributionHeatmapTotalCount />
                    <MonthContributionHeatmapLegend />
                </MonthContributionHeatmapFooter>
            </MonthContributionHeatmap>
        </TooltipProvider>
    );
}

export function MonthGermanDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <MonthContributionHeatmap
                data={monthData}
                locale={de}
                labels={{
                    totalCount: "{{count}} Aktivitäten in {{year}}",
                    legend: { less: "Weniger", more: "Mehr" },
                }}
            >
                <MonthContributionHeatmapCalendar>
                    {({ activity, dayIndex, weekIndex }) => (
                        <HeatmapTooltip
                            content={
                                <>
                                    <p className="font-medium">
                                        {format(parseISO(activity.date), "PPP", { locale: de })}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {activity.count} Aktivität{activity.count !== 1 ? "en" : ""}
                                    </p>
                                </>
                            }
                        >
                            <MonthContributionHeatmapBlock
                                activity={activity}
                                dayIndex={dayIndex}
                                weekIndex={weekIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </MonthContributionHeatmapCalendar>
                <MonthContributionHeatmapFooter>
                    <MonthContributionHeatmapTotalCount />
                    <MonthContributionHeatmapLegend />
                </MonthContributionHeatmapFooter>
            </MonthContributionHeatmap>
        </TooltipProvider>
    );
}

export function MonthLargeBlocksDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <MonthContributionHeatmap data={monthData} blockSize={18} blockMargin={3}>
                <MonthContributionHeatmapCalendar>
                    {({ activity, dayIndex, weekIndex }) => (
                        <HeatmapTooltip
                            content={<MonthTooltipContent activity={activity} />}
                        >
                            <MonthContributionHeatmapBlock
                                activity={activity}
                                dayIndex={dayIndex}
                                weekIndex={weekIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </MonthContributionHeatmapCalendar>
                <MonthContributionHeatmapFooter>
                    <MonthContributionHeatmapTotalCount />
                    <MonthContributionHeatmapLegend />
                </MonthContributionHeatmapFooter>
            </MonthContributionHeatmap>
        </TooltipProvider>
    );
}

const monthMultiYear = [
    ...generateMonthSample(7, 2024),
    ...generateMonthSample(8, 2025),
];

const multiYearYears = [2024, 2025];

export function MonthMultiYearDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <MonthContributionHeatmap data={monthMultiYear} blockSize={10}>
                <MonthContributionHeatmapCalendar
                    renderYearFooter={({ year, totalCount }) => {
                        const isLastYear = year === Math.max(...multiYearYears);
                        return (
                            <MonthContributionHeatmapFooter>
                                <div className="text-muted-foreground">
                                    {totalCount} contributions in {year}
                                </div>
                                {isLastYear && <MonthContributionHeatmapLegend />}
                            </MonthContributionHeatmapFooter>
                        );
                    }}
                >
                    {({ activity, dayIndex, weekIndex }) => (
                        <HeatmapTooltip
                            content={<MonthTooltipContent activity={activity} />}
                        >
                            <MonthContributionHeatmapBlock
                                activity={activity}
                                dayIndex={dayIndex}
                                weekIndex={weekIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </MonthContributionHeatmapCalendar>
            </MonthContributionHeatmap>
        </TooltipProvider>
    );
}

export function MonthNoFooterDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <MonthContributionHeatmap data={monthData}>
                <MonthContributionHeatmapCalendar>
                    {({ activity, dayIndex, weekIndex }) => (
                        <HeatmapTooltip
                            content={<MonthTooltipContent activity={activity} />}
                        >
                            <MonthContributionHeatmapBlock
                                activity={activity}
                                dayIndex={dayIndex}
                                weekIndex={weekIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </MonthContributionHeatmapCalendar>
            </MonthContributionHeatmap>
        </TooltipProvider>
    );
}

export function MonthCustomDateFormatDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <MonthContributionHeatmap data={monthData} dateFormat="MMM d, yyyy">
                <MonthContributionHeatmapCalendar>
                    {({ activity, dayIndex, weekIndex }) => (
                        <HeatmapTooltip
                            content={
                                <>
                                    <p className="font-medium">
                                        {format(parseISO(activity.date), "MMM d, yyyy")}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {activity.count} contribution{activity.count !== 1 ? "s" : ""}
                                    </p>
                                </>
                            }
                        >
                            <MonthContributionHeatmapBlock
                                activity={activity}
                                dayIndex={dayIndex}
                                weekIndex={weekIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </MonthContributionHeatmapCalendar>
                <MonthContributionHeatmapFooter>
                    <MonthContributionHeatmapTotalCount />
                    <MonthContributionHeatmapLegend />
                </MonthContributionHeatmapFooter>
            </MonthContributionHeatmap>
        </TooltipProvider>
    );
}

export function MonthCustomLabelDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <MonthContributionHeatmap data={monthData}>
                <MonthContributionHeatmapCalendar labelTextClass="text-red-500 font-bold">
                    {({ activity, dayIndex, weekIndex }) => (
                        <HeatmapTooltip
                            content={<MonthTooltipContent activity={activity} />}
                        >
                            <MonthContributionHeatmapBlock
                                activity={activity}
                                dayIndex={dayIndex}
                                weekIndex={weekIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </MonthContributionHeatmapCalendar>
                <MonthContributionHeatmapFooter>
                    <MonthContributionHeatmapTotalCount />
                    <MonthContributionHeatmapLegend />
                </MonthContributionHeatmapFooter>
            </MonthContributionHeatmap>
        </TooltipProvider>
    );
}
