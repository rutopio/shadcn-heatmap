import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";

import {
  CalendarHeatmap,
  CalendarHeatmapBlock,
  CalendarHeatmapBody,
  CalendarHeatmapFooter,
  CalendarHeatmapLegend,
  CalendarHeatmapStat,
} from "@/components/heatmap/calendar-heatmap";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import multiYearData from "@/data/calendar-multi-year.json";
import monthData from "@/data/calendar-sample.json";

function MonthTooltip({
  activity,
}: {
  activity: { date: string; value: number };
}) {
  return (
    <TooltipContent
      side="top"
      className="pointer-events-none text-xs"
      sideOffset={6}
    >
      <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
      <p className="text-muted-foreground">
        {activity.value} contribution{activity.value !== 1 ? "s" : ""}
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
          <CalendarHeatmapStat />
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
          <CalendarHeatmapStat />
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
          <CalendarHeatmapStat />
          <CalendarHeatmapLegend />
        </CalendarHeatmapFooter>
      </CalendarHeatmap>
    </TooltipProvider>
  );
}

export function MonthBinaryDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <CalendarHeatmap data={monthData} levels={2}>
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
              <TooltipContent
                side="top"
                className="pointer-events-none text-xs"
                sideOffset={6}
              >
                <p className="font-medium">
                  {format(parseISO(activity.date), "PPP")}
                </p>
                <p className="text-muted-foreground">
                  {activity.value > 0 ? "Enabled" : "Disabled"}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </CalendarHeatmapBody>
        <CalendarHeatmapFooter>
          <CalendarHeatmapStat />
          <CalendarHeatmapLegend
            labels={{ less: "Disabled", more: "Enabled" }}
          />
        </CalendarHeatmapFooter>
      </CalendarHeatmap>
    </TooltipProvider>
  );
}

export function MonthTenLevelsDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <CalendarHeatmap data={monthData} levels={10}>
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
          <CalendarHeatmapStat />
          <CalendarHeatmapLegend />
        </CalendarHeatmapFooter>
      </CalendarHeatmap>
    </TooltipProvider>
  );
}

export function MonthGermanDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <CalendarHeatmap data={monthData} locale={de}>
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
              <TooltipContent
                side="top"
                className="pointer-events-none text-xs"
                sideOffset={6}
              >
                <p className="font-medium">
                  {format(parseISO(activity.date), "PPP", { locale: de })}
                </p>
                <p className="text-muted-foreground">
                  {activity.value} Aktivität{activity.value !== 1 ? "en" : ""}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </CalendarHeatmapBody>
        <CalendarHeatmapFooter>
          <CalendarHeatmapStat label="{{value}} Aktivitäten in {{year}}" />
          <CalendarHeatmapLegend labels={{ less: "Weniger", more: "Mehr" }} />
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
          <CalendarHeatmapStat />
          <CalendarHeatmapLegend />
        </CalendarHeatmapFooter>
      </CalendarHeatmap>
    </TooltipProvider>
  );
}

const monthMultiYear = multiYearData;

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
              <TooltipContent
                side="top"
                className="pointer-events-none text-xs"
                sideOffset={6}
              >
                <p className="font-medium">
                  {format(parseISO(activity.date), "MMM d, yyyy")}
                </p>
                <p className="text-muted-foreground">
                  {activity.value} contribution{activity.value !== 1 ? "s" : ""}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </CalendarHeatmapBody>
        <CalendarHeatmapFooter>
          <CalendarHeatmapStat />
          <CalendarHeatmapLegend />
        </CalendarHeatmapFooter>
      </CalendarHeatmap>
    </TooltipProvider>
  );
}

export function MonthCustomStylingDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <CalendarHeatmap
        data={monthData}
        colors={{ scale: "var(--color-destructive)" }}
      >
        <CalendarHeatmapBody
          labelClassName="text-destructive font-bold"
          yearClassName="text-destructive font-bold"
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
          <CalendarHeatmapStat className="text-destructive" />
          <CalendarHeatmapLegend className="text-destructive" />
        </CalendarHeatmapFooter>
      </CalendarHeatmap>
    </TooltipProvider>
  );
}
