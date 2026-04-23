import { es } from "date-fns/locale";

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
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dateData from "@/data/date-sample.json";

import {
  DateTooltipContent,
  HeatmapTooltip,
  TooltipProvider,
} from "../_shared/tooltips";

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

const medianByHour = (data: DateHourlyActivity[]) => {
  const byHour = Array.from({ length: 24 }, () => [] as number[]);
  data.forEach((a) => byHour[a.hour].push(a.value));
  return byHour.map((arr) => {
    const s = [...arr].sort((x, y) => x - y);
    return s.length ? s[Math.floor(s.length / 2)] : 0;
  });
};

const medianByDate = (data: DateHourlyActivity[], dates: string[]) => {
  const byDate = new Map<string, number[]>();
  data.forEach((a) => {
    if (!byDate.has(a.date)) byDate.set(a.date, []);
    byDate.get(a.date)!.push(a.value);
  });
  return dates.map((date) => {
    const arr = [...(byDate.get(date) ?? [])].sort((x, y) => x - y);
    return arr.length ? arr[Math.floor(arr.length / 2)] : 0;
  });
};

const p95ByDate = (data: DateHourlyActivity[], dates: string[]) => {
  const byDate = new Map<string, number[]>();
  data.forEach((a) => {
    if (!byDate.has(a.date)) byDate.set(a.date, []);
    byDate.get(a.date)!.push(a.value);
  });
  return dates.map((date) => {
    const arr = [...(byDate.get(date) ?? [])].sort((x, y) => x - y);
    return arr.length ? arr[Math.floor(arr.length * 0.95)] : 0;
  });
};

