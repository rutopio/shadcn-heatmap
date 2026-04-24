import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  CodeIcon,
  LinkSimpleBreakIcon,
} from "@phosphor-icons/react";
import {
  CalendarDefaultDemo,
  DateDefaultDemo,
  StatusDefaultDemo,
  WeekdayDefaultDemo,
} from "@/docs";
import { toast } from "sonner";

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
          <h1 className="max-w-6xl text-center text-4xl leading-tight font-semibold sm:text-5xl md:text-6xl">
            Heatmap components for React,
            <br className="hidden sm:block" /> built for{" "}
            <span className="text-muted-foreground">shadcn/ui</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base text-pretty sm:text-center sm:text-lg">
            Four heatmap components for React: calendar, weekday, date, and
            status.
            <br />
            Built on SVG and Tailwind v4 tokens.
            <br />
            Copy the source, own it entirely.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/install">
                Get Started{" "}
                <CodeIcon aria-hidden="true" weight="bold" className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="mx-auto mt-8 flex w-full flex-col gap-12 sm:mt-14 sm:gap-16 md:gap-24">
          {heatmaps.map(({ name, description, Demo, router }) => (
            <div
              key={name}
              id={router}
              className="bg-background flex flex-col overflow-hidden rounded-xl border"
            >
              <div className="flex items-stretch justify-between border-b">
                <div className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 p-0"
                      onClick={() => {
                        const url = `${window.location.origin}${window.location.pathname}#${router}`;
                        void navigator.clipboard.writeText(url);
                        toast.success("Link copied to clipboard", {
                          description: url,
                        });
                      }}
                      aria-label={`Copy link to ${name}`}
                    >
                      <LinkSimpleBreakIcon
                        aria-hidden="true"
                        className="size-4"
                      />
                    </Button>
                    <h2 className="font-medium text-balance">{name}</h2>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs text-pretty">
                    {description}
                  </p>
                </div>
                <Link
                  to={router}
                  aria-label={`Explore ${name}`}
                  className="hover:bg-muted flex shrink-0 items-center gap-1.5 border-l px-4 text-sm font-medium transition-colors"
                >
                  Explore
                  <ArrowRightIcon
                    aria-hidden="true"
                    weight="bold"
                    className="size-4"
                  />
                </Link>
              </div>
              <div className="flex min-h-30 flex-1 items-center justify-center overflow-auto p-4 sm:min-h-48 sm:p-6">
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
