import type { ComponentPropsSection } from "../types";

export const dateProps: ComponentPropsSection[] = [
  {
    componentName: "DateHeatmap",
    description:
      "Root provider for a date × hour matrix (one row per date). A Sum column aggregates each day across all hours and is coloured against its own scale.",
    props: [
      // 1. 數據 (required)
      {
        name: "data",
        type: "DateHourlyActivity[]",
        required: true,
        description:
          "`{ date: 'YYYY-MM-DD', hour: 0–24, value: number }[]`. `hour = 24` is the daily Sum column. Dates are auto-sorted ascending; all hour 0..24 cells are auto-filled with 0 where absent.",
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
        description:
          "Base font size for labels. Also drives the date-label column width: `fontSize * 7.5 + 8`.",
      },
      {
        name: "use12Hour",
        type: "boolean",
        default: "false",
        description:
          "Switch the hour axis from 24-hour (`00`–`23`) to 12-hour AM/PM (`12am`–`11pm`). Can be combined with a custom `labels.hours` override.",
      },
      // 5. 國際化
      {
        name: "locale",
        type: "Locale",
        description:
          "A date-fns locale object (e.g. `import { es } from 'date-fns/locale'`). Auto-localizes date labels. Overrides default English formatting.",
      },
      {
        name: "dateFormat",
        type: "string",
        default: '"MMM dd, yyyy"',
        description:
          "Date format string for date-fns `format()`. Used for date labels on the left axis. Examples: 'MMM dd, yyyy', 'yyyy-MM-dd', 'EEE, MMM dd, yyyy' (with weekday). Works with `locale` for localized formatting.",
      },
      {
        name: "labels",
        type: "DateHeatmapLabels",
        description:
          "Override `hours` (24 strings), `endHour` (set to `null` to hide), `sum` (for sum column label), and legend strings (`legend.less`, `legend.more`). Useful for internationalization.",
      },
      // 6. 其他
      {
        name: "totalCount",
        type: "number",
        description:
          "Pre-calculated total. If omitted, computed from data automatically.",
      },
    ],
  },
  {
    componentName: "DateHeatmapBody",
    description:
      "Renders the SVG grid. Children render-prop: `({ activity, dateIndex }) => ReactNode`.",
    props: [
      {
        name: "children",
        type: "(args) => ReactNode",
        required: true,
        description:
          "Render function receiving `{ activity, dateIndex }`. Typically returns `<DateHeatmapBlock activity={activity} dateIndex={dateIndex} />`.",
      },
      {
        name: "hideDateLabels",
        type: "boolean",
        default: "false",
        description: "Hide date labels on the left axis.",
      },
      {
        name: "hideHourLabels",
        type: "boolean",
        default: "false",
        description: "Hide hour labels on the top axis.",
      },
      {
        name: "hideSumColumn",
        type: "boolean",
        default: "false",
        description: "Hide the daily Sum column (hour = 24) and its label.",
      },
      {
        name: "hideSumRow",
        type: "boolean",
        default: "false",
        description: 'Hide the hourly Sum row (date = "sum") and its label.',
      },
      {
        name: "labelTextClass",
        type: "string",
        description:
          "Additional CSS classes for axis labels (date and hour labels). Example: 'text-destructive font-bold'.",
      },
    ],
  },
  {
    componentName: "DateHeatmapBlock",
    description:
      "A single SVG rect element representing one hour. Uses `--color-chart-1` for activity colors and `--color-secondary` for empty cells. Colors can be customized via the root `colors` prop.",
    props: [
      {
        name: "activity",
        type: "DateHourlyActivityWithLevel",
        required: true,
        description:
          "The activity record including its computed level. Contains `date`, `hour` (0-24), `value`, and `level`.",
      },
      {
        name: "dateIndex",
        type: "number",
        required: true,
        description: "Row index for this date in the calendar (0-based).",
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
    componentName: "DateHeatmapFooter",
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
    componentName: "DateHeatmapTotalCount",
    description:
      "Displays total contributions count. Supports custom render function.",
    props: [
      {
        name: "children",
        type: "(args) => ReactNode",
        description:
          "Render function receiving `{ totalCount }`. If omitted, displays default format.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the total count element.",
      },
    ],
  },
  {
    componentName: "DateHeatmapLegend",
    description: "Displays intensity level legend (Less → More).",
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
