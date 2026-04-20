import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";

import {
    DateContributionHeatmap,
    DateContributionHeatmapBlock,
    DateContributionHeatmapCalendar,
    DateContributionHeatmapFooter,
    DateContributionHeatmapLegend,
    DateContributionHeatmapTotalCount,
} from "@/components/heatmap/date-contribution-heatmap";
import { generateDateSample } from "@/data/date-sample";

import { DateTooltipContent, HeatmapTooltip, TooltipProvider } from "./shared";

const dateData = generateDateSample(31, 14);

export function DateDefaultDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateContributionHeatmap data={dateData}>
                <DateContributionHeatmapCalendar>
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={<DateTooltipContent activity={activity} />}
                        >
                            <DateContributionHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateContributionHeatmapCalendar>
                <DateContributionHeatmapFooter>
                    <DateContributionHeatmapTotalCount />
                    <DateContributionHeatmapLegend />
                </DateContributionHeatmapFooter>
            </DateContributionHeatmap>
        </TooltipProvider>
    );
}

export function DateTenLevelsDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateContributionHeatmap data={dateData} maxLevel={10}>
                <DateContributionHeatmapCalendar>
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={<DateTooltipContent activity={activity} />}
                        >
                            <DateContributionHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateContributionHeatmapCalendar>
                <DateContributionHeatmapFooter>
                    <DateContributionHeatmapLegend />
                </DateContributionHeatmapFooter>
            </DateContributionHeatmap>
        </TooltipProvider>
    );
}

export function DateIsoDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateContributionHeatmap data={dateData} dateFormat="yyyy-MM-dd">
                <DateContributionHeatmapCalendar>
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={<DateTooltipContent activity={activity} />}
                        >
                            <DateContributionHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateContributionHeatmapCalendar>
            </DateContributionHeatmap>
        </TooltipProvider>
    );
}

export function DateSparseTicksDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateContributionHeatmap
                data={dateData}
                labels={{
                    hours: Array.from({ length: 24 }, (_, i) =>
                        i % 6 === 0 ? String(i).padStart(2, "0") : "",
                    ),
                    endHour: null,
                }}
            >
                <DateContributionHeatmapCalendar>
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={<DateTooltipContent activity={activity} />}
                        >
                            <DateContributionHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateContributionHeatmapCalendar>
            </DateContributionHeatmap>
        </TooltipProvider>
    );
}

export function DateHideSumColumnDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateContributionHeatmap data={dateData}>
                <DateContributionHeatmapCalendar hideSumColumn>
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={<DateTooltipContent activity={activity} />}
                        >
                            <DateContributionHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateContributionHeatmapCalendar>
            </DateContributionHeatmap>
        </TooltipProvider>
    );
}

export function DateNoLabelsDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateContributionHeatmap data={dateData}>
                <DateContributionHeatmapCalendar hideDateLabels hideHourLabels>
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={<DateTooltipContent activity={activity} />}
                        >
                            <DateContributionHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateContributionHeatmapCalendar>
            </DateContributionHeatmap>
        </TooltipProvider>
    );
}

export function DateLargeBlocksDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateContributionHeatmap data={dateData} blockSize={18} blockMargin={3}>
                <DateContributionHeatmapCalendar>
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={<DateTooltipContent activity={activity} />}
                        >
                            <DateContributionHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateContributionHeatmapCalendar>
                <DateContributionHeatmapFooter>
                    <DateContributionHeatmapTotalCount />
                    <DateContributionHeatmapLegend />
                </DateContributionHeatmapFooter>
            </DateContributionHeatmap>
        </TooltipProvider>
    );
}

export function Date12HourDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateContributionHeatmap data={dateData} use12Hour>
                <DateContributionHeatmapCalendar>
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={<DateTooltipContent activity={activity} />}
                        >
                            <DateContributionHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateContributionHeatmapCalendar>
                <DateContributionHeatmapFooter>
                    <DateContributionHeatmapTotalCount />
                    <DateContributionHeatmapLegend />
                </DateContributionHeatmapFooter>
            </DateContributionHeatmap>
        </TooltipProvider>
    );
}

export function DateSpanishDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateContributionHeatmap
                data={dateData}
                locale={es}
                labels={{
                    sum: "Total",
                    legend: { less: "Menos", more: "Más" },
                }}
            >
                <DateContributionHeatmapCalendar>
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={
                                <>
                                    <p className="font-medium">
                                        {activity.date === "sum"
                                            ? "Total"
                                            : format(parseISO(activity.date), "PPP", { locale: es })}
                                        {" "}
                                        {activity.hour === 24
                                            ? "Total"
                                            : `${String(activity.hour).padStart(2, "0")}:00`}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {activity.count} contribución{activity.count !== 1 ? "es" : ""}
                                    </p>
                                </>
                            }
                        >
                            <DateContributionHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateContributionHeatmapCalendar>
                <DateContributionHeatmapFooter>
                    <DateContributionHeatmapTotalCount>
                        {({ totalCount }) => (
                            <div className="text-muted-foreground">
                                {totalCount} contribuciones
                            </div>
                        )}
                    </DateContributionHeatmapTotalCount>
                    <DateContributionHeatmapLegend />
                </DateContributionHeatmapFooter>
            </DateContributionHeatmap>
        </TooltipProvider>
    );
}

export function DateCustomLabelDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateContributionHeatmap data={dateData}>
                <DateContributionHeatmapCalendar labelTextClass="text-green-500 font-bold">
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={<DateTooltipContent activity={activity} />}
                        >
                            <DateContributionHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateContributionHeatmapCalendar>
                <DateContributionHeatmapFooter>
                    <DateContributionHeatmapTotalCount />
                    <DateContributionHeatmapLegend />
                </DateContributionHeatmapFooter>
            </DateContributionHeatmap>
        </TooltipProvider>
    );
}
