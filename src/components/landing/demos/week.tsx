import { ja } from "date-fns/locale";

import {
    WeekContributionHeatmap,
    WeekContributionHeatmapBlock,
    WeekContributionHeatmapCalendar,
    WeekContributionHeatmapFooter,
    WeekContributionHeatmapLegend,
    WeekContributionHeatmapTotalCount,
} from "@/components/heatmap/week-contribution-heatmap";
import { generateWeekSample } from "@/data/week-sample";

import { HeatmapTooltip, TooltipProvider, WeekTooltipContent } from "./shared";

const weekData = generateWeekSample(17);

export function WeekDefaultDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <WeekContributionHeatmap data={weekData}>
                <WeekContributionHeatmapCalendar>
                    {({ activity }) => (
                        <HeatmapTooltip
                            content={<WeekTooltipContent activity={activity} />}
                        >
                            <WeekContributionHeatmapBlock activity={activity} />
                        </HeatmapTooltip>
                    )}
                </WeekContributionHeatmapCalendar>
                <WeekContributionHeatmapFooter>
                    <WeekContributionHeatmapTotalCount />
                    <WeekContributionHeatmapLegend />
                </WeekContributionHeatmapFooter>
            </WeekContributionHeatmap>
        </TooltipProvider>
    );
}

export function WeekMondayStartDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <WeekContributionHeatmap data={weekData} weekStart={1}>
                <WeekContributionHeatmapCalendar>
                    {({ activity }) => (
                        <HeatmapTooltip
                            content={<WeekTooltipContent activity={activity} />}
                        >
                            <WeekContributionHeatmapBlock activity={activity} />
                        </HeatmapTooltip>
                    )}
                </WeekContributionHeatmapCalendar>
            </WeekContributionHeatmap>
        </TooltipProvider>
    );
}

export function WeekMinimalTicksDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <WeekContributionHeatmap
                data={weekData}
                labels={{
                    hours: Array.from({ length: 24 }, (_, i) =>
                        i % 6 === 0 ? String(i).padStart(2, "0") : "",
                    ),
                    endHour: null,
                }}
            >
                <WeekContributionHeatmapCalendar>
                    {({ activity }) => (
                        <HeatmapTooltip
                            content={<WeekTooltipContent activity={activity} />}
                        >
                            <WeekContributionHeatmapBlock activity={activity} />
                        </HeatmapTooltip>
                    )}
                </WeekContributionHeatmapCalendar>
            </WeekContributionHeatmap>
        </TooltipProvider>
    );
}

export function WeekBinaryDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <WeekContributionHeatmap data={weekData} maxLevel={1}>
                <WeekContributionHeatmapCalendar>
                    {({ activity }) => (
                        <HeatmapTooltip
                            content={<WeekTooltipContent activity={activity} />}
                        >
                            <WeekContributionHeatmapBlock activity={activity} />
                        </HeatmapTooltip>
                    )}
                </WeekContributionHeatmapCalendar>
                <WeekContributionHeatmapFooter>
                    <WeekContributionHeatmapLegend />
                </WeekContributionHeatmapFooter>
            </WeekContributionHeatmap>
        </TooltipProvider>
    );
}

export function WeekThreeBucketsDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <WeekContributionHeatmap data={weekData} maxLevel={10}>
                <WeekContributionHeatmapCalendar>
                    {({ activity }) => (
                        <HeatmapTooltip
                            content={<WeekTooltipContent activity={activity} />}
                        >
                            <WeekContributionHeatmapBlock activity={activity} />
                        </HeatmapTooltip>
                    )}
                </WeekContributionHeatmapCalendar>
                <WeekContributionHeatmapFooter>
                    <WeekContributionHeatmapLegend />
                </WeekContributionHeatmapFooter>
            </WeekContributionHeatmap>
        </TooltipProvider>
    );
}

