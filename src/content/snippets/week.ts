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
  WeekdayHeatmap,
  WeekdayHeatmapBlock,
  WeekdayHeatmapBody,
  WeekdayHeatmapFooter,
  WeekdayHeatmapLegend,
  WeekdayHeatmapTotalCount,
} from "@/components/heatmap/weekday-heatmap";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sum"];

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
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap data={data}>
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <WeekdayHeatmapBlock activity={activity} />
              </TooltipTrigger>
              <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
                <p className="font-medium">
                  {WEEKDAY_NAMES[activity.weekday]}{" "}
                  {activity.hour === 24
                    ? "Total"
                    : \`\${String(activity.hour).padStart(2, "0")}:00\`}
                </p>
                <p className="text-muted-foreground">
                  {activity.count} contribution{activity.count !== 1 ? "s" : ""}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapTotalCount />
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}`;

export const weekVariants: VariantSpec[] = [
  {
    title: "Monday-start week (ISO)",
    description:
      "Rotate the weekday axis to start on Monday instead of Sunday.",
    code: `<WeekdayHeatmap data={data} weekStart={1}>
  <WeekdayHeatmapBody>
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {WEEKDAY_NAMES[activity.weekday]}{" "}
            {activity.hour === 24 ? "Total" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.count} contribution{activity.count !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
</WeekdayHeatmap>`,
  },
  {
    title: "Minimal hour ticks",
    description:
      "Only label every 6th hour (00 / 06 / 12 / 18) and drop the trailing tick to reduce axis noise.",
    code: `<WeekdayHeatmap
  data={data}
  labels={{
    hours: Array.from({ length: 24 }, (_, i) =>
      i % 6 === 0 ? String(i).padStart(2, "0") : ""
    ),
    endHour: null,
  }}
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
            {activity.hour === 24 ? "Total" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.count} contribution{activity.count !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
</WeekdayHeatmap>`,
  },
  {
    title: "Binary on/off",
    description:
      "Two colours only — active or inactive. Useful when presence matters more than intensity.",
    code: `<WeekdayHeatmap data={data} maxLevel={1}>
  <WeekdayHeatmapBody>
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {WEEKDAY_NAMES[activity.weekday]}{" "}
            {activity.hour === 24 ? "Total" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.count} contribution{activity.count !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>`,
  },
  {
    title: "Ten levels",
    description:
      "Expand the intensity scale to 10 levels for fine-grained differentiation of high-frequency data.",
    code: `<WeekdayHeatmap data={data} maxLevel={10}>
  <WeekdayHeatmapBody>
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {WEEKDAY_NAMES[activity.weekday]}{" "}
            {activity.hour === 24 ? "Total" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.count} contribution{activity.count !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>`,
  },
  {
    title: "i18n labels (Japanese)",
    description:
      "Pass a date-fns locale to auto-generate localised weekday labels, plus custom sum column/row label, legend, and total count text.",
    code: `import { ja } from "date-fns/locale";

<WeekdayHeatmap
  data={data}
  locale={ja}
  labels={{
    sum: "合計",
    legend: { less: "少ない", more: "多い" },
  }}
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
            {activity.hour === 24 ? "Total" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.count} contribution{activity.count !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapTotalCount>
      {({ totalCount }) => (
        <div className="text-muted-foreground">
          {totalCount} 件の活動
        </div>
      )}
    </WeekdayHeatmapTotalCount>
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>`,
  },
  {
    title: "Hide Sum column + row",
    description:
      "Drop both aggregate axes for a clean 7 × 24 grid without totals.",
    code: `<WeekdayHeatmap data={data}>
  <WeekdayHeatmapBody hideSumColumn hideSumRow>
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
            {activity.count} contribution{activity.count !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>`,
  },
  {
    title: "Hide axes for embedding",
    description:
      "Strip both axis labels — great for inline cards or a hero preview.",
    code: `<WeekdayHeatmap data={data}>
  <WeekdayHeatmapBody hideHourLabels hideWeekdayLabels>
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {WEEKDAY_NAMES[activity.weekday]}{" "}
            {activity.hour === 24 ? "Total" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.count} contribution{activity.count !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
</WeekdayHeatmap>`,
  },
  {
    title: "Large flat blocks",
    description:
      "Bigger blocks with tighter margin — more visual weight, ideal for focused dashboards.",
    code: `<WeekdayHeatmap data={data} blockSize={18} blockMargin={3}>
  <WeekdayHeatmapBody>
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {WEEKDAY_NAMES[activity.weekday]}{" "}
            {activity.hour === 24 ? "Total" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.count} contribution{activity.count !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
</WeekdayHeatmap>`,
  },
  {
    title: "12-hour axis labels",
    description:
      "Switch the hour axis to 12-hour AM/PM format with a single prop.",
    code: `<WeekdayHeatmap data={data} use12Hour>
  <WeekdayHeatmapBody>
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {WEEKDAY_NAMES[activity.weekday]}{" "}
            {activity.hour === 24 ? "Total" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.count} contribution{activity.count !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>`,
  },
  {
    title: "Custom styling",
    description:
      "Use colors to theme the blocks, labelTextClass to style axis labels, and className on TotalCount and Legend to style the footer.",
    code: `<WeekdayHeatmap data={data} colors={{ scale: "#22c55e" }}>
  <WeekdayHeatmapBody labelTextClass="text-green-700 font-bold">
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {WEEKDAY_NAMES[activity.weekday]}{" "}
            {activity.hour === 24 ? "Total" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.count} contribution{activity.count !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapTotalCount className="text-green-700" />
    <WeekdayHeatmapLegend className="text-green-700" />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>`,
  },
];
