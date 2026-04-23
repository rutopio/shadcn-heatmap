import { createFileRoute } from "@tanstack/react-router";

import {
  CalendarBinaryDemo,
  DateBinaryDemo,
  WeekdayBinaryDemo,
} from "@/components/demos";
import { DemoFrame } from "@/components/landing/demo-frame";
import { ShowcaseSection } from "@/components/landing/showcase-section";
import { CodeBlock } from "@/components/ui/code-block";
import {
  binaryCalendarCode,
  binaryDateCode,
  binarySampleData,
  binaryWeekdayCode,
} from "@/content/snippets/binary";
import { pageHead } from "@/lib/seo";

function BinaryPage() {
  return (
    <ShowcaseSection label="Binary Mode">
      <div className="mb-6 flex flex-col gap-2 sm:mb-10">
        <span className="text-muted-foreground text-xs font-medium uppercase">
          Feature
        </span>
        <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
          Binary Mode
        </h2>
        <p className="text-muted-foreground max-w-2xl text-pretty">
          Set <code className="text-xs">levels={"{1}"}</code> on any heatmap to
          collapse the colour scale to two states — active or inactive. Data
          values must be <code className="text-xs">0</code> (off) or{" "}
          <code className="text-xs">1</code> (on). Useful for habit trackers,
          schedules, and uptime dashboards where presence matters more than
          intensity.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-10">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-balance">Sample data</h3>
          <p className="text-muted-foreground text-sm">
            Each component accepts the same data shape as its standard form.
            Values must be <code className="text-xs">0</code> or{" "}
            <code className="text-xs">1</code> — no other values.
          </p>
          <CodeBlock
            code={binarySampleData}
            lang="tsx"
            filename="binary-data.ts"
            maxHeight="18rem"
          />
        </div>
        <DemoFrame
          title="CalendarHeatmap — Habit tracker"
          description="One year of daily habit data. Active days are filled, missed days are empty. Total count shows days completed."
          preview={<CalendarBinaryDemo />}
          code={binaryCalendarCode}
          filename="habit-tracker.tsx"
        />
        <DemoFrame
          title="WeekdayHeatmap — Meeting schedule"
          description="7 × 24 grid showing weekly meeting blocks. Avg row and column are hidden so only the binary grid is visible."
          preview={<WeekdayBinaryDemo />}
          code={binaryWeekdayCode}
          filename="meeting-schedule.tsx"
        />
        ㄇ
        <DemoFrame
          title="DateHeatmap — Service uptime"
          description="Hourly uptime status across 10 days. The bottom row shows how many days each hour was up. Dec 3 shows a planned maintenance window, Dec 7 shows a partial incident."
          preview={<DateBinaryDemo />}
          code={binaryDateCode}
          filename="service-uptime.tsx"
        />
      </div>
    </ShowcaseSection>
  );
}

export const Route = createFileRoute("/binary/")({
  component: BinaryPage,
  head: () =>
    pageHead({
      title: "Binary Mode — shadcn-heatmap",
      description:
        "Collapse any heatmap to two states — active or inactive — with levels={2}. Ideal for habit trackers, meeting schedules, and uptime dashboards.",
      path: "/binary",
    }),
});
