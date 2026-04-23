import type { ComponentPropsSection } from "../types";

export const dateProps: ComponentPropsSection[] = [
  {
    componentName: "DateHeatmap",
    description:
      "Root provider for the date × hour matrix (one row per date). Pass `extraRow` / `extraColumn` to append an aggregate row / column with a custom compute function.",
    props: [
      {
        name: "data",
        type: "DateHourlyActivity[]",
        required: true,
        description:
          "`{ date: 'YYYY-MM-DD', hour: number, value: number }[]`. `hour` is `0..23`. Dates are auto-sorted ascending; missing cells are auto-filled with `value: 0`.",
      },
      {
        name: "extraRow",
        type: "{ label: ReactNode; compute: (data: DateHourlyActivity[]) => number[] }",
        description:
          "Append an aggregate row below the grid. `compute(data)` must return exactly 24 numbers (one per hour). `label` appears in the left gutter. The extra row has an independent min–max colour scale.",
      },
      {
        name: "extraColumn",
        type: "{ label: ReactNode; compute: (data: DateHourlyActivity[], dates: string[]) => number[] }",
        description:
          "Append an aggregate column to the right of the grid. `compute(data, dates)` must return one number per date (aligned to the sorted `dates` array). `label` appears in the top gutter. The extra column has an independent min–max colour scale.",
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
          "Total number of cells shown in the legend. Non-normalized: 1 empty cell + `(levels - 1)` coloured steps from 20%→100% opacity. Normalized: `levels` coloured steps from 20%→100% opacity (no empty cell).",
      },
      {
        name: "isNormalized",
        type: "boolean",
        default: "false",
        description:
          "When `true`, uses min–max normalization: min maps to level 1 and max to `levels`. Suitable for signed values. When `false`, values ≤ 0 are treated as empty (level 0) and the scale runs from 0 to max.",
      },
      {
        name: "blockSize",
        type: "number",
        default: "24",
        description:
          "Block height in pixels. Block width is `blockSize × blockSizeRatio`.",
      },
      {
        name: "blockSizeRatio",
        type: "number",
        default: "1",
        description:
          "Width-to-height ratio for each block. `1` = square, `2` = landscape, `0.5` = portrait.",
      },
      {
        name: "blockMargin",
        type: "number",
        default: "4",
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
        name: "use12Hour",
        type: "boolean",
        default: "false",
        description:
          "Switch the hour axis from 24-hour (`00`–`23`) to 12-hour AM/PM format. Can be combined with a custom `labels.hours` override.",
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
        default: '"MMM dd, yyyy"',
        description:
          "date-fns format string for date labels on the left axis. Examples: `'MMM dd, yyyy'`, `'yyyy-MM-dd'`, `'EEE, MMM d'`. Works with `locale` for localized output.",
      },
      {
        name: "labels",
        type: "DateHeatmapLabels",
        description:
          "`{ hours?: string[24], endHour?: string | null, cellLabel?: string, stat?: string }`. `endHour` defaults to `'00'` / `'12'`; set to `null` to hide it. `cellLabel` is the aria-label template (placeholders: `{{date}}`, `{{hour}}`, `{{value}}`). Legend text goes on `<DateHeatmapLegend labels={…}>`; stat text goes on `<DateHeatmapStat label={…}>` — or set `labels.stat` here for a single i18n source. Extra row/column labels come from `extraRow.label` / `extraColumn.label`.",
      },
      {
        name: "totalCount",
        type: "number",
        description:
          "Override the auto-computed sum. Useful when the visible window is a slice of a larger dataset.",
      },
    ],
  },
  {
    componentName: "DateHeatmapBody",
    description:
      "Renders the SVG grid. `children` is a render-prop called once per visible cell (including extra row/column cells when present).",
    props: [
      {
        name: "children",
        type: "(args: { activity: DateHourlyActivityWithLevel; dateIndex: number }) => ReactNode",
        required: true,
        description:
          "Render-prop for each cell. Typically returns `<DateHeatmapBlock activity={activity} dateIndex={dateIndex} />`.",
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
          "Additional CSS classes applied to all axis label text elements.",
      },
      {
        name: "renderExtraRow",
        type: "(args: { activity: DateHourlyActivityWithLevel; dateIndex: number }) => ReactNode",
        description:
          "Override render-prop for extra row cells only. Falls back to `children` when omitted.",
      },
      {
        name: "renderExtraColumn",
        type: "(args: { activity: DateHourlyActivityWithLevel; dateIndex: number }) => ReactNode",
        description:
          "Override render-prop for extra column cells only. Falls back to `children` when omitted.",
      },
    ],
  },
  {
    componentName: "DateHeatmapBlock",
    description:
      "A single SVG `rect` representing one hour cell. Color is driven by the cell's level. Defaults: `--color-chart-1` for active cells, `--color-secondary` for empty. Both are overridable via the root `colors` prop.",
    props: [
      {
        name: "activity",
        type: "DateHourlyActivityWithLevel",
        required: true,
        description:
          "The cell's activity record with its computed `level`. Contains `date`, `hour` (0–23), `value`, and `level`. Pass the value received from the `DateHeatmapBody` render-prop.",
      },
      {
        name: "dateIndex",
        type: "number",
        required: true,
        description: "Row index for this date (0-based, sorted ascending). Pass the value received from the `DateHeatmapBody` render-prop.",
      },
      {
        name: "extra",
        type: "'row' | 'column' | undefined",
        description:
          "Marks this block as an extra aggregate row or column cell. Controls positioning. Pass the value received from `renderExtraRow` / `renderExtraColumn`.",
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
        type: "(activity: DateHourlyActivityWithLevel) => void",
        description:
          "Typed click handler receiving the cell's activity object. Fires alongside the native `onClick`.",
      },
      {
        name: "onCellHover",
        type: "(activity: DateHourlyActivityWithLevel | null) => void",
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
    componentName: "DateHeatmapFooter",
    description:
      "Flex container for footer elements (e.g. `DateHeatmapStat`, `DateHeatmapLegend`). Wraps items and adds responsive spacing.",
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
      "Displays a summary statistic. Defaults to total contributions. Customize the value with `compute` and the text with `label` (or `labels.stat`).",
    props: [
      {
        name: "compute",
        type: "(data: DateHourlyActivityWithLevel[]) => number | string",
        description:
          "Custom function to derive the displayed value from all activity records. Defaults to summing `value`. Example: `(data) => data.reduce((m, d) => Math.max(m, d.value), 0)` for peak hour.",
      },
      {
        name: "label",
        type: "string",
        description:
          "Template string for the stat text. Placeholder: `{{value}}`. Overrides `labels.stat`. Example: `'Peak: {{value}}'`.",
      },
      {
        name: "children",
        type: "(args: { value: number | string; data: DateHourlyActivityWithLevel[] }) => ReactNode",
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
    componentName: "DateHeatmapLegend",
    description:
      "Displays the intensity legend (Less → More) with colour-coded blocks matching the root `levels` and `colors` settings.",
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
          "Custom render-prop called once per legend level. Receives `{ level }` (0 = empty up to `levels`). Replaces the default colour block.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the legend container.",
      },
    ],
  },
];
