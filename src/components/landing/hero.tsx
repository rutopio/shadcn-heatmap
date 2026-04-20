import { ArrowRight, BookOpen } from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { MonthDefaultDemo } from "./demos";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div
        aria-hidden
        className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_15%,transparent_70%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-1 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-chart-1" />
            </span>
            Three composable heatmaps, one drop-in file each
          </Badge>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Contribution heatmaps for React,
            <br />
            styled like <span className="text-muted-foreground">shadcn/ui</span>
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Month, Week, and Date heatmaps built with SVG, Tailwind v4 theme
            tokens, and React 19 context. Own the code — copy, tweak, ship.
            Ready for Cloudflare Pages, Vercel, anywhere static.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <a href="#quick-start">
                Get started <ArrowRight aria-hidden="true" weight="bold" className="size-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <a href="#components">
                <BookOpen aria-hidden="true" weight="bold" className="size-4" /> Browse components
              </a>
            </Button>
          </div>
        </div>
        <div className="mt-14 flex justify-center">
          <div className="w-full rounded-xl border bg-card/60 p-6 shadow-xs backdrop-blur-sm sm:p-8">
            <MonthDefaultDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
