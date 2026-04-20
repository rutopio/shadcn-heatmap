import type { VariantSpec } from "../types";

export const weekSampleData = `// type HeatmapActivity = { weekday: number; hour: number; count: number }
//   weekday: 0–6 (Sun–Sat), 7 = hourly Sum row
//   hour:    0–23,           24 = daily Sum column

const data: HeatmapActivity[] = [
  // Regular cells (7 weekdays × 24 hours)
  { weekday: 0, hour: 9,  count: 600 },   // Sun 09:00
  { weekday: 1, hour: 9,  count: 1200 },  // Mon 09:00
  { weekday: 1, hour: 10, count: 2400 },  // Mon 10:00
  { weekday: 5, hour: 14, count: 1800 },  // Fri 14:00
  // ...

  // Daily Sum column (hour = 24) — total across all hours for each weekday
  { weekday: 0, hour: 24, count: 3600 },
  { weekday: 1, hour: 24, count: 28800 },
  // ...

  // Hourly Sum row (weekday = 7) — total across all weekdays for each hour
  { weekday: 7, hour: 9,  count: 8400 },
  { weekday: 7, hour: 10, count: 9600 },
  // ...
];`;

export const weekBasicCode = `import {
  WeekContributionHeatmap,
  WeekContributionHeatmapBlock,
  WeekContributionHeatmapCalendar,
  WeekContributionHeatmapFooter,
  WeekContributionHeatmapLegend,
  WeekContributionHeatmapTotalCount,
} from "@/components/heatmap/week-contribution-heatmap";

const data = [
  // Regular cells — weekday 0..6, hour 0..23
  { weekday: 1, hour: 9,  count: 1200 },
  { weekday: 1, hour: 10, count: 2400 },
  // Daily Sum column — hour = 24
  { weekday: 1, hour: 24, count: 28800 },
  // Hourly Sum row — weekday = 7
  { weekday: 7, hour: 10, count: 8400 },
  // ...
];

export function WeeklyRhythm() {
  return (
    <WeekContributionHeatmap data={data}>
      <WeekContributionHeatmapCalendar>
        {({ activity }) => (
          <WeekContributionHeatmapBlock activity={activity} />
        )}
      </WeekContributionHeatmapCalendar>
      <WeekContributionHeatmapFooter>
        <WeekContributionHeatmapTotalCount />
        <WeekContributionHeatmapLegend />
      </WeekContributionHeatmapFooter>
    </WeekContributionHeatmap>
  );
}`;

