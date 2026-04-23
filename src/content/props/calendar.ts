import type { ComponentPropsSection } from "../types";

export const calendarProps: ComponentPropsSection[] = [
  {
    componentName: "CalendarHeatmap",
    description:
      "Root provider. Accepts the activity array and layout options and shares them with its children via context.",
    props: [
      // 1. 數據 (required)
      {
        name: "data",
        type: "Activity[]",
        required: true,
        description:
          "Array of `{ date: 'YYYY-MM-DD', value: number }`. Missing days are auto-filled with value 0.",
      },
      // 2. 空狀態處理
      {
        name: "emptyState",
        type: "ReactNode",
        description:
          "Custom content to display when `data` is empty. By default, returns `null` (nothing rendered).",
      },
      // 3. 視覺配置
      {
        name: "levels",
        type: "number",
        default: "5",
        description:
          "Total number of cells shown in the legend. Non-normalized (default): 1 empty cell + (levels − 1) coloured steps from 20%→100% opacity. Normalized: `levels` coloured steps from 20%→100% opacity (no empty cell).",
      },
      {
        name: "isNormalized",
        type: "boolean",
        default: "false",
        description:
          "When `true`, uses min–max normalization across the dataset: min maps to level 1 and max to `levels`. Suitable for datasets with negative values (e.g. temperature). When `false` (default), values ≤ 0 are treated as empty (level 0) and the scale runs from 0 to max.",
      },
      {
        name: "colors",
        type: "ColorConfig",
        description:
          "Customize colors: `{ empty?: string, scale?: string }`. Defaults: `empty = 'var(--color-secondary)'`, `scale = 'var(--color-chart-1)'`. Both accept CSS color values.",
      },
      // 4. 尺寸配置
      {
        name: "blockSize",
        type: "number",
        default: "12",
        description:
          "Block **height** in pixels. Width is `blockSize × blockSizeRatio`.",
      },
      {
        name: "blockSizeRatio",
        type: "number",
        default: "1",
        description:
          "Width-to-height ratio for each block. `2` = landscape, `1` = square (default), `0.5` = portrait.",
      },
      {
        name: "blockMargin",
        type: "number",
        default: "4",
        description: "Gap between blocks.",
      },
      {
        name: "blockRadius",
        type: "number",
        default: "2",
        description: "Corner radius of each block.",
      },
      {
        name: "fontSize",
        type: "number",
        default: "14",
        description: "Base font size for labels.",
      },
      {
        name: "weekStart",
        type: "WeekDay",
        default: "0",
        description:
          "First day of week: `0` = Sunday, `1` = Monday, ..., `6` = Saturday. `WeekDay` is date-fns's `Day` type.",
      },
      {
        name: "hasEmptyColumn",
        type: "boolean",
        default: "false",
        description:
          "Insert a blank week-column between months to visually separate them. Only applies when `continuousMonths` is `false`.",
      },
      {
        name: "continuousMonths",
        type: "boolean",
        default: "true",
        description:
          "When `true` (default), days flow continuously across months — GitHub-style. When `false`, each month starts at its own weekday-aligned column.",
      },
      // 5. 國際化
      {
        name: "locale",
        type: "Locale",
        description:
          "A date-fns locale object (e.g. `import { de } from 'date-fns/locale'`). Auto-generates `months` and `weekdays` in the given language. Overridden by explicit `labels.months` / `labels.weekdays` arrays.",
      },
      {
        name: "labels",
        type: "Labels",
        description:
          "Override `months` (12 strings), `weekdays` (7 strings), and `cellLabel` aria-label template (placeholders: `{{date}}`, `{{value}}`). Legend text goes on `<CalendarHeatmapLegend labels={…}>`; stat text goes on `<CalendarHeatmapStat label={…}>` — or set `labels.stat` here if you prefer i18n all in one place.",
      },
      // 6. 其他
      {
        name: "totalCount",
        type: "number",
        description:
          "Override the auto-computed sum (useful when the visible window is a slice of a larger dataset).",
      },
    ],
  },
  {
    componentName: "CalendarHeatmapBody",
    description:
      "Renders the SVG grid. Children is a render-prop that receives `{ activity, dayIndex, weekIndex }`.",
    props: [
      {
        name: "hideMonthLabels",
        type: "boolean",
        default: "false",
        description: "Hide the `Jan Feb Mar…` labels above each row.",
      },
      {
        name: "hideWeekdayLabels",
        type: "boolean",
        default: "false",
        description: "Hide the `Sun Mon…` labels on the left.",
      },
      {
        name: "labelClassName",
        type: "string",
        description:
          "Additional CSS classes for month and weekday label text. Example: 'text-destructive font-bold'.",
      },
      {
        name: "yearClassName",
        type: "string",
        description:
          "Additional CSS classes for year label text when displaying multi-year data.",
      },
      {
        name: "renderYearFooter",
        type: "(props) => ReactNode",
        description:
          "Custom render function for year footer. Receives `{ year, totalCount }`. Useful for multi-year layouts to show per-year summaries.",
      },
      {
        name: "children",
        type: "(args) => ReactNode",
        required: true,
        description:
          "Render-prop for each cell. Typically returns `<CalendarHeatmapBlock activity={...} dayIndex={...} weekIndex={...} />`.",
      },
    ],
  },
  {
    componentName: "CalendarHeatmapBlock",
    description:
      "A single SVG rect element representing one day. Uses `--color-chart-1` for activity colors and `--color-secondary` for empty cells. Colors can be customized via the root `colors` prop.",
    props: [
      {
        name: "activity",
        type: "ActivityWithLevel",
        required: true,
        description:
          "The activity record including its computed level (0–levels). Received directly from the `CalendarHeatmapBody` render-prop.",
      },
      {
        name: "dayIndex",
        type: "number",
        required: true,
        description: "0–6 row index within the week.",
      },
      {
        name: "weekIndex",
        type: "number",
        required: true,
        description: "Column index within the current year row.",
      },
      {
        name: "highlighted",
        type: "boolean",
        default: "false",
        description:
          "Dim this block to 60% opacity of its colour (useful for selected / focus states). Also emits a `data-highlighted` attribute for CSS targeting.",
      },
      {
        name: "onCellClick",
        type: "(activity: ActivityWithLevel) => void",
        description:
          "Semantic click handler receiving the cell's activity. Fires alongside any `onClick` passed through.",
      },
      {
        name: "onCellHover",
        type: "(activity: ActivityWithLevel | null) => void",
        description:
          "Semantic hover handler. Receives the activity on enter, and `null` on leave. Fires alongside `onMouseEnter`/`onMouseLeave`.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the SVG rect element.",
      },
    ],
  },
  {
    componentName: "CalendarHeatmapFooter",
    description:
      "Container for footer elements like TotalCount and Legend. Provides default flex layout.",
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
      "Displays a summary stat in the footer. Defaults to total contributions for the year. Customize the computation with `compute` and the output text with `label` (or `labels.stat`).",
    props: [
      {
        name: "compute",
        type: "(data: ActivityWithLevel[]) => number | string",
        description:
          "Function to compute the stat from all activities. Defaults to summing `value`. Example: `(data) => Math.max(...data.map(d => d.value))`.",
      },
      {
        name: "label",
        type: "string",
        description:
          "Template string overriding `labels.stat`. Placeholders: `{{value}}`, `{{year}}`. Example: `\"Peak: {{value}}\"`.",
      },
      {
        name: "children",
        type: "(args) => ReactNode",
        description:
          "Render function receiving `{ value, data, year }`. Fully takes over rendering. Use this for rich content (multi-line, icons, etc.).",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the stat element.",
      },
    ],
  },
  {
    componentName: "CalendarHeatmapLegend",
    description:
      "Displays intensity level legend (Less → More) with color-coded blocks.",
    props: [
      {
        name: "labels",
        type: "{ less?: string; more?: string }",
        description:
          "Text labels shown at either end of the scale. Defaults to `Less` / `More`.",
      },
      {
        name: "children",
        type: "(args) => ReactNode",
        description:
          "Custom render function receiving `{ level }` for each intensity level (0 to levels).",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the legend container.",
      },
    ],
  },
];
