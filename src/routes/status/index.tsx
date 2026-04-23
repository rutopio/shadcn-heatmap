import { createFileRoute } from "@tanstack/react-router";

import { DemoFrame } from "@/components/landing/demo-frame";
import {
  StatusCustomColorDemo,
  StatusCustomSizeDemo,
  StatusDefaultDemo,
  StatusUptimeDemo,
  StatusWithLabelsDemo,
} from "@/components/landing/demos/status";
import { PropsTable } from "@/components/landing/props-table";
import { ShowcaseSection } from "@/components/landing/showcase-section";
import { VariantGrid } from "@/components/landing/variant-grid";
import { CodeBlock } from "@/components/ui/code-block";
import { statusProps } from "@/content/props/status";
import {
  statusBasicCode,
  statusSampleData,
  statusVariants,
} from "@/content/snippets/status";
import { pageHead } from "@/lib/seo";

function StatusPage() {
  return (
    <ShowcaseSection label="StatusHeatmap">
      <div className="mb-6 flex flex-col gap-2 sm:mb-10">
        <span className="text-muted-foreground text-xs font-medium uppercase">
          Component
        </span>
        <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
          StatusHeatmap
        </h2>
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
          <h3 className="text-lg font-semibold text-balance">Sample data</h3>
          <p className="text-muted-foreground text-sm">
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
          <h3 className="text-lg font-semibold text-balance">
            Props reference
          </h3>
          <PropsTable sections={statusProps} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-balance">Variants</h3>
          <p className="text-muted-foreground text-sm">
            Drop in different props and see how the layout reacts.
          </p>
          <VariantGrid
            variants={[
              { ...statusVariants[0], preview: <StatusWithLabelsDemo /> },
              { ...statusVariants[1], preview: <StatusCustomColorDemo /> },
              { ...statusVariants[2], preview: <StatusCustomSizeDemo /> },
              { ...statusVariants[3], preview: <StatusUptimeDemo /> },
            ]}
          />
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
