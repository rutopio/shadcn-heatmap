import { format, parseISO } from "date-fns";
import { zhTW } from "date-fns/locale";
import type { StatusValue } from "@/components/heatmap/status-heatmap";
import {
  StatusHeatmap,
  StatusHeatmapBlock,
  StatusHeatmapBody,
  StatusHeatmapFooter,
  StatusHeatmapLegend,
  StatusHeatmapStat,
} from "@/components/heatmap/status-heatmap";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import statusData from "@/data/status-sample.json";
import statusUptimeData from "@/data/status-uptime.json";
import { StatusExample } from "@/examples/status";

const STATUS_LABELS: Record<StatusValue, string> = {
  0: "No data",
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

export function StatusCustomStylingDemo() {
  return (
    <TooltipProvider delay={0}>
      <StatusHeatmap
        data={statusData}
        blockSize={60}
        blockAspectRatio={0.1}
        blockMargin={3}
        colors={{
          critical: "#dc2626",
          degraded: "#ea580c",
          healthy: "#16a34a",
        }}
      >
        <StatusHeatmapBody labelClassName="text-destructive font-bold">
          {({ activity, dayIndex }) => (
            <Tooltip>
              <TooltipTrigger
                tabIndex={0}
                render={
                  <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
                }
              />
              <StatusTooltip activity={activity} />
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

export function StatusNoFooterDemo() {
  return (
    <TooltipProvider delay={0}>
      <StatusHeatmap data={statusData}>
        <StatusHeatmapBody>
          {({ activity, dayIndex }) => (
            <Tooltip>
              <TooltipTrigger
                tabIndex={0}
                render={
                  <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
                }
              />
              <StatusTooltip activity={activity} />
            </Tooltip>
          )}
        </StatusHeatmapBody>
      </StatusHeatmap>
    </TooltipProvider>
  );
}

export function StatusNoLabelsDemo() {
  return (
    <TooltipProvider delay={0}>
      <StatusHeatmap data={statusData}>
        <StatusHeatmapBody hideDateLabels>
          {({ activity, dayIndex }) => (
            <Tooltip>
              <TooltipTrigger
                tabIndex={0}
                render={
                  <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
                }
              />
              <StatusTooltip activity={activity} />
            </Tooltip>
          )}
        </StatusHeatmapBody>
      </StatusHeatmap>
    </TooltipProvider>
  );
}

export function StatusCustomTooltipDemo() {
  return (
    <TooltipProvider delay={0}>
      <StatusHeatmap data={statusData}>
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
                className="pointer-events-none"
                sideOffset={6}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold">
                    {format(parseISO(activity.date), "EEEE, MMM d")}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none">
                      {activity.value === 0
                        ? "⬜"
                        : activity.value === 1
                          ? "🔴"
                          : activity.value === 2
                            ? "🟡"
                            : "🟢"}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {STATUS_LABELS[activity.value as StatusValue]}
                    </span>
                  </div>
                </div>
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

export function StatusI18nDemo() {
  return (
    <TooltipProvider delay={0}>
      <StatusHeatmap
        data={statusData}
        locale={zhTW}
        labels={{
          statuses: {
            noData: "無資料",
            critical: "嚴重異常",
            degraded: "效能降級",
            healthy: "運作正常",
          },
          stat: "{{value}} 天運作正常",
        }}
      >
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
                  {format(parseISO(activity.date), "PPP", { locale: zhTW })}
                </p>
                <p className="text-muted-foreground">
                  {activity.value === 0
                    ? "無資料"
                    : activity.value === 1
                      ? "嚴重異常"
                      : activity.value === 2
                        ? "效能降級"
                        : "運作正常"}
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

export function StatusDefaultDemo() {
  return <StatusExample data={statusData} />;
}

export function StatusWithLabelsDemo() {
  return (
    <TooltipProvider delay={0}>
      <StatusHeatmap data={statusData}>
        <StatusHeatmapBody labelInterval={15}>
          {({ activity, dayIndex }) => (
            <Tooltip>
              <TooltipTrigger
                tabIndex={0}
                render={
                  <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
                }
              />
              <StatusTooltip activity={activity} />
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

export function StatusUptimeDemo() {
  const last30Days = statusUptimeData;

  return (
    <TooltipProvider delay={0}>
      <StatusHeatmap
        data={last30Days}
        blockSize={32}
        blockAspectRatio={0.25}
        blockMargin={1.5}
      >
        <StatusHeatmapBody>
          {({ activity, dayIndex }) => (
            <Tooltip>
              <TooltipTrigger
                tabIndex={0}
                render={
                  <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
                }
              />
              <StatusTooltip activity={activity} />
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
