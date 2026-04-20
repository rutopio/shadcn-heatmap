import type { VariantSpec } from "../types";

export const dateSampleData = `// type DateHourlyActivity = { date: string; hour: number; count: number }
//   date: "YYYY-MM-DD", "sum" = hourly Sum row
//   hour: 0–23,  24 = daily Sum column
//   count: number (e.g. seconds)

const data: DateHourlyActivity[] = [
  // Regular cells (one row per date × 24 hours)
  { date: "2025-12-11", hour: 8,  count: 300 },
  { date: "2025-12-11", hour: 9,  count: 1200 },
  { date: "2025-12-11", hour: 10, count: 2400 },
  { date: "2025-12-11", hour: 14, count: 1800 },
  { date: "2025-12-12", hour: 9,  count: 600 },
  { date: "2025-12-12", hour: 10, count: 900 },
  // ...

  // Daily Sum column (hour = 24) — total across all hours for that date
  { date: "2025-12-11", hour: 24, count: 28800 },
  { date: "2025-12-12", hour: 24, count: 14400 },
  // ...

  // Hourly Sum row (date = "sum") — total across all dates for each hour
  { date: "sum", hour: 8,  count: 4200 },
  { date: "sum", hour: 9,  count: 8400 },
  // ...
];`;

export const dateBasicCode = `import {
  DateContributionHeatmap,
  DateContributionHeatmapBlock,
  DateContributionHeatmapCalendar,
  DateContributionHeatmapFooter,
  DateContributionHeatmapLegend,
  DateContributionHeatmapTotalCount,
} from "@/components/heatmap/date-contribution-heatmap";

const data = [
  { date: "2025-12-11", hour: 9,  count: 1200 },
  { date: "2025-12-11", hour: 10, count: 2400 },
  { date: "2025-12-11", hour: 24, count: 28800 }, // daily sum
  { date: "2025-12-12", hour: 8,  count: 600 },
  // ...
];

export function DateHourlyUsage() {
  return (
    <DateContributionHeatmap data={data}>
      <DateContributionHeatmapCalendar>
        {({ activity, dateIndex }) => (
          <DateContributionHeatmapBlock
            activity={activity}
            dateIndex={dateIndex}
          />
        )}
      </DateContributionHeatmapCalendar>
      <DateContributionHeatmapFooter>
        <DateContributionHeatmapTotalCount />
        <DateContributionHeatmapLegend />
      </DateContributionHeatmapFooter>
    </DateContributionHeatmap>
  );
}`;

