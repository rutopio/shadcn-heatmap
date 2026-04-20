import { de } from "date-fns/locale";
import { format, parseISO } from "date-fns";

import {
    CalendarHeatmap,
    CalendarHeatmapBlock,
    CalendarHeatmapBody,
    CalendarHeatmapFooter,
    CalendarHeatmapLegend,
    CalendarHeatmapTotalCount,
} from "@/components/heatmap/calendar-heatmap";
import { generateMonthSample } from "@/data/month-sample";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const monthData = generateMonthSample(42, 2025);

function MonthTooltip({ activity }: { activity: { date: string; count: number } }) {
    return (
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
            <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
            <p className="text-muted-foreground">
                {activity.count} contribution{activity.count !== 1 ? "s" : ""}
            </p>
        </TooltipContent>
    );
}

export function MonthDefaultDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <CalendarHeatmap data={monthData}>
                <CalendarHeatmapBody>
                    {({ activity, dayIndex, weekIndex }) => (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <CalendarHeatmapBlock
                                    activity={activity}
                                    dayIndex={dayIndex}
                                    weekIndex={weekIndex}
                                />
                            </TooltipTrigger>
                            <MonthTooltip activity={activity} />
                        </Tooltip>
                    )}
                </CalendarHeatmapBody>
                <CalendarHeatmapFooter>
                    <CalendarHeatmapTotalCount />
                    <CalendarHeatmapLegend />
                </CalendarHeatmapFooter>
            </CalendarHeatmap>
        </TooltipProvider>
    );
}

export function MonthMondayStartDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <CalendarHeatmap data={monthData} weekStart={1}>
                <CalendarHeatmapBody>
                    {({ activity, dayIndex, weekIndex }) => (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <CalendarHeatmapBlock
                                    activity={activity}
                                    dayIndex={dayIndex}
                                    weekIndex={weekIndex}
                                />
                            </TooltipTrigger>
                            <MonthTooltip activity={activity} />
                        </Tooltip>
                    )}
                </CalendarHeatmapBody>
                <CalendarHeatmapFooter>
                    <CalendarHeatmapTotalCount />
                    <CalendarHeatmapLegend />
                </CalendarHeatmapFooter>
            </CalendarHeatmap>
        </TooltipProvider>
    );
}

export function MonthChunkyDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <CalendarHeatmap data={monthData} continuousMonths={false}>
                <CalendarHeatmapBody>
                    {({ activity, dayIndex, weekIndex }) => (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <CalendarHeatmapBlock
                                    activity={activity}
                                    dayIndex={dayIndex}
                                    weekIndex={weekIndex}
                                />
                            </TooltipTrigger>
                            <MonthTooltip activity={activity} />
                        </Tooltip>
                    )}
                </CalendarHeatmapBody>
                <CalendarHeatmapFooter>
                    <CalendarHeatmapTotalCount />
                    <CalendarHeatmapLegend />
                </CalendarHeatmapFooter>
            </CalendarHeatmap>
        </TooltipProvider>
    );
}

export function MonthBinaryDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <CalendarHeatmap
                data={monthData}
                maxLevel={1}
                labels={{ legend: { less: "Disabled", more: "Enabled" } }}
            >
                <CalendarHeatmapBody>
                    {({ activity, dayIndex, weekIndex }) => (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <CalendarHeatmapBlock
                                    activity={activity}
                                    dayIndex={dayIndex}
                                    weekIndex={weekIndex}
                                />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
                                <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
                                <p className="text-muted-foreground">
                                    {activity.count > 0 ? "Enabled" : "Disabled"}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </CalendarHeatmapBody>
                <CalendarHeatmapFooter>
                    <CalendarHeatmapTotalCount />
                    <CalendarHeatmapLegend />
                </CalendarHeatmapFooter>
            </CalendarHeatmap>
        </TooltipProvider>
    );
}

export function MonthTenLevelsDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <CalendarHeatmap data={monthData} maxLevel={10}>
                <CalendarHeatmapBody>
                    {({ activity, dayIndex, weekIndex }) => (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <CalendarHeatmapBlock
                                    activity={activity}
                                    dayIndex={dayIndex}
                                    weekIndex={weekIndex}
                                />
                            </TooltipTrigger>
                            <MonthTooltip activity={activity} />
                        </Tooltip>
                    )}
                </CalendarHeatmapBody>
                <CalendarHeatmapFooter>
                    <CalendarHeatmapTotalCount />
                    <CalendarHeatmapLegend />
                </CalendarHeatmapFooter>
            </CalendarHeatmap>
        </TooltipProvider>
    );
}

