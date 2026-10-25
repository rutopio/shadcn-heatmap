import { ja } from "date-fns/locale";
import type { WeekdayHourlyActivity } from "@/components/heatmap/weekday-heatmap";
import {
  WeekdayHeatmap,
  WeekdayHeatmapBlock,
  WeekdayHeatmapBody,
  WeekdayHeatmapFooter,
  WeekdayHeatmapLegend,
  WeekdayHeatmapStat,
} from "@/components/heatmap/weekday-heatmap";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import weekData from "@/data/weekday-sample.json";
import { WeekdayExample } from "@/examples/weekday";
import { median } from "@/lib/statistics";
import {
  generateWeekdayNames,
  HeatmapTooltip,
  TooltipProvider,
  WeekTooltipContent,
} from "../_shared/tooltips";

const weekAvgTemp =
  Math.round(
    (weekData.reduce((s, a) => s + a.value, 0) / weekData.length) * 10,
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

const medianByHour = (data: WeekdayHourlyActivity[]) => {
  const byHour = Array.from({ length: 24 }, () => [] as number[]);
  data.forEach((a) => {
    byHour[a.hour].push(a.value);
  });
  return byHour.map((arr) => {
    return median(arr);
  });
};

const medianByWeekday = (data: WeekdayHourlyActivity[]) => {
  const byWeekday = Array.from({ length: 7 }, () => [] as number[]);
  data.forEach((a) => {
    byWeekday[a.weekday].push(a.value);
  });
  return byWeekday.map((arr) => {
    return median(arr);
  });
};

const weekMedianTemp = median(weekData.map((activity) => activity.value));

export function WeekdayDefaultDemo() {
  return <WeekdayExample data={weekData} />;
}

export function WeekdayMondayStartDemo() {
  return (
    <TooltipProvider delay={0}>
      <WeekdayHeatmap
        data={weekData}
        weekStart={1}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent
                  activity={activity}
                  extra={activity.extra}
                />
              }
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Average temperature: {weekAvgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend labels={{ less: "Cold", more: "Hot" }} />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekdayMinimalTicksDemo() {
  return (
    <TooltipProvider delay={0}>
      <WeekdayHeatmap
        data={weekData}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
        labels={{
          hours: Array.from({ length: 24 }, (_, i) =>
            i % 6 === 0 ? String(i).padStart(2, "0") : "",
          ),
          endHour: null,
        }}
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent
                  activity={activity}
                  extra={activity.extra}
                />
              }
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Average temperature: {weekAvgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend labels={{ less: "Cold", more: "Hot" }} />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekdayTenLevelsDemo() {
  return (
    <TooltipProvider delay={0}>
      <WeekdayHeatmap
        data={weekData}
        levels={10}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent
                  activity={activity}
                  extra={activity.extra}
                />
              }
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapLegend labels={{ less: "Cold", more: "Hot" }} />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekdayJapaneseDemo() {
  return (
    <TooltipProvider delay={0}>
      <WeekdayHeatmap
        data={weekData}
        totalCount={weekAvgTemp}
        isNormalized
        locale={ja}
        colors={{ scale: "var(--color-chart-2)" }}
        extraRow={{ label: "平均", compute: avgByHour }}
        extraColumn={{ label: "平均", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent
                  activity={activity}
                  extra={activity.extra}
                  locale={ja}
                  aggregateLabel="平均"
                  aggregatePrefix="平均 "
                />
              }
            >
              <WeekdayHeatmapBlock activity={activity} />
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
          <WeekdayHeatmapLegend labels={{ less: "寒い", more: "暑い" }} />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekdayPlainGridDemo() {
  return (
    <TooltipProvider delay={0}>
      <WeekdayHeatmap
        data={weekData}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent
                  activity={activity}
                  extra={activity.extra}
                />
              }
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Average temperature: {weekAvgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend labels={{ less: "Cold", more: "Hot" }} />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekdayMiniDemo() {
  return (
    <TooltipProvider delay={0}>
      <WeekdayHeatmap
        data={weekData}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
      >
        <WeekdayHeatmapBody hideHourLabels hideWeekdayLabels>
          {({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent
                  activity={activity}
                  extra={activity.extra}
                />
              }
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function Weekday12HourDemo() {
  return (
    <TooltipProvider delay={0}>
      <WeekdayHeatmap
        data={weekData}
        use12Hour
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent
                  activity={activity}
                  extra={activity.extra}
                  use12Hour
                />
              }
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Average temperature: {weekAvgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend labels={{ less: "Cold", more: "Hot" }} />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekdayMedianDemo() {
  return (
    <TooltipProvider delay={0}>
      <WeekdayHeatmap
        data={weekData}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
        extraRow={{ label: "Median", compute: medianByHour }}
        extraColumn={{ label: "Median", compute: medianByWeekday }}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent
                  activity={activity}
                  extra={activity.extra}
                  aggregateLabel="Median"
                  aggregatePrefix="Median "
                />
              }
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Median temperature: {weekMedianTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend labels={{ less: "Cold", more: "Hot" }} />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

const WEEKDAY_NAMES = generateWeekdayNames();

export function WeekdayCustomTooltipDemo() {
  return (
    <TooltipProvider delay={0}>
      <WeekdayHeatmap
        data={weekData}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <Tooltip>
              <TooltipTrigger
                tabIndex={0}
                render={<WeekdayHeatmapBlock activity={activity} />}
              />
              <TooltipContent
                side="top"
                className="pointer-events-none"
                sideOffset={6}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold">
                    {WEEKDAY_NAMES[activity.weekday]},{" "}
                    {`${String(activity.hour).padStart(2, "0")}:00`}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none">
                      {activity.value < 5
                        ? "🥶"
                        : activity.value < 15
                          ? "😊"
                          : activity.value < 25
                            ? "☀️"
                            : "🔥"}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {activity.value.toFixed(1)} °C
                    </span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Average temperature: {weekAvgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend labels={{ less: "Cold", more: "Hot" }} />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekdayNoFooterDemo() {
  return (
    <TooltipProvider delay={0}>
      <WeekdayHeatmap
        data={weekData}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody>
          {({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent
                  activity={activity}
                  extra={activity.extra}
                />
              }
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekdayCustomStylingDemo() {
  return (
    <TooltipProvider delay={0}>
      <WeekdayHeatmap
        data={weekData}
        blockSize={32}
        blockMargin={3}
        isNormalized
        colors={{ scale: "var(--color-destructive)" }}
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody labelClassName="text-destructive font-bold">
          {({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent
                  activity={activity}
                  extra={activity.extra}
                />
              }
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapStat className="text-destructive">
            {() => (
              <div className="text-destructive">
                Average temperature: {weekAvgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend
            className="text-destructive"
            labels={{ less: "Cold", more: "Hot" }}
          />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}
