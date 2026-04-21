import { createFileRoute } from "@tanstack/react-router";

import { StatusShowcase } from "@/components/landing/status-showcase";

function StatusPage() {
  return <StatusShowcase />;
}

export const Route = createFileRoute("/status")({
  component: StatusPage,
});
