import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  Clock,
  GridFour,
} from "@phosphor-icons/react";

import { Hero } from "@/components/landing/hero";
import { QuickStart } from "@/components/landing/quick-start";

const components = [
  {
    name: "CalendarHeatmap",
    description:
      "GitHub-style, 7-row × N-week grid. Handles multiple years, ISO week starts, and i18n labels.",
    icon: GridFour,
    to: "/calendar" as const,
  },
  {
    name: "WeekdayHeatmap",
    description:
      "Weekday × hour-of-day matrix with Sum row and column. Independent colour scales for each axis.",
    icon: Clock,
    to: "/weekday" as const,
  },
  {
    name: "DateHeatmap",
    description:
      "One row per calendar date × 24 hours + daily Sum column. Perfect for recent 1–4 week windows.",
    icon: CalendarCheck,
    to: "/date" as const,
  },
];

function IndexPage() {
  return (
    <>
      <Hero />
      <QuickStart />
      <section
        id="components"
        className="border-b py-20 sm:py-24"
        aria-label="Components"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Components
            </span>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Three heatmaps for three time scales
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              Every component is a compound component: a root provider, a
              calendar/SVG grid with a render-prop, and optional footer + legend
              + total parts you can swap out.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {components.map((comp) => (
              <Link
                key={comp.name}
                to={comp.to}
                className="group flex flex-col gap-3 rounded-xl border bg-card/50 p-6 transition-colors hover:border-foreground/20 hover:bg-card"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
                    <comp.icon aria-hidden="true" weight="bold" className="size-4" />
                  </span>
                  <h3 className="font-mono text-sm font-semibold">
                    {comp.name}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {comp.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  View docs & demos{" "}
                  <ArrowRight aria-hidden="true" weight="bold" className="size-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export const Route = createFileRoute("/")({
  component: IndexPage,
});
