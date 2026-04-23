import {
  Date12HourDemo,
  DateCustomStylingDemo,
  DateCustomTooltipDemo,
  DateMedianDemo,
  DateNoFooterDemo,
  DateNoLabelsDemo,
  DatePlainGridDemo,
  DateSparseTicksDemo,
  DateSpanishDemo,
  DateTenLevelsDemo,
} from "@/components/demos/date";

export const dateVariantItems = [
  {
    title: "Colors & block size",
    description:
      "Use colors to theme the blocks, labelClassName to style axis labels, className on Stat and Legend to style the footer, and blockSize/blockMargin to adjust block dimensions.",
    preview: <DateCustomStylingDemo />,
    code: `<DateHeatmap data={data} blockSize={32} blockMargin={3} colors={{ scale: "var(--color-destructive)" }}
  extraRow={{ label: "Total", compute: sumByHour }}
  extraColumn={{ label: "Total", compute: sumByDate }}
>
  <DateHeatmapBody
    labelClassName="text-destructive font-bold"
    renderExtraRow={({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra="row" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
    renderExtraColumn={({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra="column" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapStat className="text-destructive">
      {({ value }) => <div className="text-destructive">Total Rainfall: {Number(value).toFixed(1)} mm</div>}
    </DateHeatmapStat>
    <DateHeatmapLegend className="text-destructive" />
  </DateHeatmapFooter>
</DateHeatmap>`,
  },
  {
    title: "Simple grid",
    description:
      "Omit extraRow/extraColumn for a clean grid without any aggregate rows or columns.",
    preview: <DatePlainGridDemo />,
    code: `<DateHeatmap data={data} colors={{ scale: "var(--color-chart-3)" }}>
  <DateHeatmapBody>
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapStat />
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>`,
  },
  {
    title: "Ten levels",
    description:
      "Expand the intensity scale to 10 levels for fine-grained differentiation of high-frequency data.",
    preview: <DateTenLevelsDemo />,
    code: `<DateHeatmap data={data} levels={10} colors={{ scale: "var(--color-chart-3)" }}
  extraRow={{ label: "Total", compute: sumByHour }}
  extraColumn={{ label: "Total", compute: sumByDate }}
>
  <DateHeatmapBody
    renderExtraRow={({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra="row" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
    renderExtraColumn={({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra="column" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapStat />
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>`,
  },
  {
    title: "i18n labels (e.g., Spanish)",
    description:
      "Pass a date-fns locale to auto-generate localised date labels, plus custom extra column label, legend, and total value text.",
    preview: <DateSpanishDemo />,
    code: `import { es } from "date-fns/locale";

<DateHeatmap
  data={data}
  locale={es}
  colors={{ scale: "var(--color-chart-3)" }}
  extraRow={{ label: "Total", compute: sumByHour }}
  extraColumn={{ label: "Total", compute: sumByDate }}
>
  <DateHeatmapBody
    renderExtraRow={({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra="row" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
    renderExtraColumn={({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra="column" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapStat>
      {({ value }) => (
        <div className="text-muted-foreground">
          Total Rainfall: {Number(value).toFixed(1)} mm
        </div>
      )}
    </DateHeatmapStat>
    <DateHeatmapLegend labels={{ less: "Menos", more: "Más" }} />
  </DateHeatmapFooter>
</DateHeatmap>`,
  },
  {
    title: "No footer",
    description:
      "Omit the footer entirely for a minimal, distraction-free heatmap grid.",
    preview: <DateNoFooterDemo />,
    code: `<DateHeatmap data={data} colors={{ scale: "var(--color-chart-3)" }}
  extraRow={{ label: "Total", compute: sumByHour }}
  extraColumn={{ label: "Total", compute: sumByDate }}
>
  <DateHeatmapBody
    renderExtraRow={({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra="row" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
    renderExtraColumn={({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra="column" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  </DateHeatmapBody>
</DateHeatmap>`,
  },
  {
    title: "Grid only",
    description:
      "Strip both axis labels — great for inline cards or a hero preview.",
    preview: <DateNoLabelsDemo />,
    code: `<DateHeatmap data={data} colors={{ scale: "var(--color-chart-3)" }}>
  <DateHeatmapBody hideDateLabels hideHourLabels>
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  </DateHeatmapBody>
</DateHeatmap>`,
  },
  {
    title: "Custom tooltip",
    description:
      "Replace the default tooltip with any JSX — add emoji, charts, or extra metadata without touching the heatmap internals.",
    preview: <DateCustomTooltipDemo />,
    code: `<DateHeatmap data={data} colors={{ scale: "var(--color-chart-3)" }}
  extraRow={{ label: "Total", compute: sumByHour }}
  extraColumn={{ label: "Total", compute: sumByDate }}
>
  <DateHeatmapBody
    renderExtraRow={({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra="row" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none" sideOffset={6}>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold">
              Total, {String(activity.hour).padStart(2, "0")}:00
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-base leading-none">
                {activity.value === 0 ? "☀️" : activity.value < 1 ? "🌦️" : activity.value < 5 ? "🌧️" : "⛈️"}
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
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra="column" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none" sideOffset={6}>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold">
              {activity.date}, Total
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-base leading-none">
                {activity.value === 0 ? "☀️" : activity.value < 1 ? "🌦️" : activity.value < 5 ? "🌧️" : "⛈️"}
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
        <TooltipContent side="top" className="pointer-events-none" sideOffset={6}>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold">
              {activity.date}, {String(activity.hour).padStart(2, "0")}:00
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-base leading-none">
                {activity.value === 0 ? "☀️" : activity.value < 1 ? "🌦️" : activity.value < 5 ? "🌧️" : "⛈️"}
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
      {() => <div className="text-muted-foreground tabular-nums">Total Rainfall: {total.toFixed(1)} mm</div>}
    </DateHeatmapStat>
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>`,
  },
  {
    title: "Sparse axis labels",
    description:
      "Only label every 6th hour (00 / 06 / 12 / 18) and drop the trailing tick to reduce axis noise.",
    preview: <DateSparseTicksDemo />,
    code: `<DateHeatmap
  data={data}
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
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra="row" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
    renderExtraColumn={({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra="column" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapStat />
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>`,
  },
  {
    title: "12-hour axis labels",
    description:
      "Switch the hour axis to 12-hour AM/PM format with a single prop.",
    preview: <Date12HourDemo />,
    code: `<DateHeatmap data={data} use12Hour colors={{ scale: "var(--color-chart-3)" }}
  extraRow={{ label: "Total", compute: sumByHour }}
  extraColumn={{ label: "Total", compute: sumByDate }}
>
  <DateHeatmapBody
    renderExtraRow={({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra="row" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
    renderExtraColumn={({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra="column" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  </DateHeatmapBody>
  <DateHeatmapFooter>
    <DateHeatmapStat />
    <DateHeatmapLegend />
  </DateHeatmapFooter>
</DateHeatmap>`,
  },
  {
    title: "Aggregate row/column",
    description:
      "extraRow/extraColumn accept any ReactNode label and any compute function — sum, average, median, or whatever fits. Stat is updated to reflect the aggregate.",
    preview: <DateMedianDemo />,
    code: `const medianByHour = (data) => {
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
  colors={{ scale: "var(--color-chart-3)" }}
  extraRow={{ label: "Median", compute: medianByHour }}
  extraColumn={{ label: "Median", compute: medianByDate }}
>
  <DateHeatmapBody
    renderExtraRow={({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra="row" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
    renderExtraColumn={({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra="column" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity, dateIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <DateHeatmapBlock activity={activity} dateIndex={dateIndex} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
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
</DateHeatmap>`,
  },
];
