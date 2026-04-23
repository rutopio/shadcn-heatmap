import { es } from "date-fns/locale";

import {
  DateHeatmap,
  DateHeatmapBlock,
  DateHeatmapBody,
  DateHeatmapFooter,
  DateHeatmapLegend,
  DateHeatmapStat,
} from "@/components/heatmap/date-heatmap";
import dateData from "@/data/date-sample.json";

import { DateTooltipContent, HeatmapTooltip, TooltipProvider } from "./shared";

import type { DateHourlyActivity } from "@/components/heatmap/date-heatmap";

const dateTotalMm =
  Math.round(dateData.reduce((s, a) => s + a.value, 0) * 10) / 10;

const sumByHour = (data: DateHourlyActivity[]) => {
  const sums = new Array(24).fill(0);
  data.forEach((a) => {
    sums[a.hour] += a.value;
  });
  return sums;
};

const sumByDate = (data: DateHourlyActivity[], dates: string[]) => {
  const map = new Map<string, number>();
  data.forEach((a) => {
    map.set(a.date, (map.get(a.date) ?? 0) + a.value);
  });
  return dates.map((d) => map.get(d) ?? 0);
};

export function DateDefaultDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap
        data={dateData}
        totalCount={dateTotalMm}
        colors={{ scale: "var(--color-chart-3)" }}
        extraRow={{ label: "Total", compute: sumByHour }}
        extraColumn={{ label: "Total", compute: sumByDate }}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex, extra }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent activity={activity} extra={extra} />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra={extra}
              />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                {dateTotalMm.toFixed(1)} mm total
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateTenLevelsDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap
        data={dateData}
        levels={10}
        colors={{ scale: "var(--color-chart-3)" }}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex, extra }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent activity={activity} extra={extra} />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra={extra}
              />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapLegend />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateIsoDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap
        data={dateData}
        dateFormat="yyyy-MM-dd"
        colors={{ scale: "var(--color-chart-3)" }}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex, extra }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent activity={activity} extra={extra} />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra={extra}
              />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateSparseTicksDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap
        data={dateData}
        colors={{ scale: "var(--color-chart-3)" }}
        labels={{
          hours: Array.from({ length: 24 }, (_, i) =>
            i % 6 === 0 ? String(i).padStart(2, "0") : ""
          ),
          endHour: null,
        }}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex, extra }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent activity={activity} extra={extra} />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra={extra}
              />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateHideSumColumnDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap data={dateData} colors={{ scale: "var(--color-chart-3)" }}>
        <DateHeatmapBody>
          {({ activity, dateIndex, extra }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent activity={activity} extra={extra} />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra={extra}
              />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateNoLabelsDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap data={dateData} colors={{ scale: "var(--color-chart-3)" }}>
        <DateHeatmapBody hideDateLabels hideHourLabels>
          {({ activity, dateIndex, extra }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent activity={activity} extra={extra} />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra={extra}
              />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateLargeBlocksDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap
        data={dateData}
        totalCount={dateTotalMm}
        blockSize={32}
        blockMargin={3}
        colors={{ scale: "var(--color-chart-3)" }}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex, extra }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent activity={activity} extra={extra} />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra={extra}
              />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                {dateTotalMm.toFixed(1)} mm total
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function Date12HourDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap
        data={dateData}
        totalCount={dateTotalMm}
        use12Hour
        colors={{ scale: "var(--color-chart-3)" }}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex, extra }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent
                  activity={activity}
                  extra={extra}
                  use12Hour
                />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra={extra}
              />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                {dateTotalMm.toFixed(1)} mm total
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateSpanishDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap
        data={dateData}
        totalCount={dateTotalMm}
        locale={es}
        colors={{ scale: "var(--color-chart-3)" }}
        extraRow={{ label: "Total", compute: sumByHour }}
        extraColumn={{ label: "Total", compute: sumByDate }}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex, extra }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent
                  activity={activity}
                  extra={extra}
                  locale={es}
                />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra={extra}
              />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {({ value }) => (
              <div className="text-muted-foreground tabular-nums">
                {Number(value).toFixed(1)} mm total
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend labels={{ less: "Menos", more: "Más" }} />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateCustomStylingDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap
        data={dateData}
        totalCount={dateTotalMm}
        colors={{ scale: "var(--color-destructive)" }}
      >
        <DateHeatmapBody labelClassName="text-destructive font-bold">
          {({ activity, dateIndex, extra }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent activity={activity} extra={extra} />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra={extra}
              />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat className="text-destructive">
            {() => (
              <div className="text-destructive tabular-nums">
                {dateTotalMm.toFixed(1)} mm total
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend className="text-destructive" />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}
