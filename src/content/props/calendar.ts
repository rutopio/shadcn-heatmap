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
        name: "maxLevel",
        type: "number",
        default: "4",
        description:
          "Number of intensity buckets. Level 0 is empty; 1…maxLevel map onto `chart-1` opacity steps.",
      },
      {
        name: "isNormalized",
        type: "boolean",
        default: "false",
        description:
          "When `true`, levels are assigned via min–max normalization: the minimum value maps to level 1 and the maximum to `maxLevel`. Suitable for datasets with negative values. When `false` (default), values ≤ 0 are treated as empty (level 0) and the scale runs from 0 to max.",
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
        description: "Side length of each square block in pixels.",
      },
      {
        name: "blockMargin",
        type: "number",
        default: "4",
        description: "Gap between blocks in pixels.",
      },
      {
        name: "blockRadius",
        type: "number",
        default: "2",
        description: "Corner radius of each block.",
      },
      {
        name: "blockSizeRatio",
        type: "number",
        default: "1",
        description:
          "Width-to-height ratio for each block. `1` = square, `1.5` = landscape, `0.5` = portrait.",
      },
      {
        name: "fontSize",
        type: "number",
        default: "14",
        description: "Base font size for labels (weekday / month).",
      },
      {
        name: "weekStart",
        type: "0 | 1 | 2 | 3 | 4 | 5 | 6",
        default: "0",
        description:
          "Which weekday labels/rows start with. 0 = Sunday (GitHub-style), 1 = Monday (ISO).",
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
        name: "dateFormat",
        type: "string",
        default: '"PPP"',
        description:
          "Date format string for date-fns `format()`. Used when formatting dates in tooltips or custom rendering. Examples: 'PPP' (localized long), 'MMM d, yyyy', 'yyyy-MM-dd'. Works with `locale` for localized formatting.",
      },
      {
        name: "labels",
        type: "Labels",
        description:
          'Override default month names, weekday names, legend text, or `totalCount` template `"{{count}} contributions in {{year}}"`.',
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
        name: "labelTextClass",
        type: "string",
        description:
          "Additional CSS classes for month and weekday label text. Example: 'text-destructive font-bold'.",
      },
      {
        name: "yearTextClass",
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
          "The activity record including its computed level (0–maxLevel). Received directly from the `CalendarHeatmapBody` render-prop.",
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
        name: "className",
        type: "string",
        description: "Additional CSS classes for the SVG rect element.",
      },
      {
        name: 'data-highlighted="true"',
        type: "attribute",
        description:
          "Opt in to the `chart-2` palette for this block (useful for selected states).",
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
    componentName: "CalendarHeatmapTotalCount",
    description:
      "Displays total contributions count and year. Supports custom render function.",
    props: [
      {
        name: "children",
        type: "(args) => ReactNode",
        description:
          "Render function receiving `{ totalCount, year }`. If omitted, displays default format using `labels.totalCount` template.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the total count element.",
      },
    ],
  },
  {
    componentName: "CalendarHeatmapLegend",
    description:
      "Displays intensity level legend (Less → More) with color-coded blocks.",
    props: [
      {
        name: "children",
        type: "(args) => ReactNode",
        description:
          "Custom render function receiving `{ level }` for each intensity level (0 to maxLevel).",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the legend container.",
      },
    ],
  },
];
