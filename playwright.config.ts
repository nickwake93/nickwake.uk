import { defineConfig, devices } from "@playwright/test";

// Point at a running site (e.g. production) with PLAYWRIGHT_BASE_URL. Otherwise Playwright
// builds the site and serves dist/ with wrangler dev, the same way Cloudflare serves it.
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const PORT = 4300;

const UI_SPECS = /tests\/ui\/.*\.spec\.ts/;
// Scoped with testIgnore rather than test.skip, so nothing is scheduled just to be skipped.
const AXE = /tests\/ui\/axe\.spec\.ts/; // axe's rules don't depend on the engine: Chromium only

// CI builds in its own step and sets PW_PREBUILT, so the tested build is the one deployed.
const build = process.env.PW_PREBUILT ? "" : "npm run build && ";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }], ["github"]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: externalBaseURL ?? `http://localhost:${PORT}/`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: externalBaseURL
    ? undefined
    : {
        command: `${build}npm run preview -- --port ${PORT}`,
        url: `http://localhost:${PORT}/`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
  projects: [
    {
      name: "chromium",
      testMatch: UI_SPECS,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      testMatch: UI_SPECS,
      testIgnore: [AXE],
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testMatch: UI_SPECS,
      testIgnore: [AXE],
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      testMatch: UI_SPECS,
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "mobile-safari",
      testMatch: UI_SPECS,
      testIgnore: [AXE],
      use: { ...devices["iPhone 15"] },
    },
    // HTTP-only: headers, the PDF and the 404 page. No browser is launched.
    { name: "http", testMatch: /tests\/http\/.*\.spec\.ts/ },
  ],
});
