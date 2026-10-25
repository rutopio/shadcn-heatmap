import { LinkSimpleBreakIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { copyText } from "@/lib/clipboard";

type Variant = {
  title: string;
  description: string;
  code: string;
  preview: ReactNode;
  slug?: string;
  highlightLines?: number[];
  deletedLines?: number[];
};

type VariantGridProps = {
  variants: Variant[];
};

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function copyVariantLink(slug: string) {
  const url = `${window.location.origin}${window.location.pathname}#${slug}`;
  void copyText(url, "Link copied to clipboard", url);
}

export function VariantGrid({ variants }: VariantGridProps) {
  return (
    <div className="bg-background grid grid-cols-1 gap-6">
      <p className="text-muted-foreground text-sm">
        Variant snippets focus on the changed settings. For a complete starting
        point, use the default example on the component's page.{" "}
      </p>
      {variants.map((variant) => (
        <div
          key={variant.title}
          id={variant.slug ?? toSlug(variant.title)}
          className="bg-background flex flex-col overflow-hidden rounded-xl border"
        >
          <div className="border-b px-4 py-4">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 p-0"
                onClick={() =>
                  copyVariantLink(variant.slug ?? toSlug(variant.title))
                }
                aria-label={`Copy link to ${variant.title}`}
              >
                <LinkSimpleBreakIcon aria-hidden="true" className="size-4" />
              </Button>
              <h3 className="font-medium text-balance">{variant.title}</h3>
            </div>
            <p className="text-muted-foreground mt-1 text-xs text-pretty">
              {variant.description}
            </p>
          </div>
          <section
            aria-label={`Preview: ${variant.title}`}
            className="flex min-h-30 flex-1 items-center justify-center overflow-auto p-4 sm:min-h-48 sm:p-6"
          >
            {variant.preview}
          </section>
          <CodeBlock
            code={variant.code}
            className="rounded-none border-0 border-t"
            scrollClassName="max-h-64 sm:max-h-none"
            highlightLines={variant.highlightLines}
            deletedLines={variant.deletedLines}
          />
        </div>
      ))}
    </div>
  );
}
