import { createHighlighterCore } from "@shikijs/core";
import { createOnigurumaEngine } from "@shikijs/engine-oniguruma";

import type { HighlighterCore, ThemedToken } from "@shikijs/core";

let highlighterPromise: Promise<HighlighterCore> | null = null;

async function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const [githubLight, githubDark, tsx, bash, json] = await Promise.all([
        import("@shikijs/themes/github-light"),
        import("@shikijs/themes/github-dark"),
        import("@shikijs/langs/tsx"),
        import("@shikijs/langs/bash"),
        import("@shikijs/langs/json"),
      ]);
      return createHighlighterCore({
        themes: [githubLight.default, githubDark.default],
        langs: [tsx.default, bash.default, json.default],
        engine: createOnigurumaEngine(import("shiki/wasm")),
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
  lang: SupportedLang = "tsx"
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
    }
  );

  return lines;
}