export function MonthGermanDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <CalendarHeatmap
                data={monthData}
                locale={de}
                labels={{
                    totalCount: "{{count}} Aktivitäten in {{year}}",
                    legend: { less: "Weniger", more: "Mehr" },
                }}
            >
                <CalendarHeatmapBody>
                    {({ activity, dayIndex, weekIndex }) => (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <CalendarHeatmapBlock
                                    activity={activity}
                                    dayIndex={dayIndex}
                                    weekIndex={weekIndex}
                                />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
                                <p className="font-medium">
                                    {format(parseISO(activity.date), "PPP", { locale: de })}
                                </p>
                                <p className="text-muted-foreground">
                                    {activity.count} Aktivität{activity.count !== 1 ? "en" : ""}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </CalendarHeatmapBody>
                <CalendarHeatmapFooter>
                    <CalendarHeatmapTotalCount />
                    <CalendarHeatmapLegend />
                </CalendarHeatmapFooter>
            </CalendarHeatmap>
        </TooltipProvider>
    );
}

export function MonthLargeBlocksDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <CalendarHeatmap data={monthData} blockSize={18} blockMargin={3}>
                <CalendarHeatmapBody>
                    {({ activity, dayIndex, weekIndex }) => (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <CalendarHeatmapBlock
                                    activity={activity}
                                    dayIndex={dayIndex}
                                    weekIndex={weekIndex}
                                />
                            </TooltipTrigger>
                            <MonthTooltip activity={activity} />
                        </Tooltip>
                    )}
                </CalendarHeatmapBody>
                <CalendarHeatmapFooter>
                    <CalendarHeatmapTotalCount />
                    <CalendarHeatmapLegend />
                </CalendarHeatmapFooter>
            </CalendarHeatmap>
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
            <CalendarHeatmap data={monthMultiYear} blockSize={10}>
                <CalendarHeatmapBody
                    renderYearFooter={({ year, totalCount }) => {
                        const isLastYear = year === Math.max(...multiYearYears);
                        return (
                            <CalendarHeatmapFooter>
                                <div className="text-muted-foreground">
                                    {totalCount} contributions in {year}
                                </div>
                                {isLastYear && <CalendarHeatmapLegend />}
                            </CalendarHeatmapFooter>
                        );
                    }}
                >
                    {({ activity, dayIndex, weekIndex }) => (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <CalendarHeatmapBlock
                                    activity={activity}
                                    dayIndex={dayIndex}
                                    weekIndex={weekIndex}
                                />
                            </TooltipTrigger>
                            <MonthTooltip activity={activity} />
                        </Tooltip>
                    )}
                </CalendarHeatmapBody>
            </CalendarHeatmap>
        </TooltipProvider>
    );
}

export function MonthNoFooterDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <CalendarHeatmap data={monthData}>
                <CalendarHeatmapBody>
                    {({ activity, dayIndex, weekIndex }) => (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <CalendarHeatmapBlock
                                    activity={activity}
                                    dayIndex={dayIndex}
                                    weekIndex={weekIndex}
                                />
                            </TooltipTrigger>
                            <MonthTooltip activity={activity} />
                        </Tooltip>
                    )}
                </CalendarHeatmapBody>
            </CalendarHeatmap>
        </TooltipProvider>
    );
}

export function MonthCustomDateFormatDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <CalendarHeatmap data={monthData} dateFormat="MMM d, yyyy">
                <CalendarHeatmapBody>
                    {({ activity, dayIndex, weekIndex }) => (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <CalendarHeatmapBlock
                                    activity={activity}
                                    dayIndex={dayIndex}
                                    weekIndex={weekIndex}
                                />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
                                <p className="font-medium">
                                    {format(parseISO(activity.date), "MMM d, yyyy")}
                                </p>
                                <p className="text-muted-foreground">
                                    {activity.count} contribution{activity.count !== 1 ? "s" : ""}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </CalendarHeatmapBody>
                <CalendarHeatmapFooter>
                    <CalendarHeatmapTotalCount />
                    <CalendarHeatmapLegend />
                </CalendarHeatmapFooter>
            </CalendarHeatmap>
        </TooltipProvider>
    );
}

export function MonthCustomStylingDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <CalendarHeatmap data={monthData} colors={{ scale: "#22c55e" }}>
                <CalendarHeatmapBody
                    labelTextClass="text-green-700 font-bold"
                    yearTextClass="text-green-700 font-bold"
                >
                    {({ activity, dayIndex, weekIndex }) => (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <CalendarHeatmapBlock
                                    activity={activity}
                                    dayIndex={dayIndex}
                                    weekIndex={weekIndex}
                                />
                            </TooltipTrigger>
                            <MonthTooltip activity={activity} />
                        </Tooltip>
                    )}
                </CalendarHeatmapBody>
                <CalendarHeatmapFooter>
                    <CalendarHeatmapTotalCount className="text-green-700" />
                    <CalendarHeatmapLegend className="text-green-700" />
                </CalendarHeatmapFooter>
            </CalendarHeatmap>
        </TooltipProvider>
    );
}
