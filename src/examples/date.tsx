"use client";

import { format, parseISO } from "date-fns";
import type { DateHourlyActivity } from "@/components/heatmap/date-heatmap";
import {
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

const sampleData: DateHourlyActivity[] = [
  { date: "2025-12-11", hour: 13, value: 8.4 },
  { date: "2025-12-11", hour: 14, value: 22.7 },
  { date: "2025-12-12", hour: 14, value: 5.1 },
  // ...
];

const sumByHour = (d: DateHourlyActivity[]) => {
  const out = Array<number>(24).fill(0);
  d.forEach((a) => {
    out[a.hour] += a.value;
  });
  return out;
};
const sumByDate = (d: DateHourlyActivity[], dates: string[]) => {
  const map = new Map<string, number>();
  d.forEach((a) => {
    map.set(a.date, (map.get(a.date) ?? 0) + a.value);
  });
  return dates.map((date) => map.get(date) ?? 0);
};

export function DateExample({
  data = sampleData,
}: {
  data?: DateHourlyActivity[];
}) {
  const totalMm = Math.round(data.reduce((s, a) => s + a.value, 0) * 10) / 10;
  return (
    <TooltipProvider delay={0}>
      <DateHeatmap
        data={data}
        labels={{ cellLabel: "{{date}} {{hour}}: {{value}} mm" }}
        colors={{ scale: "var(--color-chart-3)" }}
        extraRow={{ label: "Total", compute: sumByHour }}
        extraColumn={{ label: "Total", compute: sumByDate }}
      >
        <DateHeatmapBody
          renderExtraRow={({ activity, dateIndex }) => (
            <Tooltip>
              <TooltipTrigger
                tabIndex={0}
                render={
                  <DateHeatmapBlock
                    activity={activity}
                    dateIndex={dateIndex}
                    extra="row"
                  />
                }
              />
              <TooltipContent
                side="top"
                className="pointer-events-none text-xs"
                sideOffset={6}
              >
                <p className="font-medium">
                  Total {String(activity.hour).padStart(2, "0")}:00
                </p>
                <p className="text-muted-foreground">
                  {activity.value.toFixed(1)} mm
                </p>
              </TooltipContent>
            </Tooltip>
          )}
          renderExtraColumn={({ activity, dateIndex }) => (
            <Tooltip>
              <TooltipTrigger
                tabIndex={0}
                render={
                  <DateHeatmapBlock
                    activity={activity}
                    dateIndex={dateIndex}
                    extra="column"
                  />
                }
              />
              <TooltipContent
                side="top"
                className="pointer-events-none text-xs"
                sideOffset={6}
              >
                <p className="font-medium">
                  {format(parseISO(activity.date), "PPP")} Total
                </p>
                <p className="text-muted-foreground">
                  {activity.value.toFixed(1)} mm
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        >
          {({ activity, dateIndex }) => (
            <Tooltip>
              <TooltipTrigger
                tabIndex={0}
                render={
                  <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
                }
              />
              <TooltipContent
                side="top"
                className="pointer-events-none text-xs"
                sideOffset={6}
              >
                <p className="font-medium">
                  {format(parseISO(activity.date), "PPP")}{" "}
                  {`${String(activity.hour).padStart(2, "0")}:00`}
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
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Total rainfall: {totalMm.toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend
            labels={{ less: "Less rain", more: "More rain" }}
          />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}
