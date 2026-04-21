import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/landing/hero";

function IndexPage() {
  return <Hero />;
}

export const Route = createFileRoute("/")({
  component: IndexPage,
});
