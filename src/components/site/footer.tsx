import { GithubLogoIcon } from "@phosphor-icons/react";

export function SiteFooter() {
  return (
    <footer className="border-t py-10">
      <div className="text-muted-foreground container flex flex-col items-center justify-end gap-4 text-sm sm:flex-row">
        <span>MIT License</span>
        <div className="flex items-center gap-4">
          <a
            className="hover:text-foreground inline-flex items-center gap-1.5"
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
            className="hover:text-foreground inline-flex items-center gap-1.5"
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
