import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  CodeIcon,
  GithubLogoIcon,
  ListIcon,
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
  { to: "/binary" as const, label: "Binary" },
];

export function SiteHeader() {
  const [menuState, setMenuState] = useState<"closed" | "open" | "closing">(
    "closed"
  );
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const openMenu = () => setMenuState("open");
  const closeMenu = () => setMenuState((s) => (s === "open" ? "closing" : s));
  const handleAnimationEnd = () =>
    setMenuState((s) => (s === "closing" ? "closed" : s));

  return (
    <header className="bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-sm">
      <div className="container flex h-14 items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold"
          aria-label="shadcn-heatmap home"
          onClick={() => {
            if (menuState !== "closed") closeMenu();
          }}
        >
          <span className="flex size-7 items-center justify-center rounded-md">
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="size-4"
            >
              <rect
                x="2"
                y="2"
                width="8"
                height="8"
                rx="1.5"
                fill="currentColor"
                opacity="0.15"
              />
              <rect
                x="12"
                y="2"
                width="8"
                height="8"
                rx="1.5"
                fill="currentColor"
                opacity="0.35"
              />
              <rect
                x="22"
                y="2"
                width="8"
                height="8"
                rx="1.5"
                fill="currentColor"
                opacity="0.75"
              />
              <rect
                x="2"
                y="12"
                width="8"
                height="8"
                rx="1.5"
                fill="currentColor"
                opacity="0.55"
              />
              <rect
                x="12"
                y="12"
                width="8"
                height="8"
                rx="1.5"
                fill="currentColor"
                opacity="1"
              />
              <rect
                x="22"
                y="12"
                width="8"
                height="8"
                rx="1.5"
                fill="currentColor"
                opacity="0.35"
              />
              <rect
                x="2"
                y="22"
                width="8"
                height="8"
                rx="1.5"
                fill="currentColor"
                opacity="0.9"
              />
              <rect
                x="12"
                y="22"
                width="8"
                height="8"
                rx="1.5"
                fill="currentColor"
                opacity="0.15"
              />
              <rect
                x="22"
                y="22"
                width="8"
                height="8"
                rx="1.5"
                fill="currentColor"
                opacity="0.55"
              />
            </svg>
          </span>
          <span>shadcn-heatmap</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Button asChild variant="ghost" size="sm">
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
            aria-label="View source on GitHub (opens in new tab)"
          >
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              <GithubLogoIcon
                aria-hidden="true"
                weight="bold"
                className="size-4"
              />
              <span className="hidden lg:inline">rutopio/shadcn-heatmap</span>
            </a>
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="size-10 md:hidden"
            aria-label={menuState === "open" ? "Close menu" : "Open menu"}
            aria-expanded={menuState === "open"}
            aria-controls="mobile-nav"
            onClick={() => {
              if (menuState === "open") closeMenu();
              else if (menuState === "closed") openMenu();
            }}
          >
            {menuState !== "closed" ? (
              <XIcon aria-hidden="true" weight="bold" className="size-5" />
            ) : (
              <ListIcon aria-hidden="true" weight="bold" className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {menuState !== "closed" && (
        <div
          id="mobile-nav"
          onAnimationEnd={handleAnimationEnd}
          className={cn(
            "bg-background absolute top-full right-0 left-0 z-50 border-b shadow-sm md:hidden",
            menuState === "closing"
              ? "animate-out fade-out slide-out-to-top-2 fill-mode-forwards duration-150"
              : "animate-in fade-in slide-in-from-top-2 duration-200"
          )}
        >
          <nav className="container flex flex-col py-3">
            <Link
              to="/install"
              className="hover:bg-muted focus-visible:ring-ring focus-visible:ring-offset-background flex items-center gap-2 rounded-md px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
                  "hover:bg-muted focus-visible:ring-ring focus-visible:ring-offset-background rounded-md px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
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
              aria-label="rutopio/shadcn-heatmap on GitHub (opens in new tab)"
              className="hover:bg-muted focus-visible:ring-ring focus-visible:ring-offset-background flex items-center gap-2 rounded-md px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
