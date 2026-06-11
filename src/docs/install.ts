// GitHub registry form: <owner>/<repo>/<item> installs straight from the repo.
// See https://ui.shadcn.com/docs/registry/github
const GITHUB_REGISTRY = "rutopio/shadcn-heatmap";

export const cliInstallCommands = {
  calendar: `npx shadcn@latest add ${GITHUB_REGISTRY}/calendar-heatmap`,
  weekday: `npx shadcn@latest add ${GITHUB_REGISTRY}/weekday-heatmap`,
  date: `npx shadcn@latest add ${GITHUB_REGISTRY}/date-heatmap`,
  status: `npx shadcn@latest add ${GITHUB_REGISTRY}/status-heatmap`,
} as const;

export const packageManagerCommands = {
  npm: "npm install date-fns clsx tailwind-merge @radix-ui/react-tooltip",
  pnpm: "pnpm add date-fns clsx tailwind-merge @radix-ui/react-tooltip",
  yarn: "yarn add date-fns clsx tailwind-merge @radix-ui/react-tooltip",
  bun: "bun add date-fns clsx tailwind-merge @radix-ui/react-tooltip",
} as const;

export const utilsSnippet = `// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;

export const themeTokensSnippet = `/* src/styles.css (Tailwind v4) */
@import "tailwindcss";

@theme {
  --color-secondary: oklch(96.7% 0.001 286.4);
  --color-chart-1: oklch(64.6% 0.222 41.1);
  --color-muted-foreground: oklch(55.2% 0.014 285.9);
}`;
