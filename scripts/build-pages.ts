import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PAGE_META, pageHead, SITE_NAME } from "../src/lib/seo";

const dist = path.resolve(import.meta.dirname, "../dist");
const template = (await readFile(path.join(dist, "index.html"), "utf8"))
  .replace(/<title>[\s\S]*?<\/title>/, "")
  .replace(/<meta\s+name="description"[^>]*>/, "");
const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
for (const page of Object.values(PAGE_META)) {
  const head = pageHead(page);
  const tags = head.meta.map((meta) =>
    typeof meta.title === "string"
      ? `<title>${escapeHtml(meta.title)}</title>`
      : `<meta ${"property" in meta ? `property="${meta.property}"` : `name="${meta.name}"`} content="${escapeHtml(meta.content ?? "")}">`,
  );
  tags.push(
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${SITE_NAME}">`,
    '<meta name="twitter:card" content="summary_large_image">',
  );
  tags.push(
    ...head.links.map(
      (link) => `<link rel="${link.rel}" href="${escapeHtml(link.href)}">`,
    ),
  );
  const directory = path.join(dist, page.path);
  await mkdir(directory, { recursive: true });
  await writeFile(
    path.join(directory, "index.html"),
    template.replace("</head>", `${tags.join("\n")}\n</head>`),
  );
}
console.log(
  `Built static metadata for ${Object.keys(PAGE_META).length} routes.`,
);
