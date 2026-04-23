import { ja } from "date-fns/locale";

import {
  WeekdayHeatmap,
  WeekdayHeatmapBlock,
  WeekdayHeatmapBody,
  WeekdayHeatmapFooter,
  WeekdayHeatmapLegend,
  WeekdayHeatmapTotalCount,
} from "@/components/heatmap/weekday-heatmap";
import weekData from "@/data/weekday-sample.json";

import { HeatmapTooltip, TooltipProvider, WeekTooltipContent } from "./shared";

const weekRegularCells = weekData.filter((a) => a.weekday < 7 && a.hour < 24);
const weekAvgTemp =
  Math.round(
    (weekRegularCells.reduce((s, a) => s + a.value, 0) /
      weekRegularCells.length) *
      10
  ) / 10;

export function WeekDefaultDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} />}
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapTotalCount>
            {() => (
              <div className="text-muted-foreground">
                avg. {weekAvgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapTotalCount>
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekMondayStartDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        weekStart={1}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} />}
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekMinimalTicksDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
        labels={{
          hours: Array.from({ length: 24 }, (_, i) =>
            i % 6 === 0 ? String(i).padStart(2, "0") : ""
          ),
          endHour: null,
        }}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} />}
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekBinaryDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        maxLevel={1}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} />}
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekThreeBucketsDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        maxLevel={10}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} />}
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekJapaneseDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        totalCount={weekAvgTemp}
        isNormalized
        locale={ja}
        colors={{ scale: "var(--color-chart-2)" }}
        labels={{
          avg: "合計",
          legend: { less: "少ない", more: "多い" },
        }}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} />}
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapTotalCount>
            {({ totalCount }) => (
              <div className="text-muted-foreground">
                平均 {totalCount.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapTotalCount>
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekHideAvgDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
      >
        <WeekdayHeatmapBody hideAvgColumn hideAvgRow>
          {({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} />}
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekMiniDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
      >
        <WeekdayHeatmapBody hideHourLabels hideWeekdayLabels>
          {({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} />}
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekLargeBlocksDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        blockSize={32}
        blockMargin={3}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} />}
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function Week12HourDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        use12Hour
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} use12Hour />}
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekCustomStylingDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        isNormalized
        colors={{ scale: "var(--color-destructive)" }}
      >
        <WeekdayHeatmapBody labelTextClass="text-destructive font-bold">
          {({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} />}
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapTotalCount className="text-destructive">
            {() => (
              <div className="text-destructive">
                avg. {weekAvgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapTotalCount>
          <WeekdayHeatmapLegend className="text-destructive" />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}
