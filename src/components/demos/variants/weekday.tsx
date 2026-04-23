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
} from "@/components/demos/weekday";

export const weekdayVariantItems = [
  {
    title: "Colors & block size",
    description:
      "Use colors to theme the blocks, labelClassName to style axis labels, className on Stat and Legend to style the footer, and blockSize/blockMargin to adjust block dimensions.",
    preview: <WeekdayCustomStylingDemo />,
    highlightLines: [4, 5, 6, 8, 12, 13],
    code: `
<WeekdayHeatmap
  data={data}
  blockSize={32}
  blockMargin={3}
  colors={{ scale: "var(--color-destructive)" }}
>
  <WeekdayHeatmapBody labelClassName="text-destructive font-bold">
    {({ activity }) => <Tooltip>{/* ... */}</Tooltip>}
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
      4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
      23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42,
    ],
    code: `
<WeekdayHeatmap data={data}>
  <WeekdayHeatmapBody
    renderExtraRow={({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="row" />
        </TooltipTrigger>
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
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="column" />
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="pointer-events-none text-xs"
          sideOffset={6}
        >
          <p className="font-medium">
            {WEEKDAY_NAMES[activity.weekday]} Avg
          </p>
          <p className="text-muted-foreground">
            avg. {activity.value.toFixed(1)} °C
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity }) => <Tooltip>{/* ... */}</Tooltip>}
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
      "Expand the intensity scale to 10 levels for fine-grained differentiation of high-frequency data.",
    preview: <WeekdayTenLevelsDemo />,
    highlightLines: [2],
    code: `
<WeekdayHeatmap data={data} levels={10}>
  <WeekdayHeatmapBody>
    {({ activity }) => <Tooltip>{/* ... */}</Tooltip>}
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
    description:
      "Pass a date-fns locale to auto-generate localised weekday labels, plus custom extra row/column label, legend, and total value text.",
    preview: <WeekdayJapaneseDemo />,
    highlightLines: [
      2, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
      26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
      44, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62,
      63, 66, 67, 68, 69, 70, 71, 72, 73,
    ],
    code: `
import { ja } from "date-fns/locale";

<WeekdayHeatmap
  data={data}
  locale={ja}
  extraRow={{ label: "平均", compute: avgByHour }}
  extraColumn={{ label: "平均", compute: avgByWeekday }}
>
  <WeekdayHeatmapBody
    renderExtraRow={({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="row" />
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="pointer-events-none text-xs"
          sideOffset={6}
        >
          <p className="font-medium">
            平均, {String(activity.hour).padStart(2, "0")}:00
          </p>
          <p className="text-muted-foreground">平均 {activity.value.toFixed(1)} °C</p>
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
          className="pointer-events-none text-xs"
          sideOffset={6}
        >
          <p className="font-medium">
            {generateWeekdayNames(ja)[activity.weekday]}, 平均
          </p>
          <p className="text-muted-foreground">平均 {activity.value.toFixed(1)} °C</p>
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
          className="pointer-events-none text-xs"
          sideOffset={6}
        >
          <p className="font-medium">
            {generateWeekdayNames(ja)[activity.weekday]},{" "}
            {String(activity.hour).padStart(2, "0")}:00
          </p>
          <p className="text-muted-foreground">{activity.value.toFixed(1)} °C</p>
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
    <WeekdayHeatmapLegend labels={{ less: "少ない", more: "多い" }} />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>
`,
  },
  {
    title: "No footer",
    description:
      "Omit the footer entirely for a minimal, distraction-free heatmap grid.",
    preview: <WeekdayNoFooterDemo />,
    deletedLines: [6, 7, 8, 9],
    code: `
<WeekdayHeatmap data={data}>
  <WeekdayHeatmapBody>
    {({ activity }) => <Tooltip>{/* ... */}</Tooltip>}
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
      "Strip both axis labels — great for inline cards or a hero preview.",
    preview: <WeekdayMiniDemo />,
    highlightLines: [3],
    deletedLines: [6, 7, 8, 9],
    code: `
<WeekdayHeatmap data={data}>
  <WeekdayHeatmapBody hideHourLabels hideWeekdayLabels>
    {({ activity }) => <Tooltip>{/* ... */}</Tooltip>}
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
      "Replace the default tooltip with any JSX — add emoji, charts, or extra metadata without touching the heatmap internals.",
    preview: <WeekdayCustomTooltipDemo />,
    highlightLines: [
      2, 4, 5, 6, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
      25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42,
      43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
      61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 75, 76, 77, 78, 79,
      80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97,
      98, 99, 100, 101, 102, 103, 104, 105, 106, 107,
    ],
    code: `
import { format } from "date-fns";

const WEEKDAY_NAMES = Array.from({ length: 7 }, (_, i) =>
  format(new Date(2000, 0, 2 + i), "EEEE")
);

<WeekdayHeatmap data={data}>
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
</WeekdayHeatmap>
`,
  },
  {
    title: "Monday-start week (ISO)",
    description:
      "Rotate the weekday axis to start on Monday instead of Sunday.",
    preview: <WeekdayMondayStartDemo />,
    highlightLines: [2],
    code: `
<WeekdayHeatmap data={data} weekStart={1}>
  <WeekdayHeatmapBody>
    {({ activity }) => <Tooltip>{/* ... */}</Tooltip>}
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
    description:
      "Only label every 6th hour (00 / 06 / 12 / 18) and drop the trailing tick to reduce axis noise.",
    preview: <WeekdayMinimalTicksDemo />,
    highlightLines: [4, 5, 6, 7, 8, 9],
    code: `
<WeekdayHeatmap
  data={data}
  labels={{
    hours: Array.from({ length: 24 }, (_, i) =>
      i % 6 === 0 ? String(i).padStart(2, "0") : ""
    ),
    endHour: null,
  }}
>
  <WeekdayHeatmapBody>
    {({ activity }) => <Tooltip>{/* ... */}</Tooltip>}
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
    description:
      "Switch the hour axis to 12-hour AM/PM format with a single prop.",
    preview: <Weekday12HourDemo />,
    highlightLines: [2],
    code: `
<WeekdayHeatmap data={data} use12Hour>
  <WeekdayHeatmapBody>
    {({ activity }) => <Tooltip>{/* ... */}</Tooltip>}
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
    description:
      "extraRow/extraColumn accept any ReactNode label and any compute function — sum, average, median, or whatever fits. Stat is updated to reflect the aggregate.",
    preview: <WeekdayMedianDemo />,
    highlightLines: [
      2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 22, 23, 29, 30,
      31, 32, 33, 34, 35,
    ],
    code: `
const medianByHour = (data) => {
  const byHour = Array.from({ length: 24 }, () => []);
  data.forEach((a) => byHour[a.hour].push(a.value));
  return byHour.map((arr) => {
    const s = [...arr].sort((x, y) => x - y);
    return s.length ? s[Math.floor(s.length / 2)] : 0;
  });
};

const medianByWeekday = (data) => {
  const byWeekday = Array.from({ length: 7 }, () => []);
  data.forEach((a) => byWeekday[a.weekday].push(a.value));
  return byWeekday.map((arr) => {
    const s = [...arr].sort((x, y) => x - y);
    return s.length ? s[Math.floor(s.length / 2)] : 0;
  });
};

<WeekdayHeatmap
  data={data}
  extraRow={{ label: "Median", compute: medianByHour }}
  extraColumn={{ label: "Median", compute: medianByWeekday }}
>
  <WeekdayHeatmapBody>
    {({ activity }) => <Tooltip>{/* ... */}</Tooltip>}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapStat>
      {() => (
        <div className="text-muted-foreground tabular-nums">
          Median Temperature: {medianValue.toFixed(1)} °C
        </div>
      )}
    </WeekdayHeatmapStat>
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>
`,
  },
];
