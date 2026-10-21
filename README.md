# nickwake.uk

Personal site: a landing page and an HTML CV, with the PDF version generated from the HTML.

- **`/`**: who I am, links to my CV, GitHub and LinkedIn, and my featured project,
  [Nature Frames](https://photos.nickwake.uk/) ([code and tests](https://github.com/nickwake93/nature-frames-qa)).
- **`/cv/`**: my CV as a web page, with a print stylesheet.
- **`/nick-wake-cv.pdf`**: generated from `/cv/` by Playwright (`page.pdf()`) at build time, so the
  web and PDF versions can never drift apart.

Plain HTML and CSS, no framework and no JavaScript. Served as static assets by Cloudflare.

## Layout

| Path                          | What it is                                                     |
| ----------------------------- | -------------------------------------------------------------- |
| `site/`                       | The pages, stylesheet, 404 page and security headers           |
| `scripts/build.mjs`           | Builds `dist/`: copies `site/`, adds the fonts, prints the PDF |
| `tests/ui/`                   | Browser tests: content, links, layout, fonts and axe           |
| `tests/http/`                 | HTTP tests: the PDF, security headers and the 404 page         |
| `pages/`, `tests/fixtures.ts` | Page objects and the fixtures that provide them                |
| `wrangler.jsonc`              | Cloudflare config: serves `dist/` on `nickwake.uk`             |

## Running it

```sh
npm ci
npx playwright install chromium webkit
npm run build      # dist/, including the PDF
npm run preview    # serves dist/ locally with Cloudflare's runtime
npm test           # builds, serves and runs every test
```

`PLAYWRIGHT_BASE_URL=https://nickwake.uk/ npm run test:smoke` runs the smoke tests against the
live site.

## CI and deploy

Every push and PR runs lint, typecheck and formatting checks, builds the site, runs a quick smoke
gate in Chromium, then the full suite across Chromium, Firefox, WebKit and two phones.

On `main`, the tested `dist/` is deployed to Cloudflare as is, then the smoke tests run against
production. The deploy needs the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets.
