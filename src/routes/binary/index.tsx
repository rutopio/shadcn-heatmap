import { createFileRoute } from "@tanstack/react-router";
import { CalendarBinaryDemo, DateBinaryDemo, WeekdayBinaryDemo } from "@/docs";
import { ShowcaseSection } from "@/docs/_frame/showcase-section";
import { VariantGrid } from "@/docs/_frame/variant-grid";
import {
  binaryCalendarCode,
  binaryCalendarHighlightLines,
  binaryDateCode,
  binaryDateHighlightLines,
  binaryWeekdayCode,
  binaryWeekdayHighlightLines,
} from "@/docs/binary/snippets";

import { pageHead } from "@/lib/seo";

const binaryVariants = [
  {
    title: "CalendarHeatmap — Habit tracker",
    description:
      "One year of daily habit data. Active days are filled, missed days are empty. Total count shows days completed.",
    preview: <CalendarBinaryDemo />,
    code: binaryCalendarCode,
    highlightLines: binaryCalendarHighlightLines,
  },
  {
    title: "WeekdayHeatmap — Meeting schedule",
    description:
      "7 × 24 grid showing weekly meeting blocks. Avg row and column are hidden so only the binary grid is visible.",
    preview: <WeekdayBinaryDemo />,
    code: binaryWeekdayCode,
    highlightLines: binaryWeekdayHighlightLines,
  },
  {
    title: "DateHeatmap — CI/CD monitor",
    description:
      "Hourly pipeline runs across 7 days. Green = Pass, empty = Failed or no run. Dec 2 and Dec 4 show failure clusters during active hours.",
    preview: <DateBinaryDemo />,
    code: binaryDateCode,
    highlightLines: binaryDateHighlightLines,
  },
];

const toc = [
  {
    id: "variants",
    label: "Variants",
    children: binaryVariants.map((v) => ({
      id: v.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      label: v.title,
    })),
  },
];

function BinaryPage() {
  return (
    <ShowcaseSection label="Binary Mode" toc={toc}>
      <div className="mb-6 flex flex-col gap-2 sm:mb-10">
        <span className="text-muted-foreground text-xs font-medium uppercase">
          Feature
        </span>
        <h1 className="text-3xl font-semibold text-balance sm:text-4xl">
          Binary Mode
        </h1>
        <p className="text-muted-foreground max-w-2xl text-pretty">
          Set <code className="text-xs">levels={"{1}"}</code> on any heatmap to
          collapse the colour scale to two states — active or inactive. Data
          values must be <code className="text-xs">0</code> (off) or{" "}
          <code className="text-xs">1</code> (on). Useful for habit trackers,
          schedules, and uptime dashboards where presence matters more than
          intensity.
        </p>
      </div>

      <div id="variants" className="scroll-mt-24">
        <VariantGrid variants={binaryVariants} />
      </div>
    </ShowcaseSection>
  );
}

export const Route = createFileRoute("/binary/")({
  component: BinaryPage,
  head: () =>
    pageHead({
      title: "Binary Mode — shadcn-heatmap",
      description:
        "Collapse any heatmap to two states — active or inactive — with levels={2}. Ideal for habit trackers, meeting schedules, and uptime dashboards.",
      path: "/binary",
    }),
});
