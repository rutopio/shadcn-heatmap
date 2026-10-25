import { chromium } from "@playwright/test";
import { preview } from "vite";

const server = process.env.PREVIEW_URL
  ? null
  : await preview({
      preview: { host: "127.0.0.1", port: 4174, strictPort: true },
    });

const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
    deviceScaleFactor: 2,
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  await page.goto(process.env.PREVIEW_URL ?? "http://127.0.0.1:4174");
  await page.evaluate(() => document.fonts.ready);
  for (const name of ["calendar", "weekday", "date", "status"]) {
    const chart = page.locator(`[data-slot="${name}-heatmap"]`).first();
    await chart.screenshot({
      path: `assets/${name}-heatmap.png`,
      animations: "disabled",
    });
  }
} finally {
  await browser.close();
  if (server) await new Promise((resolve) => server.httpServer.close(resolve));
}
