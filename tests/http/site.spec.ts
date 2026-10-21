import { test, expect } from "@playwright/test";

test.describe("CV PDF", () => {
  test("is served as a two-page PDF", { tag: "@smoke" }, async ({ request }) => {
    const res = await request.get("/nick-wake-cv.pdf");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("application/pdf");

    const pdf = (await res.body()).toString("latin1");
    expect(pdf.startsWith("%PDF-")).toBe(true);
    // Each page is an object of /Type /Page (the page tree is /Type /Pages).
    const pageCount = pdf.split(/\/Type\s*\/Page(?!s)/).length - 1;
    expect(pageCount).toBe(2);
  });
});

test.describe("Responses", () => {
  for (const path of ["/", "/cv/"]) {
    test(`${path} sends security headers`, { tag: "@smoke" }, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      const headers = res.headers();
      expect(headers["content-security-policy"]).toContain("script-src 'none'");
      expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
      expect(headers["x-content-type-options"]).toBe("nosniff");
      expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    });
  }

  test("an unknown page returns the 404 page", { tag: "@smoke" }, async ({ request }) => {
    const res = await request.get("/no-such-page");
    expect(res.status()).toBe(404);
    expect(await res.text()).toContain("There's nothing at this address.");
  });

  test("/cv redirects to /cv/", async ({ request }) => {
    const res = await request.get("/cv", { maxRedirects: 0 });
    expect(res.status()).toBe(307);
    expect(res.headers()["location"]).toBe("/cv/");
  });
});
