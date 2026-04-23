import type { ComponentPropsSection } from "../types";

export const statusProps: ComponentPropsSection[] = [
  {
    componentName: "StatusHeatmap",
    description:
      "Root provider for a status timeline indicator showing daily status over a period (e.g., 90 days). Each day is represented by a vertical bar, similar to Atlassian Statuspage.",
    props: [
      // 1. 數據 (required)
      {
        name: "data",
        type: "StatusActivity[]",
        required: true,
        description:
          "`{ date: 'YYYY-MM-DD', value: number }[]`. `0` is reserved for no-data. Defaults: `1`=critical (red), `2`=degraded (amber), `3`=healthy (green). You can extend with any numeric value — supply a matching entry in `colors` and `labels.statuses`, and list the value in `statusValues` to appear in the legend.",
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
        name: "colors",
        type: "ColorConfig",
        description:
          "Customize colors per status. Accepts semantic keys (`noData`, `critical`, `degraded`, `healthy`) **and** numeric keys for custom statuses (`{ 4: 'var(--color-chart-4)' }`). Numeric key takes precedence over its semantic alias. Defaults: `noData = 'var(--color-secondary)'`, critical/degraded/healthy use semantic red/amber/green.",
      },
      // 4. 尺寸配置
      {
        name: "blockSize",
        type: "number",
        default: "40",
        description:
          "Block **height** in pixels. Width is `blockSize × blockSizeRatio`.",
      },
      {
        name: "blockSizeRatio",
        type: "number",
        default: "0.2",
        description:
          "Width-to-height ratio for each block. `0.2` = narrow vertical bar (default), `0.5` = wider bar, `1` = square.",
      },
      {
        name: "blockMargin",
        type: "number",
        default: "2",
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
        default: '"MMM d"',
        description:
          "Date format string for date-fns `format()`. Used for date labels. Examples: 'MMM d', 'MMM d, yyyy', 'yyyy-MM-dd'. Works with `locale` for localized formatting.",
      },
      {
        name: "labels",
        type: "StatusHeatmapLabels",
        description:
          "Override `statuses` (semantic keys `noData`/`critical`/`degraded`/`healthy` and/or numeric keys for custom values) — these are shared by the Block aria-label and the Legend. `cellLabel` is the aria-label template (placeholders: `{{date}}`, `{{status}}`). Stat text goes on `<StatusHeatmapStat label={…}>` (or `labels.stat`). The Legend can also override `statuses` locally via `<StatusHeatmapLegend labels={…}>`.",
      },
      {
        name: "statusValues",
        type: "number[]",
        default: "[0, 1, 2, 3]",
        description:
          "Which status values are rendered in the legend, in order. Extend for custom statuses (e.g. `[0, 1, 2, 3, 4]`).",
      },
      {
        name: "healthyValue",
        type: "number",
        default: "3",
        description:
          "The status value counted by the default `StatusHeatmapStat` compute. Set this if your 'healthy' status uses a different numeric value.",
      },
    ],
  },
  {
    componentName: "StatusHeatmapBody",
    description:
      "Renders the SVG timeline. Children render-prop: `({ activity, dayIndex }) => ReactNode`.",
    props: [
      {
        name: "children",
        type: "(args) => ReactNode",
        required: true,
        description:
          "Render function receiving `{ activity, dayIndex }`. Typically returns `<StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />`.",
      },
      {
        name: "hideDateLabels",
        type: "boolean",
        default: "false",
        description: "Hide date labels below the timeline.",
      },
      {
        name: "labelInterval",
        type: "number",
        default: "30",
        description:
          "Show label every N days. Only applies when `hideDateLabels` is `false`.",
      },
      {
        name: "labelClassName",
        type: "string",
        description:
          "Additional CSS classes for date labels. Example: 'text-destructive font-bold'.",
      },
    ],
  },
  {
    componentName: "StatusHeatmapBlock",
    description:
      "A single SVG rect element representing one day. Displays fixed status colors: no-data (secondary), critical (red), degraded (orange), healthy (green). Colors can be customized via the root `colors` prop.",
    props: [
      {
        name: "activity",
        type: "StatusActivity",
        required: true,
        description:
          "The status record. Contains `date` and `value` (0=no-data, 1=critical, 2=degraded, 3=healthy).",
      },
      {
        name: "dayIndex",
        type: "number",
        required: true,
        description: "Day index in the timeline (0-based).",
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
        type: "(activity: StatusActivity) => void",
        description:
          "Semantic click handler receiving the cell's activity. Fires alongside any `onClick` passed through.",
      },
      {
        name: "onCellHover",
        type: "(activity: StatusActivity | null) => void",
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
    componentName: "StatusHeatmapFooter",
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
    componentName: "StatusHeatmapStat",
    description:
      "Displays a summary stat in the footer. Defaults to the count of days matching `healthyValue`. Customize the computation with `compute` and the output text with `label` (or `labels.stat`).",
    props: [
      {
        name: "compute",
        type: "(data: StatusActivity[]) => number | string",
        description:
          "Function to compute the stat from all activities. Defaults to counting days where `value === healthyValue`. Example: `(data) => data.filter(d => d.value === 1).length` for critical-day count.",
      },
      {
        name: "label",
        type: "string",
        description:
          "Template string overriding `labels.stat`. Placeholder: `{{value}}`. Example: `\"{{value}} critical days\"`.",
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
    componentName: "StatusHeatmapLegend",
    description:
      "Displays the status legend. By default renders one entry per value in `statusValues` (default: No Data, Critical, Degraded, Healthy).",
    props: [
      {
        name: "labels",
        type: "Record<number, string> & { noData?, critical?, degraded?, healthy? }",
        description:
          "Override the status text labels **for this legend only**. Falls back to root `labels.statuses`, then built-in defaults. Use this when the Legend text should differ from the Block aria-label text (otherwise prefer root `labels.statuses` so both share the same source).",
      },
      {
        name: "children",
        type: "(args) => ReactNode",
        description:
          "Custom render function receiving `{ value, label }` for each status in `statusValues`.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the legend container.",
      },
    ],
  },
];