export const dateVariants: VariantSpec[] = [
  {
    title: "Ten levels",
    description:
      "Expand the intensity scale to 10 levels for fine-grained differentiation of high-frequency data.",
    code: `<DateContributionHeatmap data={data} maxLevel={10}>
  <DateContributionHeatmapCalendar>
    {({ activity, dateIndex }) => (
      <DateContributionHeatmapBlock
        activity={activity}
        dateIndex={dateIndex}
      />
    )}
  </DateContributionHeatmapCalendar>
  <DateContributionHeatmapFooter>
    <DateContributionHeatmapLegend />
  </DateContributionHeatmapFooter>
</DateContributionHeatmap>`,
  },
  {
    title: "Custom date format",
    description:
      "Switch the left-axis labels to ISO format for non-US audiences.",
    code: `<DateContributionHeatmap data={data} dateFormat="yyyy-MM-dd">
  <DateContributionHeatmapCalendar>
    {({ activity, dateIndex }) => (
      <DateContributionHeatmapBlock
        activity={activity}
        dateIndex={dateIndex}
      />
    )}
  </DateContributionHeatmapCalendar>
</DateContributionHeatmap>`,
  },
  {
    title: "Minimal hour ticks",
    description:
      "Only show the 00 / 06 / 12 / 18 axis labels and drop the trailing tick.",
    code: `<DateContributionHeatmap
  data={data}
  labels={{
    hours: Array.from({ length: 24 }, (_, i) =>
      i % 6 === 0 ? String(i).padStart(2, "0") : ""
    ),
    endHour: null,
  }}
>
  <DateContributionHeatmapCalendar>
    {({ activity, dateIndex }) => (
      <DateContributionHeatmapBlock
        activity={activity}
        dateIndex={dateIndex}
      />
    )}
  </DateContributionHeatmapCalendar>
</DateContributionHeatmap>`,
  },
  {
    title: "Hide Sum column",
    description:
      "Remove the daily total column for a pure 24-hour grid without the aggregate.",
    code: `<DateContributionHeatmap data={data}>
  <DateContributionHeatmapCalendar hideSumColumn>
    {({ activity, dateIndex }) => (
      <DateContributionHeatmapBlock
        activity={activity}
        dateIndex={dateIndex}
      />
    )}
  </DateContributionHeatmapCalendar>
</DateContributionHeatmap>`,
  },
  {
    title: "Hide axes for embedding",
    description:
      "Strip all labels for tight embeds like tooltips or card thumbnails.",
    code: `<DateContributionHeatmap data={data}>
  <DateContributionHeatmapCalendar hideDateLabels hideHourLabels>
    {({ activity, dateIndex }) => (
      <DateContributionHeatmapBlock
        activity={activity}
        dateIndex={dateIndex}
      />
    )}
  </DateContributionHeatmapCalendar>
</DateContributionHeatmap>`,
  },
  {
    title: "Large flat blocks",
    description:
      "Bigger blocks with tighter margin — more visual weight for focused views.",
    code: `<DateContributionHeatmap data={data} blockSize={18} blockMargin={3}>
  <DateContributionHeatmapCalendar>
    {({ activity, dateIndex }) => (
      <DateContributionHeatmapBlock
        activity={activity}
        dateIndex={dateIndex}
      />
    )}
  </DateContributionHeatmapCalendar>
  <DateContributionHeatmapFooter>
    <DateContributionHeatmapTotalCount />
    <DateContributionHeatmapLegend />
  </DateContributionHeatmapFooter>
</DateContributionHeatmap>`,
  },
  {
    title: "12-hour axis labels",
    description:
      "Switch the hour axis to 12-hour AM/PM format with a single prop.",
    code: `<DateContributionHeatmap data={data} use12Hour>
  <DateContributionHeatmapCalendar>
    {({ activity, dateIndex }) => (
      <DateContributionHeatmapBlock
        activity={activity}
        dateIndex={dateIndex}
      />
    )}
  </DateContributionHeatmapCalendar>
  <DateContributionHeatmapFooter>
    <DateContributionHeatmapTotalCount />
    <DateContributionHeatmapLegend />
  </DateContributionHeatmapFooter>
</DateContributionHeatmap>`,
  },
  {
    title: "i18n labels (Spanish)",
    description:
      "Pass a date-fns locale to auto-generate localised date labels, plus custom sum column label, legend, and total count text. Format tooltip dates accordingly.",
    code: `import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";

<DateContributionHeatmap
  data={data}
  locale={es}
  labels={{
    sum: "Total",
    legend: { less: "Menos", more: "Más" },
  }}
>
  <DateContributionHeatmapCalendar>
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateContributionHeatmapBlock
            activity={activity}
            dateIndex={dateIndex}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">
            {format(parseISO(activity.date), "PPP", { locale: es })}
            {" "}
            {activity.hour === 24
              ? "Total"
              : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.count} contribución{activity.count !== 1 ? "es" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </DateContributionHeatmapCalendar>
  <DateContributionHeatmapFooter>
    <DateContributionHeatmapTotalCount>
      {({ totalCount }) => (
        <div className="text-muted-foreground">
          {totalCount} contribuciones
        </div>
      )}
    </DateContributionHeatmapTotalCount>
    <DateContributionHeatmapLegend />
  </DateContributionHeatmapFooter>
</DateContributionHeatmap>`,
  },
  {
    title: "Custom label styling",
    description:
      "Use labelClass to customize the appearance of date and hour labels with Tailwind classes.",
    code: `<DateContributionHeatmap data={data}>
  <DateContributionHeatmapCalendar labelClass="text-green-500 font-bold">
    {({ activity, dateIndex }) => (
      <DateContributionHeatmapBlock
        activity={activity}
        dateIndex={dateIndex}
      />
    )}
  </DateContributionHeatmapCalendar>
  <DateContributionHeatmapFooter>
    <DateContributionHeatmapTotalCount />
    <DateContributionHeatmapLegend />
  </DateContributionHeatmapFooter>
</DateContributionHeatmap>`,
  },
];
