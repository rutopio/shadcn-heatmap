import type { VariantSpec } from "../types";

export const dateSampleData = `// type DateHourlyActivity = { date: string; hour: number; value: number }
//   date:  "YYYY-MM-DD"
//   hour:  0–23
//   value: rainfall in mm

const data: DateHourlyActivity[] = [
  { date: "2025-12-11", hour: 13, value:  8.4 },
  { date: "2025-12-11", hour: 14, value: 22.7 },
  { date: "2025-12-11", hour: 15, value: 15.3 },
  { date: "2025-12-12", hour: 14, value:  5.1 },
  // ...
];`;

export const dateBasicCode = `import {
  DateHeatmap,
  DateHeatmapBlock,
  DateHeatmapBody,
  DateHeatmapFooter,
  DateHeatmapLegend,
  DateHeatmapStat,
} from "@/components/heatmap/date-heatmap";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, parseISO } from "date-fns";

const data = [
  { date: "2025-12-11", hour: 13, value:  8.4 },
  { date: "2025-12-11", hour: 14, value: 22.7 },
  { date: "2025-12-12", hour: 14, value:  5.1 },
  // ...
];

// Provide your own extra row / column aggregation (any stat you want).
const sumByHour = (d) => {
  const out = Array(24).fill(0);
  d.forEach((a) => { out[a.hour] += a.value; });
  return out;
};
const sumByDate = (d, dates) => {
  const map = new Map();
  d.forEach((a) => map.set(a.date, (map.get(a.date) ?? 0) + a.value));
  return dates.map((date) => map.get(date) ?? 0);
};

export function DateHourlyUsage() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap
        data={data}
        colors={{ scale: "var(--color-chart-3)" }}
        extraRow={{ label: "Total", compute: sumByHour }}
        extraColumn={{ label: "Total", compute: sumByDate }}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex, extra }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <DateHeatmapBlock
                  activity={activity}
                  dateIndex={dateIndex}
                  extra={extra}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
                <p className="font-medium">
                  {extra === "row"
                    ? "Total"
                    : format(parseISO(activity.date), "PPP")}{" "}
                  {extra === "column"
                    ? "Total"
                    : \`\${String(activity.hour).padStart(2, "0")}:00\`}
                </p>
                <p className="text-muted-foreground">
                  {activity.value.toFixed(1)} mm
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {({ value }) => (
              <div className="text-muted-foreground">{Number(value).toFixed(1)} mm total</div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}`;

