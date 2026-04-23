import type { VariantSpec } from "../types";

export const statusSampleData = `// type StatusActivity = { date: string; value: 0 | 1 | 2 | 3 }
//   date: YYYY-MM-DD format
//   value: 0 = no-data (secondary)
//          1 = critical (red)
//          2 = degraded (orange)
//          3 = healthy (green)

const data: StatusActivity[] = [
  { date: "2025-01-01", value: 3 },  // Healthy
  { date: "2025-01-02", value: 3 },  // Healthy
  { date: "2025-01-03", value: 2 },  // Degraded
  { date: "2025-01-04", value: 1 },  // Critical
  { date: "2025-01-05", value: 0 },  // No Data
  // ... more days
];`;

export const statusBasicCode = `import {
  StatusHeatmap,
  StatusHeatmapBlock,
  StatusHeatmapBody,
  StatusHeatmapFooter,
  StatusHeatmapStat,
  StatusHeatmapLegend,
  type StatusValue,
} from "@/components/heatmap/status-heatmap";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, parseISO } from "date-fns";

const STATUS_LABELS: Record<StatusValue, string> = {
  0: "No Data",
  1: "Critical",
  2: "Degraded",
  3: "Healthy",
};

const data = [
  { date: "2025-01-01", value: 3 },  // Healthy
  { date: "2025-01-02", value: 2 },  // Degraded
  // ... 90 days
];

export function StatusTimeline() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <StatusHeatmap data={data}>
        <StatusHeatmapBody>
          {({ activity, dayIndex }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
              </TooltipTrigger>
              <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
                <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
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
}`;

export const statusVariants: VariantSpec[] = [
  {
    title: "Custom date label interval",
    description:
      "Date labels are shown by default. Use `labelInterval` to control how often they appear.",
    code: `<StatusHeatmap data={data}>
  <StatusHeatmapBody labelInterval={30}>
    {({ activity, dayIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
          <p className="text-muted-foreground">{STATUS_LABELS[activity.value]}</p>
        </TooltipContent>
      </Tooltip>
    )}
  </StatusHeatmapBody>
  <StatusHeatmapFooter>
    <StatusHeatmapStat />
    <StatusHeatmapLegend />
  </StatusHeatmapFooter>
</StatusHeatmap>`,
  },
  {
    title: "Custom colors",
    description: "Customize critical, degraded, and healthy status colors.",
    code: `<StatusHeatmap
  data={data}
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
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
          <p className="text-muted-foreground">{STATUS_LABELS[activity.value]}</p>
        </TooltipContent>
      </Tooltip>
    )}
  </StatusHeatmapBody>
  <StatusHeatmapFooter>
    <StatusHeatmapStat />
    <StatusHeatmapLegend />
  </StatusHeatmapFooter>
</StatusHeatmap>`,
  },
  {
    title: "Custom block size",
    description: "Adjust height and width ratio for different visual styles.",
    code: `<StatusHeatmap
  data={data}
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
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
          <p className="text-muted-foreground">{STATUS_LABELS[activity.value]}</p>
        </TooltipContent>
      </Tooltip>
    )}
  </StatusHeatmapBody>
  <StatusHeatmapFooter>
    <StatusHeatmapStat />
    <StatusHeatmapLegend />
  </StatusHeatmapFooter>
</StatusHeatmap>`,
  },
  {
    title: "Compact (30 days)",
    description: "Show a shorter time period with smaller blocks.",
    code: `<StatusHeatmap
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
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          <p className="font-medium">{format(parseISO(activity.date), "PPP")}</p>
          <p className="text-muted-foreground">{STATUS_LABELS[activity.value]}</p>
        </TooltipContent>
      </Tooltip>
    )}
  </StatusHeatmapBody>
  <StatusHeatmapFooter>
    <StatusHeatmapStat />
    <StatusHeatmapLegend />
  </StatusHeatmapFooter>
</StatusHeatmap>`,
  },
];
