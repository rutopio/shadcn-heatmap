import type { VariantSpec } from "../types";

export const monthSampleData = `// type Activity = { date: string; count: number }

const activities: Activity[] = [
  { date: "2025-01-01", count: 3 },
  { date: "2025-01-02", count: 7 },
  { date: "2025-01-03", count: 0 },
  { date: "2025-01-04", count: 12 },
  { date: "2025-01-05", count: 1 },
  { date: "2025-01-06", count: 22 },
  { date: "2025-01-07", count: 15 },
  // ... one { date, count } per day
  // Missing dates are auto-filled with count: 0
  { date: "2025-12-30", count: 8 },
  { date: "2025-12-31", count: 5 },
];`;

export const monthBasicCode = `import {
  MonthContributionHeatmap,
  MonthContributionHeatmapBlock,
  MonthContributionHeatmapCalendar,
  MonthContributionHeatmapFooter,
  MonthContributionHeatmapLegend,
  MonthContributionHeatmapTotalCount,
} from "@/components/heatmap/month-contribution-heatmap";
import { format, parseISO } from "date-fns";

const activities = [
  { date: "2025-01-01", count: 3 },
  { date: "2025-01-02", count: 7 },
  { date: "2025-01-03", count: 0 },
  // ... one entry per day
];

export function YearContributions() {
  return (
    <MonthContributionHeatmap data={activities}>
      <MonthContributionHeatmapCalendar>
        {({ activity, dayIndex, weekIndex }) => (
          // Optionally wrap with Tooltip for hover details
          <MonthContributionHeatmapBlock
            activity={activity}
            dayIndex={dayIndex}
            weekIndex={weekIndex}
          />
        )}
      </MonthContributionHeatmapCalendar>
      <MonthContributionHeatmapFooter>
        <MonthContributionHeatmapTotalCount />
        <MonthContributionHeatmapLegend />
      </MonthContributionHeatmapFooter>
    </MonthContributionHeatmap>
  );
}`;

