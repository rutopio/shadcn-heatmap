import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";

import {
    DateHeatmap,
    DateHeatmapBlock,
    DateHeatmapBody,
    DateHeatmapFooter,
    DateHeatmapLegend,
    DateHeatmapTotalCount,
} from "@/components/heatmap/date-heatmap";
import { generateDateSample } from "@/data/date-sample";

import { DateTooltipContent, HeatmapTooltip, TooltipProvider } from "./shared";

const dateData = generateDateSample(31, 14);

export function DateDefaultDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateHeatmap data={dateData}>
                <DateHeatmapBody>
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={<DateTooltipContent activity={activity} />}
                        >
                            <DateHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateHeatmapBody>
                <DateHeatmapFooter>
                    <DateHeatmapTotalCount />
                    <DateHeatmapLegend />
                </DateHeatmapFooter>
            </DateHeatmap>
        </TooltipProvider>
    );
}

export function DateTenLevelsDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateHeatmap data={dateData} maxLevel={10}>
                <DateHeatmapBody>
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={<DateTooltipContent activity={activity} />}
                        >
                            <DateHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateHeatmapBody>
                <DateHeatmapFooter>
                    <DateHeatmapLegend />
                </DateHeatmapFooter>
            </DateHeatmap>
        </TooltipProvider>
    );
}

export function DateIsoDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateHeatmap data={dateData} dateFormat="yyyy-MM-dd">
                <DateHeatmapBody>
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={<DateTooltipContent activity={activity} />}
                        >
                            <DateHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateHeatmapBody>
            </DateHeatmap>
        </TooltipProvider>
    );
}

export function DateSparseTicksDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateHeatmap
                data={dateData}
                labels={{
                    hours: Array.from({ length: 24 }, (_, i) =>
                        i % 6 === 0 ? String(i).padStart(2, "0") : "",
                    ),
                    endHour: null,
                }}
            >
                <DateHeatmapBody>
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={<DateTooltipContent activity={activity} />}
                        >
                            <DateHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateHeatmapBody>
            </DateHeatmap>
        </TooltipProvider>
    );
}

export function DateHideSumColumnDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateHeatmap data={dateData}>
                <DateHeatmapBody hideSumColumn>
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={<DateTooltipContent activity={activity} />}
                        >
                            <DateHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateHeatmapBody>
            </DateHeatmap>
        </TooltipProvider>
    );
}

export function DateNoLabelsDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateHeatmap data={dateData}>
                <DateHeatmapBody hideDateLabels hideHourLabels>
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={<DateTooltipContent activity={activity} />}
                        >
                            <DateHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateHeatmapBody>
            </DateHeatmap>
        </TooltipProvider>
    );
}

export function DateLargeBlocksDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateHeatmap data={dateData} blockSize={18} blockMargin={3}>
                <DateHeatmapBody>
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={<DateTooltipContent activity={activity} />}
                        >
                            <DateHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateHeatmapBody>
                <DateHeatmapFooter>
                    <DateHeatmapTotalCount />
                    <DateHeatmapLegend />
                </DateHeatmapFooter>
            </DateHeatmap>
        </TooltipProvider>
    );
}

export function Date12HourDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateHeatmap data={dateData} use12Hour>
                <DateHeatmapBody>
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={<DateTooltipContent activity={activity} />}
                        >
                            <DateHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateHeatmapBody>
                <DateHeatmapFooter>
                    <DateHeatmapTotalCount />
                    <DateHeatmapLegend />
                </DateHeatmapFooter>
            </DateHeatmap>
        </TooltipProvider>
    );
}

export function DateSpanishDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateHeatmap
                data={dateData}
                locale={es}
                labels={{
                    sum: "Total",
                    legend: { less: "Menos", more: "Más" },
                }}
            >
                <DateHeatmapBody>
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
                            <DateHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateHeatmapBody>
                <DateHeatmapFooter>
                    <DateHeatmapTotalCount>
                        {({ totalCount }) => (
                            <div className="text-muted-foreground">
                                {totalCount} contribuciones
                            </div>
                        )}
                    </DateHeatmapTotalCount>
                    <DateHeatmapLegend />
                </DateHeatmapFooter>
            </DateHeatmap>
        </TooltipProvider>
    );
}

export function DateCustomStylingDemo() {
    return (
        <TooltipProvider delayDuration={80} skipDelayDuration={0}>
            <DateHeatmap data={dateData} colors={{ scale: "#22c55e" }}>
                <DateHeatmapBody labelTextClass="text-green-700 font-bold">
                    {({ activity, dateIndex }) => (
                        <HeatmapTooltip
                            content={<DateTooltipContent activity={activity} />}
                        >
                            <DateHeatmapBlock
                                activity={activity}
                                dateIndex={dateIndex}
                            />
                        </HeatmapTooltip>
                    )}
                </DateHeatmapBody>
                <DateHeatmapFooter>
                    <DateHeatmapTotalCount className="text-green-700" />
                    <DateHeatmapLegend className="text-green-700" />
                </DateHeatmapFooter>
            </DateHeatmap>
        </TooltipProvider>
    );
}
