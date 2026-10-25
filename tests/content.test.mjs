import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("public text files contain no en or em dashes", () => {
  const files = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { encoding: "utf8" },
  )
    .split("\0")
    .filter((file) => /\.(md|txt|tsx?|mjs|json|ya?ml|html|css|py)$/.test(file));
  const matches = files.filter((file) =>
    /[\u2013\u2014]/u.test(readFileSync(file, "utf8")),
  );
  assert.deepEqual(matches, []);
});
