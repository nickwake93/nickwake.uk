import { test as base } from "@playwright/test";
import { CvPage } from "../pages/cv";
import { HomePage } from "../pages/home";

/** `home` and `cv` open their page before the test starts. */
export const test = base.extend<{ home: HomePage; cv: CvPage }>({
  home: async ({ page }, use) => {
    const home = new HomePage(page);
    await home.goto();
    await use(home);
  },
  cv: async ({ page }, use) => {
    const cv = new CvPage(page);
    await cv.goto();
    await use(cv);
  },
});

export { expect } from "@playwright/test";
