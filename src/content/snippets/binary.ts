export const binaryCalendarCode = `import {
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

// Binary data: value is strictly 0 (missed) or 1 (done)
const activities = [
  { date: "2025-01-01", value: 1 },
  { date: "2025-01-02", value: 0 },
  { date: "2025-01-03", value: 1 },
  // ... one entry per day
];

export function HabitTracker() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <CalendarHeatmap data={activities} levels={2}>
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
                  {format(parseISO(activity.date), "PPP")}
                </p>
                <p className="text-muted-foreground">
                  {activity.value === 1 ? "Done" : "Missed"}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </CalendarHeatmapBody>
        <CalendarHeatmapFooter>
          <CalendarHeatmapStat />
          <CalendarHeatmapLegend labels={{ less: "Missed", more: "Done" }} />
        </CalendarHeatmapFooter>
      </CalendarHeatmap>
    </TooltipProvider>
  );
}`;

export const binaryWeekdayCode = `import {
  WeekdayHeatmap,
  WeekdayHeatmapBlock,
  WeekdayHeatmapBody,
  WeekdayHeatmapFooter,
  WeekdayHeatmapLegend,
} from "@/components/heatmap/weekday-heatmap";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Binary data: value is strictly 0 (free) or 1 (has meeting)
const data = [
  { weekday: 1, hour:  9, value: 1 },  // Mon 09:00 — meeting
  { weekday: 1, hour: 10, value: 1 },  // Mon 10:00 — meeting
  { weekday: 1, hour: 11, value: 0 },  // Mon 11:00 — free
  { weekday: 1, hour: 14, value: 1 },  // Mon 14:00 — meeting
  // ... weekday 0–6, hour 0–23
];

export function MeetingSchedule() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={data}
        levels={2}
        colors={{ scale: "var(--color-chart-2)" }}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <WeekdayHeatmapBlock activity={activity} />
              </TooltipTrigger>
              <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
                <p className="font-medium">
                  {WEEKDAY_NAMES[activity.weekday]}{" "}
                  {\`\${String(activity.hour).padStart(2, "0")}:00\`}
                </p>
                <p className="text-muted-foreground">
                  {activity.value === 1 ? "Meeting" : "Free"}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapLegend labels={{ less: "Free", more: "Meeting" }} />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}`;

export const binaryDateCode = `import {
  DateHeatmap,
  DateHeatmapBlock,
  DateHeatmapBody,
  DateHeatmapFooter,
  DateHeatmapLegend,
} from "@/components/heatmap/date-heatmap";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, parseISO } from "date-fns";

// Binary data: value is strictly 0 (down) or 1 (up)
const data = [
  { date: "2025-12-01", hour:  0, value: 1 },
  { date: "2025-12-01", hour:  1, value: 1 },
  { date: "2025-12-03", hour:  2, value: 0 },  // maintenance
  { date: "2025-12-03", hour:  3, value: 0 },  // maintenance
  // ...
];

export function ServiceUptime() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap
        data={data}
        levels={2}
        colors={{ scale: "var(--color-chart-3)" }}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
              </TooltipTrigger>
              <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
                <p className="font-medium">
                  {format(parseISO(activity.date), "MMM d")},{" "}
                  {\`\${String(activity.hour).padStart(2, "0")}:00\`}
                </p>
                <p className="text-muted-foreground">
                  {activity.value === 1 ? "Up" : "Down"}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapLegend labels={{ less: "Down", more: "Up" }} />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}`;

export const binarySampleData = `// All three components accept the same data shapes as their regular counterparts.
// The only difference is that values are strictly 0 or 1.

// CalendarHeatmap binary: { date: string; value: 0 | 1 }
const calendarData = [
  { date: "2025-01-01", value: 1 },  // done
  { date: "2025-01-02", value: 0 },  // missed
  // ...
];

// WeekdayHeatmap binary: { weekday: number; hour: number; value: 0 | 1 }
const weekdayData = [
  { weekday: 1, hour:  9, value: 1 },  // Mon 09:00 — meeting
  { weekday: 1, hour: 11, value: 0 },  // Mon 11:00 — free
  // ...
];

// DateHeatmap binary: { date: string; hour: number; value: 0 | 1 }
const dateData = [
  { date: "2025-12-01", hour:  0, value: 1 },  // up
  { date: "2025-12-03", hour:  2, value: 0 },  // down (maintenance)
  // ...
];`;
