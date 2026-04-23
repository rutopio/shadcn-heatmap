
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
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WEEKDAY_NAMES = Array.from({ length: 7 }, (_, i) =>
  format(new Date(2000, 0, 2 + i), "EEEE")
);

const data = [
  { weekday: 1, hour:  9, value: 16.3 },
  { weekday: 1, hour: 14, value: 22.1 },
  // ...
];

const avgTemp =
  Math.round((data.reduce((s, a) => s + a.value, 0) / data.length) * 10) / 10;

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
        <WeekdayHeatmapBody
          renderExtraRow={({ activity }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <WeekdayHeatmapBlock activity={activity} extra="row" />
              </TooltipTrigger>
              <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
                <p className="font-medium">Avg {String(activity.hour).padStart(2, "0")}:00</p>
                <p className="text-muted-foreground">avg. {activity.value.toFixed(1)} °C</p>
              </TooltipContent>
            </Tooltip>
          )}
          renderExtraColumn={({ activity }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <WeekdayHeatmapBlock activity={activity} extra="column" />
              </TooltipTrigger>
              <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
                <p className="font-medium">{WEEKDAY_NAMES[activity.weekday]} Avg</p>
                <p className="text-muted-foreground">avg. {activity.value.toFixed(1)} °C</p>
              </TooltipContent>
            </Tooltip>
          )}
        >
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
          <WeekdayHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Average Temperature: {avgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}`;
