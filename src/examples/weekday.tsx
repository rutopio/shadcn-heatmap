"use client";

import { format } from "date-fns";
import type { WeekdayHourlyActivity } from "@/components/heatmap/weekday-heatmap";
import {
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

const WEEKDAY_NAMES = Array.from({ length: 7 }, (_, i) =>
  format(new Date(2000, 0, 2 + i), "EEEE"),
);

const sampleData: WeekdayHourlyActivity[] = [
  { weekday: 1, hour: 9, value: 16.3 },
  { weekday: 1, hour: 14, value: 22.1 },
  // ...
];

const avgByHour = (d: WeekdayHourlyActivity[]) => {
  const sums = Array<number>(24).fill(0),
    counts = Array<number>(24).fill(0);
  d.forEach((a) => {
    sums[a.hour] += a.value;
    counts[a.hour] += 1;
  });
  return sums.map((s, i) => (counts[i] ? s / counts[i] : 0));
};
const avgByWeekday = (d: WeekdayHourlyActivity[]) => {
  const sums = Array<number>(7).fill(0),
    counts = Array<number>(7).fill(0);
  d.forEach((a) => {
    sums[a.weekday] += a.value;
    counts[a.weekday] += 1;
  });
  return sums.map((s, i) => (counts[i] ? s / counts[i] : 0));
};

export function WeekdayExample({
  data = sampleData,
}: {
  data?: WeekdayHourlyActivity[];
}) {
  const avgTemp =
    Math.round(
      (data.reduce((s, a) => s + a.value, 0) / (data.length || 1)) * 10,
    ) / 10;
  return (
    <TooltipProvider delay={0}>
      <WeekdayHeatmap
        data={data}
        labels={{ cellLabel: "{{weekday}} {{hour}}: {{value}} °C" }}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody
          renderExtraRow={({ activity }) => (
            <Tooltip>
              <TooltipTrigger
                tabIndex={0}
                render={<WeekdayHeatmapBlock activity={activity} extra="row" />}
              />
              <TooltipContent
                side="top"
                className="pointer-events-none text-xs"
                sideOffset={6}
              >
                <p className="font-medium">
                  Avg {String(activity.hour).padStart(2, "0")}:00
                </p>
                <p className="text-muted-foreground">
                  avg. {activity.value.toFixed(1)} °C
                </p>
              </TooltipContent>
            </Tooltip>
          )}
          renderExtraColumn={({ activity }) => (
            <Tooltip>
              <TooltipTrigger
                tabIndex={0}
                render={
                  <WeekdayHeatmapBlock activity={activity} extra="column" />
                }
              />
              <TooltipContent
                side="top"
                className="pointer-events-none text-xs"
                sideOffset={6}
              >
                <p className="font-medium">
                  {WEEKDAY_NAMES[activity.weekday]} Avg
                </p>
                <p className="text-muted-foreground">
                  avg. {activity.value.toFixed(1)} °C
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        >
          {({ activity }) => (
            <Tooltip>
              <TooltipTrigger
                tabIndex={0}
                render={<WeekdayHeatmapBlock activity={activity} />}
              />
              <TooltipContent
                side="top"
                className="pointer-events-none text-xs"
                sideOffset={6}
              >
                <p className="font-medium">
                  {WEEKDAY_NAMES[activity.weekday]}{" "}
                  {`${String(activity.hour).padStart(2, "0")}:00`}
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
                Average temperature: {avgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend labels={{ less: "Cold", more: "Hot" }} />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}
