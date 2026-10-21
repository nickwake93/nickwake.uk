import type { Page } from "@playwright/test";
import { test, expect } from "../fixtures";

const PAGES = ["/", "/cv/"];

/** Records failed requests, error responses and console errors (including CSP violations). */
function collectProblems(page: Page) {
  const problems: string[] = [];
  page.on("requestfailed", (req) => problems.push(`failed: ${req.url()}`));
  page.on("response", (res) => {
    if (res.status() >= 400) problems.push(`${res.status()}: ${res.url()}`);
  });
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`console: ${msg.text()}`);
  });
  return problems;
}

for (const path of PAGES) {
  test.describe(`${path}`, () => {
    test("loads every asset with no errors", { tag: "@smoke" }, async ({ page }) => {
      const problems = collectProblems(page);
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(problems).toEqual([]);
    });

    test("uses the self-hosted fonts", async ({ page }) => {
      await page.goto(path);
      const loaded = await page.evaluate(async () => {
        await document.fonts.ready;
        // Engines differ on whether the family name keeps its quotes.
        return [...document.fonts]
          .filter((f) => f.status === "loaded")
          .map((f) => f.family.replaceAll('"', ""));
      });
      expect(new Set(loaded)).toEqual(new Set(["Carlito", "Questrial"]));
    });

    test("has no horizontal scrolling", async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });

    // WCAG 1.4.10 Reflow: content must work at 320 CSS px wide without scrolling sideways.
    test("fits a 320px viewport", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  });
}
