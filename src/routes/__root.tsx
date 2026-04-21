import { createRootRoute, Outlet } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";

function RootLayout() {
  return (
    <div className="bg-background text-foreground relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
