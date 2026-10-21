import playwright from "eslint-plugin-playwright";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "playwright-report", "test-results", ".wrangler"] },
  ...tseslint.configs.recommended,
  {
    files: ["tests/**/*.ts", "pages/**/*.ts"],
    ...playwright.configs["flat/recommended"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "playwright/no-raw-locators": "error",
      "playwright/prefer-web-first-assertions": "error",
      // Scope tests to browsers with testIgnore in playwright.config.ts, not test.skip.
      "playwright/no-skipped-test": "error",
    },
  },
);
