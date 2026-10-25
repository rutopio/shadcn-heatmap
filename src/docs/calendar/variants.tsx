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
} from "@/docs/calendar/demos";

export const calendarVariantItems = [
  {
    title: "Colors & block size",
    slug: "colors",
    description:
      "Use colors to theme the blocks, labelClassName and yearClassName to style axis labels, className on Stat and Legend to style the footer, and blockSize/blockMargin to adjust block dimensions.",
    preview: <CalendarCustomStylingDemo />,
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
      <CalendarHeatmapBlock
        activity={activity}
        dayIndex={dayIndex}
        weekIndex={weekIndex}
      />
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
      "Expand the intensity scale to 10 levels for more detail in the color scale.",
    preview: <CalendarTenLevelsDemo />,
    code: `
<CalendarHeatmap data={data} levels={10}>
  <CalendarHeatmapBody>
    {({ activity, dayIndex, weekIndex }) => (
      <CalendarHeatmapBlock
        activity={activity}
        dayIndex={dayIndex}
        weekIndex={weekIndex}
      />
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
    title: "i18n labels (e.g., German)",
    slug: "i18n",
    description:
      "Pass a date-fns locale to auto-generate localized month and weekday labels. Month and weekday names go in the root labels; legend text goes on CalendarHeatmapLegend; the footer stat text goes on `<CalendarHeatmapStat label=…>`.",
    preview: <CalendarGermanDemo />,
    code: `
import { de } from "date-fns/locale";

<CalendarHeatmap data={data} locale={de}>
  <CalendarHeatmapBody>
    {({ activity, dayIndex, weekIndex }) => (
      <Tooltip>
        <TooltipTrigger
          tabIndex={0}
          render={
            <CalendarHeatmapBlock
              activity={activity}
              dayIndex={dayIndex}
              weekIndex={weekIndex}
            />
          }
        />
        <TooltipContent
          side="top"
          className="pointer-events-none text-xs"
          sideOffset={6}
        >
          <p className="font-medium">
            {format(parseISO(activity.date), "PPP", { locale: de })}
          </p>
          <p className="text-muted-foreground">
            {activity.value} Aktivität{activity.value !== 1 ? "en" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    )}
  </CalendarHeatmapBody>
  <CalendarHeatmapFooter>
    <CalendarHeatmapStat label="{{value}} Aktivitäten in {{year}}" />
    <CalendarHeatmapLegend labels={{ less: "Weniger", more: "Mehr" }} />
  </CalendarHeatmapFooter>
</CalendarHeatmap>;
`,
  },
  {
    title: "No footer",
    description:
      "Omit the footer entirely for a minimal, distraction-free heatmap grid.",
    preview: <CalendarNoFooterDemo />,
    deletedLines: [5, 6, 7, 8],
    code: `
<CalendarHeatmap data={data}>
  <CalendarHeatmapBody>
    {({ activity, dayIndex, weekIndex }) => (
      <CalendarHeatmapBlock
        activity={activity}
        dayIndex={dayIndex}
        weekIndex={weekIndex}
      />
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
    title: "Grid only",
    description:
      "Strip both axis labels: great for inline cards or a hero preview.",
    preview: <CalendarMiniDemo />,
    deletedLines: [5, 6, 7, 8],
    code: `
<CalendarHeatmap data={data}>
  <CalendarHeatmapBody hideMonthLabels hideWeekdayLabels hideYearLabels>
    {({ activity, dayIndex, weekIndex }) => (
      <CalendarHeatmapBlock
        activity={activity}
        dayIndex={dayIndex}
        weekIndex={weekIndex}
      />
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
    title: "Custom tooltip",
    description:
      "Replace the default tooltip with any JSX: add emoji, charts, or extra metadata without touching the heatmap internals.",
    preview: <CalendarCustomTooltipDemo />,
    code: `
<CalendarHeatmap data={data}>
  <CalendarHeatmapBody>
    {({ activity, dayIndex, weekIndex }) => (
      <Tooltip>
        <TooltipTrigger
          tabIndex={0}
          render={
            <CalendarHeatmapBlock
              activity={activity}
              dayIndex={dayIndex}
              weekIndex={weekIndex}
            />
          }
        />
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
    slug: "monday-start",
    description:
      "Switch the left-hand weekday axis and grid alignment to start on Monday.",
    preview: <CalendarMondayStartDemo />,
    code: `
<CalendarHeatmap data={data} weekStart={1}>
  <CalendarHeatmapBody>
    {({ activity, dayIndex, weekIndex }) => (
      <CalendarHeatmapBlock
        activity={activity}
        dayIndex={dayIndex}
        weekIndex={weekIndex}
      />
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
    title: "Month-aligned columns",
    slug: "month-aligned",
    description:
      "Each month starts at its own weekday-aligned column instead of flowing continuously: gives a traditional calendar feel.",
    preview: <CalendarChunkyDemo />,
    code: `
<CalendarHeatmap data={data} continuousMonths={false}>
  <CalendarHeatmapBody>
    {({ activity, dayIndex, weekIndex }) => (
      <CalendarHeatmapBlock
        activity={activity}
        dayIndex={dayIndex}
        weekIndex={weekIndex}
      />
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
    title: "Multi-year timeline",
    slug: "multi-year",
    description:
      "Feed activity spanning multiple years: each year auto-splits into its own row with separate statistics. Legend shown only on the last year.",
    preview: <CalendarMultiYearDemo />,
    code: `
const data = [
  { date: "2024-12-30", value: 3 },
  { date: "2025-01-02", value: 7 },
];
const lastYear = Math.max(
  ...data.map((activity) => Number(activity.date.slice(0, 4))),
);

<CalendarHeatmap data={data}>
  <CalendarHeatmapBody
    renderYearFooter={({ year, totalCount }) => {
      const isLastYear = year === lastYear;
      return (
        <CalendarHeatmapFooter>
          <CalendarHeatmapStat>
            {() => "Contributions in " + year + ": " + totalCount}
          </CalendarHeatmapStat>
          {isLastYear && <CalendarHeatmapLegend />}
        </CalendarHeatmapFooter>
      );
    }}
  >
    {({ activity, dayIndex, weekIndex }) => (
      <CalendarHeatmapBlock
        activity={activity}
        dayIndex={dayIndex}
        weekIndex={weekIndex}
      />
    )}
  </CalendarHeatmapBody>
</CalendarHeatmap>;
`,
  },
];
