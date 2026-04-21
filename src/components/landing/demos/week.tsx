import { ja } from "date-fns/locale";

import {
  WeekdayHeatmap,
  WeekdayHeatmapBlock,
  WeekdayHeatmapBody,
  WeekdayHeatmapFooter,
  WeekdayHeatmapLegend,
  WeekdayHeatmapTotalCount,
} from "@/components/heatmap/weekday-heatmap";
import { generateWeekSample } from "@/data/week-sample";

import { HeatmapTooltip, TooltipProvider, WeekTooltipContent } from "./shared";

const weekData = generateWeekSample(17);

export function WeekDefaultDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap data={weekData}>
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
          <WeekdayHeatmapTotalCount />
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekMondayStartDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap data={weekData} weekStart={1}>
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
      <WeekdayHeatmap data={weekData} maxLevel={1}>
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
      <WeekdayHeatmap data={weekData} maxLevel={10}>
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
        locale={ja}
        labels={{
          sum: "合計",
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
              <div className="text-muted-foreground">{totalCount} 件の活動</div>
            )}
          </WeekdayHeatmapTotalCount>
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekHideSumDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap data={weekData}>
        <WeekdayHeatmapBody hideSumColumn hideSumRow>
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
      <WeekdayHeatmap data={weekData}>
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
      <WeekdayHeatmap data={weekData} blockSize={32} blockMargin={3}>
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
      <WeekdayHeatmap data={weekData} use12Hour>
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
      <WeekdayHeatmap data={weekData} colors={{ scale: "#22c55e" }}>
        <WeekdayHeatmapBody labelTextClass="text-green-700 font-bold">
          {({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} />}
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapTotalCount className="text-green-700" />
          <WeekdayHeatmapLegend className="text-green-700" />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}
