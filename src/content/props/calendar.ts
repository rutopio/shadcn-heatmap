import type { ComponentPropsSection } from "../types";

export const calendarProps: ComponentPropsSection[] = [
  {
    componentName: "CalendarHeatmap",
    description:
      "Root provider. Accepts the activity array and layout options and shares them with its children via context.",
    props: [
      {
        name: "data",
        type: "Activity[]",
        required: true,
        description:
          "`{ date: 'YYYY-MM-DD', value: number }[]`. Missing days between the first and last date are auto-filled with `value: 0`.",
      },
      {
        name: "emptyState",
        type: "ReactNode",
        description:
          "Rendered when `data` is empty. By default returns `null`.",
      },
      {
        name: "colors",
        type: "ColorConfig",
        description:
          "`{ empty?: string; scale?: string }`. Defaults: `empty = 'var(--color-secondary)'`, `scale = 'var(--color-chart-1)'`. Both accept any CSS color value.",
      },
      {
        name: "levels",
        type: "number",
        default: "5",
        description:
          "Total number of cells shown in the legend. Non-normalized: 1 empty cell + `(levels - 1)` coloured steps from 20%→100% opacity. Normalized: `levels` coloured steps from 20%→100% opacity (no empty cell).",
      },
      {
        name: "isNormalized",
        type: "boolean",
        default: "false",
        description:
          "When `true`, uses min–max normalization: min maps to level 1 and max to `levels`. Suitable for signed values. When `false`, values ≤ 0 are treated as empty (level 0) and the scale runs from 0 to max.",
      },
      {
        name: "blockSize",
        type: "number",
        default: "12",
        description:
          "Block height in pixels. Block width is `blockSize × blockSizeRatio`.",
      },
      {
        name: "blockSizeRatio",
        type: "number",
        default: "1",
        description:
          "Width-to-height ratio for each block. `1` = square, `2` = landscape, `0.5` = portrait.",
      },
      {
        name: "blockMargin",
        type: "number",
        default: "4",
        description: "Gap between adjacent blocks, in pixels.",
      },
      {
        name: "blockRadius",
        type: "number",
        default: "2",
        description: "Corner radius (`rx`/`ry`) of each block, in pixels.",
      },
      {
        name: "fontSize",
        type: "number",
        default: "14",
        description: "Base font size for axis labels, in pixels.",
      },
      {
        name: "weekStart",
        type: "WeekDay",
        default: "0",
        description:
          "First day of the week. `0` = Sunday, `1` = Monday, ..., `6` = Saturday. Uses date-fns `Day` type.",
      },
      {
        name: "continuousMonths",
        type: "boolean",
        default: "true",
        description:
          "When `true`, days flow continuously across months (GitHub-style). When `false`, each month starts at its own weekday-aligned column.",
      },
      {
        name: "hasEmptyColumn",
        type: "boolean",
        default: "false",
        description:
          "Insert a blank week-column between months to visually separate them. Only applies when `continuousMonths` is `false`.",
      },
      {
        name: "locale",
        type: "Locale",
        description:
          "A date-fns locale object (e.g. `import { de } from 'date-fns/locale'`). Auto-generates month and weekday labels in that language. Overridden by explicit `labels.months` / `labels.weekdays`.",
      },
      {
        name: "labels",
        type: "Labels",
        description:
          "`{ months?: string[12], weekdays?: string[7], cellLabel?: string, stat?: string }`. `cellLabel` is the aria-label template (placeholders: `{{date}}`, `{{value}}`). Legend text goes on `<CalendarHeatmapLegend labels={…}>`; stat text goes on `<CalendarHeatmapStat label={…}>` — or set `labels.stat` here for a single i18n source.",
      },
      {
        name: "totalCount",
        type: "number",
        description:
          "Override the auto-computed sum. Useful when the visible window is a slice of a larger dataset.",
      },
    ],
  },
  {
    componentName: "CalendarHeatmapBody",
    description:
      "Renders the SVG grid. `children` is a render-prop called once per visible day cell.",
    props: [
      {
        name: "children",
        type: "(args: { activity: ActivityWithLevel; dayIndex: number; weekIndex: number }) => ReactNode",
        required: true,
        description:
          "Render-prop for each day cell. Typically returns `<CalendarHeatmapBlock activity={activity} dayIndex={dayIndex} weekIndex={weekIndex} />`.",
      },
      {
        name: "hideMonthLabels",
        type: "boolean",
        default: "false",
        description:
          "Hide the month labels (e.g. `Jan`, `Feb`) above each row.",
      },
      {
        name: "hideWeekdayLabels",
        type: "boolean",
        default: "false",
        description: "Hide the weekday labels (e.g. `Mon`, `Wed`) on the left.",
      },
      {
        name: "hideYearLabels",
        type: "boolean",
        default: "false",
        description: "Hide the year label above each year row.",
      },
      {
        name: "labelClassName",
        type: "string",
        description:
          "Additional CSS classes applied to month and weekday label text elements.",
      },
      {
        name: "yearClassName",
        type: "string",
        description:
          "Additional CSS classes applied to the year label element shown above each year row.",
      },
      {
        name: "renderYearFooter",
        type: "(props: { year: number; totalCount: number }) => ReactNode",
        description:
          "Render-prop called after each year row. Receives `{ year, totalCount }`. Useful for per-year summaries in multi-year layouts.",
      },
    ],
  },
  {
    componentName: "CalendarHeatmapBlock",
    description:
      "A single SVG `rect` representing one day. Color is driven by the cell's level. Defaults: `--color-chart-1` for active cells, `--color-secondary` for empty. Both are overridable via the root `colors` prop.",
    props: [
      {
        name: "activity",
        type: "ActivityWithLevel",
        required: true,
        description:
          "The day's activity record with its computed `level` (0 = empty, 1–levels = coloured). Pass the value received from the `CalendarHeatmapBody` render-prop.",
      },
      {
        name: "dayIndex",
        type: "number",
        required: true,
        description:
          "Row index within the week (0 = first day per `weekStart`, 6 = last). Pass the value received from the `CalendarHeatmapBody` render-prop.",
      },
      {
        name: "weekIndex",
        type: "number",
        required: true,
        description:
          "Column index within the current year row. Pass the value received from the `CalendarHeatmapBody` render-prop.",
      },
      {
        name: "highlighted",
        type: "boolean",
        default: "false",
        description:
          "Dims the block to 60% of its colour. Useful for selected/focus states. Also sets `data-highlighted` on the element for CSS targeting.",
      },
      {
        name: "onCellClick",
        type: "(activity: ActivityWithLevel) => void",
        description:
          "Typed click handler receiving the cell's activity object. Fires alongside the native `onClick`.",
      },
      {
        name: "onCellHover",
        type: "(activity: ActivityWithLevel | null) => void",
        description:
          "Typed hover handler. Receives the activity on `mouseenter`, `null` on `mouseleave`. Fires alongside `onMouseEnter`/`onMouseLeave`.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the SVG `rect` element.",
      },
    ],
  },
  {
    componentName: "CalendarHeatmapFooter",
    description:
      "Flex container for footer elements (e.g. `CalendarHeatmapStat`, `CalendarHeatmapLegend`). Wraps items and adds responsive spacing.",
    props: [
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the footer container.",
      },
    ],
  },
  {
    componentName: "CalendarHeatmapStat",
    description:
      "Displays a summary statistic. Defaults to total contributions for the year. Customize the value with `compute` and the text with `label` (or `labels.stat`).",
    props: [
      {
        name: "compute",
        type: "(data: ActivityWithLevel[]) => number | string",
        description:
          "Custom function to derive the displayed value from all activity records. Defaults to summing `value`. Example: `(data) => Math.max(...data.map(d => d.value))`.",
      },
      {
        name: "label",
        type: "string",
        description:
          "Template string for the stat text. Placeholders: `{{value}}`, `{{year}}`. Overrides `labels.stat`. Example: `'Peak: {{value}}'`.",
      },
      {
        name: "children",
        type: "(args: { value: number | string; data: ActivityWithLevel[]; year: number }) => ReactNode",
        description:
          "Render-prop that fully replaces the default output. Use for rich content (multi-line, icons, etc.).",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the stat container.",
      },
    ],
  },
  {
    componentName: "CalendarHeatmapLegend",
    description:
      "Displays the intensity legend (Less → More) with colour-coded blocks matching the root `levels` and `colors` settings.",
    props: [
      {
        name: "labels",
        type: "{ less?: string; more?: string }",
        description:
          "Text at either end of the scale. Defaults: `'Less'` / `'More'`.",
      },
      {
        name: "children",
        type: "(props: { level: number }) => ReactNode",
        description:
          "Custom render-prop called once per legend level. Receives `{ level }` (0 = empty up to `levels`). Replaces the default colour block.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the legend container.",
      },
    ],
  },
];
