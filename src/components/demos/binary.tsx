import { format, parseISO } from "date-fns";

import {
  CalendarHeatmap,
  CalendarHeatmapBlock,
  CalendarHeatmapBody,
  CalendarHeatmapFooter,
  CalendarHeatmapLegend,
  CalendarHeatmapStat,
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
        levels={2}
        colors={{ scale: "var(--color-chart-3)" }}
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
          <CalendarHeatmapStat />
          <CalendarHeatmapLegend labels={{ less: "Missed", more: "Done" }} />
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
        levels={2}
        colors={{ scale: "var(--color-chart-2)" }}
      >
        <WeekdayHeatmapBody>
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
          <WeekdayHeatmapLegend labels={{ less: "Free", more: "Meeting" }} />
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
        levels={2}
        colors={{ scale: "var(--color-chart-1)" }}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <>
                  <p className="font-medium">
                    {format(parseISO(activity.date), "MMM d")},{" "}
                    {`${String(activity.hour).padStart(2, "0")}:00`}
                  </p>
                  <p className="text-muted-foreground">
                    {activity.value === 1 ? "Pass" : "Failed"}
                  </p>
                </>
              }
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapLegend labels={{ less: "Failed", more: "Pass" }} />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}
