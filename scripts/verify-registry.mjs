import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const workspace = await mkdtemp(path.join(tmpdir(), "heatmap-registry-"));
const names = ["calendar", "weekday", "date", "status"].map(
  (name) => `${name}-heatmap`,
);
const manifest = JSON.parse(
  await readFile(path.join(root, "package.json"), "utf8"),
);
const run = (command, args, cwd) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      env: { ...process.env, CI: "true" },
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${command} exited with ${code}`)),
    );
  });
const server = createServer(async (request, response) => {
  const name = new URL(request.url, "http://localhost").pathname
    .slice(3)
    .replace(/\.json$/, "");
  if (!names.includes(name)) {
    response.writeHead(404).end();
    return;
  }
  response.setHeader("Content-Type", "application/json");
  response.end(await readFile(path.join(root, "public/r", `${name}.json`)));
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const registryUrl = `http://127.0.0.1:${server.address().port}/r`;
try {
  for (const mode of ["url", "namespace"]) {
    const cwd = path.join(workspace, mode);
    await mkdir(path.join(cwd, "src/lib"), { recursive: true });
    await writeFile(
      path.join(cwd, "package.json"),
      JSON.stringify(
        {
          name: `heatmap-consumer-${mode}`,
          private: true,
          type: "module",
          dependencies: {
            "@base-ui/react": manifest.dependencies["@base-ui/react"],
            react: manifest.dependencies.react,
            "react-dom": manifest.dependencies["react-dom"],
            clsx: manifest.dependencies.clsx,
            "tailwind-merge": manifest.dependencies["tailwind-merge"],
          },
          devDependencies: {
            typescript: manifest.devDependencies.typescript,
            "@types/react": manifest.devDependencies["@types/react"],
            "@types/react-dom": manifest.devDependencies["@types/react-dom"],
            tailwindcss: manifest.devDependencies.tailwindcss,
          },
        },
        null,
        2,
      ),
    );
    await writeFile(
      path.join(cwd, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          target: "ES2022",
          lib: ["DOM", "ES2023"],
          module: "ESNext",
          moduleResolution: "Bundler",
          jsx: "react-jsx",
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          paths: { "@/*": ["./src/*"] },
        },
        include: ["src"],
      }),
    );
    await writeFile(
      path.join(cwd, "components.json"),
      JSON.stringify(
        {
          $schema: "https://ui.shadcn.com/schema.json",
          style: "base-vega",
          rsc: mode === "namespace",
          tsx: true,
          tailwind: {
            config: "",
            css: "src/styles.css",
            baseColor: "neutral",
            cssVariables: true,
          },
          aliases: {
            components: "@/components",
            utils: "@/lib/utils",
            ui: "@/components/ui",
            lib: "@/lib",
            hooks: "@/hooks",
          },
          registries: { "@heatmap": `${registryUrl}/{name}.json` },
        },
        null,
        2,
      ),
    );
    await writeFile(
      path.join(cwd, "src/styles.css"),
      '@import "tailwindcss";\n',
    );
    await writeFile(
      path.join(cwd, "src/lib/utils.ts"),
      await readFile(path.join(root, "src/lib/utils.ts")),
    );
    await run("pnpm", ["install", "--ignore-scripts"], cwd);
    // Install Weekday first to prove it declares date-fns independently.
    const ordered = [names[1], names[0], names[2], names[3]];
    for (const name of ordered) {
      const address =
        mode === "url" ? `${registryUrl}/${name}.json` : `@heatmap/${name}`;
      await run(
        "pnpm",
        [
          "dlx",
          `shadcn@${process.env.SHADCN_VERSION ?? "latest"}`,
          "add",
          address,
          "--yes",
        ],
        cwd,
      );
      const source = await readFile(
        path.join(cwd, `src/components/heatmap/${name}.tsx`),
        "utf8",
      );
      assert.match(source, /^"use client";/);
      const installed = JSON.parse(
        await readFile(path.join(cwd, "package.json"), "utf8"),
      );
      assert.ok(installed.dependencies["date-fns"]);
      await run("pnpm", ["exec", "tsc", "--noEmit"], cwd);
    }
    await run(
      "pnpm",
      [
        "dlx",
        `shadcn@${process.env.SHADCN_VERSION ?? "latest"}`,
        "add",
        "tooltip",
        "--yes",
      ],
      cwd,
    );
    await mkdir(path.join(cwd, "src/examples"), { recursive: true });
    for (const name of ["calendar", "date", "weekday", "status"]) {
      await writeFile(
        path.join(cwd, `src/examples/${name}.tsx`),
        await readFile(path.join(root, `src/examples/${name}.tsx`)),
      );
    }
    const readme = await readFile(path.join(root, "README.md"), "utf8");
    let exampleIndex = 0;
    for (const [, code] of readme.matchAll(/```tsx\n([\s\S]*?)```/g)) {
      await writeFile(
        path.join(cwd, `src/examples/readme-${exampleIndex++}.tsx`),
        code,
      );
    }
    await run("pnpm", ["exec", "tsc", "--noEmit"], cwd);
    const css = await readFile(path.join(cwd, "src/styles.css"), "utf8");
    assert.match(css, /--color-chart-1/);
    assert.doesNotMatch(css, /--color-color-/);
    console.log(
      `Verified ${mode} installation and strict compilation of all four components.`,
    );
  }
} finally {
  server.close();
  console.log(`Consumer projects: ${workspace}`);
}
