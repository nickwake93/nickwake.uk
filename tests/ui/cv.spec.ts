import { test, expect } from "../fixtures";

test.describe("CV", () => {
  test("shows every section, with all nine roles", { tag: "@smoke" }, async ({ cv }) => {
    await expect(cv.heading).toHaveText("Nick Wake");
    for (const section of ["Skills", "Projects", "Work History", "Qualifications"]) {
      await expect(cv.section(section)).toBeVisible();
    }
    await expect(cv.jobs).toHaveCount(9);
    await expect(cv.jobs.first().getByRole("heading")).toHaveText("Senior QA Engineer");
  });

  test("contact details link to the right places", async ({ cv }) => {
    const links = [
      { name: "nwake@hey.com", href: "mailto:nwake@hey.com" },
      {
        name: "linkedin.com/in/nick-wake",
        href: "https://www.linkedin.com/in/nick-wake",
      },
      { name: "nickwake.uk", href: "https://nickwake.uk" },
    ];
    for (const { name, href } of links) {
      await expect(cv.contactDetails.getByRole("link", { name })).toHaveAttribute("href", href);
    }
  });

  // The public CV deliberately leaves this out; the Word version, sent directly, includes it.
  test("doesn't mention a notice period", async ({ cv }) => {
    await expect(cv.heading).toBeVisible();
    await expect(cv.page.getByText(/notice period/i)).toHaveCount(0);
  });

  test("links back to the landing page", async ({ cv, page }) => {
    await cv.homeLink.click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("link", { name: "View my CV" })).toBeVisible();
  });

  test.describe("when printed (as for the PDF)", () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ media: "print" });
    });

    test("hides the toolbar", async ({ cv }) => {
      await expect(cv.heading).toBeVisible();
      await expect(cv.toolbar).toBeHidden();
    });

    // Relative links would point at the reader's own computer once they're in a PDF.
    test("only shows absolute links", async ({ cv }) => {
      await expect(cv.heading).toBeVisible();
      const hrefs = await cv.page
        .getByRole("link")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
      expect(hrefs.length).toBeGreaterThan(0);
      expect(hrefs.filter((href) => !/^(https:|mailto:)/.test(href ?? ""))).toEqual([]);
    });
  });
});
