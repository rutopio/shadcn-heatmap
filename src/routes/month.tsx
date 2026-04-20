import { createFileRoute } from "@tanstack/react-router";

import { MonthShowcase } from "@/components/landing/month-showcase";

function MonthPage() {
  return <MonthShowcase />;
}

export const Route = createFileRoute("/month")({
  component: MonthPage,
});
