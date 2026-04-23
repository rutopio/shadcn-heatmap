import { createFileRoute } from "@tanstack/react-router";
import { StatusDefaultDemo } from "@/docs";
import { DemoFrame } from "@/docs/_frame/demo-frame";
import { PropsTable } from "@/docs/_frame/props-table";
import { ShowcaseSection } from "@/docs/_frame/showcase-section";
import { VariantGrid } from "@/docs/_frame/variant-grid";
import { statusProps } from "@/docs/status/props";
import { statusBasicCode, statusSampleData } from "@/docs/status/snippets";
import { statusVariantItems } from "@/docs/status/variants";

import { CodeBlock } from "@/components/ui/code-block";
import { pageHead } from "@/lib/seo";

function StatusPage() {
  return (
    <ShowcaseSection label="StatusHeatmap">
      <div className="mb-6 flex flex-col gap-2 sm:mb-10">
        <span className="text-muted-foreground text-xs font-medium uppercase">
          Component
        </span>
        <h1 className="text-3xl font-semibold text-balance sm:text-4xl">
          StatusHeatmap
        </h1>
        <p className="text-muted-foreground max-w-2xl text-pretty">
          Timeline status indicator showing daily activity over a period (e.g.,
          90 days). Similar to Atlassian Statuspage – each day is represented by
          a vertical bar.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-10">
        <DemoFrame
          title="Default usage"
          description="90 days of status data with narrow vertical bars, healthy days count and legend."
          preview={<StatusDefaultDemo />}
          code={statusBasicCode}
          filename="status-timeline.tsx"
        />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-balance">Sample data</h2>
          <p className="text-muted-foreground text-sm text-pretty">
            Each entry represents one day with a status value. Missing dates are
            auto-filled with <code className="text-xs">value: 0</code>.
          </p>
          <CodeBlock
            code={statusSampleData}
            lang="tsx"
            filename="sample-data.ts"
            maxHeight="18rem"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-balance">
            Props reference
          </h2>
          <PropsTable sections={statusProps} />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-balance">Variants</h2>
          <p className="text-muted-foreground text-sm text-pretty">
            Drop in different props and see how the layout reacts.
          </p>
          <VariantGrid variants={statusVariantItems} />
        </div>
      </div>
    </ShowcaseSection>
  );
}

export const Route = createFileRoute("/status/")({
  component: StatusPage,
  head: () =>
    pageHead({
      title: "StatusHeatmap — shadcn-heatmap",
      description:
        "Atlassian-style status timeline for React. Vertical bars show daily uptime across a period, with healthy-day counts, custom colors, and legends.",
      path: "/status",
    }),
});
