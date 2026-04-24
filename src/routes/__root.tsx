import { useEffect, useState } from "react";
import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";

import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/lib/seo";

const REDIRECT_SECONDS = 3;

function RootLayout() {
  return (
    <>
      <HeadContent />
      <div className="bg-background text-foreground relative flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="relative isolate flex-1">
          <div
            aria-hidden="true"
            className="bg-background absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px]"
          />
          <Outlet />
        </main>
        <SiteFooter />
        <Toaster position="top-center" />
      </div>
    </>
  );
}

function NotFoundPage() {
  const navigate = useNavigate();
  const [remaining, setRemaining] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          void navigate({ to: "/", replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-muted-foreground font-mono text-sm">404</p>
      <h1 className="text-2xl font-semibold text-balance">Page not found</h1>
      <p className="text-muted-foreground max-w-md text-sm text-pretty">
        The page you are looking for does not exist. Redirecting home in{" "}
        <span className="text-foreground tabular-nums">{remaining}</span>
        {remaining === 1 ? " second" : " seconds"}.
      </p>
      <Button asChild size="sm">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
  errorComponent: NotFoundPage,
  head: () => ({
    meta: [
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
  }),
});
