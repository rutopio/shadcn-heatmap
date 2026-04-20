import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const heatmapDir = path.join(root, "src/components/heatmap");
const outDir = path.join(root, "public/r");

type RegistryFile = {
  path: string;
  type: string;
  content: string;
};

type RegistryItem = {
  $schema: string;
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
  cssVars: Record<string, Record<string, string>>;
};

const components: {
  filename: string;
  name: string;
  title: string;
  description: string;
  extraDeps: string[];
}[] = [
  {
    filename: "calendar-heatmap.tsx",
    name: "calendar-heatmap",
    title: "CalendarHeatmap",
    description:
      "GitHub-style yearly contribution heatmap with multi-year, weekStart, and i18n support.",
    extraDeps: ["date-fns"],
  },
  {
    filename: "weekday-heatmap.tsx",
    name: "weekday-heatmap",
    title: "WeekdayHeatmap",
    description:
      "Weekday × hour-of-day matrix with Sum row/column and independent colour scales.",
    extraDeps: [],
  },
  {
    filename: "date-heatmap.tsx",
    name: "date-heatmap",
    title: "DateHeatmap",
    description:
      "Date × hour matrix for zooming into a narrow time window with daily Sum column.",
    extraDeps: [],
  },
];

const cssVars = {
  theme: {
    "--color-accent": "oklch(96.7% 0.001 286.4)",
    "--color-chart-1": "oklch(64.6% 0.222 41.1)",
    "--color-chart-2": "oklch(60% 0.118 184.7)",
    "--color-muted-foreground": "oklch(55.2% 0.014 285.9)",
  },
};

fs.mkdirSync(outDir, { recursive: true });

const indexItems: {
  name: string;
  type: string;
  title: string;
  description: string;
}[] = [];

for (const comp of components) {
  const filePath = path.join(heatmapDir, comp.filename);
  const content = fs.readFileSync(filePath, "utf-8");

  const item: RegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: comp.name,
    type: "registry:component",
    title: comp.title,
    description: comp.description,
    dependencies: ["clsx", "tailwind-merge", ...comp.extraDeps],
    registryDependencies: [],
    files: [
      {
        path: `components/heatmap/${comp.filename}`,
        type: "registry:component",
        content,
      },
    ],
    cssVars,
  };

  const outPath = path.join(outDir, `${comp.name}.json`);
  fs.writeFileSync(outPath, JSON.stringify(item, null, 2) + "\n");

  indexItems.push({
    name: comp.name,
    type: "registry:component",
    title: comp.title,
    description: comp.description,
  });
}

const index = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "shadcn-heatmap",
  homepage: "https://shadcn-heatmap.pages.dev",
  items: indexItems,
};

fs.writeFileSync(
  path.join(outDir, "index.json"),
  JSON.stringify(index, null, 2) + "\n",
);

console.log(`Registry built: ${indexItems.length} items → ${outDir}`);
