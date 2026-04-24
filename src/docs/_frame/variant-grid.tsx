import { LinkSimpleBreakIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";

import type { ReactNode } from "react";

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
    <div className="bg-background grid grid-cols-1 gap-6">
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
          <div
            aria-label={`Preview: ${variant.title}`}
            className="flex min-h-30 flex-1 items-center justify-center overflow-auto p-4 sm:min-h-48 sm:p-6"
          >
            {variant.preview}
          </div>
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