export function WeekJapaneseDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <WeekContributionHeatmap
                data={weekData}
                locale={ja}
                labels={{
                    sum: "合計",
                    legend: { less: "少ない", more: "多い" },
                }}
            >
                <WeekContributionHeatmapCalendar>
                    {({ activity }) => (
                        <HeatmapTooltip
                            content={<WeekTooltipContent activity={activity} />}
                        >
                            <WeekContributionHeatmapBlock activity={activity} />
                        </HeatmapTooltip>
                    )}
                </WeekContributionHeatmapCalendar>
                <WeekContributionHeatmapFooter>
                    <WeekContributionHeatmapTotalCount>
                        {({ totalCount }) => (
                            <div className="text-muted-foreground">
                                {totalCount} 件の活動
                            </div>
                        )}
                    </WeekContributionHeatmapTotalCount>
                    <WeekContributionHeatmapLegend />
                </WeekContributionHeatmapFooter>
            </WeekContributionHeatmap>
        </TooltipProvider>
    );
}

export function WeekCompactDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <WeekContributionHeatmap data={weekData} blockSize={18} blockMargin={3}>
                <WeekContributionHeatmapCalendar>
                    {({ activity }) => (
                        <HeatmapTooltip
                            content={<WeekTooltipContent activity={activity} />}
                        >
                            <WeekContributionHeatmapBlock activity={activity} />
                        </HeatmapTooltip>
                    )}
                </WeekContributionHeatmapCalendar>
            </WeekContributionHeatmap>
        </TooltipProvider>
    );
}

export function WeekHideSumDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <WeekContributionHeatmap data={weekData}>
                <WeekContributionHeatmapCalendar hideSumColumn hideSumRow>
                    {({ activity }) => (
                        <HeatmapTooltip
                            content={<WeekTooltipContent activity={activity} />}
                        >
                            <WeekContributionHeatmapBlock activity={activity} />
                        </HeatmapTooltip>
                    )}
                </WeekContributionHeatmapCalendar>
                <WeekContributionHeatmapFooter>
                    <WeekContributionHeatmapLegend />
                </WeekContributionHeatmapFooter>
            </WeekContributionHeatmap>
        </TooltipProvider>
    );
}

export function WeekMiniDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <WeekContributionHeatmap data={weekData}>
                <WeekContributionHeatmapCalendar hideHourLabels hideWeekdayLabels>
                    {({ activity }) => (
                        <HeatmapTooltip
                            content={<WeekTooltipContent activity={activity} />}
                        >
                            <WeekContributionHeatmapBlock activity={activity} />
                        </HeatmapTooltip>
                    )}
                </WeekContributionHeatmapCalendar>
            </WeekContributionHeatmap>
        </TooltipProvider>
    );
}

export function WeekLargeBlocksDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <WeekContributionHeatmap data={weekData} blockSize={18} blockMargin={3}>
                <WeekContributionHeatmapCalendar>
                    {({ activity }) => (
                        <HeatmapTooltip
                            content={<WeekTooltipContent activity={activity} />}
                        >
                            <WeekContributionHeatmapBlock activity={activity} />
                        </HeatmapTooltip>
                    )}
                </WeekContributionHeatmapCalendar>
            </WeekContributionHeatmap>
        </TooltipProvider>
    );
}

export function Week12HourDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <WeekContributionHeatmap data={weekData} use12Hour>
                <WeekContributionHeatmapCalendar>
                    {({ activity }) => (
                        <HeatmapTooltip
                            content={<WeekTooltipContent activity={activity} />}
                        >
                            <WeekContributionHeatmapBlock activity={activity} />
                        </HeatmapTooltip>
                    )}
                </WeekContributionHeatmapCalendar>
                <WeekContributionHeatmapFooter>
                    <WeekContributionHeatmapLegend />
                </WeekContributionHeatmapFooter>
            </WeekContributionHeatmap>
        </TooltipProvider>
    );
}

export function WeekCustomLabelDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <WeekContributionHeatmap data={weekData}>
                <WeekContributionHeatmapCalendar labelTextClass="text-green-500 font-bold">
                    {({ activity }) => (
                        <HeatmapTooltip
                            content={<WeekTooltipContent activity={activity} />}
                        >
                            <WeekContributionHeatmapBlock activity={activity} />
                        </HeatmapTooltip>
                    )}
                </WeekContributionHeatmapCalendar>
                <WeekContributionHeatmapFooter>
                    <WeekContributionHeatmapTotalCount />
                    <WeekContributionHeatmapLegend />
                </WeekContributionHeatmapFooter>
            </WeekContributionHeatmap>
        </TooltipProvider>
    );
}
