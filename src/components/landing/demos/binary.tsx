import { format, parseISO } from "date-fns";

import {
  CalendarHeatmap,
  CalendarHeatmapBlock,
  CalendarHeatmapBody,
  CalendarHeatmapFooter,
  CalendarHeatmapLegend,
  CalendarHeatmapTotalCount,
} from "@/components/heatmap/calendar-heatmap";
import {
  DateHeatmap,
  DateHeatmapBlock,
  DateHeatmapBody,
  DateHeatmapFooter,
  DateHeatmapLegend,
} from "@/components/heatmap/date-heatmap";
import {
  WeekdayHeatmap,
  WeekdayHeatmapBlock,
  WeekdayHeatmapBody,
  WeekdayHeatmapFooter,
  WeekdayHeatmapLegend,
} from "@/components/heatmap/weekday-heatmap";
import calendarBinaryData from "@/data/calendar-binary.json";
import dateBinaryData from "@/data/date-binary.json";
import weekdayBinaryData from "@/data/weekday-binary.json";

import { HeatmapTooltip, TooltipProvider, WEEKDAY_NAMES } from "./shared";

export function CalendarBinaryDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <CalendarHeatmap
        data={calendarBinaryData}
        maxLevel={1}
        labels={{ legend: { less: "Missed", more: "Done" } }}
      >
        <CalendarHeatmapBody>
          {({ activity, dayIndex, weekIndex }) => (
            <HeatmapTooltip
              content={
                <>
                  <p className="font-medium">
                    {format(parseISO(activity.date), "PPP")}
                  </p>
                  <p className="text-muted-foreground">
                    {activity.value === 1 ? "Done" : "Missed"}
                  </p>
                </>
              }
            >
              <CalendarHeatmapBlock
                activity={activity}
                dayIndex={dayIndex}
                weekIndex={weekIndex}
              />
            </HeatmapTooltip>
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

export function WeekdayBinaryDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekdayBinaryData}
        maxLevel={1}
        colors={{ scale: "var(--color-chart-2)" }}
        labels={{ legend: { less: "Free", more: "Meeting" } }}
      >
        <WeekdayHeatmapBody hideAvgRow hideAvgColumn>
          {({ activity }) => (
            <HeatmapTooltip
              content={
                <>
                  <p className="font-medium">
                    {WEEKDAY_NAMES[activity.weekday]},{" "}
                    {`${String(activity.hour).padStart(2, "0")}:00`}
                  </p>
                  <p className="text-muted-foreground">
                    {activity.value === 1 ? "Meeting" : "Free"}
                  </p>
                </>
              }
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function DateBinaryDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap
        data={dateBinaryData}
        maxLevel={1}
        colors={{ scale: "var(--color-chart-3)" }}
        labels={{ legend: { less: "Down", more: "Up" } }}
      >
        <DateHeatmapBody hideSumColumn hideSumRow>
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                activity.date === "sum" ? (
                  <>
                    <p className="font-medium">
                      {`${String(activity.hour).padStart(2, "0")}:00`} total
                    </p>
                    <p className="text-muted-foreground">
                      {activity.value} days up
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">
                      {format(parseISO(activity.date), "MMM d")},{" "}
                      {`${String(activity.hour).padStart(2, "0")}:00`}
                    </p>
                    <p className="text-muted-foreground">
                      {activity.value === 1 ? "Up" : "Down"}
                    </p>
                  </>
                )
              }
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
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
