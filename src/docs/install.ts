// Official shadcn registry namespace, listed in the shadcn directory.
// See https://ui.shadcn.com/docs/registry/namespace
const REGISTRY = "@heatmap";

export const cliInstallCommands = {
  calendar: `npx shadcn@latest add ${REGISTRY}/calendar-heatmap`,
  weekday: `npx shadcn@latest add ${REGISTRY}/weekday-heatmap`,
  date: `npx shadcn@latest add ${REGISTRY}/date-heatmap`,
  status: `npx shadcn@latest add ${REGISTRY}/status-heatmap`,
} as const;

export const packageManagerCommands = {
  npm: "npm install date-fns clsx tailwind-merge",
  pnpm: "pnpm add date-fns clsx tailwind-merge",
  yarn: "yarn add date-fns clsx tailwind-merge",
  bun: "bun add date-fns clsx tailwind-merge",
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
