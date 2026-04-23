import {
  Date12HourDemo,
  DateCustomStylingDemo,
  DateCustomTooltipDemo,
  DateMedianDemo,
  DateNoFooterDemo,
  DateNoLabelsDemo,
  DatePlainGridDemo,
  DateSpanishDemo,
  DateSparseTicksDemo,
  DateTenLevelsDemo,
} from "@/docs/date/demos";

export const dateVariantItems = [
  {
    title: "Colors & block size",
    description:
      "Use colors to theme the blocks, labelClassName to style axis labels, className on Stat and Legend to style the footer, and blockSize/blockMargin to adjust block dimensions.",
    preview: <DateCustomStylingDemo />,
    highlightLines: [3, 4, 5, 7, 11, 12],
    code: `
<DateHeatmap
  data={data}
  blockSize={32}
  blockMargin={3}
  colors={{ scale: "var(--color-destructive)" }}
>
  <DateHeatmapBody labelClassName="text-destructive font-bold">
    {({ activity, dateIndex }) => <Tooltip>{/* ... */}</Tooltip>}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapStat className="text-destructive" />
    <DateHeatmapLegend className="text-destructive" />
  </DateHeatmapFooter>
</DateHeatmap>
`,
  },
  {
    title: "Simple grid",
    description:
      "Omit extraRow/extraColumn for a clean grid without any aggregate rows or columns.",
    preview: <DatePlainGridDemo />,
    deletedLines: [
      3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
      23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47,
    ],
    code: `
<DateHeatmap data={data}>
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
          className="pointer-events-none text-xs"
          sideOffset={6}
        >
          <p className="font-medium">
            Total {String(activity.hour).padStart(2, "0")}:00
          </p>
          <p className="text-muted-foreground">
            total {activity.value.toFixed(1)} mm
          </p>
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
          className="pointer-events-none text-xs"
          sideOffset={6}
        >
          <p className="font-medium">{activity.date} Total</p>
          <p className="text-muted-foreground">
            total {activity.value.toFixed(1)} mm
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity, dateIndex }) => <Tooltip>{/* ... */}</Tooltip>}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapStat />
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>
`,
  },
  {
    title: "Ten levels",
    description:
      "Expand the intensity scale to 10 levels for fine-grained differentiation of high-frequency data.",
    preview: <DateTenLevelsDemo />,
    highlightLines: [1],
    code: `
<DateHeatmap data={data} levels={10}>
  <DateHeatmapBody>
    {({ activity, dateIndex }) => <Tooltip>{/* ... */}</Tooltip>}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapStat />
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>
`,
  },
  {
    title: "i18n labels (e.g., Spanish)",
    description:
      "Pass a date-fns locale to auto-generate localised date labels, plus custom extra column label, legend, and total value text.",
    preview: <DateSpanishDemo />,
    highlightLines: [
      1, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
      23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 52, 53, 54, 55, 56, 57, 58, 59,
      60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 74, 75, 76, 77, 78, 79,
      80, 81,
    ],
    code: `
import { es } from "date-fns/locale";

<DateHeatmap data={data} locale={es}>
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
          className="pointer-events-none text-xs"
          sideOffset={6}
        >
          <p className="font-medium">
            Total, {String(activity.hour).padStart(2, "0")}:00
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} mm
          </p>
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
          className="pointer-events-none text-xs"
          sideOffset={6}
        >
          <p className="font-medium">
            {format(parseISO(activity.date), "PPP", { locale: es })}, Total
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} mm
          </p>
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
          className="pointer-events-none text-xs"
          sideOffset={6}
        >
          <p className="font-medium">
            {format(parseISO(activity.date), "PPP", { locale: es })},{" "}
            {String(activity.hour).padStart(2, "0")}:00
          </p>
          <p className="text-muted-foreground">
            {activity.value.toFixed(1)} mm
          </p>
        </TooltipContent>
      </Tooltip>
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
`,
  },
  {
    title: "No footer",
    description:
      "Omit the footer entirely for a minimal, distraction-free heatmap grid.",
    preview: <DateNoFooterDemo />,
    deletedLines: [5, 6, 7, 8],
    code: `
<DateHeatmap data={data}>
  <DateHeatmapBody>
    {({ activity, dateIndex }) => <Tooltip>{/* ... */}</Tooltip>}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapStat />
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>
`,
  },
  {
    title: "Grid only",
    description:
      "Strip both axis labels — great for inline cards or a hero preview.",
    preview: <DateNoLabelsDemo />,
    highlightLines: [2],
    deletedLines: [5, 6, 7, 8],
    code: `
<DateHeatmap data={data}>
  <DateHeatmapBody hideDateLabels hideHourLabels>
    {({ activity, dateIndex }) => <Tooltip>{/* ... */}</Tooltip>}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapStat />
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>
`,
  },
  {
    title: "Custom tooltip",
    description:
      "Replace the default tooltip with any JSX — add emoji, charts, or extra metadata without touching the heatmap internals.",
    preview: <DateCustomTooltipDemo />,
    highlightLines: [
      3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
      25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42,
      43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
      61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 78, 79,
      80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97,
      98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 112, 113, 114, 115,
      116, 117, 118,
    ],
    code: `
<DateHeatmap
  data={data}
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
                Total Rainfall: {activity.value.toFixed(1)} mm
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
            <p className="text-xs font-semibold">{activity.date}, Total</p>
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
                Total Rainfall: {activity.value.toFixed(1)} mm
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
          Total Rainfall: {total.toFixed(1)} mm
        </div>
      )}
    </DateHeatmapStat>
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>
`,
  },
  {
    title: "Sparse axis labels",
    description:
      "Only label every 6th hour (00 / 06 / 12 / 18) and drop the trailing tick to reduce axis noise.",
    preview: <DateSparseTicksDemo />,
    highlightLines: [3, 4, 5, 6, 7, 8],
    code: `
<DateHeatmap
  data={data}
  labels={{
    hours: Array.from({ length: 24 }, (_, i) =>
      i % 6 === 0 ? String(i).padStart(2, "0") : ""
    ),
    endHour: null,
  }}
>
  <DateHeatmapBody>
    {({ activity, dateIndex }) => <Tooltip>{/* ... */}</Tooltip>}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapStat />
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>
`,
  },
  {
    title: "12-hour axis labels",
    description:
      "Switch the hour axis to 12-hour AM/PM format with a single prop.",
    preview: <Date12HourDemo />,
    highlightLines: [1],
    code: `
<DateHeatmap data={data} use12Hour>
  <DateHeatmapBody>
    {({ activity, dateIndex }) => <Tooltip>{/* ... */}</Tooltip>}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapStat />
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>
`,
  },
  {
    title: "Aggregate row/column",
    description:
      "extraRow/extraColumn accept any ReactNode label and any compute function — sum, average, median, or whatever fits. Stat is updated to reflect the aggregate.",
    preview: <DateMedianDemo />,
    highlightLines: [
      1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 24,
      25, 31, 32, 33, 34, 35, 36, 37,
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

const medianByDate = (data, dates) => {
  const byDate = new Map();
  data.forEach((a) => {
    if (!byDate.has(a.date)) byDate.set(a.date, []);
    byDate.get(a.date).push(a.value);
  });
  return dates.map((date) => {
    const arr = [...(byDate.get(date) ?? [])].sort((x, y) => x - y);
    return arr.length ? arr[Math.floor(arr.length / 2)] : 0;
  });
};

<DateHeatmap
  data={data}
  extraRow={{ label: "Median", compute: medianByHour }}
  extraColumn={{ label: "Median", compute: medianByDate }}
>
  <DateHeatmapBody>
    {({ activity, dateIndex }) => <Tooltip>{/* ... */}</Tooltip>}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapStat>
      {() => (
        <div className="text-muted-foreground tabular-nums">
          Median Rainfall: {medianValue.toFixed(1)} mm
        </div>
      )}
    </DateHeatmapStat>
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>
`,
  },
];
