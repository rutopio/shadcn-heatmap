import {
    Weekday12HourDemo,
    WeekdayCustomStylingDemo,
    WeekdayCustomTooltipDemo,
    WeekdayJapaneseDemo,
    WeekdayMedianDemo,
    WeekdayMinimalTicksDemo,
    WeekdayMiniDemo,
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
        code: `<WeekdayHeatmap data={data} blockSize={32} blockMargin={3} isNormalized colors={{ scale: "var(--color-destructive)" }}
  extraRow={{ label: "Avg", compute: avgByHour }}
  extraColumn={{ label: "Avg", compute: avgByWeekday }}
>
  <WeekdayHeatmapBody
    labelClassName="text-destructive font-bold"
    renderExtraRow={({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="row" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
    renderExtraColumn={({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="column" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapStat className="text-destructive" />
    <WeekdayHeatmapLegend className="text-destructive" />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>`,
    },
    {
        title: "Simple grid",
        description:
            "Omit extraRow/extraColumn for a clean grid without any aggregate rows or columns.",
        preview: <WeekdayPlainGridDemo />,
        code: `<WeekdayHeatmap data={data} isNormalized colors={{ scale: "var(--color-chart-2)" }}>
  <WeekdayHeatmapBody>
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapStat />
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>`,
    },
    {
        title: "Ten levels",
        description:
            "Expand the intensity scale to 10 levels for fine-grained differentiation of high-frequency data.",
        preview: <WeekdayTenLevelsDemo />,
        code: `<WeekdayHeatmap data={data} levels={10} isNormalized colors={{ scale: "var(--color-chart-2)" }}
  extraRow={{ label: "Avg", compute: avgByHour }}
  extraColumn={{ label: "Avg", compute: avgByWeekday }}
>
  <WeekdayHeatmapBody
    renderExtraRow={({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="row" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
    renderExtraColumn={({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="column" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>`,
    },
    {
        title: "i18n labels (e.g., Japanese)",
        description:
            "Pass a date-fns locale to auto-generate localised weekday labels, plus custom extra row/column label, legend, and total value text.",
        preview: <WeekdayJapaneseDemo />,
        code: `import { ja } from "date-fns/locale";

<WeekdayHeatmap
  data={data}
  isNormalized
  locale={ja}
  colors={{ scale: "var(--color-chart-2)" }}
  extraRow={{ label: "平均", compute: avgByHour }}
  extraColumn={{ label: "平均", compute: avgByWeekday }}
>
  <WeekdayHeatmapBody
    renderExtraRow={({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="row" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
    renderExtraColumn={({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="column" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
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
</WeekdayHeatmap>`,
    },
    {
        title: "No footer",
        description:
            "Omit the footer entirely for a minimal, distraction-free heatmap grid.",
        preview: <WeekdayNoFooterDemo />,
        code: `<WeekdayHeatmap data={data} isNormalized colors={{ scale: "var(--color-chart-2)" }}
  extraRow={{ label: "Avg", compute: avgByHour }}
  extraColumn={{ label: "Avg", compute: avgByWeekday }}
>
  <WeekdayHeatmapBody
    renderExtraRow={({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="row" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
    renderExtraColumn={({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="column" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
</WeekdayHeatmap>`,
    },
    {
        title: "Grid only",
        description:
            "Strip both axis labels — great for inline cards or a hero preview.",
        preview: <WeekdayMiniDemo />,
        code: `<WeekdayHeatmap data={data} isNormalized colors={{ scale: "var(--color-chart-2)" }}>
  <WeekdayHeatmapBody hideHourLabels hideWeekdayLabels>
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
</WeekdayHeatmap>`,
    },
    {
        title: "Custom tooltip",
        description:
            "Replace the default tooltip with any JSX — add emoji, charts, or extra metadata without touching the heatmap internals.",
        preview: <WeekdayCustomTooltipDemo />,
        code: `const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

<WeekdayHeatmap data={data} isNormalized colors={{ scale: "var(--color-chart-2)" }}
  extraRow={{ label: "Avg", compute: avgByHour }}
  extraColumn={{ label: "Avg", compute: avgByWeekday }}
>
  <WeekdayHeatmapBody
    renderExtraRow={({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="row" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none" sideOffset={6}>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold">
              Avg, {String(activity.hour).padStart(2, "0")}:00
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-base leading-none">
                {activity.value < 5 ? "🥶" : activity.value < 15 ? "😊" : activity.value < 25 ? "☀️" : "🔥"}
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
        <TooltipContent side="top" className="pointer-events-none" sideOffset={6}>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold">
              {WEEKDAY_NAMES[activity.weekday]}, Avg
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-base leading-none">
                {activity.value < 5 ? "🥶" : activity.value < 15 ? "😊" : activity.value < 25 ? "☀️" : "🔥"}
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
        <TooltipContent side="top" className="pointer-events-none" sideOffset={6}>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold">
              {WEEKDAY_NAMES[activity.weekday]}, {String(activity.hour).padStart(2, "0")}:00
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-base leading-none">
                {activity.value < 5 ? "🥶" : activity.value < 15 ? "😊" : activity.value < 25 ? "☀️" : "🔥"}
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
      {({ value }) => (
        <div className="text-muted-foreground tabular-nums">
          Average Temperature: {Number(value).toFixed(1)} °C
        </div>
      )}
    </WeekdayHeatmapStat>
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>`,
    },
    {
        title: "Monday-start week (ISO)",
        description:
            "Rotate the weekday axis to start on Monday instead of Sunday.",
        preview: <WeekdayMondayStartDemo />,
        code: `<WeekdayHeatmap data={data} weekStart={1} isNormalized colors={{ scale: "var(--color-chart-2)" }}
  extraRow={{ label: "Avg", compute: avgByHour }}
  extraColumn={{ label: "Avg", compute: avgByWeekday }}
>
  <WeekdayHeatmapBody
    renderExtraRow={({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="row" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
    renderExtraColumn={({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="column" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapStat />
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>`,
    },
    {
        title: "Sparse axis labels",
        description:
            "Only label every 6th hour (00 / 06 / 12 / 18) and drop the trailing tick to reduce axis noise.",
        preview: <WeekdayMinimalTicksDemo />,
        code: `<WeekdayHeatmap
  data={data}
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
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="row" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
    renderExtraColumn={({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="column" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapStat />
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>`,
    },
    {
        title: "12-hour axis labels",
        description:
            "Switch the hour axis to 12-hour AM/PM format with a single prop.",
        preview: <Weekday12HourDemo />,
        code: `<WeekdayHeatmap data={data} use12Hour isNormalized colors={{ scale: "var(--color-chart-2)" }}
  extraRow={{ label: "Avg", compute: avgByHour }}
  extraColumn={{ label: "Avg", compute: avgByWeekday }}
>
  <WeekdayHeatmapBody
    renderExtraRow={({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="row" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
    renderExtraColumn={({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="column" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  </WeekdayHeatmapBody>
  <WeekdayHeatmapFooter>
    <WeekdayHeatmapStat />
    <WeekdayHeatmapLegend />
  </WeekdayHeatmapFooter>
</WeekdayHeatmap>`,
    },
    {
        title: "Aggregate row/column",
        description:
            "extraRow/extraColumn accept any ReactNode label and any compute function — sum, average, median, or whatever fits. Stat is updated to reflect the aggregate.",
        preview: <WeekdayMedianDemo />,
        code: `const medianByHour = (data) => {
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
  isNormalized
  colors={{ scale: "var(--color-chart-2)" }}
  extraRow={{ label: "Median", compute: medianByHour }}
  extraColumn={{ label: "Median", compute: medianByWeekday }}
>
  <WeekdayHeatmapBody
    renderExtraRow={({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="row" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
    renderExtraColumn={({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} extra="column" />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
  >
    {({ activity }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <WeekdayHeatmapBlock activity={activity} />
        </TooltipTrigger>
        <TooltipContent side="top" className="pointer-events-none text-xs" sideOffset={6}>
          {/* ... */}
        </TooltipContent>
      </Tooltip>
    )}
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
</WeekdayHeatmap>`,
    },
];
