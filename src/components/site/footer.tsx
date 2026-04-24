import { GithubLogoIcon } from "@phosphor-icons/react";

export function SiteFooter() {
  return (
    <footer className="border-t py-6 sm:py-10">
      <div className="text-muted-foreground container flex flex-col items-center justify-center gap-4 text-sm sm:flex-row sm:justify-end">
        <span>MIT License</span>
        <div className="flex items-center gap-4">
          <a
            className="hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center gap-1.5 rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            href="https://github.com/rutopio/shadcn-heatmap"
            target="_blank"
            rel="noreferrer"
            aria-label="rutopio/shadcn-heatmap on GitHub (opens in new tab)"
          >
            <GithubLogoIcon
              aria-hidden="true"
              weight="bold"
              className="size-4"
            />
            rutopio/shadcn-heatmap
          </a>
          <a
            className="hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center gap-1.5 rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noreferrer"
            aria-label="shadcn/ui (opens in new tab)"
          >
            <GithubLogoIcon
              aria-hidden="true"
              weight="bold"
              className="size-4"
            />
            shadcn/ui
          </a>
        </div>
      </div>
    </footer>
  );
}
