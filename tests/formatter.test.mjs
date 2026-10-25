import assert from "node:assert/strict";
import { test } from "node:test";
import { formatSnippet, formatSource } from "../scripts/format-snippets.mjs";

test("single-element snippets do not leak a wrapper function", async () => {
  assert.equal(await formatSnippet("<Example/>"), "<Example />");
});

test("snippets follow the repository's Biome formatting settings", async () => {
  assert.equal(
    await formatSnippet("const options={label:'Activity',values:[1,2]};"),
    'const options = { label: "Activity", values: [1, 2] };',
  );
});

test("invalid snippets fail instead of being silently accepted", async () => {
  await assert.rejects(formatSnippet("const value = ;"));
});

test("formatting preserves nested template literals and is idempotent", async () => {
  // biome-ignore lint/suspicious/noTemplateCurlyInString: test an escaped template in a source string.
  const source = "export const code = `const label = \\`Hour \\${hour}\\`;`;";
  const formatted = await formatSource(source);
  assert.match(formatted, /\\`Hour \\\${hour}\\`/);
  assert.equal(await formatSource(formatted), formatted);
});
