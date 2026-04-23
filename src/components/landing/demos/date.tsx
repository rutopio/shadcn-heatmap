import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import {
  DateHeatmap,
  DateHeatmapBlock,
  DateHeatmapBody,
  DateHeatmapFooter,
  DateHeatmapLegend,
  DateHeatmapTotalCount,
} from "@/components/heatmap/date-heatmap";
import dateData from "@/data/date-sample.json";

import { DateTooltipContent, HeatmapTooltip, TooltipProvider } from "./shared";

const dateTotalMm =
  Math.round(
    dateData
      .filter((a) => a.date !== "sum" && a.hour < 24)
      .reduce((s, a) => s + a.value, 0) * 10
  ) / 10;

export function DateDefaultDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap
        data={dateData}
        totalCount={dateTotalMm}
        colors={{ scale: "var(--color-chart-3)" }}
      >
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
          <DateHeatmapTotalCount>
            {() => (
              <div className="text-muted-foreground">
                {dateTotalMm.toFixed(1)} mm total
              </div>
            )}
          </DateHeatmapTotalCount>
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
        maxLevel={10}
        colors={{ scale: "var(--color-chart-3)" }}
      >
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

export function DateHideSumColumnDemo() {
  return (
    <TooltipProvider delayDuration={80} skipDelayDuration={0}>
      <DateHeatmap data={dateData} colors={{ scale: "var(--color-chart-3)" }}>
        <DateHeatmapBody hideSumColumn>
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
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} />}
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapTotalCount>
            {() => (
              <div className="text-muted-foreground">
                {dateTotalMm.toFixed(1)} mm total
              </div>
            )}
          </DateHeatmapTotalCount>
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
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} use12Hour />}
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapTotalCount>
            {() => (
              <div className="text-muted-foreground">
                {dateTotalMm.toFixed(1)} mm total
              </div>
            )}
          </DateHeatmapTotalCount>
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
        labels={{
          sum: "Total",
          legend: { less: "Menos", more: "Más" },
        }}
      >
        <DateHeatmapBody>
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={
                <>
                  <p className="font-medium">
                    {activity.date === "sum"
                      ? "Total"
                      : format(parseISO(activity.date), "PPP", {
                          locale: es,
                        })}{" "}
                    {activity.hour === 24
                      ? "Total"
                      : `${String(activity.hour).padStart(2, "0")}:00`}
                  </p>
                  <p className="text-muted-foreground">
                    {activity.value.toFixed(1)} mm
                  </p>
                </>
              }
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapTotalCount>
            {({ totalCount }) => (
              <div className="text-muted-foreground">
                {totalCount.toFixed(1)} mm total
              </div>
            )}
          </DateHeatmapTotalCount>
          <DateHeatmapLegend />
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
        <DateHeatmapBody labelTextClass="text-destructive font-bold">
          {({ activity, dateIndex }) => (
            <HeatmapTooltip
              content={<DateTooltipContent activity={activity} />}
            >
              <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
            </HeatmapTooltip>
          )}
        </DateHeatmapBody>
        <DateHeatmapFooter>
          <DateHeatmapTotalCount className="text-destructive">
            {() => (
              <div className="text-destructive">
                {dateTotalMm.toFixed(1)} mm total
              </div>
            )}
          </DateHeatmapTotalCount>
          <DateHeatmapLegend className="text-destructive" />
        </DateHeatmapFooter>
      </DateHeatmap>
    </TooltipProvider>
  );
}
