import type { VariantSpec } from "../types";

export const weekdaySampleData = `// type HeatmapActivity = { weekday: number; hour: number; value: number }
//   weekday: 0–6 (Sun–Sat), 7 = hourly average row
//   hour:    0–23,           24 = daily average column
//   value:   average temperature in °C

const data: HeatmapActivity[] = [
  // Regular cells (7 weekdays × 24 hours)
  { weekday: 0, hour:  0, value: 10.2 },  // Sun 00:00
  { weekday: 1, hour:  9, value: 16.3 },  // Mon 09:00
  { weekday: 1, hour: 14, value: 22.1 },  // Mon 14:00
  { weekday: 5, hour: 14, value: 21.8 },  // Fri 14:00
  // ...

  // Daily average column (hour = 24) — avg across all hours for each weekday
  { weekday: 0, hour: 24, value: 14.8 },
  { weekday: 1, hour: 24, value: 15.2 },
  // ...

  // Hourly average row (weekday = 7) — avg across all weekdays for each hour
  { weekday: 7, hour:  0, value:  9.8 },
  { weekday: 7, hour: 14, value: 21.5 },
  // ...
];`;

export const weekdayBasicCode = `import {
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

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Avg"];

const data = [
  // Regular cells — weekday 0..6, hour 0..23
  { weekday: 1, hour:  9, value: 16.3 },
  { weekday: 1, hour: 14, value: 22.1 },
  // Daily average column — hour = 24
  { weekday: 1, hour: 24, value: 15.2 },
  // Hourly average row — weekday = 7
  { weekday: 7, hour: 14, value: 21.5 },
  // ...
];

export function WeeklyRhythm() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap data={data} isNormalized colors={{ scale: "var(--color-chart-2)" }}>
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
                    ? "Avg"
                    : \`\${String(activity.hour).padStart(2, "0")}:00\`}
                </p>
                <p className="text-muted-foreground">
                  {activity.value.toFixed(1)} °C
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapTotalCount>
            {({ totalCount }) => (
              <div className="text-muted-foreground">avg. {totalCount.toFixed(1)} °C</div>
            )}
          </WeekdayHeatmapTotalCount>
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}`;

export const weekdayVariants: VariantSpec[] = [
  {
    title: "Monday-start week (ISO)",
    description:
      "Rotate the weekday axis to start on Monday instead of Sunday.",
    code: `<WeekdayHeatmap data={data} weekStart={1} isNormalized colors={{ scale: "var(--color-chart-2)" }}>
  <WeekdayHeatmapBody>
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {WEEKDAY_NAMES[activity.weekday]}{" "}
            {activity.hour === 24 ? "Avg" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} °C
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
  isNormalized
  colors={{ scale: "var(--color-chart-2)" }}
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
            {activity.hour === 24 ? "Avg" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} °C
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
</WeekdayHeatmap>`,
  },
  {
    title: "Ten levels",
    description:
      "Expand the intensity scale to 10 levels for fine-grained differentiation of high-frequency data.",
    code: `<WeekdayHeatmap data={data} maxLevel={10} isNormalized colors={{ scale: "var(--color-chart-2)" }}>
  <WeekdayHeatmapBody>
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {WEEKDAY_NAMES[activity.weekday]}{" "}
            {activity.hour === 24 ? "Avg" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} °C
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
      "Pass a date-fns locale to auto-generate localised weekday labels, plus custom avg column/row label, legend, and total value text.",
    code: `import { ja } from "date-fns/locale";

<WeekdayHeatmap
  data={data}
  isNormalized
  locale={ja}
  colors={{ scale: "var(--color-chart-2)" }}
  labels={{
    avg: "合計",
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
            {activity.hour === 24 ? "Avg" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} °C
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapTotalCount>
      {({ totalCount }) => (
        <div className="text-muted-foreground">
          平均 {totalCount.toFixed(1)} °C
        </div>
      )}
    </WeekdayHeatmapTotalCount>
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>`,
  },
  {
    title: "Hide Avg column + row",
    description:
      "Drop both aggregate axes for a clean 7 × 24 grid without totals.",
    code: `<WeekdayHeatmap data={data} isNormalized colors={{ scale: "var(--color-chart-2)" }}>
  <WeekdayHeatmapBody hideAvgColumn hideAvgRow>
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
            {activity.value.toFixed(1)} °C
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
    code: `<WeekdayHeatmap data={data} isNormalized colors={{ scale: "var(--color-chart-2)" }}>
  <WeekdayHeatmapBody hideHourLabels hideWeekdayLabels>
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {WEEKDAY_NAMES[activity.weekday]}{" "}
            {activity.hour === 24 ? "Avg" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} °C
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
    code: `<WeekdayHeatmap data={data} blockSize={32} blockMargin={3} isNormalized colors={{ scale: "var(--color-chart-2)" }}>
  <WeekdayHeatmapBody>
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {WEEKDAY_NAMES[activity.weekday]}{" "}
            {activity.hour === 24 ? "Avg" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} °C
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
    code: `<WeekdayHeatmap data={data} use12Hour isNormalized colors={{ scale: "var(--color-chart-2)" }}>
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
              ? "Avg"
              : (() => {
                  const fmt = (h: number) => {
                    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
                    return \`\${h12}:00 \${h < 12 ? "AM" : "PM"}\`;
                  };
                  return \`\${fmt(activity.hour)}-\${fmt((activity.hour + 1) % 24)}\`;
                })()}
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} °C
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
    code: `<WeekdayHeatmap data={data} isNormalized colors={{ scale: "var(--color-destructive)" }}>
  <WeekdayHeatmapBody labelTextClass="text-destructive font-bold">
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {WEEKDAY_NAMES[activity.weekday]}{" "}
            {activity.hour === 24 ? "Avg" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} °C
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapTotalCount className="text-destructive" />
    <WeekdayHeatmapLegend className="text-destructive" />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>`,
  },
];
