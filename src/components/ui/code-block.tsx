import * as React from "react";
import { CopyIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

import { highlightTokens } from "@/lib/shiki";
import { cn } from "@/lib/utils";

import { Button } from "./button";

import type { HighlightedLine, SupportedLang } from "@/lib/shiki";

type CodeBlockProps = {
  code: string;
  lang?: SupportedLang;
  className?: string;
  filename?: string;
  hideCopy?: boolean;
  maxHeight?: string;
  scrollClassName?: string;
  highlightLines?: number[];
  deletedLines?: number[];
};

const FONT_STYLE_ITALIC = 1;
const FONT_STYLE_BOLD = 2;
const FONT_STYLE_UNDERLINE = 4;

function HighlightedToken({
  light,
  dark,
  fontStyle = 0,
  children,
}: {
  light?: string;
  dark?: string;
  fontStyle?: number;
  children: string;
}) {
  const style: React.CSSProperties & Record<string, string | undefined> = {
    color: light,
    ["--shiki-dark" as string]: dark,
  };
  if ((fontStyle & FONT_STYLE_ITALIC) !== 0) style.fontStyle = "italic";
  if ((fontStyle & FONT_STYLE_BOLD) !== 0) style.fontWeight = 600;
  if ((fontStyle & FONT_STYLE_UNDERLINE) !== 0)
    style.textDecoration = "underline";

  return <span style={style}>{children}</span>;
}

export function CodeBlock({
  code,
  lang = "tsx",
  className,
  filename,
  hideCopy = false,
  maxHeight,
  scrollClassName,
  highlightLines,
  deletedLines,
}: CodeBlockProps) {
  const [lines, setLines] = React.useState<HighlightedLine[] | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    highlightTokens(code, lang).then((result) => {
      if (!cancelled) setLines(result);
    });
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard");
  }, [code]);

  return (
    <div
      className={cn(
        "group bg-background relative overflow-hidden rounded-lg border",
        className
      )}
    >
      {filename && (
        <div className="bg-muted/60 flex items-center justify-between border-b px-4 py-4">
          <span className="text-muted-foreground font-mono text-xs">
            {filename}
          </span>
        </div>
      )}
      <div
        className={cn("relative overflow-auto", scrollClassName)}
        style={!scrollClassName && maxHeight ? { maxHeight } : undefined}
      >
        <pre className="text-foreground/80 px-4 py-4 font-mono text-sm leading-relaxed">
          <code>
            {/* Static syntax highlighting - using index as key is safe here as order never changes */}
            {/* eslint-disable @eslint-react/no-array-index-key */}
            {lines
              ? lines.map((line, i) => {
                  const lineNumber = i + 1;
                  const isHighlighted =
                    highlightLines?.includes(lineNumber) ?? false;
                  const isDeleted =
                    deletedLines?.includes(lineNumber) ?? false;
                  return (
                    <React.Fragment key={`line-${i}`}>
                      {line.length === 0 ? (
                        "\n"
                      ) : (
                        <span
                          className={
                            isDeleted
                              ? "block -mx-4 px-4 bg-red-500/15 dark:bg-red-500/10"
                              : isHighlighted
                                ? "block -mx-4 px-4 bg-amber-400/15 dark:bg-amber-400/10"
                                : undefined
                          }
                        >
                          {line.map((token, j) => (
                            <HighlightedToken
                              key={`token-${i}-${j}`}
                              light={token.light}
                              dark={token.dark}
                              fontStyle={token.fontStyle}
                            >
                              {token.content}
                            </HighlightedToken>
                          ))}
                          {"\n"}
                        </span>
                      )}
                    </React.Fragment>
                  );
                })
              : code}
            {/* eslint-enable @eslint-react/no-array-index-key */}
          </code>
        </pre>
      </div>
      {!hideCopy && (
        <Button
          size="icon"
          variant="ghost"
          aria-label="Copy code"
          onClick={handleCopy}
          className="absolute top-3 right-4 size-6 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 motion-safe:transition-opacity"
        >
          <CopyIcon aria-hidden="true" className="size-4" />
        </Button>
      )}
    </div>
  );
}
