import { GithubLogoIcon, HeartIcon } from "@phosphor-icons/react";

export function SiteFooter() {
  return (
    <footer className="border-t py-10">
      <div className="text-muted-foreground container flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
        <p className="flex items-center gap-1.5">
          Built with{" "}
          <HeartIcon
            aria-hidden="true"
            weight="fill"
            className="text-chart-1 size-3.5"
          />{" "}
          using React, Tailwind v4, Radix, and shadcn conventions.
        </p>
        <div className="flex items-center gap-4">
          <a
            className="hover:text-foreground inline-flex items-center gap-1.5"
            href="https://github.com/rutopio/shadcn-heatmap"
            target="_blank"
            rel="noreferrer"
          >
            <GithubLogoIcon
              aria-hidden="true"
              weight="bold"
              className="size-4"
            />
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
