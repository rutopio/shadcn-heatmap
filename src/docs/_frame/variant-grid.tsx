import { CodeBlock } from "@/components/ui/code-block";

import type { ReactNode } from "react";

type Variant = {
  title: string;
  description: string;
  code: string;
  preview: ReactNode;
  highlightLines?: number[];
  deletedLines?: number[];
};

type VariantGridProps = {
  variants: Variant[];
};

export function VariantGrid({ variants }: VariantGridProps) {
  return (
    <div className="bg-background grid grid-cols-1 gap-6">
      {variants.map((variant) => (
        <div
          key={variant.title}
          className="bg-card/40 flex flex-col overflow-hidden rounded-xl border"
        >
          <div className="border-b px-4 py-4">
            <h3 className="font-medium text-balance">{variant.title}</h3>
            <p className="text-muted-foreground mt-1 text-xs text-pretty">
              {variant.description}
            </p>
          </div>
          <div
            aria-label={`Preview: ${variant.title}`}
            className="flex min-h-[180px] flex-1 items-center justify-center overflow-auto"
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
