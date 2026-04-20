import { createFileRoute } from "@tanstack/react-router";

import { DateShowcase } from "@/components/landing/date-showcase";

function DatePage() {
  return <DateShowcase />;
}

export const Route = createFileRoute("/date")({
  component: DatePage,
});
