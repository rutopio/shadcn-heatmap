import { createFileRoute } from "@tanstack/react-router";

import { QuickStart } from "@/components/landing/quick-start";

function InstallPage() {
  return <QuickStart />;
}

export const Route = createFileRoute("/install")({
  component: InstallPage,
});
