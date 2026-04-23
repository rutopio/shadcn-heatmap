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
    <div className="bg-background rounded-xl border">
      {(title || description) && (
        <div className="flex flex-col gap-1 border-b px-6 py-4">
          {title && <h4 className="font-medium text-balance">{title}</h4>}
          {description && (
            <p className="text-muted-foreground text-sm text-pretty">
              {description}
            </p>
          )}
        </div>
      )}
      <Tabs defaultValue="preview" className="w-full">
        <div className="flex items-center justify-between px-4 pt-4">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="preview"
          aria-label={title ? `${title} preview` : "Component preview"}
          className="mt-0 px-6 pt-4 pb-6"
        >
          <div
            className={cn(
              "bg-background flex min-h-[120px] items-center justify-center overflow-x-auto rounded-lg border p-3 sm:min-h-[160px] sm:p-6",
              previewClassName
            )}
          >
            {preview}
          </div>
        </TabsContent>
        <TabsContent value="code" className="mt-0 px-4 pt-4 pb-4">
          <CodeBlock
            code={code}
            filename={filename}
            maxHeight="28rem"
            className="border-0 bg-transparent"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
