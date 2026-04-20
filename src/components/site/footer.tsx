import { GithubLogo, Heart } from "@phosphor-icons/react";

export function SiteFooter() {
  return (
    <footer className="border-t py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p className="flex items-center gap-1.5">
          Built with <Heart aria-hidden="true" weight="fill" className="size-3.5 text-chart-1" />{" "}
          using React, Tailwind v4, Radix, and shadcn conventions.
        </p>
        <div className="flex items-center gap-4">
          <a
            className="inline-flex items-center gap-1.5 hover:text-foreground"
            href="https://github.com/chingru/shadcn-heatmap"
            target="_blank"
            rel="noreferrer"
          >
            <GithubLogo aria-hidden="true" weight="bold" className="size-4" />
            Source
          </a>
          <a
            className="hover:text-foreground"
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noreferrer"
          >
            shadcn/ui
          </a>
        </div>
      </div>
    </footer>
  );
}
