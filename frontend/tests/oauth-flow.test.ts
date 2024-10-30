import { test } from "@playwright/test";

// IT'S BETTER IF YOU DON'T USE IT

test("testing oauth flow", async ({ page }) => {
  await page.goto("http://localhost:3000/es/auth/sign-in");
  await page.click("#google");
  await page.waitForSelector('[data-identifier="heavycream9090@gmail.com"]');
  await page.click('[data-identifier="heavycream9090@gmail.com"]');
  await page.waitForSelector("//*[contains(text(), 'Continuar')]");
  await page.click("//*[contains(text(), 'Continuar')]")
  await page.waitForURL("http://localhost:3000/es/dashboard")
});
