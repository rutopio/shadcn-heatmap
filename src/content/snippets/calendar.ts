import type { VariantSpec } from "../types";

export const calendarSampleData = `// type Activity = { date: string; value: number }

const activities: Activity[] = [
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
];`;

export const calendarBasicCode = `import {
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

const activities = [
  { date: "2025-01-01", value: 3 },
  { date: "2025-01-02", value: 7 },
  { date: "2025-01-03", value: 0 },
  // ... one entry per day
];

export function YearContributions() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <CalendarHeatmap data={activities}>
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
                <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
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
}`;

export const calendarVariants: VariantSpec[] = [
  {
    title: "Monday-start week (ISO)",
    description:
      "Switch the left-hand weekday axis and grid alignment to start on Monday.",
    code: `<CalendarHeatmap data={activities} weekStart={1}>
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
          <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
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
</CalendarHeatmap>`,
  },
  {
    title: "Month-aligned columns",
    description:
      "Each month starts at its own weekday-aligned column instead of flowing continuously — gives a traditional calendar feel.",
    code: `<CalendarHeatmap
  data={activities}
  continuousMonths={false}
>
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
          <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
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
</CalendarHeatmap>`,
  },
  {
    title: "10 level intensity",
    description:
      "Expand the intensity scale to 10 levels for a more granular, detailed gradient.",
    code: `<CalendarHeatmap data={activities} levels={10}>
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
          <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
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
</CalendarHeatmap>`,
  },
  {
    title: "i18n labels (German)",
    description:
      "Pass a date-fns locale to auto-generate localised month and weekday labels. Structural text (months/weekdays/legend) goes in the root labels; the footer stat text goes on `<CalendarHeatmapStat label=…>`.",
    code: `import { de } from "date-fns/locale";
import { format, parseISO } from "date-fns";

<CalendarHeatmap data={activities} locale={de}>
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
</CalendarHeatmap>`,
  },
  {
    title: "Large flat blocks",
    description:
      "Oversized blocks with tighter margin — a bold, grid-forward look.",
    code: `<CalendarHeatmap
  data={activities}
  blockSize={18}
  blockMargin={3}
>
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
          <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
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
</CalendarHeatmap>`,
  },
  {
    title: "Multi-year timeline",
    description:
      "Feed activity spanning multiple years — each year auto-splits into its own row with separate statistics. Legend shown only on the last year.",
    code: `<CalendarHeatmap data={[...year2024, ...year2025]}>
  <CalendarHeatmapBody
    renderYearFooter={({ year, totalCount }) => {
      const isLastYear = year === 2025; // or detect from your data
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
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
          <p className="text-muted-foreground">
            {activity.value} contribution{activity.value !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </CalendarHeatmapBody>
</CalendarHeatmap>`,
  },
  {
    title: "Calendar only (no footer)",
    description:
      "Omit the footer entirely for a minimal, distraction-free heatmap grid.",
    code: `<CalendarHeatmap data={activities}>
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
          <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
          <p className="text-muted-foreground">
            {activity.value} contribution{activity.value !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </CalendarHeatmapBody>
</CalendarHeatmap>`,
  },
  {
    title: "Custom date format in tooltip",
    description:
      "Use date-fns format strings inside the render-prop to customize how dates appear in tooltips.",
    code: `import { format, parseISO } from "date-fns";

<CalendarHeatmap data={activities}>
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
</CalendarHeatmap>`,
  },
  {
    title: "Custom styling",
    description:
      "Use colors to theme the blocks, labelClassName and yearClassName to style axis labels, and className on TotalCount and Legend to style the footer.",
    code: `<CalendarHeatmap data={activities} colors={{ scale: "var(--color-destructive)" }}>
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
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
          <p className="text-muted-foreground">
            {activity.value} contribution{activity.value !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </CalendarHeatmapBody>
  <CalendarHeatmapFooter>
    <CalendarHeatmapStat className="text-destructive" />
    <CalendarHeatmapLegend className="text-destructive" />
  </CalendarHeatmapFooter>
</CalendarHeatmap>`,
  },
];
