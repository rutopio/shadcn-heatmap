import { CodeBlock } from "@/components/ui/code-block";
import { weekProps } from "@/content/props/week";
import {
  weekBasicCode,
  weekSampleData,
  weekVariants,
} from "@/content/snippets/week";

import { DemoFrame } from "./demo-frame";
import {
  Week12HourDemo,
  WeekBinaryDemo,
  WeekCustomStylingDemo,
  WeekDefaultDemo,
  WeekHideSumDemo,
  WeekJapaneseDemo,
  WeekLargeBlocksDemo,
  WeekMiniDemo,
  WeekMinimalTicksDemo,
  WeekMondayStartDemo,
  WeekThreeBucketsDemo,
} from "./demos";
import { PropsTable } from "./props-table";
import { VariantGrid } from "./variant-grid";

export function WeekShowcase() {
  return (
    <section className="py-20 sm:py-24" aria-label="WeekdayHeatmap">
      <div className="container">
        <div className="mb-10 flex flex-col gap-2">
          <span className="text-muted-foreground text-xs font-medium uppercase">
            Component
          </span>
          <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
            WeekdayHeatmap
          </h2>
          <p className="text-muted-foreground max-w-2xl text-pretty">
            Weekday × hour-of-day matrix with optional Sum row and Sum column.
            Each Sum axis is coloured against its own maximum so it visually
            stands apart from the regular cells.
          </p>
        </div>

        <div className="space-y-10">
          <DemoFrame
            title="Default usage"
            preview={<WeekDefaultDemo />}
            code={weekBasicCode}
            filename="weekly-rhythm.tsx"
          />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sample data</h3>
            <p className="text-muted-foreground text-sm">
              Regular cells are weekday 0–6 × hour 0–23. Use{" "}
              <code className="text-xs">weekday = 7</code> for the Sum row and{" "}
              <code className="text-xs">hour = 24</code> for the Sum column.
            </p>
            <CodeBlock
              code={weekSampleData}
              lang="tsx"
              filename="sample-data.ts"
              maxHeight="18rem"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Props reference</h3>
            <PropsTable sections={weekProps} />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Variants</h3>
            <p className="text-muted-foreground text-sm">
              Drop in different props and see how the layout reacts.
            </p>
            <VariantGrid
              variants={[
                {
                  ...weekVariants[0],
                  preview: <WeekMondayStartDemo />,
                },
                {
                  ...weekVariants[1],
                  preview: <WeekMinimalTicksDemo />,
                },
                {
                  ...weekVariants[2],
                  preview: <WeekBinaryDemo />,
                },
                {
                  ...weekVariants[3],
                  preview: <WeekThreeBucketsDemo />,
                },
                {
                  ...weekVariants[4],
                  preview: <WeekJapaneseDemo />,
                },
                {
                  ...weekVariants[5],
                  preview: <WeekHideSumDemo />,
                },
                {
                  ...weekVariants[6],
                  preview: <WeekMiniDemo />,
                },
                {
                  ...weekVariants[7],
                  preview: <WeekLargeBlocksDemo />,
                },
                {
                  ...weekVariants[8],
                  preview: <Week12HourDemo />,
                },
                {
                  ...weekVariants[9],
                  preview: <WeekCustomStylingDemo />,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
