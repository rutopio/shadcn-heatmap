import { CalendarCheck, Clock, GridFour } from "@phosphor-icons/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dateProps } from "@/content/props/date";
import { monthProps } from "@/content/props/month";
import { weekProps } from "@/content/props/week";
import { dateBasicCode, dateVariants } from "@/content/snippets/date";
import { monthBasicCode, monthVariants } from "@/content/snippets/month";
import { weekBasicCode, weekVariants } from "@/content/snippets/week";

import { DemoFrame } from "./demo-frame";
import {
  DateDefaultDemo,
  DateHideSumColumnDemo,
  DateIsoDemo,
  DateNoLabelsDemo,
  DateSparseTicksDemo,
  MonthBinaryDemo,
  MonthChunkyDemo,
  MonthDefaultDemo,
  MonthMondayStartDemo,
  MonthMultiYearDemo,
  WeekBinaryDemo,
  WeekMinimalTicksDemo,
  WeekDefaultDemo,
  WeekMiniDemo,
  WeekMondayStartDemo,
} from "./demos";
import { PropsTable } from "./props-table";
import { VariantGrid } from "./variant-grid";

export function ComponentShowcase() {
  return (
    <section
      id="components"
      className="border-b py-20 sm:py-24"
      aria-label="Components"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Components
          </span>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Three heatmaps for three time scales
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Every component is a compound component: a root provider, a
            calendar/SVG grid with a render-prop, and optional footer + legend +
            total parts you can swap out.
          </p>
        </div>

        <Tabs defaultValue="month" className="w-full">
          <TabsList className="flex h-auto w-full max-w-xl flex-wrap justify-start gap-2 bg-muted/60 p-1">
            <TabsTrigger value="month" className="gap-2 px-4 py-2">
              <GridFour aria-hidden="true" weight="bold" className="size-4" /> Month
            </TabsTrigger>
            <TabsTrigger value="week" className="gap-2 px-4 py-2">
              <Clock aria-hidden="true" weight="bold" className="size-4" /> Week
            </TabsTrigger>
            <TabsTrigger value="date" className="gap-2 px-4 py-2">
              <CalendarCheck aria-hidden="true" weight="bold" className="size-4" /> Date
            </TabsTrigger>
          </TabsList>

          {/* -------------- MONTH -------------- */}
          <TabsContent value="month" className="space-y-10">
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-semibold">
                CalendarHeatmap
              </h3>
              <p className="text-muted-foreground">
                GitHub-style, 7-row × N-week grid. Handles multiple years by
                splitting into per-year rows and supports ISO week starts.
              </p>
            </div>

            <DemoFrame
              title="Default usage"
              description="One year of deterministic sample data with weekday labels, month headers, total and legend."
              preview={<MonthDefaultDemo />}
              code={monthBasicCode}
              filename="year-contributions.tsx"
            />

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Props reference</h4>
              <PropsTable sections={monthProps} />
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Variants</h4>
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
                    preview: <MonthMultiYearDemo />,
                  },
                ]}
              />
            </div>
          </TabsContent>

          {/* -------------- WEEK -------------- */}
          <TabsContent value="week" className="space-y-10">
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-semibold">
                WeekdayHeatmap
              </h3>
              <p className="text-muted-foreground">
                Weekday × hour-of-day matrix with optional Sum row and Sum
                column. Each Sum axis is coloured against its own maximum so it
                visually stands apart from the regular cells.
              </p>
            </div>

            <DemoFrame
              title="Default usage"
              preview={<WeekDefaultDemo />}
              code={weekBasicCode}
              filename="weekly-rhythm.tsx"
            />

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Props reference</h4>
              <PropsTable sections={weekProps} />
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Variants</h4>
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
                    preview: <WeekMiniDemo />,
                  },
                ]}
              />
            </div>
          </TabsContent>

          {/* -------------- DATE -------------- */}
          <TabsContent value="date" className="space-y-10">
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl font-semibold">
                DateHeatmap
              </h3>
              <p className="text-muted-foreground">
                One row per calendar date × 24 hours + a daily Sum column.
                Perfect for zooming into a narrow window (recent 1–4 weeks).
              </p>
            </div>

            <DemoFrame
              title="Default usage"
              preview={<DateDefaultDemo />}
              code={dateBasicCode}
              filename="date-hourly-usage.tsx"
            />

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Props reference</h4>
              <PropsTable sections={dateProps} />
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Variants</h4>
              <VariantGrid
                variants={[
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
                ]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
