export const REGISTRY_BASE_URL = "https://shadcn-heatmap.pages.dev/r"; // update to your deployment URL

export const cliInstallCommands = {
  month: `npx shadcn@latest add ${REGISTRY_BASE_URL}/month-contribution-heatmap.json`,
  week: `npx shadcn@latest add ${REGISTRY_BASE_URL}/week-contribution-heatmap.json`,
  date: `npx shadcn@latest add ${REGISTRY_BASE_URL}/date-contribution-heatmap.json`,
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

export const themeTokensSnippet = `/* src/styles/globals.css (Tailwind v4) */
@import "tailwindcss";

@theme {
  --color-secondary: oklch(96.7% 0.001 286.4);
  --color-chart-1: oklch(64.6% 0.222 41.1);
  --color-muted-foreground: oklch(55.2% 0.014 285.9);
}`;
