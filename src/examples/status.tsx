"use client";

import { format, parseISO } from "date-fns";
import type { StatusActivity } from "@/components/heatmap/status-heatmap";
import {
  StatusHeatmap,
  StatusHeatmapBlock,
  StatusHeatmapBody,
  StatusHeatmapFooter,
  StatusHeatmapLegend,
  StatusHeatmapStat,
  type StatusValue,
} from "@/components/heatmap/status-heatmap";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const STATUS_LABELS: Record<StatusValue, string> = {
  0: "No data",
  1: "Critical",
  2: "Degraded",
  3: "Healthy",
};

const sampleData: StatusActivity[] = [
  { date: "2025-01-01", value: 3 }, // Healthy
  { date: "2025-01-02", value: 2 }, // Degraded
  // ... 90 days
];

export function StatusExample({
  data = sampleData,
}: {
  data?: StatusActivity[];
}) {
  return (
    <TooltipProvider delay={0}>
      <StatusHeatmap data={data}>
        <StatusHeatmapBody>
          {({ activity, dayIndex }) => (
            <Tooltip>
              <TooltipTrigger
                tabIndex={0}
                render={
                  <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
                }
              />
              <TooltipContent
                side="top"
                className="pointer-events-none text-xs"
                sideOffset={6}
              >
                <p className="font-medium">
                  {format(parseISO(activity.date), "PPP")}
                </p>
                <p className="text-muted-foreground">
                  {STATUS_LABELS[activity.value]}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </StatusHeatmapBody>
        <StatusHeatmapFooter>
          <StatusHeatmapStat />
          <StatusHeatmapLegend />
        </StatusHeatmapFooter>
      </StatusHeatmap>
    </TooltipProvider>
  );
}
