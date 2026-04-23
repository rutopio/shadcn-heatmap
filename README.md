# shadcn-heatmap

Contribution heatmap components for React, styled like [shadcn/ui](https://ui.shadcn.com).

**Live demo → [https://shadcn-heatmap.pages.dev](https://shadcn-heatmap.pages.dev)**

---

## Components

| Component         | Description                               |
| ----------------- | ----------------------------------------- |
| `CalendarHeatmap` | GitHub-style yearly contribution calendar |
| `WeekdayHeatmap`  | Weekday × hour activity grid              |
| `DateHeatmap`     | Date × hour activity grid                 |
| `StatusHeatmap`   | Atlassian-style status timeline           |

All four are single-file, zero-config components. You own the code after installation — copy, tweak, ship.

## Requirements

- React 19+
- Tailwind CSS v4
- shadcn/ui project setup

## Installation

### shadcn CLI (recommended)

```bash
# GitHub-style calendar
npx shadcn@latest add https://shadcn-heatmap.pages.dev/r/calendar-heatmap.json

# Weekday × hour grid
npx shadcn@latest add https://shadcn-heatmap.pages.dev/r/weekday-heatmap.json

# Date × hour grid
npx shadcn@latest add https://shadcn-heatmap.pages.dev/r/date-heatmap.json

# Status timeline
npx shadcn@latest add https://shadcn-heatmap.pages.dev/r/status-heatmap.json
```

The CLI writes the component into `components/heatmap/` in your project.

### Manual

1. Install peer dependencies:

```bash
pnpm add date-fns clsx tailwind-merge @radix-ui/react-tooltip
```

2. Add the `cn` helper if not already present:

```ts
// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

3. Expose the required theme tokens in your global CSS:

```css
/* src/styles/globals.css (Tailwind v4) */
@import "tailwindcss";

@theme {
  --color-secondary: oklch(96.7% 0.001 286.4);
  --color-chart-1: oklch(64.6% 0.222 41.1);
  --color-muted-foreground: oklch(55.2% 0.014 285.9);
}
```

4. Copy the component source from the [live demo](https://shadcn-heatmap.pages.dev) (each component page has a **Code** tab with the full source).

## Usage

### CalendarHeatmap

```tsx
import {
  CalendarHeatmap,
  CalendarHeatmapBlock,
  CalendarHeatmapBody,
  CalendarHeatmapFooter,
  CalendarHeatmapLegend,
  CalendarHeatmapTotalCount,
} from "@/components/heatmap/calendar-heatmap";

const data = [
  { date: "2024-01-01", value: 3 },
  { date: "2024-01-02", value: 7 },
  // ...
];

export default function Example() {
  return (
    <CalendarHeatmap data={data} weekStart={1}>
      <CalendarHeatmapBody>
        {({ activity, dayIndex, weekIndex }) => (
          <CalendarHeatmapBlock
            activity={activity}
            dayIndex={dayIndex}
            weekIndex={weekIndex}
          />
        )}
      </CalendarHeatmapBody>
      <CalendarHeatmapFooter>
        <CalendarHeatmapTotalCount />
        <CalendarHeatmapLegend />
      </CalendarHeatmapFooter>
    </CalendarHeatmap>
  );
}
```

### StatusHeatmap

```tsx
import {
  StatusHeatmap,
  StatusHeatmapBlock,
  StatusHeatmapBody,
  StatusHeatmapFooter,
  StatusHeatmapHealthyDays,
  StatusHeatmapLegend,
} from "@/components/heatmap/status-heatmap";

// value: 0 = no data, 1 = critical, 2 = degraded, 3 = healthy
const data = [
  { date: "2025-01-01", value: 3 },
  { date: "2025-01-02", value: 2 },
  { date: "2025-01-03", value: 1 },
];

export default function Example() {
  return (
    <StatusHeatmap data={data}>
      <StatusHeatmapBody showDateLabels>
        {({ activity, dayIndex }) => (
          <StatusHeatmapBlock activity={activity} dayIndex={dayIndex} />
        )}
      </StatusHeatmapBody>
      <StatusHeatmapFooter>
        <StatusHeatmapHealthyDays />
        <StatusHeatmapLegend />
      </StatusHeatmapFooter>
    </StatusHeatmap>
  );
}
```

See the [live demo](https://shadcn-heatmap.pages.dev) for full examples of all four components, including tooltips, i18n, and custom colors.

## Customization

All components accept a `colors` prop to override the default theme tokens:

```tsx
<CalendarHeatmap
  data={data}
  colors={{
    empty: "#e5e7eb",
    scale: "#6366f1",
  }}
>
  ...
</CalendarHeatmap>
```

Pass a `locale` prop (a `date-fns` locale object) for internationalized month and weekday labels.

## Contributing

Contributions are warmly welcome. Whether it's a bug report, a new variant idea, a11y improvement, or docs polish — feel free to open an [issue](https://github.com/rutopio/shadcn-heatmap/issues) or send a pull request.

If you're adding a new component or changing the public API, please open an issue first so we can align on scope before you write the code.

Before opening a pull request, please make sure the following commands pass locally — CI will run the same checks and block merges on failure:

```bash
pnpm run check
pnpm run build
```

## License

MIT License
