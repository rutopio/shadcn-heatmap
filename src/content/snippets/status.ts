import type { VariantSpec } from "../types";

export const statusSampleData = `// type StatusActivity = { date: string; value: 0 | 1 | 2 | 3 }
//   date: YYYY-MM-DD format
//   value: 0 = no-data (secondary)
//          1 = error (red)
//          2 = warning (orange)
//          3 = normal (green)

const data: StatusActivity[] = [
  { date: "2025-01-01", value: 3 },  // Normal
  { date: "2025-01-02", value: 3 },  // Normal
  { date: "2025-01-03", value: 2 },  // Warning
  { date: "2025-01-04", value: 1 },  // Error
  { date: "2025-01-05", value: 0 },  // No Data
  // ... more days
];`;

export const statusBasicCode = `import {
  StatusHeatmap,
  StatusHeatmapBlock,
  StatusHeatmapBody,
  StatusHeatmapFooter,
  StatusHeatmapLegend,
  StatusHeatmapNormalDays,
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
  1: "Error",
  2: "Warning",
  3: "Normal",
};

const data = [
  { date: "2025-01-01", value: 3 },  // Normal
  { date: "2025-01-02", value: 2 },  // Warning
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
          <StatusHeatmapNormalDays />
          <StatusHeatmapLegend />
        </StatusHeatmapFooter>
      </StatusHeatmap>
    </TooltipProvider>
  );
}`;

export const statusVariants: VariantSpec[] = [
  {
    title: "With date labels",
    description: "Show date labels below the timeline every N days.",
    code: `<StatusHeatmap data={data}>
  <StatusHeatmapBody showDateLabels labelInterval={30}>
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
    <StatusHeatmapNormalDays />
    <StatusHeatmapLegend />
  </StatusHeatmapFooter>
</StatusHeatmap>`,
  },
  {
    title: "Custom colors",
    description: "Customize error, warning, and normal status colors.",
    code: `<StatusHeatmap
  data={data}
  colors={{
    error: "#dc2626",
    warning: "#ea580c",
    normal: "#16a34a",
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
    <StatusHeatmapNormalDays />
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
    <StatusHeatmapNormalDays />
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
    <StatusHeatmapNormalDays />
    <StatusHeatmapLegend />
  </StatusHeatmapFooter>
</StatusHeatmap>`,
  },
];
