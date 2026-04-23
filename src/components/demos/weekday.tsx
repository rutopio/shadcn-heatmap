import { ja } from "date-fns/locale";

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

import {
  generateWeekdayNames,
  HeatmapTooltip,
  TooltipProvider,
  WeekTooltipContent,
} from "./shared";

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

const medianByHour = (data: WeekdayHourlyActivity[]) => {
  const byHour = Array.from({ length: 24 }, () => [] as number[]);
  data.forEach((a) => byHour[a.hour].push(a.value));
  return byHour.map((arr) => {
    const s = [...arr].sort((x, y) => x - y);
    return s.length ? s[Math.floor(s.length / 2)] : 0;
  });
};

const medianByWeekday = (data: WeekdayHourlyActivity[]) => {
  const byWeekday = Array.from({ length: 7 }, () => [] as number[]);
  data.forEach((a) => byWeekday[a.weekday].push(a.value));
  return byWeekday.map((arr) => {
    const s = [...arr].sort((x, y) => x - y);
    return s.length ? s[Math.floor(s.length / 2)] : 0;
  });
};

const weekMedianTemp = (() => {
  const sorted = [...weekData].sort((a, b) => a.value - b.value);
  return Math.round(sorted[Math.floor(sorted.length / 2)].value * 10) / 10;
})();

export function WeekdayDefaultDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody
          renderExtraRow={({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} extra="row" />}
            >
              <WeekdayHeatmapBlock activity={activity} extra="row" />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent activity={activity} extra="column" />
              }
            >
              <WeekdayHeatmapBlock activity={activity} extra="column" />
            </HeatmapTooltip>
          )}
        >
          {({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} />}
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Average Temperature: {weekAvgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekdayMondayStartDemo() {
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
        <WeekdayHeatmapBody
          renderExtraRow={({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} extra="row" />}
            >
              <WeekdayHeatmapBlock activity={activity} extra="row" />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent activity={activity} extra="column" />
              }
            >
              <WeekdayHeatmapBlock activity={activity} extra="column" />
            </HeatmapTooltip>
          )}
        >
          {({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} />}
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Average Temperature: {weekAvgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekdayMinimalTicksDemo() {
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
        <WeekdayHeatmapBody
          renderExtraRow={({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} extra="row" />}
            >
              <WeekdayHeatmapBlock activity={activity} extra="row" />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent activity={activity} extra="column" />
              }
            >
              <WeekdayHeatmapBlock activity={activity} extra="column" />
            </HeatmapTooltip>
          )}
        >
          {({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} />}
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Average Temperature: {weekAvgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekdayBinaryDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        levels={2}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody
          renderExtraRow={({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} extra="row" />}
            >
              <WeekdayHeatmapBlock activity={activity} extra="row" />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent activity={activity} extra="column" />
              }
            >
              <WeekdayHeatmapBlock activity={activity} extra="column" />
            </HeatmapTooltip>
          )}
        >
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

export function WeekdayTenLevelsDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        levels={10}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody
          renderExtraRow={({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} extra="row" />}
            >
              <WeekdayHeatmapBlock activity={activity} extra="row" />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent activity={activity} extra="column" />
              }
            >
              <WeekdayHeatmapBlock activity={activity} extra="column" />
            </HeatmapTooltip>
          )}
        >
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

