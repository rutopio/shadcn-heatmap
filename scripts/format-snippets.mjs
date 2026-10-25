import { execFileSync } from "node:child_process";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "..");
const biome = createRequire(import.meta.url).resolve(
  "@biomejs/biome/bin/biome",
);

export async function formatSnippet(code) {
  const formatted = execFileSync(
    process.execPath,
    [biome, "format", "--stdin-file-path=src/docs/snippet.tsx"],
    { cwd: root, input: code.trim(), encoding: "utf8", stdio: "pipe" },
  ).trim();
  return code.trim().startsWith("<") ? formatted.replace(/;$/, "") : formatted;
}

export async function formatSource(source) {
  const ast = ts.createSourceFile(
    "snippet.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const literals = [];
  function visit(node) {
    if (
      ts.isNoSubstitutionTemplateLiteral(node) &&
      /(<[A-Z]|import |const |export |function )/.test(node.text)
    )
      literals.push(node);
    ts.forEachChild(node, visit);
  }
  visit(ast);
  for (const literal of literals.reverse()) {
    const code = await formatSnippet(literal.text);
    // Preserve template escapes when writing formatted code back into its source.
    const escaped = code
      .replaceAll("\\", "\\\\")
      .replaceAll("`", "\\`")
      .replaceAll("${", "\\${");
    source = `${source.slice(0, literal.getStart(ast))}\`\n${escaped}\n\`${source.slice(literal.end)}`;
  }
  return source;
}

async function main() {
  let changed = false;
  for (const filename of await readdir(path.join(root, "src/docs"), {
    recursive: true,
  })) {
    if (!/(snippets\.ts|variants\.tsx)$/.test(filename)) continue;
    const file = path.join(root, "src/docs", filename);
    const source = await readFile(file, "utf8");
    const formatted = await formatSource(source);
    if (formatted === source) continue;
    changed = true;
    if (process.argv.includes("--check"))
      console.error(`Unformatted snippets: ${filename}`);
    else await writeFile(file, formatted);
  }
  if (changed && process.argv.includes("--check")) process.exitCode = 1;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await main();
