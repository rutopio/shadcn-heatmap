import {
  Weekday12HourDemo,
  WeekdayCustomStylingDemo,
  WeekdayCustomTooltipDemo,
  WeekdayJapaneseDemo,
  WeekdayMedianDemo,
  WeekdayMiniDemo,
  WeekdayMinimalTicksDemo,
  WeekdayMondayStartDemo,
  WeekdayNoFooterDemo,
  WeekdayPlainGridDemo,
  WeekdayTenLevelsDemo,
} from "@/docs/weekday/demos";

export const weekdayVariantItems = [
  {
    title: "Colors & block size",
    slug: "colors",
    description:
      "Use colors to theme the blocks, labelClassName to style axis labels, className on Stat and Legend to style the footer, and blockSize/blockMargin to adjust block dimensions.",
    preview: <WeekdayCustomStylingDemo />,
    code: `
<WeekdayHeatmap
  data={data}
  blockSize={32}
  blockMargin={3}
  colors={{ scale: "var(--color-destructive)" }}
>
  <WeekdayHeatmapBody labelClassName="text-destructive font-bold">
    {({ activity }) => <WeekdayHeatmapBlock activity={activity} />}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapStat className="text-destructive" />
    <WeekdayHeatmapLegend className="text-destructive" />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>
`,
  },
  {
    title: "Simple grid",
    description:
      "Omit extraRow/extraColumn for a clean grid without any aggregate rows or columns.",
    preview: <WeekdayPlainGridDemo />,
    deletedLines: [
      3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
      23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    ],
    code: `
<WeekdayHeatmap data={data}>
  <WeekdayHeatmapBody
    renderExtraRow={({ activity }) => (
      <Tooltip>
        <TooltipTrigger
          tabIndex={0}
          render={<WeekdayHeatmapBlock activity={activity} extra="row" />}
        />
        <TooltipContent
          side="top"
          className="pointer-events-none text-xs"
          sideOffset={6}
        >
          <p className="font-medium">
            Avg {String(activity.hour).padStart(2, "0")}:00
          </p>
          <p className="text-muted-foreground">
            avg. {activity.value.toFixed(1)} °C
          </p>
        </TooltipContent>
      </Tooltip>
    )}
    renderExtraColumn={({ activity }) => (
      <Tooltip>
        <TooltipTrigger
          tabIndex={0}
          render={<WeekdayHeatmapBlock activity={activity} extra="column" />}
        />
        <TooltipContent
          side="top"
          className="pointer-events-none text-xs"
          sideOffset={6}
        >
          <p className="font-medium">{WEEKDAY_NAMES[activity.weekday]} Avg</p>
          <p className="text-muted-foreground">
            avg. {activity.value.toFixed(1)} °C
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity }) => <WeekdayHeatmapBlock activity={activity} />}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapStat />
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>
`,
  },
  {
    title: "Ten levels",
    description:
      "Expand the intensity scale to 10 levels for more detail in the color scale.",
    preview: <WeekdayTenLevelsDemo />,
    code: `
<WeekdayHeatmap data={data} levels={10}>
  <WeekdayHeatmapBody>
    {({ activity }) => <WeekdayHeatmapBlock activity={activity} />}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapStat />
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>
`,
  },
  {
    title: "i18n labels (e.g., Japanese)",
    slug: "i18n",
    description:
      "Pass a date-fns locale to auto-generate localized weekday labels, plus custom extra row/column label, legend, and total value text.",
    preview: <WeekdayJapaneseDemo />,
    code: `
import { ja } from "date-fns/locale";

const japaneseWeekdays = Array.from({ length: 7 }, (_, day) =>
  format(new Date(2000, 0, 2 + day), "EEEE", { locale: ja }),
);

<WeekdayHeatmap
  data={data}
  locale={ja}
  extraRow={{ label: "平均", compute: avgByHour }}
  extraColumn={{ label: "平均", compute: avgByWeekday }}
>
  <WeekdayHeatmapBody
    renderExtraRow={({ activity }) => (
      <Tooltip>
        <TooltipTrigger
          tabIndex={0}
          render={<WeekdayHeatmapBlock activity={activity} extra="row" />}
        />
        <TooltipContent
          side="top"
          className="pointer-events-none text-xs"
          sideOffset={6}
        >
          <p className="font-medium">
            平均, {String(activity.hour).padStart(2, "0")}:00
          </p>
          <p className="text-muted-foreground">
            平均 {activity.value.toFixed(1)} °C
          </p>
        </TooltipContent>
      </Tooltip>
    )}
    renderExtraColumn={({ activity }) => (
      <Tooltip>
        <TooltipTrigger
          tabIndex={0}
          render={<WeekdayHeatmapBlock activity={activity} extra="column" />}
        />
        <TooltipContent
          side="top"
          className="pointer-events-none text-xs"
          sideOffset={6}
        >
          <p className="font-medium">
            {japaneseWeekdays[activity.weekday]}, 平均
          </p>
          <p className="text-muted-foreground">
            平均 {activity.value.toFixed(1)} °C
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger
          tabIndex={0}
          render={<WeekdayHeatmapBlock activity={activity} />}
        />
        <TooltipContent
          side="top"
          className="pointer-events-none text-xs"
          sideOffset={6}
        >
          <p className="font-medium">
            {japaneseWeekdays[activity.weekday]},{" "}
            {String(activity.hour).padStart(2, "0")}:00
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} °C
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapStat>
      {({ value }) => (
        <div className="text-muted-foreground">
          平均 {Number(value).toFixed(1)} °C
        </div>
      )}
    </WeekdayHeatmapStat>
    <WeekdayHeatmapLegend labels={{ less: "寒い", more: "暑い" }} />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>;
`,
  },
  {
    title: "No footer",
    description:
      "Omit the footer entirely for a minimal, distraction-free heatmap grid.",
    preview: <WeekdayNoFooterDemo />,
    deletedLines: [5, 6, 7, 8],
    code: `
<WeekdayHeatmap data={data}>
  <WeekdayHeatmapBody>
    {({ activity }) => <WeekdayHeatmapBlock activity={activity} />}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapStat />
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>
`,
  },
  {
    title: "Grid only",
    description:
      "Strip both axis labels: great for inline cards or a hero preview.",
    preview: <WeekdayMiniDemo />,
    deletedLines: [5, 6, 7, 8],
    code: `
<WeekdayHeatmap data={data}>
  <WeekdayHeatmapBody hideHourLabels hideWeekdayLabels>
    {({ activity }) => <WeekdayHeatmapBlock activity={activity} />}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapStat />
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>
`,
  },
  {
    title: "Custom tooltip",
    description:
      "Replace the default tooltip with any JSX: add emoji, charts, or extra metadata without touching the heatmap internals.",
    preview: <WeekdayCustomTooltipDemo />,
    code: `
import { format } from "date-fns";

const WEEKDAY_NAMES = Array.from({ length: 7 }, (_, i) =>
  format(new Date(2000, 0, 2 + i), "EEEE"),
);

<WeekdayHeatmap data={data}>
  <WeekdayHeatmapBody
    renderExtraRow={({ activity }) => (
      <Tooltip>
        <TooltipTrigger
          tabIndex={0}
          render={<WeekdayHeatmapBlock activity={activity} extra="row" />}
        />
        <TooltipContent
          side="top"
          className="pointer-events-none"
          sideOffset={6}
        >
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold">
              Avg, {String(activity.hour).padStart(2, "0")}:00
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
                avg. {activity.value.toFixed(1)} °C
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    )}
    renderExtraColumn={({ activity }) => (
      <Tooltip>
        <TooltipTrigger
          tabIndex={0}
          render={<WeekdayHeatmapBlock activity={activity} extra="column" />}
        />
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
                avg. {activity.value.toFixed(1)} °C
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    )}
  >
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
              {String(activity.hour).padStart(2, "0")}:00
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
    <WeekdayHeatmapStat />
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>;
`,
  },
  {
    title: "Monday-start week (ISO)",
    slug: "monday-start",
    description:
      "Rotate the weekday axis to start on Monday instead of Sunday.",
    preview: <WeekdayMondayStartDemo />,
    code: `
<WeekdayHeatmap data={data} weekStart={1}>
  <WeekdayHeatmapBody>
    {({ activity }) => <WeekdayHeatmapBlock activity={activity} />}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapStat />
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>
`,
  },
  {
    title: "Sparse axis labels",
    slug: "sparse-axis",
    description:
      "Only label every 6th hour (00 / 06 / 12 / 18) and drop the trailing tick to reduce axis noise.",
    preview: <WeekdayMinimalTicksDemo />,
    code: `
<WeekdayHeatmap
  data={data}
  labels={{
    hours: Array.from({ length: 24 }, (_, i) =>
      i % 6 === 0 ? String(i).padStart(2, "0") : "",
    ),
    endHour: null,
  }}
>
  <WeekdayHeatmapBody>
    {({ activity }) => <WeekdayHeatmapBlock activity={activity} />}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapStat />
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>
`,
  },
  {
    title: "12-hour axis labels",
    slug: "12-hour",
    description:
      "Switch the hour axis to 12-hour AM/PM format with a single prop.",
    preview: <Weekday12HourDemo />,
    code: `
<WeekdayHeatmap data={data} use12Hour>
  <WeekdayHeatmapBody>
    {({ activity }) => <WeekdayHeatmapBlock activity={activity} />}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapStat />
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>
`,
  },
  {
    title: "Aggregate row/column",
    slug: "aggregate",
    description:
      "extraRow/extraColumn accept any ReactNode label and any compute function: sum, average, median, or whatever fits. Set Stat separately to show the same calculation.",
    preview: <WeekdayMedianDemo />,
    code: `
function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

const medianValue = median(data.map((activity) => activity.value));

const medianByHour = (data: WeekdayHourlyActivity[]) => {
  const byHour = Array.from({ length: 24 }, () => [] as number[]);
  data.forEach((a) => byHour[a.hour].push(a.value));
  return byHour.map((arr) => {
    const s = [...arr].sort((x, y) => x - y);
    const middle = Math.floor(s.length / 2);
    return s.length === 0
      ? 0
      : s.length % 2 === 0
        ? (s[middle - 1] + s[middle]) / 2
        : s[middle];
  });
};

const medianByWeekday = (data: WeekdayHourlyActivity[]) => {
  const byWeekday = Array.from({ length: 7 }, () => [] as number[]);
  data.forEach((a) => byWeekday[a.weekday].push(a.value));
  return byWeekday.map((arr) => {
    const s = [...arr].sort((x, y) => x - y);
    const middle = Math.floor(s.length / 2);
    return s.length === 0
      ? 0
      : s.length % 2 === 0
        ? (s[middle - 1] + s[middle]) / 2
        : s[middle];
  });
};

<WeekdayHeatmap
  data={data}
  extraRow={{ label: "Median", compute: medianByHour }}
  extraColumn={{ label: "Median", compute: medianByWeekday }}
>
  <WeekdayHeatmapBody>
    {({ activity }) => <WeekdayHeatmapBlock activity={activity} />}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapStat>
      {() => (
        <div className="text-muted-foreground tabular-nums">
          Median temperature: {medianValue.toFixed(1)} °C
        </div>
      )}
    </WeekdayHeatmapStat>
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>;
`,
  },
];