export const monthVariants: VariantSpec[] = [
  {
    title: "Monday-start week (ISO)",
    description:
      "Switch the left-hand weekday axis and grid alignment to start on Monday.",
    code: `<MonthContributionHeatmap data={activities} weekStart={1}>
  <MonthContributionHeatmapCalendar>
    {({ activity, dayIndex, weekIndex }) => (
      <MonthContributionHeatmapBlock
        activity={activity}
        dayIndex={dayIndex}
        weekIndex={weekIndex}
      />
    )}
  </MonthContributionHeatmapCalendar>
  <MonthContributionHeatmapFooter>
    <MonthContributionHeatmapTotalCount />
    <MonthContributionHeatmapLegend />
  </MonthContributionHeatmapFooter>
</MonthContributionHeatmap>`,
  },
  {
    title: "Empty column separators between months",
    description:
      "Insert a blank column between each month for a poster-style, calendar-aligned look.",
    code: `<MonthContributionHeatmap
  data={activities}
  continuousMonths={false}
>
  <MonthContributionHeatmapCalendar>
    {({ activity, dayIndex, weekIndex }) => (
      <MonthContributionHeatmapBlock
        activity={activity}
        dayIndex={dayIndex}
        weekIndex={weekIndex}
      />
    )}
  </MonthContributionHeatmapCalendar>
  <MonthContributionHeatmapFooter>
    <MonthContributionHeatmapTotalCount />
    <MonthContributionHeatmapLegend />
  </MonthContributionHeatmapFooter>
</MonthContributionHeatmap>`,
  },
  {
    title: "Binary on/off",
    description:
      "Two colours only — active or inactive. Useful when presence matters more than intensity.",
    code: `<MonthContributionHeatmap
  data={activities}
  maxLevel={1}
  labels={{
    legend: { less: "Disabled", more: "Enabled" },
  }}
>
  <MonthContributionHeatmapCalendar>
    {({ activity, dayIndex, weekIndex }) => (
      <MonthContributionHeatmapBlock
        activity={activity}
        dayIndex={dayIndex}
        weekIndex={weekIndex}
      />
    )}
  </MonthContributionHeatmapCalendar>
  <MonthContributionHeatmapFooter>
    <MonthContributionHeatmapTotalCount />
    <MonthContributionHeatmapLegend />
  </MonthContributionHeatmapFooter>
</MonthContributionHeatmap>`,
  },
  {
    title: "10 level intensity",
    description:
      "Expand the intensity scale to 10 levels for a more granular, detailed gradient.",
    code: `<MonthContributionHeatmap data={activities} maxLevel={10}>
  <MonthContributionHeatmapCalendar>
    {({ activity, dayIndex, weekIndex }) => (
      <MonthContributionHeatmapBlock
        activity={activity}
        dayIndex={dayIndex}
        weekIndex={weekIndex}
      />
    )}
  </MonthContributionHeatmapCalendar>
  <MonthContributionHeatmapFooter>
    <MonthContributionHeatmapTotalCount />
    <MonthContributionHeatmapLegend />
  </MonthContributionHeatmapFooter>
</MonthContributionHeatmap>`,
  },
  {
    title: "i18n labels (German)",
    description:
      "Pass a date-fns locale to auto-generate localised month and weekday labels. Use labels.totalCount template and labels.legend for custom text. Format tooltip dates with the locale.",
    code: `import { de } from "date-fns/locale";
import { format, parseISO } from "date-fns";

<MonthContributionHeatmap
  data={activities}
  locale={de}
  labels={{
    totalCount: "{{count}} Aktivitäten in {{year}}",
    legend: { less: "Weniger", more: "Mehr" },
  }}
>
  <MonthContributionHeatmapCalendar>
    {({ activity, dayIndex, weekIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <MonthContributionHeatmapBlock
            activity={activity}
            dayIndex={dayIndex}
            weekIndex={weekIndex}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">
            {format(parseISO(activity.date), "PPP", { locale: de })}
          </p>
          <p className="text-muted-foreground">
            {activity.count} Aktivität{activity.count !== 1 ? "en" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </MonthContributionHeatmapCalendar>
  <MonthContributionHeatmapFooter>
    <MonthContributionHeatmapTotalCount />
    <MonthContributionHeatmapLegend />
  </MonthContributionHeatmapFooter>
</MonthContributionHeatmap>`,
  },
  {
    title: "Large flat blocks",
    description:
      "Oversized blocks with tighter margin — a bold, grid-forward look.",
    code: `<MonthContributionHeatmap
  data={activities}
  blockSize={18}
  blockMargin={3}
>
  <MonthContributionHeatmapCalendar>
    {({ activity, dayIndex, weekIndex }) => (
      <MonthContributionHeatmapBlock
        activity={activity}
        dayIndex={dayIndex}
        weekIndex={weekIndex}
      />
    )}
  </MonthContributionHeatmapCalendar>
  <MonthContributionHeatmapFooter>
    <MonthContributionHeatmapTotalCount />
    <MonthContributionHeatmapLegend />
  </MonthContributionHeatmapFooter>
</MonthContributionHeatmap>`,
  },
  {
    title: "Multi-year timeline",
    description:
      "Feed activity spanning multiple years — each year auto-splits into its own row with separate statistics. Legend shown only on the last year.",
    code: `<MonthContributionHeatmap data={[...year2024, ...year2025]}>
  <MonthContributionHeatmapCalendar
    renderYearFooter={({ year, totalCount }) => {
      const isLastYear = year === 2025; // or detect from your data
      return (
        <MonthContributionHeatmapFooter>
          <div className="text-muted-foreground">
            {totalCount} contributions in {year}
          </div>
          {isLastYear && <MonthContributionHeatmapLegend />}
        </MonthContributionHeatmapFooter>
      );
    }}
  >
    {({ activity, dayIndex, weekIndex }) => (
      <MonthContributionHeatmapBlock
        activity={activity}
        dayIndex={dayIndex}
        weekIndex={weekIndex}
      />
    )}
  </MonthContributionHeatmapCalendar>
</MonthContributionHeatmap>`,
  },
  {
    title: "Calendar only (no footer)",
    description:
      "Omit the footer entirely for a minimal, distraction-free heatmap grid.",
    code: `<MonthContributionHeatmap data={activities}>
  <MonthContributionHeatmapCalendar>
    {({ activity, dayIndex, weekIndex }) => (
      <MonthContributionHeatmapBlock
        activity={activity}
        dayIndex={dayIndex}
        weekIndex={weekIndex}
      />
    )}
  </MonthContributionHeatmapCalendar>
</MonthContributionHeatmap>`,
  },
  {
    title: "Custom date format in tooltip",
    description:
      "Use date-fns format strings to customize how dates appear in tooltips. Use dateFormat prop or format manually.",
    code: `import { format, parseISO } from "date-fns";

<MonthContributionHeatmap data={activities} dateFormat="MMM d, yyyy">
  <MonthContributionHeatmapCalendar>
    {({ activity, dayIndex, weekIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <MonthContributionHeatmapBlock
            activity={activity}
            dayIndex={dayIndex}
            weekIndex={weekIndex}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">
            {format(parseISO(activity.date), "MMM d, yyyy")}
          </p>
          <p className="text-muted-foreground">
            {activity.count} contribution{activity.count !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </MonthContributionHeatmapCalendar>
  <MonthContributionHeatmapFooter>
    <MonthContributionHeatmapTotalCount />
    <MonthContributionHeatmapLegend />
  </MonthContributionHeatmapFooter>
</MonthContributionHeatmap>`,
  },
  {
    title: "Custom label styling",
    description:
      "Use labelClass to customize the appearance of month and weekday labels with Tailwind classes.",
    code: `<MonthContributionHeatmap data={activities}>
  <MonthContributionHeatmapCalendar labelClass="text-green-500 font-bold">
    {({ activity, dayIndex, weekIndex }) => (
      <MonthContributionHeatmapBlock
        activity={activity}
        dayIndex={dayIndex}
        weekIndex={weekIndex}
      />
    )}
  </MonthContributionHeatmapCalendar>
  <MonthContributionHeatmapFooter>
    <MonthContributionHeatmapTotalCount />
    <MonthContributionHeatmapLegend />
  </MonthContributionHeatmapFooter>
</MonthContributionHeatmap>`,
  },
];
