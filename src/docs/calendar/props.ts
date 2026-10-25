import type { ComponentPropsSection } from "../types";

export const calendarProps: ComponentPropsSection[] = [
  {
    componentName: "CalendarHeatmap",
    description:
      "Root provider for calendar activity and layout. CalendarActivity and CalendarHeatmapLabels are descriptive aliases for the existing Activity and Labels types.",
    props: [
      {
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Compose the grid and optional footer with CalendarHeatmapBody, CalendarHeatmapStat, and CalendarHeatmapLegend.",
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
        type: "CalendarActivity[]",
        required: true,
        description:
          "`{ date: 'YYYY-MM-DD', value: number }[]`. Dates must be valid calendar dates. Values must be finite numbers. Duplicate dates use the last record. Missing days between the first and last date render with `value: 0` and level 0, but are excluded from Stat callbacks.",
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
        default: "12",
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
        name: "continuousMonths",
        type: "boolean",
        default: "true",
        description:
          "When `true`, days flow continuously across months (GitHub-style). When `false`, each month starts at its own weekday-aligned column.",
      },
      {
        name: "hasEmptyColumn",
        type: "boolean",
        default: "false",
        description:
          "Insert a blank week-column between months to visually separate them. Only applies when `continuousMonths` is `false`.",
      },
      {
        name: "locale",
        type: "Locale",
        description:
          "A date-fns locale object (e.g. `import { de } from 'date-fns/locale'`). Auto-generates month and weekday labels in that language. Overridden by explicit `labels.months` / `labels.weekdays`.",
      },
      {
        name: "labels",
        type: "CalendarHeatmapLabels",
        description:
          "`months` and `weekdays` override locale labels; supply 12 months starting with January and 7 weekdays starting with Sunday. `cellLabel` formats cell aria-labels using `{{date}}` and `{{value}}`. `stat` sets the default Stat template. `heatmapLabel` labels each SVG and supports `{{year}}`. `legendLabel` labels the legend; `legendLevelLabel` labels each swatch using `{{level}}`. All placeholder occurrences are replaced. Set legend endpoint text on CalendarHeatmapLegend.",
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
    componentName: "CalendarHeatmapBody",
    description:
      "Renders the SVG grid. `children` is a render-prop called once per visible day cell.",
    props: [
      {
        name: "className",
        type: "string",
        description:
          "Additional CSS classes for the scroll container div. Common HTML attributes are also supported.",
      },
      {
        name: "children",
        type: "(args: { activity: CalendarActivityWithLevel; dayIndex: number; weekIndex: number }) => ReactNode",
        required: true,
        description:
          "Render-prop for each day cell. Typically returns `<CalendarHeatmapBlock activity={activity} dayIndex={dayIndex} weekIndex={weekIndex} />`.",
      },
      {
        name: "hideMonthLabels",
        type: "boolean",
        default: "false",
        description:
          "Hide the month labels (e.g. `Jan`, `Feb`) above each row.",
      },
      {
        name: "hideWeekdayLabels",
        type: "boolean",
        default: "false",
        description: "Hide the weekday labels (e.g. `Mon`, `Wed`) on the left.",
      },
      {
        name: "hideYearLabels",
        type: "boolean",
        default: "false",
        description: "Hide the year label above each year row.",
      },
      {
        name: "labelClassName",
        type: "string",
        description:
          "Additional CSS classes applied to month and weekday label text elements.",
      },
      {
        name: "yearClassName",
        type: "string",
        description:
          "Additional CSS classes applied to the year label element shown above each year row.",
      },
      {
        name: "renderYearFooter",
        type: "(props: { year: number; totalCount: number }) => ReactNode",
        description:
          "Called after each year row with the year and sum of its input values. This sum must be finite and is independent of the root `totalCount` override.",
      },
    ],
  },
  {
    componentName: "CalendarHeatmapBlock",
    description:
      "A single SVG `rect` representing one day. Color is driven by the cell's level. Defaults: `--color-chart-1` for active cells, `--color-secondary` for empty. Both are overridable via the root `colors` prop.",
    props: [
      {
        name: "activity",
        type: "CalendarActivityWithLevel",
        required: true,
        description:
          "The day's activity record with its computed `level` (0 = empty; colored levels end at levels - 1, or levels when normalized). Pass the value received from the `CalendarHeatmapBody` render-prop.",
      },
      {
        name: "dayIndex",
        type: "number",
        required: true,
        description:
          "Row index within the week (0 = first day per `weekStart`, 6 = last). Pass the value received from the `CalendarHeatmapBody` render-prop.",
      },
      {
        name: "weekIndex",
        type: "number",
        required: true,
        description:
          "Column index within the current year row. Pass the value received from the `CalendarHeatmapBody` render-prop.",
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
        type: "(activity: CalendarActivityWithLevel) => void",
        description:
          "Typed click handler receiving the cell's activity object. Fires alongside the native `onClick`.",
      },
      {
        name: "onCellHover",
        type: "(activity: CalendarActivityWithLevel | null) => void",
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
    componentName: "CalendarHeatmapFooter",
    description:
      "Flex container for footer elements (e.g. `CalendarHeatmapStat`, `CalendarHeatmapLegend`). Wraps items and adds responsive spacing.",
    props: [
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes for the footer container.",
      },
    ],
  },
  {
    componentName: "CalendarHeatmapStat",
    description:
      "Displays a summary statistic. Defaults to total contributions across the supplied date range. Customize the value with `compute` and the text with `label` (or `labels.stat`).",
    props: [
      {
        name: "compute",
        type: "(data: CalendarActivityWithLevel[]) => number | string",
        description:
          "Compute a finite number or a string from sorted, deduplicated input records. Filled cells are excluded. Defaults to summing `value`. Example: `(data) => Math.max(...data.map(d => d.value))`.",
      },
      {
        name: "label",
        type: "string",
        description:
          "Template string for the stat text. Placeholders: `{{value}}`, `{{year}}`. Overrides `labels.stat`. `{{year}}` is the displayed year or year range. The render-prop `year` is the first year. Example: `'Peak: {{value}}'`.",
      },
      {
        name: "children",
        type: "(args: { value: number | string; data: CalendarActivityWithLevel[]; year: number }) => ReactNode",
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
    componentName: "CalendarHeatmapLegend",
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
