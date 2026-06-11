import { LinkSimpleBreakIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";

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
  navigator.clipboard.writeText(url);
  toast.success("Link copied to clipboard", { description: url });
}

export function VariantGrid({ variants }: VariantGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 bg-background">
      {variants.map((variant) => (
        <div
          key={variant.title}
          id={variant.slug ?? toSlug(variant.title)}
          className="flex flex-col overflow-hidden rounded-xl border bg-background"
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
              <h3 className="text-balance font-medium">{variant.title}</h3>
            </div>
            <p className="mt-1 text-pretty text-muted-foreground text-xs">
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
