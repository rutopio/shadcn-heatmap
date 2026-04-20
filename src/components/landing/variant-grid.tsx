import type { ReactNode } from "react";

import { CodeBlock } from "@/components/ui/code-block";
import type { VariantSpec } from "@/content/types";

type Variant = VariantSpec & {
  preview: ReactNode;
};

type VariantGridProps = {
  variants: Variant[];
};

export function VariantGrid({ variants }: VariantGridProps) {
  return (
    <div className="grid gap-6 grid-cols-1">
      {variants.map((variant) => (
        <div
          key={variant.title}
          className="flex flex-col overflow-hidden rounded-xl border bg-card/40"
        >
          <div className="border-b px-5 py-4">
            <h5 className="font-medium">{variant.title}</h5>
            <p className="mt-1 text-xs text-muted-foreground">
              {variant.description}
            </p>
          </div>
          <div className="flex min-h-[180px] flex-1 items-center justify-center overflow-auto p-5">
            {variant.preview}
          </div>
          <CodeBlock
            code={variant.code}
            className="rounded-none border-0 border-t"
            maxHeight="16rem"
          />
        </div>
      ))}
    </div>
  );
}
