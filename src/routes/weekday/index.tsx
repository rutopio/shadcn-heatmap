import { createFileRoute } from "@tanstack/react-router";
import { WeekdayDefaultDemo } from "@/docs";
import { DemoFrame } from "@/docs/_frame/demo-frame";
import { PropsTable } from "@/docs/_frame/props-table";
import { ShowcaseSection } from "@/docs/_frame/showcase-section";
import { VariantGrid } from "@/docs/_frame/variant-grid";
import { weekdayProps } from "@/docs/weekday/props";
import { weekdayBasicCode, weekdaySampleData } from "@/docs/weekday/snippets";
import { weekdayVariantItems } from "@/docs/weekday/variants";

import { CodeBlock } from "@/components/ui/code-block";
import { pageHead } from "@/lib/seo";

function WeekdayPage() {
  return (
    <ShowcaseSection label="WeekdayHeatmap">
      <div className="mb-6 flex flex-col gap-2 sm:mb-10">
        <span className="text-muted-foreground text-xs font-medium uppercase">
          Component
        </span>
        <h1 className="text-3xl font-semibold text-balance sm:text-4xl">
          WeekdayHeatmap
        </h1>
        <p className="text-muted-foreground max-w-2xl text-pretty">
          Weekday × hour-of-day matrix for recurring weekly patterns. Supports
          optional aggregate rows and columns with custom compute functions,
          i18n, and custom colors.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-10">
        <DemoFrame
          title="Default usage"
          preview={<WeekdayDefaultDemo />}
          code={weekdayBasicCode}
          filename="weekly-rhythm.tsx"
        />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-balance">Sample data</h2>
          <p className="text-muted-foreground text-sm text-pretty">
            Regular cells are weekday 0–6 × hour 0–23. Use{" "}
            <code className="text-xs">weekday = 7</code> for the Avg row and{" "}
            <code className="text-xs">hour = 24</code> for the Avg column.
          </p>
          <CodeBlock
            code={weekdaySampleData}
            lang="tsx"
            filename="sample-data.ts"
            maxHeight="18rem"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-balance">
            Props reference
          </h2>
          <PropsTable sections={weekdayProps} />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-balance">Variants</h2>
          <p className="text-muted-foreground text-sm text-pretty">
            Drop in different props and see how the layout reacts.
          </p>
          <VariantGrid variants={weekdayVariantItems} />
        </div>
      </div>
    </ShowcaseSection>
  );
}

export const Route = createFileRoute("/weekday/")({
  component: WeekdayPage,
  head: () =>
    pageHead({
      title: "WeekdayHeatmap — shadcn-heatmap",
      description:
        "Weekday × hour-of-day activity grid for React. Optional Avg row and column, independent min–max scaling, tooltips, and full i18n support.",
      path: "/weekday",
    }),
});
