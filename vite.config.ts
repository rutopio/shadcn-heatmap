import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Fontsource asset names are only available after bundling.
const PRELOAD_FONT_MATCHERS = [
  /albert-sans-latin-wght-normal.*\.woff2$/,
  /host-grotesk-latin-wght-normal.*\.woff2$/,
];
const PUBLIC_PRELOAD_FONTS = ["/fonts/PaperMono-Variable.woff2"];

const fontPreloadPlugin = {
  name: "font-preload",
  transformIndexHtml: {
    order: "post" as const,
    handler(html: string, ctx: { bundle?: Record<string, { type: string }> }) {
      const hrefs: string[] = [...PUBLIC_PRELOAD_FONTS];
      // In dev there is no bundle; only the fixed public path is preloaded.
      if (ctx.bundle) {
        for (const name of Object.keys(ctx.bundle)) {
          if (
            ctx.bundle[name]?.type === "asset" &&
            PRELOAD_FONT_MATCHERS.some((re) => re.test(name))
          ) {
            hrefs.push(`/${name}`);
          }
        }
      }
      const tags = hrefs
        .map(
          (href) =>
            `    <link rel="preload" href="${href}" as="font" type="font/woff2" crossorigin>`,
        )
        .join("\n");
      return html.replace("</head>", `${tags}\n  </head>`);
    },
  },
};

export default defineConfig({
  plugins: [
    tanstackRouter({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    fontPreloadPlugin,
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
