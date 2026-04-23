import type { ComponentPropsSection } from "../types";

export const dateProps: ComponentPropsSection[] = [
  {
    componentName: "DateHeatmap",
    description:
      "Root provider for a date × hour matrix (one row per date). Pass `extraRow` / `extraColumn` to append an aggregate row / column with your own compute function (sum, avg, p95 — anything).",
    props: [
      // 1. 數據 (required)
      {
        name: "data",
        type: "DateHourlyActivity[]",
        required: true,
        description:
          "`{ date: 'YYYY-MM-DD', hour: number, value: number }[]`. `hour` is `0..23`. Dates are auto-sorted ascending; missing cells are auto-filled with 0.",
      },
      {
        name: "extraRow",
        type: "{ label: ReactNode; compute: (data) => number[] }",
        description:
          "Append an aggregate row below the grid. `compute(data)` must return 24 numbers (one per hour). `label` appears in the left gutter. Extra row cells have an independent min–max colour scale.",
      },
      {
        name: "extraColumn",
        type: "{ label: ReactNode; compute: (data, dates) => number[] }",
        description:
          "Append an aggregate column to the right of the grid. `compute(data, dates)` must return one number per date (aligned to the sorted `dates` array). `label` appears in the top gutter. Extra column cells have an independent min–max colour scale.",
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
        description: "Base font size for labels.",
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
          "Override `hours` (24 strings), `endHour` (set to `null` to hide), and `cellLabel` aria-label template (placeholders: `{{date}}`, `{{hour}}`, `{{value}}`). Legend text goes on `<DateHeatmapLegend labels={…}>`; stat text goes on `<DateHeatmapStat label={…}>` — or set `labels.stat` here if you prefer i18n all in one place. Extra row/column labels come from `extraRow.label` / `extraColumn.label`.",
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
          "Render function receiving `{ activity, dateIndex, extra }`. `extra` is `'row'` | `'column'` for extra cells, otherwise `undefined`. Typically returns `<DateHeatmapBlock activity={activity} dateIndex={dateIndex} extra={extra} />`.",
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
        name: "labelClassName",
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
          "The activity record including its computed level. Contains `date`, `hour` (0-23), `value`, and `level`.",
      },
      {
        name: "dateIndex",
        type: "number",
        required: true,
        description: "Row index for this date in the calendar (0-based).",
      },
      {
        name: "extra",
        type: "'row' | 'column' | undefined",
        description:
          "Marks this block as belonging to the extra aggregate row or column. Forward the value from the Body render-prop as-is.",
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
        type: "(activity: DateHourlyActivityWithLevel) => void",
        description:
          "Semantic click handler receiving the cell's activity. Fires alongside any `onClick` passed through.",
      },
      {
        name: "onCellHover",
        type: "(activity: DateHourlyActivityWithLevel | null) => void",
        description:
          "Semantic hover handler. Receives the activity on enter, and `null` on leave. Fires alongside `onMouseEnter`/`onMouseLeave`.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the block element.",
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
    componentName: "DateHeatmapStat",
    description:
      "Displays a summary stat in the footer. Defaults to total contributions. Customize the computation with `compute` and the output text with `label` (or `labels.stat`).",
    props: [
      {
        name: "compute",
        type: "(data: DateHourlyActivityWithLevel[]) => number | string",
        description:
          "Function to compute the stat from all activities. Defaults to the total sum. Example: `(data) => data.reduce((m, d) => Math.max(m, d.value), 0)` for peak hour.",
      },
      {
        name: "label",
        type: "string",
        description:
          "Template string overriding `labels.stat`. Placeholder: `{{value}}`.",
      },
      {
        name: "children",
        type: "(args) => ReactNode",
        description:
          "Render function receiving `{ value, data }`. Fully takes over rendering.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the stat element.",
      },
    ],
  },
  {
    componentName: "DateHeatmapLegend",
    description: "Displays intensity level legend (Less → More).",
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
