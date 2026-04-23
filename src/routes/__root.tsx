import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { Toaster } from "@/components/ui/sonner";
import { OG_IMAGE, SITE_NAME } from "@/lib/seo";

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

export const Route = createRootRoute({
  component: RootLayout,
  head: () => ({
    meta: [
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