export const weekVariants: VariantSpec[] = [
  {
    title: "Monday-start week (ISO)",
    description:
      "Rotate the weekday axis to start on Monday instead of Sunday.",
    code: `<WeekContributionHeatmap data={data} weekStart={1}>
  <WeekContributionHeatmapCalendar>
    {({ activity }) => (
      <WeekContributionHeatmapBlock activity={activity} />
    )}
  </WeekContributionHeatmapCalendar>
</WeekContributionHeatmap>`,
  },
  {
    title: "Minimal hour ticks",
    description:
      "Only label every 6th hour (00 / 06 / 12 / 18) and drop the trailing tick to reduce axis noise.",
    code: `<WeekContributionHeatmap
  data={data}
  labels={{
    hours: Array.from({ length: 24 }, (_, i) =>
      i % 6 === 0 ? String(i).padStart(2, "0") : ""
    ),
    endHour: null,
  }}
>
  <WeekContributionHeatmapCalendar>
    {({ activity }) => (
      <WeekContributionHeatmapBlock activity={activity} />
    )}
  </WeekContributionHeatmapCalendar>
</WeekContributionHeatmap>`,
  },
  {
    title: "Binary on/off",
    description:
      "Two colours only — active or inactive. Useful when presence matters more than intensity.",
    code: `<WeekContributionHeatmap data={data} maxLevel={1}>
  <WeekContributionHeatmapCalendar>
    {({ activity }) => (
      <WeekContributionHeatmapBlock activity={activity} />
    )}
  </WeekContributionHeatmapCalendar>
  <WeekContributionHeatmapFooter>
    <WeekContributionHeatmapLegend />
  </WeekContributionHeatmapFooter>
</WeekContributionHeatmap>`,
  },
  {
    title: "Ten levels",
    description:
      "Expand the intensity scale to 10 levels for fine-grained differentiation of high-frequency data.",
    code: `<WeekContributionHeatmap data={data} maxLevel={10}>
  <WeekContributionHeatmapCalendar>
    {({ activity }) => (
      <WeekContributionHeatmapBlock activity={activity} />
    )}
  </WeekContributionHeatmapCalendar>
  <WeekContributionHeatmapFooter>
    <WeekContributionHeatmapLegend />
  </WeekContributionHeatmapFooter>
</WeekContributionHeatmap>`,
  },
  {
    title: "i18n labels (Japanese)",
    description:
      "Pass a date-fns locale to auto-generate localised weekday labels.",
    code: `import { ja } from "date-fns/locale";

<WeekContributionHeatmap data={data} locale={ja}>
  <WeekContributionHeatmapCalendar>
    {({ activity }) => (
      <WeekContributionHeatmapBlock activity={activity} />
    )}
  </WeekContributionHeatmapCalendar>
  <WeekContributionHeatmapFooter>
    <WeekContributionHeatmapLegend />
  </WeekContributionHeatmapFooter>
</WeekContributionHeatmap>`,
  },
  {
    title: "Compact layout",
    description:
      "Large blocks with full corner radius — a pill-shaped grid ideal for dense dashboards.",
    code: `<WeekContributionHeatmap data={data} blockSize={18} blockMargin={3}>
  <WeekContributionHeatmapCalendar>
    {({ activity }) => (
      <WeekContributionHeatmapBlock activity={activity} />
    )}
  </WeekContributionHeatmapCalendar>
</WeekContributionHeatmap>`,
  },
  {
    title: "Hide Sum column + row",
    description:
      "Drop both aggregate axes for a clean 7 × 24 grid without totals.",
    code: `<WeekContributionHeatmap data={data}>
  <WeekContributionHeatmapCalendar hideSumColumn hideSumRow>
    {({ activity }) => (
      <WeekContributionHeatmapBlock activity={activity} />
    )}
  </WeekContributionHeatmapCalendar>
  <WeekContributionHeatmapFooter>
    <WeekContributionHeatmapLegend />
  </WeekContributionHeatmapFooter>
</WeekContributionHeatmap>`,
  },
  {
    title: "Hide axes for embedding",
    description:
      "Strip both axis labels — great for inline cards or a hero preview.",
    code: `<WeekContributionHeatmap data={data}>
  <WeekContributionHeatmapCalendar hideHourLabels hideWeekdayLabels>
    {({ activity }) => (
      <WeekContributionHeatmapBlock activity={activity} />
    )}
  </WeekContributionHeatmapCalendar>
</WeekContributionHeatmap>`,
  },
  {
    title: "Large flat blocks",
    description:
      "Bigger blocks with tighter margin — more visual weight, ideal for focused dashboards.",
    code: `<WeekContributionHeatmap data={data} blockSize={18} blockMargin={3}>
  <WeekContributionHeatmapCalendar>
    {({ activity }) => (
      <WeekContributionHeatmapBlock activity={activity} />
    )}
  </WeekContributionHeatmapCalendar>
</WeekContributionHeatmap>`,
  },
  {
    title: "12-hour axis labels",
    description:
      "Switch the hour axis to 12-hour AM/PM format with a single prop.",
    code: `<WeekContributionHeatmap data={data} use12Hour>
  <WeekContributionHeatmapCalendar>
    {({ activity }) => (
      <WeekContributionHeatmapBlock activity={activity} />
    )}
  </WeekContributionHeatmapCalendar>
  <WeekContributionHeatmapFooter>
    <WeekContributionHeatmapLegend />
  </WeekContributionHeatmapFooter>
</WeekContributionHeatmap>`,
  },
  {
    title: "Custom label styling",
    description:
      "Use labelClass to customize the appearance of hour and weekday labels with Tailwind classes.",
    code: `<WeekContributionHeatmap data={data}>
  <WeekContributionHeatmapCalendar labelClass="text-red-500 font-bold">
    {({ activity }) => (
      <WeekContributionHeatmapBlock activity={activity} />
    )}
  </WeekContributionHeatmapCalendar>
  <WeekContributionHeatmapFooter>
    <WeekContributionHeatmapTotalCount />
    <WeekContributionHeatmapLegend />
  </WeekContributionHeatmapFooter>
</WeekContributionHeatmap>`,
  },
];
