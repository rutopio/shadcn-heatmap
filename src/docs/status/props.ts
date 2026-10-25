import type { ComponentPropsSection } from "../types";

export const statusProps: ComponentPropsSection[] = [
  {
    componentName: "StatusHeatmap",
    description:
      "Root provider for a status timeline. Each day is represented by a vertical bar (similar to Atlassian Statuspage).",
    props: [
      {
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Compose the grid and optional footer with StatusHeatmapBody, StatusHeatmapStat, and StatusHeatmapLegend.",
      },
      {
        name: "className",
        type: "string",
        description:
          "Additional CSS classes for the root div. Common HTML attributes are also supported.",
      },
      {
        name: "style",
        type: "CSSProperties",
        description:
          "Inline styles for the root div. Use layout props to change SVG block geometry.",
      },
      {
        name: "data",
        type: "StatusActivity[]",
        required: true,
        description:
          "`{ date: 'YYYY-MM-DD', value: number }[]`. Dates must be valid calendar dates and values must be finite numbers, including custom negative or fractional values. Duplicate dates use the last record. Missing days render as 0 but are excluded from Stat callbacks. `0` = no data. Built-in values: `1` = critical (red), `2` = degraded (amber), `3` = healthy (green). Custom numeric values are supported: supply matching entries in `colors` and `labels.statuses`, and add them to `statusValues` to appear in the legend.",
      },
      {
        name: "emptyState",
        type: "ReactNode",
        description:
          "Rendered when `data` is empty. By default returns `null`.",
      },
      {
        name: "colors",
        type: "StatusColorConfig",
        description:
          "Customize colors per status. Accepts semantic keys (`noData`, `critical`, `degraded`, `healthy`) and numeric keys for custom statuses (e.g. `{ 4: 'var(--color-chart-4)' }`). A numeric key takes precedence over its semantic alias. Defaults: `noData = 'var(--color-secondary)'`; critical/degraded/healthy use built-in red/amber/green.",
      },
      {
        name: "statusValues",
        type: "number[]",
        default: "[0, 1, 2, 3]",
        description:
          "Unique finite status values to show in the legend, in display order. An empty array hides all entries. This does not restrict values in `data`. Extend for custom statuses (e.g. `[0, 1, 2, 3, 4]`).",
      },
      {
        name: "healthyValue",
        type: "number",
        default: "3",
        description:
          "Finite status value counted by the default `StatusHeatmapStat` compute function. Only supplied records are counted, including when this is 0. Change this if your healthy state uses a different numeric value.",
      },
      {
        name: "blockSize",
        type: "number",
        default: "40",
        description:
          "Finite block height in pixels, greater than 0. Block width is `blockSize × blockAspectRatio`.",
      },
      {
        name: "blockAspectRatio",
        type: "number",
        default: "0.2",
        description:
          "Finite width-to-height ratio greater than 0 for each block. `0.2` = narrow vertical bar (default), `0.5` = wider bar, `1` = square.",
      },
      {
        name: "blockMargin",
        type: "number",
        default: "2",
        description:
          "Finite gap between adjacent blocks in pixels, at least 0.",
      },
      {
        name: "blockRadius",
        type: "number",
        default: "2",
        description: "Finite corner radius (`rx`/`ry`) in pixels, at least 0.",
      },
      {
        name: "fontSize",
        type: "number",
        default: "14",
        description:
          "Finite base font size for axis labels in pixels, greater than 0.",
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
          "`statuses` maps numeric or semantic status keys to text shared by cells and the legend. `cellLabel` formats cell aria-labels using `{{date}}` and `{{status}}`. `stat` sets the default Stat template. `heatmapLabel` labels the SVG; `legendLabel` labels the legend. All placeholder occurrences are replaced. Override legend status text locally with StatusHeatmapLegend.labels.",
      },
    ],
  },
  {
    componentName: "StatusHeatmapBody",
    description:
      "Renders the SVG timeline. `children` is a render-prop called once per day cell.",
    props: [
      {
        name: "className",
        type: "string",
        description:
          "Additional CSS classes for the scroll container div. Common HTML attributes are also supported.",
      },
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
          "Show a date label every N days. Must be a positive integer. The first and last dates are always labelled. Only applies when `hideDateLabels` is `false`.",
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
        description:
          "Position of this day in the timeline (0-based). Pass the value received from the `StatusHeatmapBody` render-prop.",
      },
      {
        name: "highlighted",
        type: "boolean",
        default: "false",
        description:
          "Dims the block to 60% of its color. Useful for selected/focus states. Also sets `data-highlighted` on the element for CSS targeting.",
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
          "Compute a finite number or a string from sorted, deduplicated input records. Filled cells are excluded. Defaults to counting days where `value === healthyValue`. Example: `(data) => data.filter(d => d.value === 1).length` for critical-day count.",
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
          "Render-prop that replaces the default output and its wrapper. Container attributes such as `className` do not apply when this is provided.",
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
      "Displays the status legend. Renders one entry per value in `statusValues` with its color swatch and label.",
    props: [
      {
        name: "labels",
        type: "Record<number, string> & { noData?: string; critical?: string; degraded?: string; healthy?: string }",
        description:
          "Override status text labels for this legend only. Each missing label falls back to root `labels.statuses`, then built-in defaults. Local labels take precedence even when the root uses a numeric key and the local override uses its semantic alias. Use this when the legend text should differ from the Block aria-label text.",
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
