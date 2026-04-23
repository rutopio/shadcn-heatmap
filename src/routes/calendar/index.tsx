import { createFileRoute } from "@tanstack/react-router";

import { DemoFrame } from "@/components/landing/demo-frame";
import {
  MonthChunkyDemo,
  MonthCustomDateFormatDemo,
  MonthCustomStylingDemo,
  MonthDefaultDemo,
  MonthGermanDemo,
  MonthLargeBlocksDemo,
  MonthMondayStartDemo,
  MonthMultiYearDemo,
  MonthNoFooterDemo,
  MonthTenLevelsDemo,
} from "@/components/landing/demos";
import { PropsTable } from "@/components/landing/props-table";
import { ShowcaseSection } from "@/components/landing/showcase-section";
import { VariantGrid } from "@/components/landing/variant-grid";
import { CodeBlock } from "@/components/ui/code-block";
import { calendarProps } from "@/content/props/calendar";
import {
  calendarBasicCode,
  calendarSampleData,
  calendarVariants,
} from "@/content/snippets/calendar";

function CalendarPage() {
  return (
    <ShowcaseSection label="CalendarHeatmap">
      <div className="mb-6 flex flex-col gap-2 sm:mb-10">
        <span className="text-muted-foreground text-xs font-medium uppercase">
          Component
        </span>
        <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
          CalendarHeatmap
        </h2>
        <p className="text-muted-foreground max-w-2xl text-pretty">
          GitHub-style, 7-row × N-week grid. Handles multiple years by splitting
          into per-year rows and supports ISO week starts.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-10">
        <DemoFrame
          title="Default usage"
          description="One year of deterministic sample data with weekday labels, month headers, total and legend."
          preview={<MonthDefaultDemo />}
          code={calendarBasicCode}
          filename="year-contributions.tsx"
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-balance">Sample data</h3>
          <p className="text-muted-foreground text-sm">
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
          <h3 className="text-lg font-semibold text-balance">
            Props reference
          </h3>
          <PropsTable sections={calendarProps} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-balance">Variants</h3>
          <p className="text-muted-foreground text-sm">
            Drop in different props and see how the layout reacts.
          </p>
          <VariantGrid
            variants={[
              { ...calendarVariants[0], preview: <MonthMondayStartDemo /> },
              { ...calendarVariants[1], preview: <MonthChunkyDemo /> },
              { ...calendarVariants[2], preview: <MonthTenLevelsDemo /> },
              { ...calendarVariants[3], preview: <MonthGermanDemo /> },
              { ...calendarVariants[4], preview: <MonthLargeBlocksDemo /> },
              { ...calendarVariants[5], preview: <MonthMultiYearDemo /> },
              { ...calendarVariants[6], preview: <MonthNoFooterDemo /> },
              {
                ...calendarVariants[7],
                preview: <MonthCustomDateFormatDemo />,
              },
              { ...calendarVariants[8], preview: <MonthCustomStylingDemo /> },
            ]}
          />
        </div>
      </div>
    </ShowcaseSection>
  );
}

export const Route = createFileRoute("/calendar/")({
  component: CalendarPage,
});
