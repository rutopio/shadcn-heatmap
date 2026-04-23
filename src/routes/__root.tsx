import { createRootRoute, Outlet } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { Toaster } from "@/components/ui/sonner";

function RootLayout() {
  return (
    <div className="bg-background text-foreground relative flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="relative isolate flex-1">
        <div
          aria-hidden
          className="bg-background absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px]"
        />
        <Outlet />
      </main>
      <SiteFooter />
      <Toaster position="top-center" />
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
