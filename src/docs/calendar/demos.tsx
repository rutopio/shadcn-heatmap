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

function CalendarTooltip({
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

export function CalendarDefaultDemo() {
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
              <CalendarTooltip activity={activity} />
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

export function CalendarMondayStartDemo() {
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
              <CalendarTooltip activity={activity} />
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

export function CalendarChunkyDemo() {
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
              <CalendarTooltip activity={activity} />
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

export function CalendarBinaryDemo() {
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

export function CalendarTenLevelsDemo() {
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
              <CalendarTooltip activity={activity} />
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

export function CalendarGermanDemo() {
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

const calendarMultiYear = multiYearData;

const multiYearYears = [2024, 2025];

export function CalendarMultiYearDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <CalendarHeatmap data={calendarMultiYear}>
        <CalendarHeatmapBody
          renderYearFooter={({ year, totalCount }) => {
            const isLastYear = year === Math.max(...multiYearYears);
            return (
              <CalendarHeatmapFooter>
                <CalendarHeatmapStat>
                  {() => `${totalCount} contributions in ${year}`}
                </CalendarHeatmapStat>
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
              <CalendarTooltip activity={activity} />
            </Tooltip>
          )}
        </CalendarHeatmapBody>
      </CalendarHeatmap>
    </TooltipProvider>
  );
}

export function CalendarNoFooterDemo() {
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
              <CalendarTooltip activity={activity} />
            </Tooltip>
          )}
        </CalendarHeatmapBody>
      </CalendarHeatmap>
    </TooltipProvider>
  );
}

export function CalendarMiniDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <CalendarHeatmap data={monthData}>
        <CalendarHeatmapBody hideMonthLabels hideWeekdayLabels hideYearLabels>
          {({ activity, dayIndex, weekIndex }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <CalendarHeatmapBlock
                  activity={activity}
                  dayIndex={dayIndex}
                  weekIndex={weekIndex}
                />
              </TooltipTrigger>
              <CalendarTooltip activity={activity} />
            </Tooltip>
          )}
        </CalendarHeatmapBody>
      </CalendarHeatmap>
    </TooltipProvider>
  );
}

export function CalendarCustomTooltipDemo() {
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
                className="pointer-events-none"
                sideOffset={6}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold">
                    {format(parseISO(activity.date), "EEEE, MMM d")}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none">
                      {activity.value === 0
                        ? "😴"
                        : activity.value < 3
                          ? "🌱"
                          : activity.value < 7
                            ? "🔥"
                            : "⚡"}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {activity.value} contribution
                      {activity.value !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
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

export function CalendarCustomStylingDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <CalendarHeatmap
        data={monthData}
        blockSize={18}
        blockMargin={3}
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
              <CalendarTooltip activity={activity} />
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
