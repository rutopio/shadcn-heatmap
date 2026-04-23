import type { ComponentPropsSection } from "../types";

export const statusProps: ComponentPropsSection[] = [
  {
    componentName: "StatusHeatmap",
    description:
      "Root provider for a status timeline. Each day is represented by a vertical bar (similar to Atlassian Statuspage).",
    props: [
      {
        name: "data",
        type: "StatusActivity[]",
        required: true,
        description:
          "`{ date: 'YYYY-MM-DD', value: number }[]`. `0` = no data. Built-in values: `1` = critical (red), `2` = degraded (amber), `3` = healthy (green). Custom numeric values are supported — supply matching entries in `colors` and `labels.statuses`, and add them to `statusValues` to appear in the legend.",
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
          "Customize colors per status. Accepts semantic keys (`noData`, `critical`, `degraded`, `healthy`) and numeric keys for custom statuses (e.g. `{ 4: 'var(--color-chart-4)' }`). A numeric key takes precedence over its semantic alias. Defaults: `noData = 'var(--color-secondary)'`; critical/degraded/healthy use built-in red/amber/green.",
      },
      {
        name: "statusValues",
        type: "number[]",
        default: "[0, 1, 2, 3]",
        description:
          "Which status values are shown in the legend, in the order they appear. Extend for custom statuses (e.g. `[0, 1, 2, 3, 4]`).",
      },
      {
        name: "healthyValue",
        type: "number",
        default: "3",
        description:
          "The status value counted by the default `StatusHeatmapStat` compute function. Change this if your healthy state uses a different numeric value.",
      },
      {
        name: "blockSize",
        type: "number",
        default: "40",
        description:
          "Block height in pixels. Block width is `blockSize × blockSizeRatio`.",
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
        name: "locale",
        type: "Locale",
        description:
          "A date-fns locale object (e.g. `import { es } from 'date-fns/locale'`). Localizes date label formatting. Overrides default English formatting.",
      },
      {
        name: "dateFormat",
        type: "string",
        default: '"MMM d"',
        description:
          "date-fns format string for date labels below the timeline. Examples: `'MMM d'`, `'MMM d, yyyy'`, `'yyyy-MM-dd'`. Works with `locale` for localized output.",
      },
      {
        name: "labels",
        type: "StatusHeatmapLabels",
        description:
          "`{ statuses?: Record<number, string> & { noData?, critical?, degraded?, healthy? }, cellLabel?: string, stat?: string }`. `statuses` labels are shared by the Block aria-label and the Legend. `cellLabel` is the aria-label template (placeholders: `{{date}}`, `{{status}}`). Stat text goes on `<StatusHeatmapStat label={…}>` — or set `labels.stat` here for a single i18n source. The Legend can also override `statuses` locally via `<StatusHeatmapLegend labels={…}>`.",
      },
    ],
  },
  {
    componentName: "StatusHeatmapBody",
    description:
      "Renders the SVG timeline. `children` is a render-prop called once per day cell.",
    props: [
      {
        name: "children",
        type: "(args: { activity: StatusActivity; dayIndex: number }) => ReactNode",
        required: true,
        description:
          "Render-prop for each day cell. Typically returns `<StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />`.",
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
          "Show a date label every N days. The first and last dates are always labelled. Only applies when `hideDateLabels` is `false`.",
      },
      {
        name: "labelClassName",
        type: "string",
        description:
          "Additional CSS classes applied to date label text elements.",
      },
    ],
  },
  {
    componentName: "StatusHeatmapBlock",
    description:
      "A single SVG `rect` representing one day. Color is driven by the status value. Defaults: built-in red/amber/green for 1/2/3, `--color-secondary` for 0. All overridable via the root `colors` prop.",
    props: [
      {
        name: "activity",
        type: "StatusActivity",
        required: true,
        description:
          "The day's status record. Contains `date` and `value` (`0` = no data, `1` = critical, `2` = degraded, `3` = healthy, or a custom value). Pass the value received from the `StatusHeatmapBody` render-prop.",
      },
      {
        name: "dayIndex",
        type: "number",
        required: true,
        description: "Position of this day in the timeline (0-based). Pass the value received from the `StatusHeatmapBody` render-prop.",
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
        type: "(activity: StatusActivity) => void",
        description:
          "Typed click handler receiving the cell's activity object. Fires alongside the native `onClick`.",
      },
      {
        name: "onCellHover",
        type: "(activity: StatusActivity | null) => void",
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
    componentName: "StatusHeatmapFooter",
    description:
      "Flex container for footer elements (e.g. `StatusHeatmapStat`, `StatusHeatmapLegend`). Wraps items and adds responsive spacing.",
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
      "Displays a summary statistic. Defaults to the count of days where `value === healthyValue`. Customize the value with `compute` and the text with `label` (or `labels.stat`).",
    props: [
      {
        name: "compute",
        type: "(data: StatusActivity[]) => number | string",
        description:
          "Custom function to derive the displayed value from all activity records. Defaults to counting days where `value === healthyValue`. Example: `(data) => data.filter(d => d.value === 1).length` for critical-day count.",
      },
      {
        name: "label",
        type: "string",
        description:
          "Template string for the stat text. Placeholder: `{{value}}`. Overrides `labels.stat`. Example: `'{{value}} critical days'`.",
      },
      {
        name: "children",
        type: "(args: { value: number | string; data: StatusActivity[] }) => ReactNode",
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
    componentName: "StatusHeatmapLegend",
    description:
      "Displays the status legend. Renders one entry per value in `statusValues` with its colour swatch and label.",
    props: [
      {
        name: "labels",
        type: "Record<number, string> & { noData?: string; critical?: string; degraded?: string; healthy?: string }",
        description:
          "Override status text labels for this legend only. Falls back to root `labels.statuses`, then built-in defaults. Use this when the legend text should differ from the Block aria-label text.",
      },
      {
        name: "children",
        type: "(props: { value: StatusValue; label: string }) => ReactNode",
        description:
          "Custom render-prop called once per status in `statusValues`. Receives `{ value, label }`. Replaces the default swatch + text layout.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the legend container.",
      },
    ],
  },
];
