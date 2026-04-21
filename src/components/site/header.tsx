import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  CodeIcon,
  GithubLogoIcon,
  ListIcon,
  SquaresFourIcon,
  XIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./theme-toggle";

const GITHUB_URL = "https://github.com/rutopio/shadcn-heatmap";

const navLinks = [
  { to: "/calendar" as const, label: "Calendar" },
  { to: "/weekday" as const, label: "Weekday" },
  { to: "/date" as const, label: "Date" },
  { to: "/status" as const, label: "Status" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-lg">
      <div className="container flex h-14 items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold"
          aria-label="shadcn-heatmap home"
          onClick={closeMenu}
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

        <nav className="hidden items-center gap-1 md:flex">
          <Button asChild variant="ghost" size="sm" className="mr-8">
            <Link to="/install">
              Install
              <CodeIcon aria-hidden="true" weight="bold" className="size-4" />
            </Link>
          </Button>
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
            className="hidden md:inline-flex"
            aria-label="View source on GitHub"
          >
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              <GithubLogoIcon
                aria-hidden="true"
                weight="bold"
                className="size-4"
              />
              rutopio/shadcn-heatmap
            </a>
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <XIcon aria-hidden="true" weight="bold" className="size-5" />
            ) : (
              <ListIcon aria-hidden="true" weight="bold" className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="bg-background border-b shadow-sm md:hidden">
          <nav className="container flex flex-col py-3">
            <Link
              to="/install"
              className="hover:bg-muted flex items-center gap-2 rounded-md px-3 py-2 text-sm"
              onClick={closeMenu}
            >
              Install
              <CodeIcon aria-hidden="true" weight="bold" className="size-4" />
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "hover:bg-muted rounded-md px-3 py-2 text-sm",
                  pathname === link.to && "bg-muted font-medium"
                )}
                aria-current={pathname === link.to ? "page" : undefined}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:bg-muted flex items-center gap-2 rounded-md px-3 py-2 text-sm"
              onClick={closeMenu}
            >
              <GithubLogoIcon
                aria-hidden="true"
                weight="bold"
                className="size-4"
              />
              rutopio/shadcn-heatmap
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
