/**
 * Formats all template-literal code snippets in variant and snippet files
 * using the project's .prettierrc config.
 *
 * Each backtick string is extracted, wrapped in a dummy component so prettier
 * can parse it as TSX, formatted, then the wrapper is stripped and the result
 * is written back into the source file.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import * as prettier from "prettier";

const ROOT = resolve(import.meta.dirname, "..");

const FILES = [
  // variant files — code: `...` fields
  "src/docs/calendar/variants.tsx",
  "src/docs/date/variants.tsx",
  "src/docs/status/variants.tsx",
  "src/docs/weekday/variants.tsx",
  // snippet files — export const foo = `...`
  "src/docs/calendar/snippets.ts",
  "src/docs/date/snippets.ts",
  "src/docs/status/snippets.ts",
  "src/docs/weekday/snippets.ts",
  "src/docs/binary/snippets.ts",
];

// Prettier config matching .prettierrc (plugins resolved at runtime)
const PRETTIER_OPTIONS = {
  parser: "babel-ts",
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  bracketSpacing: true,
  arrowParens: "always",
  bracketSameLine: false,
  endOfLine: "lf",
};

/**
 * Format a raw JSX/TSX snippet string.
 * Snippets may start with import statements or directly with JSX.
 * We wrap JSX-only snippets in a dummy function so the parser accepts them.
 */
async function formatSnippet(code) {
  // Trim leading/trailing whitespace before formatting
  code = code.trim();

  // Check whether snippet starts with top-level JSX (not import/const/function)
  const startsWithJsx = /^</.test(code);

  const wrapped = startsWithJsx
    ? `export function __Snippet() {\n  return (\n${code}\n  );\n}`
    : code;

  let formatted;
  try {
    formatted = await prettier.format(wrapped, PRETTIER_OPTIONS);
  } catch {
    // If formatting fails (e.g. incomplete snippet with {/* ... */}), return as-is
    return code;
  }

  formatted = formatted.trim();

  if (startsWithJsx) {
    // Strip the wrapper we added
    // Remove: export function __Snippet() {\n  return (\n  and the closing \n  );\n}
    formatted = formatted
      .replace(/^export function __Snippet\(\) \{\n {2}return \(\n/, "")
      .replace(/\n {2}\);\n\}$/, "")
      .trim();

    // Dedent by 4 spaces (the return body indentation added by the wrapper)
    formatted = formatted
      .split("\n")
      .map((line) => (line.startsWith("    ") ? line.slice(4) : line))
      .join("\n");
  }

  // Prettier adds a trailing semicolon to bare JSX expression statements.
  // Strip it — snippets that start with import + JSX also end up with one.
  formatted = formatted.replace(/;(\n?)$/, "$1").trim();

  return formatted;
}

/**
 * Find all template literal spans in source text and format each one.
 * Returns the modified source.
 */
async function processFile(src) {
  // We scan character by character to find backtick-delimited template literals
  // (no tagged templates, no nested ${} interpolations in these snippet strings)
  let result = "";
  let i = 0;
  let changed = 0;

  while (i < src.length) {
    if (src[i] === "`") {
      // Find closing backtick (no interpolations in our snippets)
      let j = i + 1;
      while (j < src.length && src[j] !== "`") {
        if (src[j] === "\\") j++; // skip escaped char
        j++;
      }
      const inner = src.slice(i + 1, j);

      // Only format if the content looks like code (contains JSX/import/const)
      if (/(<[A-Z]|import |const |export |function )/.test(inner)) {
        const formatted = await formatSnippet(inner);
        if (formatted !== inner.trim()) {
          changed++;
          result += "`" + "\n" + formatted + "\n" + "`";
          i = j + 1;
          continue;
        }
      }

      result += src.slice(i, j + 1);
      i = j + 1;
    } else {
      result += src[i];
      i++;
    }
  }

  return { result, changed };
}

async function main() {
  for (const rel of FILES) {
    const path = resolve(ROOT, rel);
    const src = readFileSync(path, "utf8");
    const { result, changed } = await processFile(src);
    if (changed > 0) {
      writeFileSync(path, result, "utf8");
      console.log(
        `✓ ${rel} (${changed} snippet${changed > 1 ? "s" : ""} formatted)`
      );
    } else {
      console.log(`· ${rel} (no changes)`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
