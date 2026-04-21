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
          "`{ date: 'YYYY-MM-DD', value: 0 | 1 | 2 | 3 }[]`. Status values: 0=no-data (secondary), 1=error (red), 2=warning (orange), 3=normal (green). Missing days are auto-filled with value 0.",
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
          "Customize colors: `{ error?: string, warning?: string, normal?: string }`. Defaults: error=red-500, warning=orange-500, normal=green-500. No-data always uses secondary color.",
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
        default: "12",
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
          "Override status labels (`statuses.noData`, `statuses.error`, `statuses.warning`, `statuses.normal`) and `normalDays` template string. Useful for internationalization.",
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
        name: "showDateLabels",
        type: "boolean",
        default: "false",
        description: "Show date labels below the timeline.",
      },
      {
        name: "labelInterval",
        type: "number",
        default: "30",
        description: "Show label every N days. Only applies when `showDateLabels` is true.",
      },
      {
        name: "labelTextClass",
        type: "string",
        description:
          "Additional CSS classes for date labels. Example: 'text-green-700 font-bold'.",
      },
    ],
  },
  {
    componentName: "StatusHeatmapBlock",
    description:
      "A single SVG rect element representing one day. Displays fixed status colors: no-data (secondary), error (red), warning (orange), normal (green). Colors can be customized via the root `colors` prop.",
    props: [
      {
        name: "activity",
        type: "StatusActivity",
        required: true,
        description:
          "The status record. Contains `date` and `value` (0=no-data, 1=error, 2=warning, 3=normal).",
      },
      {
        name: "dayIndex",
        type: "number",
        required: true,
        description: "Day index in the timeline (0-based).",
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
    componentName: "StatusHeatmapNormalDays",
    description:
      "Displays the count of days with normal status (value=3). Supports custom render function.",
    props: [
      {
        name: "children",
        type: "(args) => ReactNode",
        description:
          "Render function receiving `{ normalDays }`. If omitted, displays default format.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the element.",
      },
    ],
  },
  {
    componentName: "StatusHeatmapLegend",
    description: "Displays all 4 status states with their colors and labels: No Data, Error, Warning, Normal.",
    props: [
      {
        name: "children",
        type: "(args) => ReactNode",
        description:
          "Custom render function receiving `{ value, label }` for each status (0=no-data, 1=error, 2=warning, 3=normal).",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the legend container.",
      },
    ],
  },
];
