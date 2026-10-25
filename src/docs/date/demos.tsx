import { es } from "date-fns/locale";
import type { DateHourlyActivity } from "@/components/heatmap/date-heatmap";
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
import { DateExample } from "@/examples/date";
import { median } from "@/lib/statistics";
import {
  DateTooltipContent,
  HeatmapTooltip,
  TooltipProvider,
} from "../_shared/tooltips";

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
  data.forEach((a) => {
    byHour[a.hour].push(a.value);
  });
  return byHour.map((arr) => {
    return median(arr);
  });
};

const medianByDate = (data: DateHourlyActivity[], dates: string[]) => {
  const byDate = new Map<string, number[]>();
  data.forEach((a) => {
    if (!byDate.has(a.date)) byDate.set(a.date, []);
    byDate.get(a.date)?.push(a.value);
  });
  return dates.map((date) => {
    return median(byDate.get(date) ?? []);
  });
};

const dateMedianMm = median(dateData.map((activity) => activity.value));

export function DateDefaultDemo() {
  return <DateExample data={dateData} />;
}

export function DateTenLevelsDemo() {
  return (
    <TooltipProvider delay={0}>
      <DateHeatmap
        data={dateData}
        levels={10}
        colors={{ scale: "var(--color-chart-3)" }}
        extraRow={{ label: "Total", compute: sumByHour }}
        extraColumn={{ label: "Total", compute: sumByDate }}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent
                  activity={activity}
                  extra={activity.extra}
                />
              }
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Total rainfall: {dateTotalMm.toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend
            labels={{ less: "Less rain", more: "More rain" }}
          />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateCustomTooltipDemo() {
  return (
    <TooltipProvider delay={0}>
      <DateHeatmap
        data={dateData}
        colors={{ scale: "var(--color-chart-3)" }}
        extraRow={{ label: "Total", compute: sumByHour }}
        extraColumn={{ label: "Total", compute: sumByDate }}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex }) => (
            <Tooltip>
              <TooltipTrigger
                tabIndex={0}
                render={
                  <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
                }
              />
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
                Total rainfall: {dateTotalMm.toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend
            labels={{ less: "Less rain", more: "More rain" }}
          />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateSparseTicksDemo() {
  return (
    <TooltipProvider delay={0}>
      <DateHeatmap
        data={dateData}
        colors={{ scale: "var(--color-chart-3)" }}
        labels={{
          hours: Array.from({ length: 24 }, (_, i) =>
            i % 6 === 0 ? String(i).padStart(2, "0") : "",
          ),
          endHour: null,
        }}
        extraRow={{ label: "Total", compute: sumByHour }}
        extraColumn={{ label: "Total", compute: sumByDate }}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent
                  activity={activity}
                  extra={activity.extra}
                />
              }
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Total rainfall: {dateTotalMm.toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend
            labels={{ less: "Less rain", more: "More rain" }}
          />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DatePlainGridDemo() {
  return (
    <TooltipProvider delay={0}>
      <DateHeatmap data={dateData} colors={{ scale: "var(--color-chart-3)" }}>
        <DateHeatmapBody>
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent
                  activity={activity}
                  extra={activity.extra}
                />
              }
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Total rainfall: {dateTotalMm.toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend
            labels={{ less: "Less rain", more: "More rain" }}
          />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateNoLabelsDemo() {
  return (
    <TooltipProvider delay={0}>
      <DateHeatmap data={dateData} colors={{ scale: "var(--color-chart-3)" }}>
        <DateHeatmapBody hideDateLabels hideHourLabels>
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent
                  activity={activity}
                  extra={activity.extra}
                />
              }
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
    <TooltipProvider delay={0}>
      <DateHeatmap
        data={dateData}
        totalCount={dateTotalMm}
        use12Hour
        colors={{ scale: "var(--color-chart-3)" }}
        extraRow={{ label: "Total", compute: sumByHour }}
        extraColumn={{ label: "Total", compute: sumByDate }}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent
                  activity={activity}
                  extra={activity.extra}
                  use12Hour
                />
              }
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Total rainfall: {dateTotalMm.toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend
            labels={{ less: "Less rain", more: "More rain" }}
          />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateSpanishDemo() {
  return (
    <TooltipProvider delay={0}>
      <DateHeatmap
        data={dateData}
        totalCount={dateTotalMm}
        locale={es}
        colors={{ scale: "var(--color-chart-3)" }}
        extraRow={{ label: "Total", compute: sumByHour }}
        extraColumn={{ label: "Total", compute: sumByDate }}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent
                  activity={activity}
                  extra={activity.extra}
                  locale={es}
                />
              }
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
          <DateHeatmapLegend
            labels={{ less: "Menos lluvia", more: "Más lluvia" }}
          />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateMedianDemo() {
  return (
    <TooltipProvider delay={0}>
      <DateHeatmap
        data={dateData}
        colors={{ scale: "var(--color-chart-3)" }}
        extraRow={{ label: "Median", compute: medianByHour }}
        extraColumn={{ label: "Median", compute: medianByDate }}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent
                  aggregateLabel="Median"
                  activity={activity}
                  extra={activity.extra}
                />
              }
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Median rainfall: {dateMedianMm.toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend
            labels={{ less: "Less rain", more: "More rain" }}
          />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}

export function DateNoFooterDemo() {
  return (
    <TooltipProvider delay={0}>
      <DateHeatmap
        data={dateData}
        colors={{ scale: "var(--color-chart-3)" }}
        extraRow={{ label: "Total", compute: sumByHour }}
        extraColumn={{ label: "Total", compute: sumByDate }}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent
                  activity={activity}
                  extra={activity.extra}
                />
              }
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
    <TooltipProvider delay={0}>
      <DateHeatmap
        data={dateData}
        totalCount={dateTotalMm}
        blockSize={32}
        blockMargin={3}
        colors={{ scale: "var(--color-destructive)" }}
        extraRow={{ label: "Total", compute: sumByHour }}
        extraColumn={{ label: "Total", compute: sumByDate }}
      >
        <DateHeatmapBody labelClassName="text-destructive font-bold">
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <DateTooltipContent
                  activity={activity}
                  extra={activity.extra}
                />
              }
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapStat className="text-destructive">
            {() => (
              <div className="text-destructive tabular-nums">
                Total rainfall: {dateTotalMm.toFixed(1)} mm
              </div>
            )}
          </DateHeatmapStat>
          <DateHeatmapLegend
            className="text-destructive"
            labels={{ less: "Less rain", more: "More rain" }}
          />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}
