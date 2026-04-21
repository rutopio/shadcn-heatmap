import type { ComponentPropsSection } from "../types";

export const weekProps: ComponentPropsSection[] = [
  {
    componentName: "WeekdayHeatmap",
    description:
      "Root provider for the weekday × hour matrix. The grid includes a right-hand daily Sum column and a bottom hourly Sum row.",
    props: [
      // 1. 數據 (required)
      {
        name: "data",
        type: "HeatmapActivity[]",
        required: true,
        description:
          "`{ weekday: 0–7, hour: 0–24, value: number }[]`. Use `weekday = 7` for the Sum row and `hour = 24` for the Sum column. Sum cells are coloured against their own max (independent scales).",
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
        description: "Number of intensity buckets (0 to maxLevel).",
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
        default: "24",
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
        description: "Gap between cells.",
      },
      {
        name: "blockRadius",
        type: "number",
        default: "2",
        description: "Corner radius of each cell.",
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
        description: "First day of week: `0` = Sunday, `1` = Monday, ..., `6` = Saturday.",
      },
      {
        name: "use12Hour",
        type: "boolean",
        default: "false",
        description:
          "Switch the hour axis from 24-hour (`00`–`23`) to 12-hour AM/PM format. Can be combined with a custom `labels.hours` override.",
      },
      // 5. 國際化
      {
        name: "locale",
        type: "Locale",
        description:
          "A date-fns locale object (e.g. `import { ja } from 'date-fns/locale'`). Auto-generates `weekdays[0–6]` in the given language. Overridden by an explicit `labels.weekdays` array.",
      },
      {
        name: "labels",
        type: "WeekdayHeatmapLabels",
        description:
          "Override `weekdays` (length 7), `hours` (length 24), `endHour`, `sum` (for sum row/column labels), and `legend.less`/`legend.more` strings. Set `endHour: null` to suppress the trailing hour label. Useful for internationalization.",
      },
      // 6. 其他
      {
        name: "totalCount",
        type: "number",
        description: "Pre-calculated total. If omitted, computed from data automatically.",
      },
    ],
  },
  {
    componentName: "WeekdayHeatmapBody",
    description:
      "Renders the SVG grid. Children render-prop: `({ activity }) => ReactNode`.",
    props: [
      {
        name: "children",
        type: "(args) => ReactNode",
        required: true,
        description:
          "Render function receiving `{ activity }`. Typically returns `<WeekdayHeatmapBlock activity={activity} />`.",
      },
      {
        name: "hideSumRow",
        type: "boolean",
        default: "false",
        description: "Hide the hourly Sum row (weekday = 7) and its label.",
      },
      {
        name: "hideSumColumn",
        type: "boolean",
        default: "false",
        description: "Hide the daily Sum column (hour = 24) and its label.",
      },
      {
        name: "hideWeekdayLabels",
        type: "boolean",
        default: "false",
        description: "Hide weekday labels on the left.",
      },
      {
        name: "hideHourLabels",
        type: "boolean",
        default: "false",
        description: "Hide hour labels on the top.",
      },
      {
        name: "labelTextClass",
        type: "string",
        description: "Additional CSS classes for label text elements.",
      },
    ],
  },
  {
    componentName: "WeekdayHeatmapBlock",
    description:
      'A single SVG rect element representing one cell. Uses `--color-chart-1` for activity colors and `--color-secondary` for empty cells. Colors can be customized via the root `colors` prop.',
    props: [
      {
        name: "activity",
        type: "HeatmapActivityWithLevel",
        required: true,
        description:
          "The activity record including its computed level. Contains `weekday` (0-7), `hour` (0-24), `value`, and `level`.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the block element.",
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
    componentName: "WeekdayHeatmapFooter",
    description: "Container for footer elements like TotalCount and Legend.",
    props: [
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the footer container.",
      },
    ],
  },
  {
    componentName: "WeekdayHeatmapTotalCount",
    description: "Displays total contributions count. Supports custom render function.",
    props: [
      {
        name: "children",
        type: "(args) => ReactNode",
        description: "Render function receiving `{ totalCount }`. If omitted, displays default format.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the total count element.",
      },
    ],
  },
  {
    componentName: "WeekdayHeatmapLegend",
    description: "Displays intensity level legend (Less → More).",
    props: [
      {
        name: "children",
        type: "(args) => ReactNode",
        description: "Custom render function receiving `{ level }` for each intensity level.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the legend container.",
      },
    ],
  },
];
