import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "../fixtures";

// Runs in Chromium only (desktop and mobile layouts), as axe's rules don't depend on the
// browser engine: see playwright.config.ts.
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa", "best-practice"];

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`Accessibility (${colorScheme} mode)`, () => {
    test.use({ colorScheme });

    for (const path of ["/", "/cv/", "/no-such-page"]) {
      test(`${path} has no axe violations`, async ({ page }, testInfo) => {
        await page.goto(path);
        const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
        await testInfo.attach("axe-results", {
          body: JSON.stringify(results, null, 2),
          contentType: "application/json",
        });
        const violations = results.violations.map(
          (v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`,
        );
        expect(violations).toEqual([]);
      });
    }
  });
}
