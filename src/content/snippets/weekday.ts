import type { VariantSpec } from "../types";

export const weekdaySampleData = `// type WeekdayHourlyActivity = { weekday: number; hour: number; value: number }
//   weekday: 0–6 (Sun–Sat)
//   hour:    0–23
//   value:   average temperature in °C

const data: WeekdayHourlyActivity[] = [
  { weekday: 0, hour:  0, value: 10.2 },  // Sun 00:00
  { weekday: 1, hour:  9, value: 16.3 },  // Mon 09:00
  { weekday: 1, hour: 14, value: 22.1 },  // Mon 14:00
  { weekday: 5, hour: 14, value: 21.8 },  // Fri 14:00
  // ...
];`;

export const weekdayBasicCode = `import {
  WeekdayHeatmap,
  WeekdayHeatmapBlock,
  WeekdayHeatmapBody,
  WeekdayHeatmapFooter,
  WeekdayHeatmapLegend,
  WeekdayHeatmapStat,
} from "@/components/heatmap/weekday-heatmap";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const data = [
  { weekday: 1, hour:  9, value: 16.3 },
  { weekday: 1, hour: 14, value: 22.1 },
  // ...
];

// Provide your own extra row / column aggregation (any stat you want).
const avgByHour = (d) => {
  const sums = Array(24).fill(0), counts = Array(24).fill(0);
  d.forEach((a) => { sums[a.hour] += a.value; counts[a.hour] += 1; });
  return sums.map((s, i) => (counts[i] ? s / counts[i] : 0));
};
const avgByWeekday = (d) => {
  const sums = Array(7).fill(0), counts = Array(7).fill(0);
  d.forEach((a) => { sums[a.weekday] += a.value; counts[a.weekday] += 1; });
  return sums.map((s, i) => (counts[i] ? s / counts[i] : 0));
};

export function WeeklyRhythm() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={data}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody>
          {({ activity, extra }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <WeekdayHeatmapBlock activity={activity} extra={extra} />
              </TooltipTrigger>
              <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
                <p className="font-medium">
                  {extra === "row" ? "Avg" : WEEKDAY_NAMES[activity.weekday]}{" "}
                  {extra === "column" ? "Avg" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
                </p>
                <p className="text-muted-foreground">
                  {activity.value.toFixed(1)} °C
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapStat>
            {({ value }) => (
              <div className="text-muted-foreground">avg. {Number(value).toFixed(1)} °C</div>
            )}
          </WeekdayHeatmapStat>
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
    {({ activity, extra }) => (
      <WeekdayHeatmapBlock activity={activity} extra={extra} />
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
    {({ activity, extra }) => (
      <WeekdayHeatmapBlock activity={activity} extra={extra} />
    )}
  </WeekdayHeatmapBody>
</WeekdayHeatmap>`,
  },
  {
    title: "Ten levels",
    description:
      "Expand the intensity scale to 10 levels for fine-grained differentiation of high-frequency data.",
    code: `<WeekdayHeatmap data={data} levels={10} isNormalized colors={{ scale: "var(--color-chart-2)" }}>
  <WeekdayHeatmapBody>
    {({ activity, extra }) => (
      <WeekdayHeatmapBlock activity={activity} extra={extra} />
    )}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>`,
  },
  {
    title: "Custom extra row label (median)",
    description:
      "extraRow/extraColumn accept any ReactNode label and any compute function — pick average, median, p95, whatever fits the data.",
    code: `const medianByHour = (d) => {
  const byHour = Array.from({ length: 24 }, () => []);
  d.forEach((a) => byHour[a.hour].push(a.value));
  return byHour.map((arr) => {
    const s = arr.sort((x, y) => x - y);
    return s.length ? s[Math.floor(s.length / 2)] : 0;
  });
};

<WeekdayHeatmap
  data={data}
  isNormalized
  colors={{ scale: "var(--color-chart-2)" }}
  extraRow={{ label: <strong>Median</strong>, compute: medianByHour }}
>
  <WeekdayHeatmapBody>
    {({ activity, extra }) => (
      <WeekdayHeatmapBlock activity={activity} extra={extra} />
    )}
  </WeekdayHeatmapBody>
</WeekdayHeatmap>`,
  },
  {
    title: "i18n labels (Japanese)",
    description:
      "Pass a date-fns locale to auto-generate localised weekday labels, plus custom extra row/column label, legend, and total value text.",
    code: `import { ja } from "date-fns/locale";

<WeekdayHeatmap
  data={data}
  isNormalized
  locale={ja}
  colors={{ scale: "var(--color-chart-2)" }}
  extraRow={{ label: "合計", compute: avgByHour }}
  extraColumn={{ label: "合計", compute: avgByWeekday }}
>
  <WeekdayHeatmapBody>
    {({ activity, extra }) => (
      <WeekdayHeatmapBlock activity={activity} extra={extra} />
    )}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapStat>
      {({ value }) => (
        <div className="text-muted-foreground">
          平均 {Number(value).toFixed(1)} °C
        </div>
      )}
    </WeekdayHeatmapStat>
    <WeekdayHeatmapLegend labels={{ less: "少ない", more: "多い" }} />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>`,
  },
  {
    title: "Plain 7 × 24 grid",
    description:
      "Omit extraRow/extraColumn for a clean grid without any aggregate row or column.",
    code: `<WeekdayHeatmap data={data} isNormalized colors={{ scale: "var(--color-chart-2)" }}>
  <WeekdayHeatmapBody>
    {({ activity, extra }) => (
      <WeekdayHeatmapBlock activity={activity} extra={extra} />
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
    {({ activity, extra }) => (
      <WeekdayHeatmapBlock activity={activity} extra={extra} />
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
    {({ activity, extra }) => (
      <WeekdayHeatmapBlock activity={activity} extra={extra} />
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
    {({ activity, extra }) => (
      <WeekdayHeatmapBlock activity={activity} extra={extra} />
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
      "Use colors to theme the blocks, labelClassName to style axis labels, and className on Stat and Legend to style the footer.",
    code: `<WeekdayHeatmap data={data} isNormalized colors={{ scale: "var(--color-destructive)" }}>
  <WeekdayHeatmapBody labelClassName="text-destructive font-bold">
    {({ activity, extra }) => (
      <WeekdayHeatmapBlock activity={activity} extra={extra} />
    )}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapStat className="text-destructive" />
    <WeekdayHeatmapLegend className="text-destructive" />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>`,
  },
];