const dateMedianMm = (() => {
  const sorted = [...dateData].sort((a, b) => a.value - b.value);
  return Math.round(sorted[Math.floor(sorted.length / 2)].value * 10) / 10;
})();

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
        <DateHeatmapBody
          renderExtraRow={({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} extra="row" />}
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra="row"
              />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent activity={activity} extra="column" />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra="column"
              />
            </HeatmapTooltip>
          )}
        >
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} />}
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Total Rainfall: {dateTotalMm.toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend labels={{ less: "Dry", more: "Humid" }} />
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
        extraRow={{ label: "Total", compute: sumByHour }}
        extraColumn={{ label: "Total", compute: sumByDate }}
      >
        <DateHeatmapBody
          renderExtraRow={({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} extra="row" />}
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra="row"
              />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent activity={activity} extra="column" />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra="column"
              />
            </HeatmapTooltip>
          )}
        >
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} />}
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Total Rainfall: {dateTotalMm.toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend labels={{ less: "Dry", more: "Humid" }} />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateCustomTooltipDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap
        data={dateData}
        colors={{ scale: "var(--color-chart-3)" }}
        extraRow={{ label: "Total", compute: sumByHour }}
        extraColumn={{ label: "Total", compute: sumByDate }}
      >
        <DateHeatmapBody
          renderExtraRow={({ activity, dateIndex }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <DateHeatmapBlock
                  activity={activity}
                  dateIndex={dateIndex}
                  extra="row"
                />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="pointer-events-none"
                sideOffset={6}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold">
                    Total, {String(activity.hour).padStart(2, "0")}:00
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none">
                      {activity.value === 0
                        ? "☀️"
                        : activity.value < 1
                          ? "🌦️"
                          : activity.value < 5
                            ? "🌧️"
                            : "⛈️"}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {activity.value.toFixed(1)} mm total
                    </span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
          renderExtraColumn={({ activity, dateIndex }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <DateHeatmapBlock
                  activity={activity}
                  dateIndex={dateIndex}
                  extra="column"
                />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="pointer-events-none"
                sideOffset={6}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold">
                    {activity.date}, Total
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none">
                      {activity.value === 0
                        ? "☀️"
                        : activity.value < 1
                          ? "🌦️"
                          : activity.value < 5
                            ? "🌧️"
                            : "⛈️"}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {activity.value.toFixed(1)} mm total
                    </span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        >
          {({ activity, dateIndex }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="pointer-events-none"
                sideOffset={6}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold">
                    {activity.date}, {String(activity.hour).padStart(2, "0")}:00
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none">
                      {activity.value === 0
                        ? "☀️"
                        : activity.value < 1
                          ? "🌦️"
                          : activity.value < 5
                            ? "🌧️"
                            : "⛈️"}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {activity.value.toFixed(1)} mm
                    </span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Total Rainfall: {dateTotalMm.toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend labels={{ less: "Dry", more: "Humid" }} />
        </DateHeatmapFooter>
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
        extraRow={{ label: "Total", compute: sumByHour }}
        extraColumn={{ label: "Total", compute: sumByDate }}
      >
        <DateHeatmapBody
          renderExtraRow={({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} extra="row" />}
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra="row"
              />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent activity={activity} extra="column" />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra="column"
              />
            </HeatmapTooltip>
          )}
        >
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} />}
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Total Rainfall: {dateTotalMm.toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend labels={{ less: "Dry", more: "Humid" }} />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DatePlainGridDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap data={dateData} colors={{ scale: "var(--color-chart-3)" }}>
        <DateHeatmapBody>
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} />}
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Total Rainfall: {dateTotalMm.toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend labels={{ less: "Dry", more: "Humid" }} />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateNoLabelsDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap data={dateData} colors={{ scale: "var(--color-chart-3)" }}>
        <DateHeatmapBody hideDateLabels hideHourLabels>
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} />}
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
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
        extraRow={{ label: "Total", compute: sumByHour }}
        extraColumn={{ label: "Total", compute: sumByDate }}
      >
        <DateHeatmapBody
          renderExtraRow={({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent activity={activity} extra="row" use12Hour />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra="row"
              />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent
                  activity={activity}
                  extra="column"
                  use12Hour
                />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra="column"
              />
            </HeatmapTooltip>
          )}
        >
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} use12Hour />}
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Total Rainfall: {dateTotalMm.toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend labels={{ less: "Dry", more: "Humid" }} />
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
        <DateHeatmapBody
          renderExtraRow={({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent
                  activity={activity}
                  extra="row"
                  locale={es}
                />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra="row"
              />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent
                  activity={activity}
                  extra="column"
                  locale={es}
                />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra="column"
              />
            </HeatmapTooltip>
          )}
        >
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} locale={es} />}
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {({ value }) => (
              <div className="text-muted-foreground tabular-nums">
                Lluvia total: {Number(value).toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend labels={{ less: "Seco", more: "Húmedo" }} />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateP95Demo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap
        data={dateData}
        colors={{ scale: "var(--color-chart-3)" }}
        extraRow={{ label: "Total", compute: sumByHour }}
        extraColumn={{ label: <strong>P95</strong>, compute: p95ByDate }}
      >
        <DateHeatmapBody
          renderExtraRow={({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} extra="row" />}
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra="row"
              />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent activity={activity} extra="column" />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra="column"
              />
            </HeatmapTooltip>
          )}
        >
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} />}
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Total Rainfall: {dateTotalMm.toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend labels={{ less: "Dry", more: "Humid" }} />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateMedianDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap
        data={dateData}
        colors={{ scale: "var(--color-chart-3)" }}
        extraRow={{ label: "Median", compute: medianByHour }}
        extraColumn={{ label: "Median", compute: medianByDate }}
      >
        <DateHeatmapBody
          renderExtraRow={({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} extra="row" />}
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra="row"
              />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent activity={activity} extra="column" />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra="column"
              />
            </HeatmapTooltip>
          )}
        >
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} />}
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Median Rainfall: {dateMedianMm.toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend labels={{ less: "Dry", more: "Humid" }} />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateNoFooterDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap
        data={dateData}
        colors={{ scale: "var(--color-chart-3)" }}
        extraRow={{ label: "Total", compute: sumByHour }}
        extraColumn={{ label: "Total", compute: sumByDate }}
      >
        <DateHeatmapBody
          renderExtraRow={({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} extra="row" />}
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra="row"
              />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent activity={activity} extra="column" />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra="column"
              />
            </HeatmapTooltip>
          )}
        >
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} />}
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
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
        blockSize={32}
        blockMargin={3}
        colors={{ scale: "var(--color-destructive)" }}
        extraRow={{ label: "Total", compute: sumByHour }}
        extraColumn={{ label: "Total", compute: sumByDate }}
      >
        <DateHeatmapBody
          labelClassName="text-destructive font-bold"
          renderExtraRow={({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} extra="row" />}
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra="row"
              />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent activity={activity} extra="column" />
              }
            >
              <DateHeatmapBlock
                activity={activity}
                dateIndex={dateIndex}
                extra="column"
              />
            </HeatmapTooltip>
          )}
        >
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} />}
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat className="text-destructive">
            {() => (
              <div className="text-destructive tabular-nums">
                Total Rainfall: {dateTotalMm.toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend
            className="text-destructive"
            labels={{ less: "Dry", more: "Humid" }}
          />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}
