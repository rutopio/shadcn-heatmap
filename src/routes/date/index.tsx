import { createFileRoute } from "@tanstack/react-router";

import { DateDefaultDemo } from "@/components/demos";
import { dateVariantItems } from "@/components/demos/variants/date";
import { DemoFrame } from "@/components/landing/demo-frame";
import { PropsTable } from "@/components/landing/props-table";
import { ShowcaseSection } from "@/components/landing/showcase-section";
import { VariantGrid } from "@/components/landing/variant-grid";
import { CodeBlock } from "@/components/ui/code-block";
import { dateProps } from "@/content/props/date";
import { dateBasicCode, dateSampleData } from "@/content/snippets/date";
import { pageHead } from "@/lib/seo";

function DatePage() {
  return (
    <ShowcaseSection label="DateHeatmap">
      <div className="mb-6 flex flex-col gap-2 sm:mb-10">
        <span className="text-muted-foreground text-xs font-medium uppercase">
          Component
        </span>
        <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
          DateHeatmap
        </h2>
        <p className="text-muted-foreground max-w-2xl text-pretty">
          One row per calendar date × 24 hours + a daily Sum column. Perfect for
          zooming into a narrow window (recent 1–4 weeks).
        </p>
      </div>

      <div className="space-y-6 sm:space-y-10">
        <DemoFrame
          title="Default usage"
          preview={<DateDefaultDemo />}
          code={dateBasicCode}
          filename="date-hourly-usage.tsx"
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-balance">Sample data</h3>
          <p className="text-muted-foreground text-sm">
            Each entry is one date × hour slot. Use{" "}
            <code className="text-xs">hour = 24</code> for the daily Sum column.
            Dates are sorted automatically.
          </p>
          <CodeBlock
            code={dateSampleData}
            lang="tsx"
            filename="sample-data.ts"
            maxHeight="18rem"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-balance">
            Props reference
          </h3>
          <PropsTable sections={dateProps} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-balance">Variants</h3>
          <p className="text-muted-foreground text-sm">
            Drop in different props and see how the layout reacts.
          </p>
          <VariantGrid variants={dateVariantItems} />
        </div>
      </div>
    </ShowcaseSection>
  );
}

export const Route = createFileRoute("/date/")({
  component: DatePage,
  head: () =>
    pageHead({
      title: "DateHeatmap — shadcn-heatmap",
      description:
        "Date × hour activity grid for React. One row per calendar date with a daily Sum column, perfect for zooming into recent 1–4 week windows.",
      path: "/date",
    }),
});
