import {
  createRootRoute,
  type ErrorComponentProps,
  HeadContent,
  Link,
  Outlet,
} from "@tanstack/react-router";

import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/lib/seo";

function RootLayout() {
  return (
    <>
      <HeadContent />
      <div className="bg-background text-foreground relative flex min-h-svh flex-col">
        <SiteHeader />
        <main className="bg-background relative flex-1 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px]">
          <Outlet />
        </main>
        <SiteFooter />
        <Toaster position="top-center" expand closeButton />
      </div>
    </>
  );
}

function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-muted-foreground font-mono text-sm">404</p>
      <h1 className="text-2xl font-semibold text-balance">Page not found</h1>
      <p className="text-muted-foreground max-w-md text-sm text-pretty">
        The page you are looking for does not exist.
      </p>
      <Button
        size="sm"
        nativeButton={false}
        role="link"
        render={<Link to="/">Back to home</Link>}
      />
    </div>
  );
}

function ErrorPage({ reset }: ErrorComponentProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground">
        We could not load this page. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
      <Link to="/">Back to home</Link>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
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
