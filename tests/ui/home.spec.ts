import { test, expect } from "../fixtures";

test.describe("Landing page", () => {
  test("introduces me and links to my CV and profiles", { tag: "@smoke" }, async ({ home }) => {
    await expect(home.heading).toHaveText("Nick Wake");
    await expect(home.page.getByText("Senior QA Engineer")).toBeVisible();

    const links = [
      { name: "View my CV", href: "cv/" },
      { name: "Download CV (PDF)", href: "nick-wake-cv.pdf" },
      { name: "GitHub", href: "https://github.com/nickwake93" },
      { name: "LinkedIn", href: "https://www.linkedin.com/in/nick-wake" },
      { name: "nwake@hey.com", href: "mailto:nwake@hey.com" },
    ];
    for (const { name, href } of links) {
      await expect(home.profileLink(name)).toHaveAttribute("href", href);
    }
    await expect(home.profileLink("Download CV (PDF)")).toHaveAttribute("download");
  });

  test(
    "features Nature Frames with links to the site, its code and its test report",
    { tag: "@smoke" },
    async ({ home }) => {
      await expect(home.project.getByRole("heading", { name: "Nature Frames" })).toBeVisible();
      await expect(home.projectLink("Live site")).toHaveAttribute(
        "href",
        "https://photos.nickwake.uk",
      );
      await expect(home.projectLink("Code and tests")).toHaveAttribute(
        "href",
        "https://github.com/nickwake93/nature-frames-qa",
      );
      await expect(home.projectLink("Latest test report")).toHaveAttribute(
        "href",
        "https://nickwake93.github.io/nature-frames-qa/main/",
      );
    },
  );

  test("View my CV opens the CV", async ({ home, page }) => {
    await home.profileLink("View my CV").click();
    await expect(page).toHaveURL(/\/cv\/$/);
    await expect(page.getByRole("heading", { name: "Work History" })).toBeVisible();
  });
});
