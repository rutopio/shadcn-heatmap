import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, CodeIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

import {
  DateDefaultDemo,
  MonthDefaultDemo,
  StatusDefaultDemo,
  WeekDefaultDemo,
} from "./demos";

const heatmaps = [
  { name: "CalendarHeatmap", Demo: MonthDefaultDemo, router: "calendar" },
  { name: "WeekdayHeatmap", Demo: WeekDefaultDemo, router: "weekday" },
  { name: "DateHeatmap", Demo: DateDefaultDemo, router: "date" },
  { name: "StatusHeatmap", Demo: StatusDefaultDemo, router: "status" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div
        aria-hidden
        className="bg-grid-pattern pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_15%,transparent_70%)] opacity-40"
      />
      <div className="relative container py-20 sm:py-28">
        <div className="flex flex-col items-center gap-6">
          <h1 className="max-w-6xl text-center text-4xl leading-[1.05] font-semibold text-balance sm:text-5xl md:text-6xl">
            Contribution heatmaps for React,
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
        <div className="mx-auto mt-14 flex w-fit flex-col gap-24">
          {heatmaps.map(({ name, Demo, router }) => (
            <div key={name} className="item-center flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="mr-auto text-lg font-semibold">{name}</h3>
                <Link to={router}>
                  <Button variant="outline" size="sm">
                    Explore
                    <ArrowRightIcon
                      aria-hidden="true"
                      weight="bold"
                      className="size-4"
                    />
                  </Button>
                </Link>
              </div>
              <Demo />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
