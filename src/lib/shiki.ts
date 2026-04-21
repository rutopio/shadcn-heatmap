import type { Highlighter, ThemedToken } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const { createHighlighter } = await import("shiki");
      return createHighlighter({
        themes: ["github-light", "github-dark"],
        langs: ["tsx", "bash", "json"],
      });
    })();
  }
  return highlighterPromise;
}

export type SupportedLang = "tsx" | "bash" | "json";

export type HighlightedToken = {
  content: string;
  light?: string;
  dark?: string;
  fontStyle?: number;
};

export type HighlightedLine = HighlightedToken[];

/**
 * Tokenize code for rendering via React (no innerHTML required).
 * Returns lines of tokens with `light` and `dark` colour strings.
 */
export async function highlightTokens(
  code: string,
  lang: SupportedLang = "tsx",
): Promise<HighlightedLine[]> {
  const highlighter = await getHighlighter();

  const lightTokens = highlighter.codeToTokensBase(code, {
    lang,
    theme: "github-light",
  });
  const darkTokens = highlighter.codeToTokensBase(code, {
    lang,
    theme: "github-dark",
  });

  const lines: HighlightedLine[] = lightTokens.map(
    (lineTokens: ThemedToken[], lineIndex: number) => {
      const darkLine: ThemedToken[] = darkTokens[lineIndex] ?? [];
      return lineTokens.map((tok, tokIndex) => ({
        content: tok.content,
        light: tok.color,
        dark: darkLine[tokIndex]?.color,
        fontStyle: tok.fontStyle,
      }));
    },
  );

  return lines;
}
