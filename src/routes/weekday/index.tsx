import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/ui/code-block";
import { WeekdayDefaultDemo } from "@/docs";
import { DemoFrame } from "@/docs/_frame/demo-frame";
import { PropsTable } from "@/docs/_frame/props-table";
import { ShowcaseSection } from "@/docs/_frame/showcase-section";
import { VariantGrid } from "@/docs/_frame/variant-grid";
import { weekdayProps } from "@/docs/weekday/props";
import { weekdayBasicCode, weekdaySampleData } from "@/docs/weekday/snippets";
import { weekdayVariantItems } from "@/docs/weekday/variants";
import { pageHead } from "@/lib/seo";

const toc = [
  { id: "default-usage", label: "Default usage" },
  { id: "sample-data", label: "Sample data" },
  {
    id: "props-reference",
    label: "Props reference",
    children: weekdayProps.map((s) => ({
      id: `props-heading-${s.componentName}`,
      label: s.componentName,
    })),
  },
  {
    id: "variants",
    label: "Variants",
    children: weekdayVariantItems.map((v) => ({
      id:
        v.slug ??
        v.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      label: v.title,
    })),
  },
];

function WeekdayPage() {
  return (
    <ShowcaseSection label="WeekdayHeatmap" toc={toc}>
      <div className="mb-6 flex flex-col gap-2 sm:mb-10">
        <span className="font-medium text-muted-foreground text-xs uppercase">
          Component
        </span>
        <h1 className="text-balance font-semibold text-3xl sm:text-4xl">
          WeekdayHeatmap
        </h1>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          Weekday × hour-of-day matrix for recurring weekly patterns. Supports
          optional aggregate rows and columns with custom compute functions,
          i18n, and custom colors.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-10">
        <div id="default-usage" className="scroll-mt-24">
          <DemoFrame
            title="Default usage"
            preview={<WeekdayDefaultDemo />}
            code={weekdayBasicCode}
            filename="components/heatmap/weekday-heatmap.tsx"
          />
        </div>

        <div id="sample-data" className="scroll-mt-24 space-y-4">
          <h2 className="text-balance font-semibold text-lg">Sample data</h2>
          <p className="text-pretty text-muted-foreground text-sm">
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

        <div id="props-reference" className="scroll-mt-24 space-y-4">
          <h2 className="text-balance font-semibold text-lg">
            Props reference
          </h2>
          <PropsTable sections={weekdayProps} />
        </div>

        <div id="variants" className="scroll-mt-24 space-y-4">
          <h2 className="text-balance font-semibold text-lg">Variants</h2>
          <p className="text-pretty text-muted-foreground text-sm">
            Drop in different props and see how the layout reacts.
          </p>
          <VariantGrid variants={weekdayVariantItems} />
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
      image: "/og-weekday.png",
    }),
});
