import { createFileRoute } from "@tanstack/react-router";

import { DemoFrame } from "@/components/landing/demo-frame";
import {
  Week12HourDemo,
  WeekCustomStylingDemo,
  WeekDefaultDemo,
  WeekHideAvgDemo,
  WeekJapaneseDemo,
  WeekLargeBlocksDemo,
  WeekMiniDemo,
  WeekMinimalTicksDemo,
  WeekMondayStartDemo,
  WeekThreeBucketsDemo,
} from "@/components/demos";
import { PropsTable } from "@/components/landing/props-table";
import { ShowcaseSection } from "@/components/landing/showcase-section";
import { VariantGrid } from "@/components/landing/variant-grid";
import { CodeBlock } from "@/components/ui/code-block";
import { weekdayProps } from "@/content/props/weekday";
import {
  weekdayBasicCode,
  weekdaySampleData,
  weekdayVariants,
} from "@/content/snippets/weekday";
import { pageHead } from "@/lib/seo";

function WeekdayPage() {
  return (
    <ShowcaseSection label="WeekdayHeatmap">
      <div className="mb-6 flex flex-col gap-2 sm:mb-10">
        <span className="text-muted-foreground text-xs font-medium uppercase">
          Component
        </span>
        <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
          WeekdayHeatmap
        </h2>
        <p className="text-muted-foreground max-w-2xl text-pretty">
          Weekday × hour-of-day matrix with optional Avg row and Avg column.
          Each Avg axis is independently min–max scaled so it visually stands
          apart from the regular cells.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-10">
        <DemoFrame
          title="Default usage"
          preview={<WeekDefaultDemo />}
          code={weekdayBasicCode}
          filename="weekly-rhythm.tsx"
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-balance">Sample data</h3>
          <p className="text-muted-foreground text-sm">
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
          <h3 className="text-lg font-semibold text-balance">
            Props reference
          </h3>
          <PropsTable sections={weekdayProps} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-balance">Variants</h3>
          <p className="text-muted-foreground text-sm">
            Drop in different props and see how the layout reacts.
          </p>
          <VariantGrid
            variants={[
              { ...weekdayVariants[0], preview: <WeekMondayStartDemo /> },
              { ...weekdayVariants[1], preview: <WeekMinimalTicksDemo /> },
              { ...weekdayVariants[2], preview: <WeekThreeBucketsDemo /> },
              { ...weekdayVariants[3], preview: <WeekJapaneseDemo /> },
              { ...weekdayVariants[4], preview: <WeekHideAvgDemo /> },
              { ...weekdayVariants[5], preview: <WeekMiniDemo /> },
              { ...weekdayVariants[6], preview: <WeekLargeBlocksDemo /> },
              { ...weekdayVariants[7], preview: <Week12HourDemo /> },
              { ...weekdayVariants[8], preview: <WeekCustomStylingDemo /> },
            ]}
          />
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
