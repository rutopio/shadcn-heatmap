import { format, parseISO } from "date-fns";

import {
  StatusHeatmap,
  StatusHeatmapBlock,
  StatusHeatmapBody,
  StatusHeatmapFooter,
  StatusHeatmapHealthyDays,
  StatusHeatmapLegend,
} from "@/components/heatmap/status-heatmap";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import _statusData from "@/data/status-sample.json";
import _statusUptimeData from "@/data/status-uptime.json";

import type {
  StatusActivity,
  StatusValue,
} from "@/components/heatmap/status-heatmap";

const statusData = _statusData as StatusActivity[];
const statusUptimeData = _statusUptimeData as StatusActivity[];

const STATUS_LABELS: Record<StatusValue, string> = {
  0: "No Data",
  1: "Critical",
  2: "Degraded",
  3: "Healthy",
};

function StatusTooltip({
  activity,
}: {
  activity: { date: string; value: StatusValue };
}) {
  return (
    <TooltipContent
      side="top"
      className="pointer-events-none text-xs"
      sideOffset={6}
    >
      <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
      <p className="text-muted-foreground">{STATUS_LABELS[activity.value]}</p>
    </TooltipContent>
  );
}

export function StatusDefaultDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <StatusHeatmap data={statusData}>
        <StatusHeatmapBody>
          {({ activity, dayIndex }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
              </TooltipTrigger>
              <StatusTooltip activity={activity} />
            </Tooltip>
          )}
        </StatusHeatmapBody>
        <StatusHeatmapFooter>
          <StatusHeatmapHealthyDays />
          <StatusHeatmapLegend />
        </StatusHeatmapFooter>
      </StatusHeatmap>
    </TooltipProvider>
  );
}

export function StatusWithLabelsDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <StatusHeatmap data={statusData}>
        <StatusHeatmapBody showDateLabels labelInterval={30}>
          {({ activity, dayIndex }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
              </TooltipTrigger>
              <StatusTooltip activity={activity} />
            </Tooltip>
          )}
        </StatusHeatmapBody>
        <StatusHeatmapFooter>
          <StatusHeatmapHealthyDays />
          <StatusHeatmapLegend />
        </StatusHeatmapFooter>
      </StatusHeatmap>
    </TooltipProvider>
  );
}

export function StatusCustomColorDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <StatusHeatmap
        data={statusData}
        colors={{
          critical: "#dc2626",
          degraded: "#ea580c",
          healthy: "#16a34a",
        }}
      >
        <StatusHeatmapBody>
          {({ activity, dayIndex }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
              </TooltipTrigger>
              <StatusTooltip activity={activity} />
            </Tooltip>
          )}
        </StatusHeatmapBody>
        <StatusHeatmapFooter>
          <StatusHeatmapHealthyDays />
          <StatusHeatmapLegend />
        </StatusHeatmapFooter>
      </StatusHeatmap>
    </TooltipProvider>
  );
}

export function StatusCustomSizeDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <StatusHeatmap
        data={statusData}
        blockSize={60}
        blockSizeRatio={0.15}
        blockMargin={1}
      >
        <StatusHeatmapBody>
          {({ activity, dayIndex }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
              </TooltipTrigger>
              <StatusTooltip activity={activity} />
            </Tooltip>
          )}
        </StatusHeatmapBody>
        <StatusHeatmapFooter>
          <StatusHeatmapHealthyDays />
          <StatusHeatmapLegend />
        </StatusHeatmapFooter>
      </StatusHeatmap>
    </TooltipProvider>
  );
}

export function StatusUptimeDemo() {
  const last30Days = statusUptimeData;

  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <StatusHeatmap
        data={last30Days}
        blockSize={32}
        blockSizeRatio={0.25}
        blockMargin={1.5}
      >
        <StatusHeatmapBody>
          {({ activity, dayIndex }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
              </TooltipTrigger>
              <StatusTooltip activity={activity} />
            </Tooltip>
          )}
        </StatusHeatmapBody>
        <StatusHeatmapFooter>
          <StatusHeatmapHealthyDays />
          <StatusHeatmapLegend />
        </StatusHeatmapFooter>
      </StatusHeatmap>
    </TooltipProvider>
  );
}
