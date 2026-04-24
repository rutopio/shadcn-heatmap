import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRightIcon, CodeIcon } from "@phosphor-icons/react";
import {
  CalendarDefaultDemo,
  DateDefaultDemo,
  StatusDefaultDemo,
  WeekdayDefaultDemo,
} from "@/docs";

import { Button } from "@/components/ui/button";
import { pageHead, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo";

const heatmaps = [
  {
    name: "CalendarHeatmap",
    description: "Example of Github Contribution",
    Demo: CalendarDefaultDemo,
    router: "calendar",
  },
  {
    name: "WeekdayHeatmap",
    description: "Average weekly temperature in the Atacama Desert",
    Demo: WeekdayDefaultDemo,
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
      <div className="relative container py-12 sm:py-28">
        <div className="flex flex-col items-center gap-6">
          <h1 className="max-w-6xl text-center text-4xl leading-[1.05] font-semibold text-balance sm:text-5xl md:text-6xl">
            <span className="block sm:inline">
              Heatmap components for React,
            </span>{" "}
            <span className="block sm:inline">
              built for <span className="text-muted-foreground">shadcn/ui</span>
            </span>
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
              className="bg-background flex flex-col gap-6 rounded-lg border p-4 sm:gap-8"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="sm:mr-auto">
                  <h2 className="text-lg font-semibold text-balance">{name}</h2>
                  <p className="text-muted-foreground text-sm text-pretty">
                    {description}
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="self-start sm:self-auto"
                  aria-label={`Explore ${name}`}
                >
                  <Link to={router}>
                    Explore
                    <ArrowRightIcon
                      aria-hidden="true"
                      weight="bold"
                      className="size-4"
                    />
                  </Link>
                </Button>
              </div>
              <div className="-mx-4 flex w-[calc(100%+2rem)] justify-center overflow-x-auto px-4 sm:mx-0 sm:w-full sm:px-0">
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
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      path: "/",
    }),
});
