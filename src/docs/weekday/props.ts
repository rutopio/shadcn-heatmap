import type { ComponentPropsSection } from "../types";

export const weekdayProps: ComponentPropsSection[] = [
  {
    componentName: "WeekdayHeatmap",
    description:
      "Root provider for the weekday × hour matrix (7 rows × 24 columns). Pass `extraRow` / `extraColumn` to append an aggregate row / column with a custom compute function.",
    props: [
      {
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Compose the grid and optional footer with WeekdayHeatmapBody, WeekdayHeatmapStat, and WeekdayHeatmapLegend.",
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
        type: "WeekdayHourlyActivity[]",
        required: true,
        description:
          "`{ weekday: number, hour: number, value: number }[]`. `weekday` must be an integer from 0 to 6 (Sunday to Saturday); `hour` must be an integer from 0 to 23. Values must be finite. Duplicate slots use the last record. Missing slots render with value and level 0 and are excluded from Stat and aggregate compute callbacks.",
      },
      {
        name: "extraRow",
        type: "{ label: ReactNode; compute: (data: WeekdayHourlyActivity[]) => number[] }",
        description:
          "Append an aggregate row below the grid. `compute(data)` must return exactly 24 numbers (one per hour). `label` appears in the left gutter. The extra row has its own scale: 0 to maximum by default, or min-max when `isNormalized` is true. Values must be finite with no array holes. The callback receives sorted, deduplicated input without filled cells and is skipped for empty data.",
      },
      {
        name: "extraColumn",
        type: "{ label: ReactNode; compute: (data: WeekdayHourlyActivity[]) => number[] }",
        description:
          "Append an aggregate column to the right of the grid. `compute(data)` must return exactly 7 numbers (one per weekday, indexed 0 to 6). `label` appears in the top gutter. The extra column has its own scale: 0 to maximum by default, or min-max when `isNormalized` is true. Values must be finite with no array holes. The callback receives sorted, deduplicated input without filled cells and is skipped for empty data.",
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
          "`{ empty?: string; scale?: string }`. Defaults: `empty = 'var(--color-secondary)'`, `scale = 'var(--color-chart-1)'`. Both accept any CSS color value.",
      },
      {
        name: "levels",
        type: "number",
        default: "5",
        description:
          "Number of legend cells. Use an integer of at least 2, or at least 1 when normalized. The default scale has one empty cell and `levels - 1` colored steps; normalized scales have `levels` colored steps. Colored steps range from 20% to 100% color strength. A single colored step uses 100%.",
      },
      {
        name: "isNormalized",
        type: "boolean",
        default: "false",
        description:
          "When `true`, scales supplied values from their minimum (level 1) to maximum (`levels`), including negative values. Equal values all use level 1. Missing cells keep level 0. When `false`, values at or below 0 use the empty color; positive values scale from 0 to the maximum. This changes colors, not stored values or totals.",
      },
      {
        name: "blockSize",
        type: "number",
        default: "24",
        description:
          "Finite block height in pixels, greater than 0. Block width is `blockSize × blockAspectRatio`.",
      },
      {
        name: "blockAspectRatio",
        type: "number",
        default: "1",
        description:
          "Finite width-to-height ratio greater than 0 for each block. `1` = square, `2` = landscape, `0.5` = portrait.",
      },
      {
        name: "blockMargin",
        type: "number",
        default: "4",
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
        name: "weekStart",
        type: "WeekDay",
        default: "0",
        description:
          "First day of the week. `0` = Sunday, `1` = Monday, ..., `6` = Saturday. Uses date-fns `Day` type.",
      },
      {
        name: "use12Hour",
        type: "boolean",
        default: "false",
        description:
          "Switch the hour axis from 24-hour (`00` to `23`) to 12-hour AM/PM format. Can be combined with a custom `labels.hours` override.",
      },
      {
        name: "locale",
        type: "Locale",
        description:
          "A date-fns locale object (e.g. `import { ja } from 'date-fns/locale'`). Auto-generates weekday labels in that language. Overridden by an explicit `labels.weekdays` array.",
      },
      {
        name: "labels",
        type: "WeekdayHeatmapLabels",
        description:
          "`weekdays` and `hours` override axis labels; supply 7 weekdays starting with Sunday and 24 hours starting at midnight. `endHour` defaults to '00' or '12'; use null to hide it. `cellLabel` formats cell aria-labels using `{{weekday}}`, `{{hour}}`, and `{{value}}`. `stat` sets the default Stat template. `heatmapLabel` labels the SVG; `legendLabel` labels the legend; `legendLevelLabel` labels each swatch using `{{level}}`. All placeholder occurrences are replaced. Aggregate labels come from `extraRow.label` and `extraColumn.label`. Set legend endpoint text on WeekdayHeatmapLegend.",
      },
      {
        name: "totalCount",
        type: "number",
        description:
          "Override the sum of input values, not the number of records. Must be finite; negative totals are allowed. Without an override, input values must sum to a finite number. A Stat `compute` callback takes precedence.",
      },
    ],
  },
  {
    componentName: "WeekdayHeatmapBody",
    description:
      "Renders the SVG grid. `children` is a render-prop called once per visible cell (including extra row/column cells when present).",
    props: [
      {
        name: "className",
        type: "string",
        description:
          "Additional CSS classes for the scroll container div. Common HTML attributes are also supported.",
      },
      {
        name: "children",
        type: "(args: { activity: WeekdayHourlyActivityWithLevel; weekdayIndex: number }) => ReactNode",
        required: true,
        description:
          "Render-prop for each cell. `weekdayIndex` is the display row index (0 to 6, reordered per `weekStart`; 7 = extra row). Typically returns `<WeekdayHeatmapBlock activity={activity} />`.",
      },
      {
        name: "hideWeekdayLabels",
        type: "boolean",
        default: "false",
        description:
          "Hide weekday labels (e.g. `Mon`, `Tue`) on the left axis.",
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
          "Additional CSS classes applied to all axis label text elements.",
      },
      {
        name: "renderExtraRow",
        type: "(args: { activity: WeekdayHourlyActivityWithLevel; weekdayIndex: number }) => ReactNode",
        description:
          "Override render-prop for extra row cells only. Falls back to `children` when omitted.",
      },
      {
        name: "renderExtraColumn",
        type: "(args: { activity: WeekdayHourlyActivityWithLevel; weekdayIndex: number }) => ReactNode",
        description:
          "Override render-prop for extra column cells only. Falls back to `children` when omitted.",
      },
    ],
  },
  {
    componentName: "WeekdayHeatmapBlock",
    description:
      "A single SVG `rect` representing one cell. Color is driven by the cell's level. Defaults: `--color-chart-1` for active cells, `--color-secondary` for empty. Both are overridable via the root `colors` prop.",
    props: [
      {
        name: "activity",
        type: "WeekdayHourlyActivityWithLevel",
        required: true,
        description:
          "The cell's activity record with its computed `level`. Contains `weekday` (0 to 6), `hour` (0 to 23), `value`, and `level`. Pass the value received from the `WeekdayHeatmapBody` render-prop.",
      },
      {
        name: "extra",
        type: "'row' | 'column' | undefined",
        description:
          "Overrides aggregate positioning. Defaults to `activity.extra`, which the body sets automatically.",
      },
      {
        name: "highlighted",
        type: "boolean",
        default: "false",
        description:
          "Reduces colored blocks to 60% of their color strength. Empty blocks keep their empty color. Useful for selected/focus states. Also sets `data-highlighted` on the element for CSS targeting.",
      },
      {
        name: "onCellClick",
        type: "(activity: WeekdayHourlyActivityWithLevel) => void",
        description:
          "Typed click handler receiving the cell's activity object. Fires alongside the native `onClick`.",
      },
      {
        name: "onCellHover",
        type: "(activity: WeekdayHourlyActivityWithLevel | null) => void",
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
    componentName: "WeekdayHeatmapFooter",
    description:
      "Flex container for footer elements (e.g. `WeekdayHeatmapStat`, `WeekdayHeatmapLegend`). Wraps items and adds responsive spacing.",
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
      "Displays a summary statistic. Defaults to total contributions. Customize the value with `compute` and the text with `label` (or `labels.stat`).",
    props: [
      {
        name: "compute",
        type: "(data: WeekdayHourlyActivityWithLevel[]) => number | string",
        description:
          "Compute a finite number or a string from sorted, deduplicated input records. Filled cells and aggregate cells are excluded. Defaults to summing `value`. Example: `(data) => (data.reduce((s, d) => s + d.value, 0) / data.length).toFixed(1)` for an average.",
      },
      {
        name: "label",
        type: "string",
        description:
          "Template string for the stat text. Placeholder: `{{value}}`. Overrides `labels.stat`. Example: `'Avg: {{value}}'`.",
      },
      {
        name: "children",
        type: "(args: { value: number | string; data: WeekdayHourlyActivityWithLevel[] }) => ReactNode",
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
    componentName: "WeekdayHeatmapLegend",
    description:
      "Displays the intensity legend (Less → More) with color-coded blocks matching the root `levels` and `colors` settings.",
    props: [
      {
        name: "labels",
        type: "{ less?: string; more?: string }",
        description:
          "Text at either end of the scale. Defaults: `'Less'` / `'More'`.",
      },
      {
        name: "children",
        type: "(props: { level: number }) => ReactNode",
        description:
          "Custom render-prop called once per legend level. Receives `{ level }`: 0 to `levels - 1`, or 1 to `levels` when normalized. Replaces the default color block.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the legend container.",
      },
    ],
  },
];
