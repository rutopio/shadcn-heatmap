import type { VariantSpec } from "../types";

export const dateSampleData = `// type DateHourlyActivity = { date: string; hour: number; value: number }
//   date: "YYYY-MM-DD", "sum" = hourly total row
//   hour: 0–23,  24 = daily total column
//   value: rainfall in mm

const data: DateHourlyActivity[] = [
  // Regular cells (one row per date × 24 hours)
  { date: "2025-12-11", hour: 13, value:  8.4 },
  { date: "2025-12-11", hour: 14, value: 22.7 },
  { date: "2025-12-11", hour: 15, value: 15.3 },
  { date: "2025-12-12", hour: 14, value:  5.1 },
  // ...

  // Daily total column (hour = 24) — total mm across all hours for that date
  { date: "2025-12-11", hour: 24, value: 48.2 },
  { date: "2025-12-12", hour: 24, value: 12.6 },
  // ...

  // Hourly total row (date = "sum") — total mm across all dates for each hour
  { date: "sum", hour: 14, value: 156.3 },
  { date: "sum", hour: 15, value:  98.7 },
  // ...
];`;

export const dateBasicCode = `import {
  DateHeatmap,
  DateHeatmapBlock,
  DateHeatmapBody,
  DateHeatmapFooter,
  DateHeatmapLegend,
  DateHeatmapTotalCount,
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
  { date: "2025-12-11", hour: 24, value: 48.2 }, // daily total
  { date: "2025-12-12", hour: 14, value:  5.1 },
  // ...
];

export function DateHourlyUsage() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap data={data} colors={{ scale: "var(--color-chart-3)" }}>
        <DateHeatmapBody>
          {({ activity, dateIndex }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <DateHeatmapBlock
                  activity={activity}
                  dateIndex={dateIndex}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
                <p className="font-medium">
                  {activity.date === "sum"
                    ? "Total"
                    : format(parseISO(activity.date), "PPP")}{" "}
                  {activity.hour === 24
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
          <DateHeatmapTotalCount>
            {({ totalCount }) => (
              <div className="text-muted-foreground">{totalCount.toFixed(1)} mm total</div>
            )}
          </DateHeatmapTotalCount>
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
    code: `<DateHeatmap data={data} maxLevel={10} colors={{ scale: "var(--color-chart-3)" }}>
  <DateHeatmapBody>
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock
            activity={activity}
            dateIndex={dateIndex}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {activity.date === "sum" ? "Total" : format(parseISO(activity.date), "PPP")}{" "}
            {activity.hour === 24 ? "Total" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} mm
          </p>
        </TooltipContent>
      </Tooltip>
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
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock
            activity={activity}
            dateIndex={dateIndex}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {activity.date === "sum" ? "Total" : format(parseISO(activity.date), "yyyy-MM-dd")}{" "}
            {activity.hour === 24 ? "Total" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} mm
          </p>
        </TooltipContent>
      </Tooltip>
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
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock
            activity={activity}
            dateIndex={dateIndex}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {activity.date === "sum" ? "Total" : format(parseISO(activity.date), "PPP")}{" "}
            {activity.hour === 24 ? "Total" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} mm
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </DateHeatmapBody>
</DateHeatmap>`,
  },
  {
    title: "Hide Sum column",
    description:
      "Remove the daily total column for a pure 24-hour grid without the aggregate.",
    code: `<DateHeatmap data={data} colors={{ scale: "var(--color-chart-3)" }}>
  <DateHeatmapBody hideSumColumn>
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock
            activity={activity}
            dateIndex={dateIndex}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {activity.date === "sum" ? "Total" : format(parseISO(activity.date), "PPP")}{" "}
            {\`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} mm
          </p>
        </TooltipContent>
      </Tooltip>
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
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock
            activity={activity}
            dateIndex={dateIndex}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {activity.date === "sum" ? "Total" : format(parseISO(activity.date), "PPP")}{" "}
            {activity.hour === 24 ? "Total" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} mm
          </p>
        </TooltipContent>
      </Tooltip>
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
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock
            activity={activity}
            dateIndex={dateIndex}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {activity.date === "sum" ? "Total" : format(parseISO(activity.date), "PPP")}{" "}
            {activity.hour === 24 ? "Total" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} mm
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapTotalCount>
      {({ totalCount }) => (
        <div className="text-muted-foreground">{totalCount.toFixed(1)} mm total</div>
      )}
    </DateHeatmapTotalCount>
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
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock
            activity={activity}
            dateIndex={dateIndex}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {activity.date === "sum" ? "Total" : format(parseISO(activity.date), "PPP")}{" "}
            {activity.hour === 24
              ? "Total"
              : (() => {
                  const fmt = (h: number) => {
                    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
                    return \`\${h12}:00 \${h < 12 ? "AM" : "PM"}\`;
                  };
                  return \`\${fmt(activity.hour)}-\${fmt((activity.hour + 1) % 24)}\`;
                })()}
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} mm
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapTotalCount>
      {({ totalCount }) => (
        <div className="text-muted-foreground">{totalCount.toFixed(1)} mm total</div>
      )}
    </DateHeatmapTotalCount>
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>`,
  },
  {
    title: "i18n labels (Spanish)",
    description:
      "Pass a date-fns locale to auto-generate localised date labels, plus custom sum column label, legend, and total value text. Format tooltip dates accordingly.",
    code: `import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";

<DateHeatmap
  data={data}
  locale={es}
  colors={{ scale: "var(--color-chart-3)" }}
  labels={{
    sum: "Total",
    legend: { less: "Menos", more: "Más" },
  }}
>
  <DateHeatmapBody>
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock
            activity={activity}
            dateIndex={dateIndex}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {activity.date === "sum"
              ? "Total"
              : format(parseISO(activity.date), "PPP", { locale: es })}{" "}
            {activity.hour === 24
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
    <DateHeatmapTotalCount>
      {({ totalCount }) => (
        <div className="text-muted-foreground">
          {totalCount.toFixed(1)} mm total
        </div>
      )}
    </DateHeatmapTotalCount>
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>`,
  },
  {
    title: "Custom styling",
    description:
      "Use colors to theme the blocks, labelTextClass to style axis labels, and className on TotalCount and Legend to style the footer.",
    code: `<DateHeatmap data={data} colors={{ scale: "var(--color-destructive)" }}>
  <DateHeatmapBody labelTextClass="text-destructive font-bold">
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock
            activity={activity}
            dateIndex={dateIndex}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">
            {activity.date === "sum" ? "Total" : format(parseISO(activity.date), "PPP")}{" "}
            {activity.hour === 24 ? "Total" : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} mm
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapTotalCount className="text-destructive">
      {({ totalCount }) => <div className="text-destructive">{totalCount.toFixed(1)} mm total</div>}
    </DateHeatmapTotalCount>
    <DateHeatmapLegend className="text-destructive" />
  </DateHeatmapFooter>
</DateHeatmap>`,
  },
];
