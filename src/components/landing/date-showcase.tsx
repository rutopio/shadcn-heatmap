import { CodeBlock } from "@/components/ui/code-block";
import { dateProps } from "@/content/props/date";
import {
  dateBasicCode,
  dateSampleData,
  dateVariants,
} from "@/content/snippets/date";

import { DemoFrame } from "./demo-frame";
import {
  Date12HourDemo,
  DateCustomLabelDemo,
  DateDefaultDemo,
  DateHideSumColumnDemo,
  DateIsoDemo,
  DateLargeBlocksDemo,
  DateNoLabelsDemo,
  DateSparseTicksDemo,
  DateSpanishDemo,
  DateTenLevelsDemo,
} from "./demos";
import { PropsTable } from "./props-table";
import { VariantGrid } from "./variant-grid";

export function DateShowcase() {
  return (
    <section className="py-20 sm:py-24" aria-label="DateContributionHeatmap">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Component
          </span>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            DateContributionHeatmap
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            One row per calendar date × 24 hours + a daily Sum column. Perfect
            for zooming into a narrow window (recent 1–4 weeks).
          </p>
        </div>

        <div className="space-y-10">
          <DemoFrame
            title="Default usage"
            preview={<DateDefaultDemo />}
            code={dateBasicCode}
            filename="date-hourly-usage.tsx"
          />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sample data</h3>
            <p className="text-sm text-muted-foreground">
              Each entry is one date × hour slot. Use{" "}
              <code className="text-xs">hour = 24</code> for the daily Sum
              column. Dates are sorted automatically.
            </p>
            <CodeBlock
              code={dateSampleData}
              lang="tsx"
              filename="sample-data.ts"
              maxHeight="18rem"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Props reference</h3>
            <PropsTable sections={dateProps} />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Variants</h3>
            <p className="text-sm text-muted-foreground">
              Drop in different props and see how the layout reacts.
            </p>
            <VariantGrid
              variants={[
                {
                  ...dateVariants[0],
                  preview: <DateTenLevelsDemo />,
                },
                {
                  ...dateVariants[1],
                  preview: <DateIsoDemo />,
                },
                {
                  ...dateVariants[2],
                  preview: <DateSparseTicksDemo />,
                },
                {
                  ...dateVariants[3],
                  preview: <DateHideSumColumnDemo />,
                },
                {
                  ...dateVariants[4],
                  preview: <DateNoLabelsDemo />,
                },
                {
                  ...dateVariants[5],
                  preview: <DateLargeBlocksDemo />,
                },
                {
                  ...dateVariants[6],
                  preview: <Date12HourDemo />,
                },
                {
                  ...dateVariants[7],
                  preview: <DateSpanishDemo />,
                },
                {
                  ...dateVariants[8],
                  preview: <DateCustomLabelDemo />,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
