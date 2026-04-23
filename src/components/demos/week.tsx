import { ja } from "date-fns/locale";

import {
  WeekdayHeatmap,
  WeekdayHeatmapBlock,
  WeekdayHeatmapBody,
  WeekdayHeatmapFooter,
  WeekdayHeatmapLegend,
  WeekdayHeatmapStat,
} from "@/components/heatmap/weekday-heatmap";
import weekData from "@/data/weekday-sample.json";

import { HeatmapTooltip, TooltipProvider, WeekTooltipContent } from "./shared";

import type { WeekdayHourlyActivity } from "@/components/heatmap/weekday-heatmap";

const weekAvgTemp =
  Math.round(
    (weekData.reduce((s, a) => s + a.value, 0) / weekData.length) * 10
  ) / 10;

const avgByHour = (data: WeekdayHourlyActivity[]) => {
  const sums = new Array(24).fill(0);
  const counts = new Array(24).fill(0);
  data.forEach((a) => {
    sums[a.hour] += a.value;
    counts[a.hour] += 1;
  });
  return sums.map((s, i) => (counts[i] ? s / counts[i] : 0));
};

const avgByWeekday = (data: WeekdayHourlyActivity[]) => {
  const sums = new Array(7).fill(0);
  const counts = new Array(7).fill(0);
  data.forEach((a) => {
    sums[a.weekday] += a.value;
    counts[a.weekday] += 1;
  });
  return sums.map((s, i) => (counts[i] ? s / counts[i] : 0));
};

export function WeekDefaultDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody>
          {({ activity, extra }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} extra={extra} />}
            >
              <WeekdayHeatmapBlock activity={activity} extra={extra} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                avg. {weekAvgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
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
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody>
          {({ activity, extra }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} extra={extra} />}
            >
              <WeekdayHeatmapBlock activity={activity} extra={extra} />
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
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody>
          {({ activity, extra }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} extra={extra} />}
            >
              <WeekdayHeatmapBlock activity={activity} extra={extra} />
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
        levels={2}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
      >
        <WeekdayHeatmapBody>
          {({ activity, extra }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} extra={extra} />}
            >
              <WeekdayHeatmapBlock activity={activity} extra={extra} />
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
        levels={10}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
      >
        <WeekdayHeatmapBody>
          {({ activity, extra }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} extra={extra} />}
            >
              <WeekdayHeatmapBlock activity={activity} extra={extra} />
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
        extraRow={{ label: "合計", compute: avgByHour }}
        extraColumn={{ label: "合計", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody>
          {({ activity, extra }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} extra={extra} />}
            >
              <WeekdayHeatmapBlock activity={activity} extra={extra} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapStat>
            {({ value }) => (
              <div className="text-muted-foreground tabular-nums">
                平均 {Number(value).toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend labels={{ less: "少ない", more: "多い" }} />
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
        <WeekdayHeatmapBody>
          {({ activity, extra }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} extra={extra} />}
            >
              <WeekdayHeatmapBlock activity={activity} extra={extra} />
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
          {({ activity, extra }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} extra={extra} />}
            >
              <WeekdayHeatmapBlock activity={activity} extra={extra} />
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
          {({ activity, extra }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} extra={extra} />}
            >
              <WeekdayHeatmapBlock activity={activity} extra={extra} />
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
          {({ activity, extra }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent
                  activity={activity}
                  extra={extra}
                  use12Hour
                />
              }
            >
              <WeekdayHeatmapBlock activity={activity} extra={extra} />
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
        <WeekdayHeatmapBody labelClassName="text-destructive font-bold">
          {({ activity, extra }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} extra={extra} />}
            >
              <WeekdayHeatmapBlock activity={activity} extra={extra} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapStat className="text-destructive">
            {() => (
              <div className="text-destructive">
                avg. {weekAvgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend className="text-destructive" />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}
