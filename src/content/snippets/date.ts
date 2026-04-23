
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

const totalMm =
  Math.round(data.reduce((s, a) => s + a.value, 0) * 10) / 10;

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
        <DateHeatmapBody
          renderExtraRow={({ activity, dateIndex }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra="row" />
              </TooltipTrigger>
              <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
                <p className="font-medium">
                  Total {String(activity.hour).padStart(2, "0")}:00
                </p>
                <p className="text-muted-foreground">{activity.value.toFixed(1)} mm</p>
              </TooltipContent>
            </Tooltip>
          )}
          renderExtraColumn={({ activity, dateIndex }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra="column" />
              </TooltipTrigger>
              <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
                <p className="font-medium">
                  {format(parseISO(activity.date), "PPP")} Total
                </p>
                <p className="text-muted-foreground">{activity.value.toFixed(1)} mm</p>
              </TooltipContent>
            </Tooltip>
          )}
        >
          {({ activity, dateIndex }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
              </TooltipTrigger>
              <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
                <p className="font-medium">
                  {format(parseISO(activity.date), "PPP")}{" "}
                  {\`\${String(activity.hour).padStart(2, "0")}:00\`}
                </p>
                <p className="text-muted-foreground">{activity.value.toFixed(1)} mm</p>
              </TooltipContent>
            </Tooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Total Rainfall: {totalMm.toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}`;
