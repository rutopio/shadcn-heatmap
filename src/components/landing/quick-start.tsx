import { Terminal } from "@phosphor-icons/react";

import { CodeBlock } from "@/components/ui/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  cliInstallCommands,
  packageManagerCommands,
  themeTokensSnippet,
  utilsSnippet,
} from "@/content/install";

export function QuickStart() {
  return (
    <section
      id="quick-start"
      className="border-b py-20 sm:py-24"
      aria-label="Quick start"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
            <Terminal aria-hidden="true" weight="bold" className="size-3.5" /> Quick start
          </span>
          <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
            Install in under a minute
          </h2>
          <p className="max-w-2xl text-muted-foreground text-pretty">
            Use the shadcn CLI to drop a file into your project, or copy the
            source manually. Either way, you own the code afterwards.
          </p>
        </div>

        <Tabs defaultValue="cli" className="w-full">
          <TabsList className="w-full max-w-sm">
            <TabsTrigger value="cli" className="flex-1">
              shadcn CLI
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex-1">
              Manual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cli" className="mt-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                1. Install via{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  shadcn@latest
                </code>
              </h3>
              <p className="text-sm text-muted-foreground">
                Pick the component you need. The CLI will write it into your
                project&rsquo;s{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  components/heatmap/
                </code>{" "}
                directory.
              </p>
              <div className="grid gap-3">
                <CodeBlock
                  code={cliInstallCommands.month}
                  lang="bash"
                  filename="# Month / GitHub-style"
                />
                <CodeBlock
                  code={cliInstallCommands.week}
                  lang="bash"
                  filename="# Week (weekday x hour)"
                />
                <CodeBlock
                  code={cliInstallCommands.date}
                  lang="bash"
                  filename="# Date (date x hour)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                2. Ensure the runtime dependencies exist
              </h3>
              <CodeBlock
                code={packageManagerCommands.pnpm}
                lang="bash"
                filename="install peer deps"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                3. Install the shadcn tooltip component (optional but recommended)
              </h3>
              <p className="text-sm text-muted-foreground">
                The demos use tooltips to show activity details on hover:
              </p>
              <CodeBlock
                code="npx shadcn@latest add tooltip"
                lang="bash"
                filename="install tooltip"
              />
            </div>
          </TabsContent>

          <TabsContent value="manual" className="mt-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                1. Install peer dependencies
              </h3>
              <Tabs defaultValue="pnpm">
                <TabsList>
                  <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                  <TabsTrigger value="npm">npm</TabsTrigger>
                  <TabsTrigger value="yarn">yarn</TabsTrigger>
                  <TabsTrigger value="bun">bun</TabsTrigger>
                </TabsList>
                <TabsContent value="pnpm">
                  <CodeBlock code={packageManagerCommands.pnpm} lang="bash" />
                </TabsContent>
                <TabsContent value="npm">
                  <CodeBlock code={packageManagerCommands.npm} lang="bash" />
                </TabsContent>
                <TabsContent value="yarn">
                  <CodeBlock code={packageManagerCommands.yarn} lang="bash" />
                </TabsContent>
                <TabsContent value="bun">
                  <CodeBlock code={packageManagerCommands.bun} lang="bash" />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                2. Add the{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  cn
                </code>{" "}
                helper
              </h3>
              <CodeBlock code={utilsSnippet} filename="src/lib/utils.ts" />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                3. Expose theme tokens used by the blocks
              </h3>
              <p className="text-sm text-muted-foreground">
                The heatmaps reference{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  --color-chart-1
                </code>{" "}
                for activity colors,{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  --color-secondary
                </code>{" "}
                for empty cells, and{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  --color-muted-foreground
                </code>{" "}
                for labels. You can customize these via the{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  colors
                </code>{" "}
                prop.
              </p>
              <CodeBlock
                code={themeTokensSnippet}
                filename="src/styles/globals.css"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                4. Install the shadcn tooltip component (optional but recommended)
              </h3>
              <p className="text-sm text-muted-foreground">
                The demos use tooltips to show activity details on hover. If you want this functionality, add the tooltip component:
              </p>
              <CodeBlock
                code="npx shadcn@latest add tooltip"
                lang="bash"
                filename="install tooltip"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                5. Copy the component you need
              </h3>
              <p className="text-sm text-muted-foreground">
                Browse the three components below — each includes a{" "}
                <em>Code</em> tab with the full source ready to paste into{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  src/components/heatmap/&lt;name&gt;.tsx
                </code>
                .
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
