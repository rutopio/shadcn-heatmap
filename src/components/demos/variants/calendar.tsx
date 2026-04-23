import {
    CalendarChunkyDemo,
    CalendarCustomStylingDemo,
    CalendarCustomTooltipDemo,
    CalendarGermanDemo,
    CalendarMiniDemo,
    CalendarMondayStartDemo,
    CalendarMultiYearDemo,
    CalendarNoFooterDemo,
    CalendarTenLevelsDemo,
} from "@/components/demos/calendar";

export const calendarVariantItems = [
    {
        title: "Colors & block size",
        description:
            "Use colors to theme the blocks, labelClassName and yearClassName to style axis labels, className on Stat and Legend to style the footer, and blockSize/blockMargin to adjust block dimensions.",
        preview: <CalendarCustomStylingDemo />,
        highlightLines: [4, 5, 6, 9, 10, 26, 27],
        code: `
<CalendarHeatmap
  data={data}
  blockSize={18}
  blockMargin={3}
  colors={{ scale: "var(--color-destructive)" }}
>
  <CalendarHeatmapBody
    labelClassName="text-destructive font-bold"
    yearClassName="text-destructive font-bold"
  >
    {({ activity, dayIndex, weekIndex }) => (
      <Tooltip>
        {/* ... */}
      </Tooltip>
    )}
  </CalendarHeatmapBody>
  <CalendarHeatmapFooter>
    <CalendarHeatmapStat className="text-destructive" />
    <CalendarHeatmapLegend className="text-destructive" />
  </CalendarHeatmapFooter>
</CalendarHeatmap>
`,
    },
    {
        title: "Ten levels",
        description:
            "Expand the intensity scale to 10 levels for fine-grained differentiation of high-frequency data.",
        preview: <CalendarTenLevelsDemo />,
        highlightLines: [1],
        code: `<CalendarHeatmap data={data} levels={10}>
  <CalendarHeatmapBody>
    {({ activity, dayIndex, weekIndex }) => (
      <Tooltip>
        {/* ... */}
      </Tooltip>
    )}
  </CalendarHeatmapBody>
  <CalendarHeatmapFooter>
    <CalendarHeatmapStat />
    <CalendarHeatmapLegend />
  </CalendarHeatmapFooter>
</CalendarHeatmap>`,
    },
    {
        title: "i18n labels (e.g., German)",
        description:
            "Pass a date-fns locale to auto-generate localised month and weekday labels. Structural text (months/weekdays/legend) goes in the root labels; the footer stat text goes on `<CalendarHeatmapStat label=…>`.",
        preview: <CalendarGermanDemo />,
        highlightLines: [2, 4, 13, 14],
        code: `
import { de } from "date-fns/locale";

<CalendarHeatmap data={data} locale={de}>
  <CalendarHeatmapBody>
    {({ activity, dayIndex, weekIndex }) => (
      <Tooltip>
        {/* ... */}
      </Tooltip>
    )}
  </CalendarHeatmapBody>
  <CalendarHeatmapFooter>
    <CalendarHeatmapStat label="{{value}} Aktivitäten in {{year}}" />
    <CalendarHeatmapLegend labels={{ less: "Weniger", more: "Mehr" }} />
  </CalendarHeatmapFooter>
</CalendarHeatmap>`,
    },
    {
        title: "No footer",
        description:
            "Omit the footer entirely for a minimal, distraction-free heatmap grid.",
        preview: <CalendarNoFooterDemo />,
        deletedLines: [9, 10, 11, 12],
        code: `<CalendarHeatmap data={data}>
  <CalendarHeatmapBody>
    {({ activity, dayIndex, weekIndex }) => (
      <Tooltip>
        {/* ... */}
      </Tooltip>
    )}
  </CalendarHeatmapBody>
  <CalendarHeatmapFooter>
    <CalendarHeatmapStat />
    <CalendarHeatmapLegend />
  </CalendarHeatmapFooter>
</CalendarHeatmap>`,
    },
    {
        title: "Grid only",
        description:
            "Strip both axis labels — great for inline cards or a hero preview.",
        preview: <CalendarMiniDemo />,
        highlightLines: [2],
        deletedLines: [9, 10, 11],
        code: `<CalendarHeatmap data={data}>
  <CalendarHeatmapBody hideMonthLabels hideWeekdayLabels hideYearLabels>
    {({ activity, dayIndex, weekIndex }) => (
      <Tooltip>
        {/* ... */}
      </Tooltip>
    )}
  </CalendarHeatmapBody>
  <CalendarHeatmapFooter>
    <CalendarHeatmapStat />
    <CalendarHeatmapLegend />
  </CalendarHeatmapFooter>
</CalendarHeatmap>`,
    },
    {
        title: "Custom tooltip",
        description:
            "Replace the default tooltip with any JSX — add emoji, charts, or extra metadata without touching the heatmap internals.",
        preview: <CalendarCustomTooltipDemo />,
        highlightLines: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
        code: `
<CalendarHeatmap data={data}>
  <CalendarHeatmapBody>
    {({ activity, dayIndex, weekIndex }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <CalendarHeatmapBlock
            activity={activity}
            dayIndex={dayIndex}
            weekIndex={weekIndex}
          />
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="pointer-events-none"
          sideOffset={6}
        >
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold">
              {format(parseISO(activity.date), "EEEE, MMM d")}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-base leading-none">
                {activity.value === 0
                  ? "😴"
                  : activity.value < 3
                    ? "🌱"
                    : activity.value < 7
                      ? "🔥"
                      : "⚡"}
              </span>
              <span className="text-muted-foreground text-xs">
                {activity.value} contribution
                {activity.value !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    )}
  </CalendarHeatmapBody>
  <CalendarHeatmapFooter>
    <CalendarHeatmapStat />
    <CalendarHeatmapLegend />
  </CalendarHeatmapFooter>
</CalendarHeatmap>
`,
    },
    {
        title: "Monday-start week (ISO)",
        description:
            "Switch the left-hand weekday axis and grid alignment to start on Monday.",
        preview: <CalendarMondayStartDemo />,
        highlightLines: [1],
        code: `<CalendarHeatmap data={data} weekStart={1}>
  <CalendarHeatmapBody>
    {({ activity, dayIndex, weekIndex }) => (
      <Tooltip>
        {/* ... */}
      </Tooltip>
    )}
  </CalendarHeatmapBody>
  <CalendarHeatmapFooter>
    <CalendarHeatmapStat />
    <CalendarHeatmapLegend />
  </CalendarHeatmapFooter>
</CalendarHeatmap>`,
    },
    {
        title: "Month-aligned columns",
        description:
            "Each month starts at its own weekday-aligned column instead of flowing continuously — gives a traditional calendar feel.",
        preview: <CalendarChunkyDemo />,
        highlightLines: [1],
        code: `<CalendarHeatmap data={data} continuousMonths={false}>
  <CalendarHeatmapBody>
    {({ activity, dayIndex, weekIndex }) => (
      <Tooltip>
        {/* ... */}
      </Tooltip>
    )}
  </CalendarHeatmapBody>
  <CalendarHeatmapFooter>
    <CalendarHeatmapStat />
    <CalendarHeatmapLegend />
  </CalendarHeatmapFooter>
</CalendarHeatmap>`,
    },
    {
        title: "Multi-year timeline",
        description:
            "Feed activity spanning multiple years — each year auto-splits into its own row with separate statistics. Legend shown only on the last year.",
        preview: <CalendarMultiYearDemo />,
        highlightLines: [2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        code: `
<CalendarHeatmap data={[...year2024, ...year2025]}>
  <CalendarHeatmapBody
    renderYearFooter={({ year, totalCount }) => {
      const isLastYear = year === 2025;
      return (
        <CalendarHeatmapFooter>
          <CalendarHeatmapStat>
            {() => totalCount + " contributions in " + year}
          </CalendarHeatmapStat>
          {isLastYear && <CalendarHeatmapLegend />}
        </CalendarHeatmapFooter>
      );
    }}
  >
    {({ activity, dayIndex, weekIndex }) => (
      <Tooltip>
        {/* ... */}
      </Tooltip>
    )}
  </CalendarHeatmapBody>
</CalendarHeatmap>
`,
    },
];
