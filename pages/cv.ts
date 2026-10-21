import type { Locator, Page } from "@playwright/test";

/** The HTML CV at nickwake.uk/cv/. */
export class CvPage {
  readonly heading: Locator;
  readonly toolbar: Locator;
  readonly downloadLink: Locator;
  readonly homeLink: Locator;
  readonly contactDetails: Locator;
  readonly jobs: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1 });
    this.toolbar = page.getByRole("navigation", { name: "CV actions" });
    this.downloadLink = this.toolbar.getByRole("link", {
      name: "Download PDF",
    });
    this.homeLink = this.toolbar.getByRole("link", { name: /nickwake\.uk/ });
    this.contactDetails = page.getByRole("list", { name: "Contact details" });
    this.jobs = page.getByRole("region", { name: "Work History" }).getByRole("article");
  }

  async goto() {
    await this.page.goto("/cv/");
  }

  section(name: string): Locator {
    return this.page.getByRole("region", { name });
  }
}
