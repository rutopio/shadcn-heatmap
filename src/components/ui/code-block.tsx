import { Check, Copy } from "@phosphor-icons/react";
import * as React from "react";

import {
  highlightTokens,
  type HighlightedLine,
  type SupportedLang,
} from "@/lib/shiki";
import { cn } from "@/lib/utils";

import { Button } from "./button";

type CodeBlockProps = {
  code: string;
  lang?: SupportedLang;
  className?: string;
  filename?: string;
  hideCopy?: boolean;
  maxHeight?: string;
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
}: CodeBlockProps) {
  const [lines, setLines] = React.useState<HighlightedLine[] | null>(null);
  const [copied, setCopied] = React.useState(false);

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
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }, [code]);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-muted/40",
        className,
      )}
    >
      {filename && (
        <div className="flex items-center justify-between border-b bg-muted/60 px-4 py-2">
          <span className="font-mono text-xs text-muted-foreground">
            {filename}
          </span>
        </div>
      )}
      <div
        className="relative overflow-auto"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <pre className="px-4 py-4 font-mono text-[13px] leading-relaxed text-foreground/80">
          <code>
            {lines
              ? lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {line.length === 0 ? (
                      "\n"
                    ) : (
                      <>
                        {line.map((token, j) => (
                          <HighlightedToken
                            key={j}
                            light={token.light}
                            dark={token.dark}
                            fontStyle={token.fontStyle}
                          >
                            {token.content}
                          </HighlightedToken>
                        ))}
                        {"\n"}
                      </>
                    )}
                  </React.Fragment>
                ))
              : code}
          </code>
        </pre>
      </div>
      {!hideCopy && (
        <Button
          size="icon"
          variant="ghost"
          aria-label={copied ? "Copied" : "Copy code"}
          onClick={handleCopy}
          className="absolute right-2 top-2 size-8 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          {copied ? (
            <Check weight="bold" className="size-4 text-chart-1" />
          ) : (
            <Copy weight="bold" className="size-4" />
          )}
        </Button>
      )}
    </div>
  );
}
