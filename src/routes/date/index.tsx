import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/ui/code-block";
import { DateDefaultDemo } from "@/docs";
import { DemoFrame } from "@/docs/_frame/demo-frame";
import { PropsTable } from "@/docs/_frame/props-table";
import { ShowcaseSection } from "@/docs/_frame/showcase-section";
import { VariantGrid } from "@/docs/_frame/variant-grid";
import { dateProps } from "@/docs/date/props";
import { dateBasicCode, dateSampleData } from "@/docs/date/snippets";
import { dateVariantItems } from "@/docs/date/variants";
import { pageHead } from "@/lib/seo";

const toc = [
  { id: "default-usage", label: "Default usage" },
  { id: "sample-data", label: "Sample data" },
  {
    id: "props-reference",
    label: "Props reference",
    children: dateProps.map((s) => ({
      id: `props-heading-${s.componentName}`,
      label: s.componentName,
    })),
  },
  {
    id: "variants",
    label: "Variants",
    children: dateVariantItems.map((v) => ({
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

function DatePage() {
  return (
    <ShowcaseSection label="DateHeatmap" toc={toc}>
      <div className="mb-6 flex flex-col gap-2 sm:mb-10">
        <span className="font-medium text-muted-foreground text-xs uppercase">
          Component
        </span>
        <h1 className="text-balance font-semibold text-3xl sm:text-4xl">
          DateHeatmap
        </h1>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          Date × hour grid for zoomed time windows (1–4 weeks). Supports
          optional aggregate rows and columns with custom compute functions,
          i18n, and custom colors.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-10">
        <div id="default-usage" className="scroll-mt-24">
          <DemoFrame
            title="Default usage"
            preview={<DateDefaultDemo />}
            code={dateBasicCode}
            filename="components/heatmap/date-heatmap.tsx"
          />
        </div>

        <div id="sample-data" className="scroll-mt-24 space-y-4">
          <h2 className="text-balance font-semibold text-lg">Sample data</h2>
          <p className="text-pretty text-muted-foreground text-sm">
            Each entry is one date × hour slot. Use{" "}
            <code className="text-xs">hour = 24</code> for the daily Sum column.
            Dates are sorted automatically.
          </p>
          <CodeBlock
            code={dateSampleData}
            lang="tsx"
            filename="sample-data.ts"
          />
        </div>

        <div id="props-reference" className="scroll-mt-24 space-y-4">
          <h2 className="text-balance font-semibold text-lg">
            Props reference
          </h2>
          <PropsTable sections={dateProps} />
        </div>

        <div id="variants" className="scroll-mt-24 space-y-4">
          <h2 className="text-balance font-semibold text-lg">Variants</h2>
          <p className="text-pretty text-muted-foreground text-sm">
            Drop in different props and see how the layout reacts.
          </p>
          <VariantGrid variants={dateVariantItems} />
        </div>
      </div>
    </ShowcaseSection>
  );
}

export const Route = createFileRoute("/date/")({
  component: DatePage,
  head: () =>
    pageHead({
      title: "DateHeatmap — shadcn-heatmap",
      description:
        "Date × hour activity grid for React. One row per calendar date with a daily Sum column, perfect for zooming into recent 1–4 week windows.",
      path: "/date",
      image: "/og-date.png",
    }),
});
