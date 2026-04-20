import { createFileRoute } from "@tanstack/react-router";

import { WeekShowcase } from "@/components/landing/week-showcase";

function WeekPage() {
  return <WeekShowcase />;
}

export const Route = createFileRoute("/week")({
  component: WeekPage,
});
