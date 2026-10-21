import type { Locator, Page } from "@playwright/test";

/** The landing page at nickwake.uk. */
export class HomePage {
  readonly heading: Locator;
  readonly profileLinks: Locator;
  readonly project: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1 });
    this.profileLinks = page.getByRole("navigation", { name: "Profile links" });
    this.project = page.getByRole("region", { name: "Nature Frames" });
  }

  async goto() {
    await this.page.goto("/");
  }

  profileLink(name: string | RegExp): Locator {
    return this.profileLinks.getByRole("link", { name });
  }

  projectLink(name: string): Locator {
    return this.project.getByRole("link", { name });
  }
}
