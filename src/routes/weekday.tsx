import { createFileRoute } from "@tanstack/react-router";

import { WeekShowcase } from "@/components/landing/week-showcase";

function WeekdayPage() {
  return <WeekShowcase />;
}

export const Route = createFileRoute("/weekday")({
  component: WeekdayPage,
});
