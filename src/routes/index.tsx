import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRightIcon, CodeIcon } from "@phosphor-icons/react";

import {
  DateDefaultDemo,
  MonthDefaultDemo,
  StatusDefaultDemo,
  WeekDefaultDemo,
} from "@/components/landing/demos";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";

const heatmaps = [
  {
    name: "CalendarHeatmap",
    description: "Example of Github Contribution",
    Demo: MonthDefaultDemo,
    router: "calendar",
  },
  {
    name: "WeekdayHeatmap",
    description: "Average weekly temperature in the Atacama Desert",
    Demo: WeekDefaultDemo,
    router: "weekday",
  },
  {
    name: "DateHeatmap",
    description: "Annual rainfall in Cherrapunji across dry and wet seasons",
    Demo: DateDefaultDemo,
    router: "date",
  },
  {
    name: "StatusHeatmap",
    description: "System uptime and operational status",
    Demo: StatusDefaultDemo,
    router: "status",
  },
];

function IndexPage() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="relative container py-20 sm:py-28">
        <div className="flex flex-col items-center gap-6">
          <h1 className="max-w-6xl text-center text-4xl leading-[1.05] font-semibold text-balance sm:text-5xl md:text-6xl">
            Heatmap components for React,
            <br />
            styled like <span className="text-muted-foreground">shadcn/ui</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base text-pretty sm:text-lg">
            Calendar, Weekday, Date, and Status heatmaps built with SVG,
            Tailwind v4 theme tokens, and React 19 context. Own the code — copy,
            tweak, ship. Ready for Cloudflare Pages, Vercel, anywhere static.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/install">
                Quick Start{" "}
                <CodeIcon aria-hidden="true" weight="bold" className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="mx-auto mt-8 flex w-full flex-col gap-12 sm:mt-14 sm:gap-16 md:gap-24">
          {heatmaps.map(({ name, description, Demo, router }) => (
            <div
              key={name}
              className="bg-background flex flex-col gap-8 rounded-lg border p-4"
            >
              <div className="flex items-center">
                <div className="mr-auto">
                  <h3 className="text-lg font-semibold text-balance">{name}</h3>
                  <p className="text-muted-foreground text-sm">{description}</p>
                </div>
                <Link to={router}>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label={`Explore ${name}`}
                  >
                    Explore
                    <ArrowRightIcon
                      aria-hidden="true"
                      weight="bold"
                      className="size-4"
                    />
                  </Button>
                </Link>
              </div>
              <div className="mx-auto overflow-x-auto">
                <Demo />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/")({
  component: IndexPage,
  head: () =>
    pageHead({
      title: "shadcn-heatmap — composable React heatmap components",
      description:
        "Beautiful, accessible heatmap components for React. Calendar, Weekday, Date, and Status heatmaps built with SVG, Tailwind v4, and shadcn/ui conventions.",
      path: "/",
    }),
});
