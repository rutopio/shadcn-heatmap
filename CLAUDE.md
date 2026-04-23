# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # build:registry → tsc → vite build
pnpm typecheck    # TypeScript check only
pnpm lint         # ESLint
pnpm format       # Prettier
pnpm check        # audit + format + lint + typecheck (what CI runs)
```

No test suite — CI validates via `pnpm check` and `pnpm build`.

## Architecture

This is a **component library + demo site** for four heatmap visualizations distributed via the shadcn/ui registry.

### The Four Components (`src/components/heatmap/`)

| Component | Shape | Use case |
|---|---|---|
| `CalendarHeatmap` | 52 weeks × 7 days | GitHub-style contribution graph |
| `WeekdayHeatmap` | 7 weekdays × 24 hours | Recurring weekly patterns |
| `DateHeatmap` | N dates × 24 hours | Zoomed time windows |
| `StatusHeatmap` | Timeline of day statuses | Uptime / incident history |

### Compound Component Pattern

Each heatmap is composed:

```tsx
<CalendarHeatmap data={...}>        // root: computes context (levels, colors, data)
  <CalendarHeatmapBody>             // renders grid, calls render prop per cell
    {({ activity, dayIndex, weekIndex }) => <Block />}
  </CalendarHeatmapBody>
  <CalendarHeatmapFooter>           // optional
    <CalendarHeatmapStat />
    <CalendarHeatmapLegend />
  </CalendarHeatmapFooter>
</CalendarHeatmap>
```

The root passes computed data down via React Context. Body uses a render prop for each cell, giving the caller `activity` + position indices needed for tooltips.

### Color System

Colors use CSS `color-mix(in oklch, ...)` for level scaling. Two normalization modes:
- **normalized**: relative to min/max in dataset
- **non-normalized**: relative to 0 and max

`calculateLevel()` maps a value to a level bucket (default 4, configurable to 10 etc.). Users customize via `colors={{ scale: "var(--color-foo)" }}`.

### Registry Build (`scripts/build-registry.ts`)

`pnpm build:registry` runs before Vite build. It reads each heatmap source file and emits JSON to `public/r/` — these are the shadcn/ui registry entries users install with `shadcn@latest add <url>`. Each entry bundles component source, CSS variables (OKLch tokens), and peer dep declarations.

### Demo Site Structure

- `src/routes/` — TanStack Router pages (auto-generated `routeTree.gen.ts`, gitignored)
- `src/components/demos/` — Demo implementations per component type
  - `demos/variants/` — Variant grid configs (title, description, preview, code snippet)
  - `demos/shared.tsx` — Shared tooltip helpers and `WEEKDAY_NAMES` used across demos
- `src/content/` — Static code snippets and props metadata shown in docs
- `src/data/*.json` — Sample datasets used in demos

### Adding a New Variant

1. Add a demo function in `src/components/demos/<type>.tsx`
2. Export it from `src/components/demos/index.ts`
3. Add a variant object (title, description, preview, code) in `src/components/demos/variants/<type>.tsx`
