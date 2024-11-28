import test from "@playwright/test";

test("2fa verify accessability", async ({ browser }) => {
  const ctx = await browser.newContext();
  ctx.addCookies([
    { name: "NEXT_LOCALE", value: "es", url: "http://localhost:3000" },
  ]);
  const page = await ctx.newPage();

  await page.goto("http://localhost:3000/es/auth/sign-in/verify");
  await page.waitForURL("http://localhost:3000/es/auth/sign-in");
});
