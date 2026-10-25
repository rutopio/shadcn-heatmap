"use client";

import { format, parseISO } from "date-fns";
import type { Activity } from "@/components/heatmap/calendar-heatmap";
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

const sampleData: Activity[] = [
  { date: "2025-01-01", value: 3 },
  { date: "2025-01-02", value: 7 },
  { date: "2025-01-03", value: 0 },
  // ... one entry per day
];

export function CalendarExample({ data = sampleData }: { data?: Activity[] }) {
  return (
    <TooltipProvider delay={0}>
      <CalendarHeatmap data={data}>
        <CalendarHeatmapBody>
          {({ activity, dayIndex, weekIndex }) => (
            <Tooltip>
              <TooltipTrigger
                tabIndex={0}
                render={
                  <CalendarHeatmapBlock
                    activity={activity}
                    dayIndex={dayIndex}
                    weekIndex={weekIndex}
                  />
                }
              />
              <TooltipContent
                side="top"
                className="pointer-events-none text-xs"
                sideOffset={6}
              >
                <p className="font-medium">
                  {format(parseISO(activity.date), "PPP")}
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
