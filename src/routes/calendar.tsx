import { createFileRoute } from "@tanstack/react-router";

import { MonthShowcase } from "@/components/landing/month-showcase";

function CalendarPage() {
  return <MonthShowcase />;
}

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});
