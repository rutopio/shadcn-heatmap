import { Link, useRouterState } from "@tanstack/react-router";
import { GithubLogo, SquaresFour } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./theme-toggle";

const GITHUB_URL = "https://github.com/chingru/shadcn-heatmap";

const navLinks = [
    { to: "/calendar" as const, label: "Calendar" },
    { to: "/weekday" as const, label: "Weekday" },
    { to: "/date" as const, label: "Date" },
];

export function SiteHeader() {
    const pathname = useRouterState({ select: (s) => s.location.pathname });

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
            <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
                <Link
                    to="/"
                    className="flex items-center gap-2 font-semibold tracking-tight"
                    aria-label="shadcn-heatmap home"
                >
                    <span className="flex size-7 items-center justify-center rounded-md bg-foreground text-background">
                        <SquaresFour aria-hidden="true" weight="fill" className="size-4" />
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
                            <GithubLogo aria-hidden="true" weight="bold" className="size-4" />
                        </a>
                    </Button>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
