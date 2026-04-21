import { Link, useRouterState } from "@tanstack/react-router";
import { GithubLogoIcon, SquaresFourIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./theme-toggle";

const GITHUB_URL = "https://github.com/rutopio/shadcn-heatmap";

const navLinks = [
  { to: "/install" as const, label: "Install" },
  { to: "/calendar" as const, label: "Calendar" },
  { to: "/weekday" as const, label: "Weekday" },
  { to: "/date" as const, label: "Date" },
  { to: "/status" as const, label: "Status" },
];

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-lg">
      <div className="container flex h-14 items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold"
          aria-label="shadcn-heatmap home"
        >
          <span className="bg-foreground text-background flex size-7 items-center justify-center rounded-md">
            <SquaresFourIcon
              aria-hidden="true"
              weight="fill"
              className="size-4"
            />
          </span>
          <span className="hidden sm:inline">shadcn-heatmap</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Button
              key={link.to}
              asChild
              variant="ghost"
              size="sm"
              className={cn("gap-2", pathname === link.to && "bg-muted")}
            >
              <Link
                to={link.to}
                aria-current={pathname === link.to ? "page" : undefined}
              >
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label="View source on GitHub"
          >
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              <GithubLogoIcon
                aria-hidden="true"
                weight="bold"
                className="size-4"
              />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
