import { test } from "@playwright/test";

test("it should update refresh token", async ({ page }) => {
  await page.goto("http://localhost:3000/auth/sign-in");

  await page.fill("[name=email]", "heavycream9090@icloud.com");
  await page.fill("[name=password]", "Rt3$YiOO");

  await page.click("[type=submit]");

  await page.waitForURL("http://localhost:3000/dashboard");
  await page.waitForTimeout(1000);
  await page.reload();

  await page.waitForURL("http://localhost:3000/dashboard");
});
