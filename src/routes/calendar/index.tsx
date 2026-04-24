import { createFileRoute } from "@tanstack/react-router";
import { CalendarDefaultDemo } from "@/docs";
import { DemoFrame } from "@/docs/_frame/demo-frame";
import { PropsTable } from "@/docs/_frame/props-table";
import { ShowcaseSection } from "@/docs/_frame/showcase-section";
import { VariantGrid } from "@/docs/_frame/variant-grid";
import { calendarProps } from "@/docs/calendar/props";
import {
  calendarBasicCode,
  calendarSampleData,
} from "@/docs/calendar/snippets";
import { calendarVariantItems } from "@/docs/calendar/variants";

import { CodeBlock } from "@/components/ui/code-block";
import { pageHead } from "@/lib/seo";

function CalendarPage() {
  return (
    <ShowcaseSection label="CalendarHeatmap">
      <div className="mb-6 flex flex-col gap-2 sm:mb-10">
        <span className="text-muted-foreground text-xs font-medium uppercase">
          Component
        </span>
        <h1 className="text-3xl font-semibold text-balance sm:text-4xl">
          CalendarHeatmap
        </h1>
        <p className="text-muted-foreground max-w-2xl text-pretty">
          GitHub-style yearly contribution grid. Supports multiple years, ISO
          Monday start, custom colors, i18n labels, and full tooltip control.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-10">
        <DemoFrame
          title="Default usage"
          description="One year of activity data with weekday labels, month headers, contribution total, and legend."
          preview={<CalendarDefaultDemo />}
          code={calendarBasicCode}
          filename="year-contributions.tsx"
        />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-balance">Sample data</h2>
          <p className="text-muted-foreground text-sm text-pretty">
            Each entry is one day. Missing dates are auto-filled with{" "}
            <code className="text-xs">value: 0</code>.
          </p>
          <CodeBlock
            code={calendarSampleData}
            lang="tsx"
            filename="sample-data.ts"
            maxHeight="18rem"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-balance">
            Props reference
          </h2>
          <PropsTable sections={calendarProps} />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-balance">Variants</h2>
          <p className="text-muted-foreground text-sm text-pretty">
            Drop in different props and see how the layout reacts.
          </p>
          <VariantGrid variants={calendarVariantItems} />
        </div>
      </div>
    </ShowcaseSection>
  );
}

export const Route = createFileRoute("/calendar/")({
  component: CalendarPage,
  head: () =>
    pageHead({
      title: "CalendarHeatmap — shadcn-heatmap",
      description:
        "GitHub-style yearly contribution calendar for React. 7-row × N-week grid with multi-year support, ISO weeks, custom colors, and tooltips.",
      path: "/calendar",
    }),
});
