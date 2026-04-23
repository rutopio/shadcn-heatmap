import type { ComponentPropsSection } from "../types";

export const weekdayProps: ComponentPropsSection[] = [
  {
    componentName: "WeekdayHeatmap",
    description:
      "Root provider for the weekday × hour matrix. Pass `extraRow` / `extraColumn` to append an aggregate row / column with your own compute function (avg, median, p95, sum — anything).",
    props: [
      // 1. 數據 (required)
      {
        name: "data",
        type: "WeekdayHourlyActivity[]",
        required: true,
        description:
          "`{ weekday: number, hour: number, value: number }[]`. `weekday` is `0..6` (Sun–Sat); `hour` is `0..23`.",
      },
      {
        name: "extraRow",
        type: "{ label: ReactNode; compute: (data) => number[] }",
        description:
          "Append an aggregate row below the grid. `compute(data)` must return 24 numbers (one per hour). `label` appears in the left gutter. Extra row cells have an independent min–max colour scale.",
      },
      {
        name: "extraColumn",
        type: "{ label: ReactNode; compute: (data) => number[] }",
        description:
          "Append an aggregate column to the right of the grid. `compute(data)` must return 7 numbers indexed by weekday (0–6). `label` appears in the top gutter. Extra column cells have an independent min–max colour scale.",
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
        name: "weekStart",
        type: "WeekDay",
        default: "0",
        description:
          "First day of week: `0` = Sunday, `1` = Monday, ..., `6` = Saturday.",
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
          "Override `weekdays` (7 strings), `hours` (24 strings), `endHour` (set to `null` to hide), and `cellLabel` aria-label template (placeholders: `{{weekday}}`, `{{hour}}`, `{{value}}`). Legend text goes on `<WeekdayHeatmapLegend labels={…}>`; stat text goes on `<WeekdayHeatmapStat label={…}>` — or set `labels.stat` here if you prefer i18n all in one place. Extra row/column labels come from `extraRow.label` / `extraColumn.label`.",
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
    componentName: "WeekdayHeatmapBody",
    description:
      "Renders the SVG grid. Children render-prop: `({ activity }) => ReactNode`.",
    props: [
      {
        name: "children",
        type: "(args) => ReactNode",
        required: true,
        description:
          "Render function receiving `{ activity, extra }`. `extra` is `'row'` | `'column'` for extra cells, otherwise `undefined`. Typically returns `<WeekdayHeatmapBlock activity={activity} extra={extra} />`.",
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
        name: "labelClassName",
        type: "string",
        description: "Additional CSS classes for label text elements.",
      },
    ],
  },
  {
    componentName: "WeekdayHeatmapBlock",
    description:
      "A single SVG rect element representing one cell. Uses `--color-chart-1` for activity colors and `--color-secondary` for empty cells. Colors can be customized via the root `colors` prop.",
    props: [
      {
        name: "activity",
        type: "WeekdayHourlyActivityWithLevel",
        required: true,
        description:
          "The activity record including its computed level. Contains `weekday` (0-6), `hour` (0-23), `value`, and `level`.",
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
        type: "(activity: WeekdayHourlyActivityWithLevel) => void",
        description:
          "Semantic click handler receiving the cell's activity. Fires alongside any `onClick` passed through.",
      },
      {
        name: "onCellHover",
        type: "(activity: WeekdayHourlyActivityWithLevel | null) => void",
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
    componentName: "WeekdayHeatmapStat",
    description:
      "Displays a summary stat in the footer. Defaults to total contributions. Customize the computation with `compute` and the output text with `label` (or `labels.stat`).",
    props: [
      {
        name: "compute",
        type: "(data: WeekdayHourlyActivityWithLevel[]) => number | string",
        description:
          "Function to compute the stat from all activities. Defaults to the total sum. Example: `(data) => data.reduce((s, d) => s + d.value, 0) / data.length` for an average.",
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
    componentName: "WeekdayHeatmapLegend",
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
          "Custom render function receiving `{ level }` for each intensity level.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the legend container.",
      },
    ],
  },
];