export const dateVariants: VariantSpec[] = [
  {
    title: "Ten levels",
    description:
      "Expand the intensity scale to 10 levels for fine-grained differentiation of high-frequency data.",
    code: `<DateHeatmap data={data} levels={10} colors={{ scale: "var(--color-chart-3)" }}>
  <DateHeatmapBody>
    {({ activity, dateIndex, extra }) => (
      <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra={extra} />
    )}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>`,
  },
  {
    title: "Custom date format",
    description:
      "Switch the left-axis labels to ISO format for non-US audiences.",
    code: `<DateHeatmap data={data} dateFormat="yyyy-MM-dd" colors={{ scale: "var(--color-chart-3)" }}>
  <DateHeatmapBody>
    {({ activity, dateIndex, extra }) => (
      <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra={extra} />
    )}
  </DateHeatmapBody>
</DateHeatmap>`,
  },
  {
    title: "Minimal hour ticks",
    description:
      "Only show the 00 / 06 / 12 / 18 axis labels and drop the trailing tick.",
    code: `<DateHeatmap
  data={data}
  colors={{ scale: "var(--color-chart-3)" }}
  labels={{
    hours: Array.from({ length: 24 }, (_, i) =>
      i % 6 === 0 ? String(i).padStart(2, "0") : ""
    ),
    endHour: null,
  }}
>
  <DateHeatmapBody>
    {({ activity, dateIndex, extra }) => (
      <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra={extra} />
    )}
  </DateHeatmapBody>
</DateHeatmap>`,
  },
  {
    title: "Plain grid (no aggregate)",
    description:
      "Omit extraRow/extraColumn for a pure 24-hour grid without the aggregate.",
    code: `<DateHeatmap data={data} colors={{ scale: "var(--color-chart-3)" }}>
  <DateHeatmapBody>
    {({ activity, dateIndex, extra }) => (
      <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra={extra} />
    )}
  </DateHeatmapBody>
</DateHeatmap>`,
  },
  {
    title: "Custom extra column (p95)",
    description:
      "extraRow/extraColumn accept any compute function — pick sum, average, median, p95, whatever fits.",
    code: `const p95ByDate = (d, dates) => {
  const byDate = new Map();
  d.forEach((a) => {
    if (!byDate.has(a.date)) byDate.set(a.date, []);
    byDate.get(a.date).push(a.value);
  });
  return dates.map((date) => {
    const arr = (byDate.get(date) ?? []).sort((x, y) => x - y);
    return arr.length ? arr[Math.floor(arr.length * 0.95)] : 0;
  });
};

<DateHeatmap
  data={data}
  colors={{ scale: "var(--color-chart-3)" }}
  extraColumn={{ label: <strong>P95</strong>, compute: p95ByDate }}
>
  <DateHeatmapBody>
    {({ activity, dateIndex, extra }) => (
      <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra={extra} />
    )}
  </DateHeatmapBody>
</DateHeatmap>`,
  },
  {
    title: "Hide axes for embedding",
    description:
      "Strip all labels for tight embeds like tooltips or card thumbnails.",
    code: `<DateHeatmap data={data} colors={{ scale: "var(--color-chart-3)" }}>
  <DateHeatmapBody hideDateLabels hideHourLabels>
    {({ activity, dateIndex, extra }) => (
      <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra={extra} />
    )}
  </DateHeatmapBody>
</DateHeatmap>`,
  },
  {
    title: "Large flat blocks",
    description:
      "Bigger blocks with tighter margin — more visual weight for focused views.",
    code: `<DateHeatmap data={data} totalCount={totalMm} blockSize={32} blockMargin={3} colors={{ scale: "var(--color-chart-3)" }}>
  <DateHeatmapBody>
    {({ activity, dateIndex, extra }) => (
      <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra={extra} />
    )}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapStat>
      {({ value }) => (
        <div className="text-muted-foreground">{Number(value).toFixed(1)} mm total</div>
      )}
    </DateHeatmapStat>
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>`,
  },
  {
    title: "12-hour axis labels",
    description:
      "Switch the hour axis to 12-hour AM/PM format with a single prop.",
    code: `<DateHeatmap data={data} totalCount={totalMm} use12Hour colors={{ scale: "var(--color-chart-3)" }}>
  <DateHeatmapBody>
    {({ activity, dateIndex, extra }) => (
      <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra={extra} />
    )}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapStat>
      {({ value }) => (
        <div className="text-muted-foreground">{Number(value).toFixed(1)} mm total</div>
      )}
    </DateHeatmapStat>
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>`,
  },
  {
    title: "i18n labels (Spanish)",
    description:
      "Pass a date-fns locale to auto-generate localised date labels, plus custom extra column label, legend, and total value text.",
    code: `import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";

<DateHeatmap
  data={data}
  locale={es}
  colors={{ scale: "var(--color-chart-3)" }}
  extraRow={{ label: "Total", compute: sumByHour }}
  extraColumn={{ label: "Total", compute: sumByDate }}
>
  <DateHeatmapBody>
    {({ activity, dateIndex, extra }) => (
      <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra={extra} />
    )}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapStat>
      {({ value }) => (
        <div className="text-muted-foreground">
          {Number(value).toFixed(1)} mm total
        </div>
      )}
    </DateHeatmapStat>
    <DateHeatmapLegend labels={{ less: "Menos", more: "Más" }} />
  </DateHeatmapFooter>
</DateHeatmap>`,
  },
  {
    title: "Custom styling",
    description:
      "Use colors to theme the blocks, labelClassName to style axis labels, and className on Stat and Legend to style the footer.",
    code: `<DateHeatmap data={data} colors={{ scale: "var(--color-destructive)" }}>
  <DateHeatmapBody labelClassName="text-destructive font-bold">
    {({ activity, dateIndex, extra }) => (
      <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra={extra} />
    )}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapStat className="text-destructive">
      {({ value }) => <div className="text-destructive">{Number(value).toFixed(1)} mm total</div>}
    </DateHeatmapStat>
    <DateHeatmapLegend className="text-destructive" />
  </DateHeatmapFooter>
</DateHeatmap>`,
  },
];
