import { monthProps } from "@/content/props/month";
import {
  monthBasicCode,
  monthSampleData,
  monthVariants,
} from "@/content/snippets/month";

import { CodeBlock } from "@/components/ui/code-block";

import { DemoFrame } from "./demo-frame";
import {
  MonthBinaryDemo,
  MonthChunkyDemo,
  MonthCustomDateFormatDemo,
  MonthCustomLabelDemo,
  MonthDefaultDemo,
  MonthGermanDemo,
  MonthLargeBlocksDemo,
  MonthMondayStartDemo,
  MonthMultiYearDemo,
  MonthNoFooterDemo,
  MonthTenLevelsDemo,
} from "./demos";
import { PropsTable } from "./props-table";
import { VariantGrid } from "./variant-grid";

export function MonthShowcase() {
  return (
    <section className="py-20 sm:py-24" aria-label="MonthContributionHeatmap">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Component
          </span>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            MonthContributionHeatmap
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            GitHub-style, 7-row × N-week grid. Handles multiple years by
            splitting into per-year rows and supports ISO week starts.
          </p>
        </div>

        <div className="space-y-10">
          <DemoFrame
            title="Default usage"
            description="One year of deterministic sample data with weekday labels, month headers, total and legend."
            preview={<MonthDefaultDemo />}
            code={monthBasicCode}
            filename="year-contributions.tsx"
          />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sample data</h3>
            <p className="text-sm text-muted-foreground">
              Each entry is one day. Missing dates are auto-filled with{" "}
              <code className="text-xs">count: 0</code>.
            </p>
            <CodeBlock
              code={monthSampleData}
              lang="tsx"
              filename="sample-data.ts"
              maxHeight="18rem"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Props reference</h3>
            <PropsTable sections={monthProps} />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Variants</h3>
            <p className="text-sm text-muted-foreground">
              Drop in different props and see how the layout reacts.
            </p>
            <VariantGrid
              variants={[
                {
                  ...monthVariants[0],
                  preview: <MonthMondayStartDemo />,
                },
                {
                  ...monthVariants[1],
                  preview: <MonthChunkyDemo />,
                },
                {
                  ...monthVariants[2],
                  preview: <MonthBinaryDemo />,
                },
                {
                  ...monthVariants[3],
                  preview: <MonthTenLevelsDemo />,
                },
                {
                  ...monthVariants[4],
                  preview: <MonthGermanDemo />,
                },
                {
                  ...monthVariants[5],
                  preview: <MonthLargeBlocksDemo />,
                },
                {
                  ...monthVariants[6],
                  preview: <MonthMultiYearDemo />,
                },
                {
                  ...monthVariants[7],
                  preview: <MonthNoFooterDemo />,
                },
                {
                  ...monthVariants[8],
                  preview: <MonthCustomDateFormatDemo />,
                },
                {
                  ...monthVariants[9],
                  preview: <MonthCustomLabelDemo />,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