export function WeekdayJapaneseDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        totalCount={weekAvgTemp}
        isNormalized
        locale={ja}
        colors={{ scale: "var(--color-chart-2)" }}
        extraRow={{ label: "平均", compute: avgByHour }}
        extraColumn={{ label: "平均", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody
          renderExtraRow={({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent
                  activity={activity}
                  extra="row"
                  locale={ja}
                  avgLabel="平均"
                  avgPrefix="平均 "
                />
              }
            >
              <WeekdayHeatmapBlock activity={activity} extra="row" />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent
                  activity={activity}
                  extra="column"
                  locale={ja}
                  avgLabel="平均"
                  avgPrefix="平均 "
                />
              }
            >
              <WeekdayHeatmapBlock activity={activity} extra="column" />
            </HeatmapTooltip>
          )}
        >
          {({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent
                  activity={activity}
                  locale={ja}
                  avgLabel="平均"
                  avgPrefix="平均 "
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
          <WeekdayHeatmapLegend labels={{ less: "少ない", more: "多い" }} />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekdayPlainGridDemo() {
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
          <WeekdayHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Average Temperature: {weekAvgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekdayMiniDemo() {
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

export function Weekday12HourDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        use12Hour
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody
          renderExtraRow={({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent activity={activity} extra="row" use12Hour />
              }
            >
              <WeekdayHeatmapBlock activity={activity} extra="row" />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent
                  activity={activity}
                  extra="column"
                  use12Hour
                />
              }
            >
              <WeekdayHeatmapBlock activity={activity} extra="column" />
            </HeatmapTooltip>
          )}
        >
          {({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} use12Hour />}
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapStat>
            {() => (
              <div className="text-muted-foreground tabular-nums">
                Average Temperature: {weekAvgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekdayMedianDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
        extraRow={{ label: "Median", compute: medianByHour }}
        extraColumn={{ label: "Median", compute: medianByWeekday }}
      >
        <WeekdayHeatmapBody
          renderExtraRow={({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent
                  activity={activity}
                  extra="row"
                  avgLabel="Median"
                  avgPrefix="Median "
                />
              }
            >
              <WeekdayHeatmapBlock activity={activity} extra="row" />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent
                  activity={activity}
                  extra="column"
                  avgLabel="Median"
                  avgPrefix="Median "
                />
              }
            >
              <WeekdayHeatmapBlock activity={activity} extra="column" />
            </HeatmapTooltip>
          )}
        >
          {({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent
                  activity={activity}
                  avgLabel="Median"
                  avgPrefix="Median "
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
                Median Temperature: {weekMedianTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

const WEEKDAY_NAMES = generateWeekdayNames();

export function WeekdayCustomTooltipDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody
          renderExtraRow={({ activity }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <WeekdayHeatmapBlock activity={activity} extra="row" />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="pointer-events-none"
                sideOffset={6}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold">
                    Avg, {`${String(activity.hour).padStart(2, "0")}:00`}
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
          renderExtraColumn={({ activity }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <WeekdayHeatmapBlock activity={activity} extra="column" />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="pointer-events-none"
                sideOffset={6}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold">
                    {WEEKDAY_NAMES[activity.weekday]}, Avg
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
        >
          {({ activity }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <WeekdayHeatmapBlock activity={activity} />
              </TooltipTrigger>
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
                Average Temperature: {weekAvgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}

export function WeekdayNoFooterDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        isNormalized
        colors={{ scale: "var(--color-chart-2)" }}
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody
          renderExtraRow={({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} extra="row" />}
            >
              <WeekdayHeatmapBlock activity={activity} extra="row" />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent activity={activity} extra="column" />
              }
            >
              <WeekdayHeatmapBlock activity={activity} extra="column" />
            </HeatmapTooltip>
          )}
        >
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

export function WeekdayCustomStylingDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <WeekdayHeatmap
        data={weekData}
        blockSize={32}
        blockMargin={3}
        isNormalized
        colors={{ scale: "var(--color-destructive)" }}
        extraRow={{ label: "Avg", compute: avgByHour }}
        extraColumn={{ label: "Avg", compute: avgByWeekday }}
      >
        <WeekdayHeatmapBody
          labelClassName="text-destructive font-bold"
          renderExtraRow={({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} extra="row" />}
            >
              <WeekdayHeatmapBlock activity={activity} extra="row" />
            </HeatmapTooltip>
          )}
          renderExtraColumn={({ activity }) => (
            <HeatmapTooltip
              content={
                <WeekTooltipContent activity={activity} extra="column" />
              }
            >
              <WeekdayHeatmapBlock activity={activity} extra="column" />
            </HeatmapTooltip>
          )}
        >
          {({ activity }) => (
            <HeatmapTooltip
              content={<WeekTooltipContent activity={activity} />}
            >
              <WeekdayHeatmapBlock activity={activity} />
            </HeatmapTooltip>
          )}
        </WeekdayHeatmapBody>
        <WeekdayHeatmapFooter>
          <WeekdayHeatmapStat className="text-destructive">
            {() => (
              <div className="text-destructive">
                Average Temperature: {weekAvgTemp.toFixed(1)} °C
              </div>
            )}
          </WeekdayHeatmapStat>
          <WeekdayHeatmapLegend className="text-destructive" />
        </WeekdayHeatmapFooter>
      </WeekdayHeatmap>
    </TooltipProvider>
  );
}
