import { CodeBlock } from "@/components/ui/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

type DemoFrameProps = {
  title?: string;
  description?: string;
  preview: ReactNode;
  code: string;
  filename?: string;
  previewClassName?: string;
};

export function DemoFrame({
  title,
  description,
  preview,
  code,
  filename,
  previewClassName,
}: DemoFrameProps) {
  return (
    <div className="space-y-4">
      {(title || description) && (
        <div className="flex flex-col gap-1">
          {title && (
            <h2 className="text-lg font-semibold text-balance">{title}</h2>
          )}
          {description && (
            <p className="text-muted-foreground text-sm text-pretty">
              {description}
            </p>
          )}
        </div>
      )}
      <Tabs defaultValue="preview" className="w-full">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent
          value="preview"
          aria-label={title ? `${title} preview` : "Component preview"}
          className="mt-3"
        >
          <div
            className={cn(
              "bg-background flex min-h-30 items-center justify-center overflow-x-auto rounded-lg border p-4 sm:min-h-40 sm:p-6",
              previewClassName
            )}
          >
            {preview}
          </div>
        </TabsContent>
        <TabsContent value="code" className="mt-3">
          <CodeBlock
            code={code}
            filename={filename}
            scrollClassName="max-h-96"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
