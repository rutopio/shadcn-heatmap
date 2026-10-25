import { expect, test } from "@playwright/test";

for (const route of [
  "/",
  "/calendar",
  "/date",
  "/weekday",
  "/status",
  "/binary",
  "/install",
]) {
  test(`${route} loads without runtime errors at desktop and mobile widths`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const fits = await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      );
      expect(fits).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

test("mobile navigation closes on Escape and restores focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.locator("#mobile-nav")).toBeVisible();
  await page.locator("#mobile-nav a").first().focus();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-nav")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("tooltips work with SVG blocks on hover and keyboard focus", async ({
  page,
}) => {
  await page.goto("/date");
  const cell = page
    .locator("#default-usage rect[data-date][data-hour]")
    .first();
  await cell.hover();
  await expect(page.locator('[data-slot="tooltip-content"]')).toContainText(
    "mm",
  );
  await page.mouse.move(0, 0);
  await expect(cell).toHaveAttribute("tabindex", "0");
  await page.keyboard.press("Tab");
  await cell.focus();
  await expect(page.locator('[data-slot="tooltip-content"]')).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator('[data-slot="tooltip-content"]')).toHaveCount(0);
});

test("copy failures show an error instead of a success message", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("denied")) },
    }),
  );
  await page.goto("/install");
  await page.getByRole("button", { name: "Copy code" }).first().click();
  await expect(
    page.getByText("Could not copy. Please select and copy the text manually."),
  ).toBeVisible();
});

test("missing pages remain visible without an automatic redirect", async ({
  page,
}) => {
  await page.goto("/does-not-exist");
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
});

test("route HTML contains social metadata before JavaScript runs", async ({
  request,
}) => {
  for (const route of ["calendar", "date", "weekday", "status"]) {
    const response = await request.get(`/${route}/index.html`);
    expect(await response.text()).toContain(
      `https://heatmap.chingru.com/og-${route}.png`,
    );
  }
});
