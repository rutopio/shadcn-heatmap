import type { VariantSpec } from "../types";

export const dateSampleData = `// type DateHourlyActivity = { date: string; hour: number; value: number }
//   date: "YYYY-MM-DD", "sum" = hourly Sum row
//   hour: 0–23,  24 = daily Sum column
//   value: number (e.g. seconds)

const data: DateHourlyActivity[] = [
  // Regular cells (one row per date × 24 hours)
  { date: "2025-12-11", hour: 8,  value: 300 },
  { date: "2025-12-11", hour: 9,  value: 1200 },
  { date: "2025-12-11", hour: 10, value: 2400 },
  { date: "2025-12-11", hour: 14, value: 1800 },
  { date: "2025-12-12", hour: 9,  value: 600 },
  { date: "2025-12-12", hour: 10, value: 900 },
  // ...

  // Daily Sum column (hour = 24) — total across all hours for that date
  { date: "2025-12-11", hour: 24, value: 28800 },
  { date: "2025-12-12", hour: 24, value: 14400 },
  // ...

  // Hourly Sum row (date = "sum") — total across all dates for each hour
  { date: "sum", hour: 8,  value: 4200 },
  { date: "sum", hour: 9,  value: 8400 },
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
  { date: "2025-12-11", hour: 9,  value: 1200 },
  { date: "2025-12-11", hour: 10, value: 2400 },
  { date: "2025-12-11", hour: 24, value: 28800 }, // daily sum
  { date: "2025-12-12", hour: 8,  value: 600 },
  // ...
];

export function DateHourlyUsage() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap data={data}>
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
                  {activity.value} contribution{activity.value !== 1 ? "s" : ""}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapTotalCount />
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
    code: `<DateHeatmap data={data} maxLevel={10}>
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
            {activity.value} contribution{activity.value !== 1 ? "s" : ""}
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
    code: `<DateHeatmap data={data} dateFormat="yyyy-MM-dd">
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
            {activity.value} contribution{activity.value !== 1 ? "s" : ""}
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
            {activity.value} contribution{activity.value !== 1 ? "s" : ""}
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
    code: `<DateHeatmap data={data}>
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
            {activity.value} contribution{activity.value !== 1 ? "s" : ""}
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
    code: `<DateHeatmap data={data}>
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
            {activity.value} contribution{activity.value !== 1 ? "s" : ""}
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
    code: `<DateHeatmap data={data} blockSize={32} blockMargin={3}>
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
            {activity.value} contribution{activity.value !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapTotalCount />
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>`,
  },
  {
    title: "12-hour axis labels",
    description:
      "Switch the hour axis to 12-hour AM/PM format with a single prop.",
    code: `<DateHeatmap data={data} use12Hour>
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
            {activity.value} contribution{activity.value !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapTotalCount />
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
        <TooltipContent>
          <p className="font-medium">
            {format(parseISO(activity.date), "PPP", { locale: es })}
            {" "}
            {activity.hour === 24
              ? "Total"
              : \`\${String(activity.hour).padStart(2, "0")}:00\`}
          </p>
          <p className="text-muted-foreground">
            {activity.value} contribución{activity.value !== 1 ? "es" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapTotalCount>
      {({ totalCount }) => (
        <div className="text-muted-foreground">
          {totalCount} contribuciones
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
    code: `<DateHeatmap data={data} colors={{ scale: "#22c55e" }}>
  <DateHeatmapBody labelTextClass="text-green-700 font-bold">
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
            {activity.value} contribution{activity.value !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapTotalCount className="text-green-700" />
    <DateHeatmapLegend className="text-green-700" />
  </DateHeatmapFooter>
</DateHeatmap>`,
  },
];
