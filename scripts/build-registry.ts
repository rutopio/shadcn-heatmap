import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const heatmapDir = path.join(root, "src/components/heatmap");
const outDir = path.join(root, "public/r");

const REGISTRY_NAME = "@heatmap";
const HOMEPAGE = "https://shadcn-heatmap.pages.dev";

type RegistryFile = {
  path: string;
  type: string;
  content?: string;
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
    extraDeps: ["date-fns"],
  },
  {
    filename: "status-heatmap.tsx",
    name: "status-heatmap",
    title: "StatusHeatmap",
    description:
      "Timeline status indicator showing daily activity over a period (e.g. 90 days). Similar to Atlassian Statuspage.",
    extraDeps: ["date-fns"],
  },
];

const cssVars = {
  theme: {
    "--color-secondary": "oklch(96.7% 0.001 286.4)",
    "--color-chart-1": "oklch(64.6% 0.222 41.1)",
    "--color-muted-foreground": "oklch(55.2% 0.014 285.9)",
  },
};

fs.mkdirSync(outDir, { recursive: true });

// Full item entries for the source registry.json (no file content).
const sourceItems: Omit<RegistryItem, "$schema">[] = [];

for (const comp of components) {
  const filePath = path.join(heatmapDir, comp.filename);
  const content = fs.readFileSync(filePath, "utf-8");

  const files: RegistryFile[] = [
    {
      path: `components/heatmap/${comp.filename}`,
      type: "registry:component",
    },
  ];

  const baseItem: Omit<RegistryItem, "$schema"> = {
    name: comp.name,
    type: "registry:component",
    title: comp.title,
    description: comp.description,
    dependencies: ["clsx", "tailwind-merge", ...comp.extraDeps],
    registryDependencies: [],
    files,
    cssVars,
  };

  // Served item: CLI installs from this, so it keeps file content.
  const servedItem: RegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    ...baseItem,
    files: [{ ...files[0], content }],
  };

  fs.writeFileSync(
    path.join(outDir, `${comp.name}.json`),
    `${JSON.stringify(servedItem, null, 2)}\n`
  );

  sourceItems.push(baseItem);
}

// Source registry.json at repo root: flat, no file content. Required for the
// shadcn directory submission.
const sourceRegistry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: REGISTRY_NAME,
  homepage: HOMEPAGE,
  items: sourceItems.map((item) => ({
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    ...item,
  })),
};

const sourceRegistryJson = `${JSON.stringify(sourceRegistry, null, 2)}\n`;
// Repo root: flat structure for the directory submission.
fs.writeFileSync(path.join(root, "registry.json"), sourceRegistryJson);
// public/: so the deployed site serves it at /registry.json (Pages serves the
// build output, not the repo root).
fs.writeFileSync(
  path.join(root, "public/registry.json"),
  sourceRegistryJson
);

// Served index for the public registry endpoint (slim listing).
const index = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: REGISTRY_NAME,
  homepage: HOMEPAGE,
  items: sourceItems.map(({ name, type, title, description }) => ({
    name,
    type,
    title,
    description,
  })),
};

fs.writeFileSync(
  path.join(outDir, "index.json"),
  `${JSON.stringify(index, null, 2)}\n`
);

console.log(
  `Registry built: ${sourceItems.length} items → ${outDir} + registry.json`
);
