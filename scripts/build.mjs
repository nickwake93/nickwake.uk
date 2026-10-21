// Builds the site into dist/: copies site/, adds the self-hosted fonts, then prints the CV page
// to dist/nick-wake-cv.pdf with Playwright, so the PDF is always generated from the HTML.
import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = `${root}dist`;

const fonts = [
  "@fontsource/carlito/files/carlito-latin-400-normal.woff2",
  "@fontsource/carlito/files/carlito-latin-400-italic.woff2",
  "@fontsource/carlito/files/carlito-latin-700-normal.woff2",
  "@fontsource/questrial/files/questrial-latin-400-normal.woff2",
];

await rm(dist, { recursive: true, force: true });
await cp(`${root}site`, dist, { recursive: true });
await mkdir(`${dist}/fonts`);
for (const font of fonts) {
  await cp(`${root}node_modules/${font}`, `${dist}/fonts/${font.split("/").pop()}`);
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(`${dist}/cv/index.html`).href);
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: `${dist}/nick-wake-cv.pdf`,
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
    outline: true,
  });
} finally {
  await browser.close();
}
console.log("Built dist/ with nick-wake-cv.pdf");
