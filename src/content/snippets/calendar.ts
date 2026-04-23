export const calendarSampleData = `
// type Activity = { date: string; value: number }

const data: Activity[] = [
  { date: "2025-01-01", value: 3 },
  { date: "2025-01-02", value: 7 },
  { date: "2025-01-03", value: 0 },
  { date: "2025-01-04", value: 12 },
  { date: "2025-01-05", value: 1 },
  { date: "2025-01-06", value: 22 },
  { date: "2025-01-07", value: 15 },
  // ... one { date, value } per day
  // Missing dates are auto-filled with value: 0
  { date: "2025-12-30", value: 8 },
  { date: "2025-12-31", value: 5 },
]
`;

export const calendarBasicCode = `
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
import { format, parseISO } from "date-fns";

const data = [
  { date: "2025-01-01", value: 3 },
  { date: "2025-01-02", value: 7 },
  { date: "2025-01-03", value: 0 },
  // ... one entry per day
];

export function YearContributions() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <CalendarHeatmap data={data}>
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
`;
