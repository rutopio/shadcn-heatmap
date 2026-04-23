import { createFileRoute } from "@tanstack/react-router";
import { TerminalIcon } from "@phosphor-icons/react";

import { CodeBlock } from "@/components/ui/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  cliInstallCommands,
  packageManagerCommands,
  themeTokensSnippet,
  utilsSnippet,
} from "@/content/install";
import { pageHead } from "@/lib/seo";

function InstallPage() {
  return (
    <section
      id="quick-start"
      className="border-b py-20 sm:py-24"
      aria-label="Quick start"
    >
      <div className="container">
        <div className="mb-10 flex flex-col gap-2">
          <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs font-medium uppercase">
            <TerminalIcon
              aria-hidden="true"
              weight="bold"
              className="size-3.5"
            />{" "}
            Quick start
          </span>
          <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
            Install in under a minute
          </h2>
          <p className="text-muted-foreground max-w-2xl text-pretty">
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
              <h3 className="text-sm font-medium text-balance">
                1. Install via{" "}
                <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">
                  shadcn@latest
                </code>
              </h3>
              <p className="text-muted-foreground text-sm text-pretty">
                Pick the component you need. The CLI will write it into your
                project&rsquo;s{" "}
                <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">
                  components/heatmap/
                </code>{" "}
                directory.
              </p>
              <div className="grid gap-3">
                <CodeBlock
                  code={cliInstallCommands.calendar}
                  lang="bash"
                  filename="# CalendarHeatmap"
                />
                <CodeBlock
                  code={cliInstallCommands.weekday}
                  lang="bash"
                  filename="# WeekdayHeatmap"
                />
                <CodeBlock
                  code={cliInstallCommands.date}
                  lang="bash"
                  filename="# DateHeatmap"
                />
                <CodeBlock
                  code={cliInstallCommands.status}
                  lang="bash"
                  filename="# StatusHeatmap"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-balance">
                2. Ensure the runtime dependencies exist
              </h3>
              <CodeBlock
                code={packageManagerCommands.pnpm}
                lang="bash"
                filename="# Install peer deps"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-balance">
                3. Install the shadcn tooltip component (optional but
                recommended)
              </h3>
              <p className="text-muted-foreground text-sm text-pretty">
                The demos use tooltips to show activity details on hover:
              </p>
              <CodeBlock
                code="npx shadcn@latest add tooltip"
                lang="bash"
                filename="# Install tooltip"
              />
            </div>
          </TabsContent>

          <TabsContent value="manual" className="mt-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-balance">
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
              <h3 className="text-sm font-medium text-balance">
                2. Add the{" "}
                <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">
                  cn
                </code>{" "}
                helper
              </h3>
              <CodeBlock code={utilsSnippet} filename="src/lib/utils.ts" />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-balance">
                3. Expose theme tokens used by the blocks
              </h3>
              <p className="text-muted-foreground text-sm text-pretty">
                The heatmaps reference{" "}
                <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">
                  --color-chart-1
                </code>{" "}
                for activity colors,{" "}
                <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">
                  --color-secondary
                </code>{" "}
                for empty cells, and{" "}
                <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">
                  --color-muted-foreground
                </code>{" "}
                for labels. You can customize these via the{" "}
                <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">
                  colors
                </code>{" "}
                prop.
              </p>
              <CodeBlock
                code={themeTokensSnippet}
                lang="css"
                filename="src/styles/globals.css"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-balance">
                4. Install the shadcn tooltip component (optional but
                recommended)
              </h3>
              <p className="text-muted-foreground text-sm text-pretty">
                The demos use tooltips to show activity details on hover. If you
                want this functionality, add the tooltip component:
              </p>
              <CodeBlock
                code="npx shadcn@latest add tooltip"
                lang="bash"
                filename="# Install tooltip"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-balance">
                5. Copy the component you need
              </h3>
              <p className="text-muted-foreground text-sm text-pretty">
                Copy the files you need from{" "}
                <a
                  href="https://github.com/rutopio/shadcn-heatmap/tree/master/src/components/heatmap"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground underline underline-offset-4"
                  aria-label="src/components/heatmap on GitHub (opens in new tab)"
                >
                  src/components/heatmap/
                </a>{" "}
                on GitHub and place them under{" "}
                <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">
                  src/components/heatmap/
                </code>{" "}
                in your project.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/install/")({
  component: InstallPage,
  head: () =>
    pageHead({
      title: "Install — shadcn-heatmap",
      description:
        "Install shadcn-heatmap components via the shadcn CLI or copy manually. Peer dependencies, theme tokens, and the cn helper explained in under a minute.",
      path: "/install",
    }),
});
