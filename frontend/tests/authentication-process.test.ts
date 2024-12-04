import { test } from "@playwright/test";

// DEPRECATED

test("Test web page appearing, sign up valid, and sign up invalid", async ({
  browser,
}) => {
  const ctx = await browser.newContext();
  ctx.addCookies([
    { name: "NEXT_LOCALE", value: "es", domain: "localhost", path: "/" },
  ]);
  const page = await ctx.newPage();

  await test.step("Is appearing web page?", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForURL("http://localhost:3000/en", {
      timeout: 10000,
      waitUntil: "domcontentloaded",
    });
  });

  await test.step("Sign up", async () => {
    await page.goto("http://localhost:3000/en");
    await page.waitForURL("http://localhost:3000/en", {
      timeout: 10000,
      waitUntil: "domcontentloaded",
    });

    await page.goto("http://localhost:3000/en/auth/sign-up");

    await page.getByTestId("sign-up-username-input").fill("john_doe8889");
    await page.getByTestId("sign-up-first-name-input").fill("John");
    await page.getByTestId("sign-up-last-name-input").fill("Doe");
    await page
      .getByTestId("sign-up-email-input")
      .fill("johndoe8889@cartera.es");
    await page.getByTestId("sign-up-password-input").fill("Rt3$YiOO");
    await page.getByTestId("sign-up-password-input-confirm").fill("Rt3$YiOO");
    await page.getByTestId("sign-up-btn").click();

    await page
      .getByTestId("sign-up-success")
      .waitFor({ timeout: 30000, state: "visible" });
  });

  await test.step("Sign up with invalid username", async () => {
    await page.goto("http://localhost:3000/en");
    await page.waitForURL("http://localhost:3000/en", {
      timeout: 10000,
      waitUntil: "domcontentloaded",
    });

    await page.goto("http://localhost:3000/en/auth/sign-up");

    await page.getByTestId("sign-up-username-input").fill("john_doe2489");
    await page.getByTestId("sign-up-first-name-input").fill("John");
    await page.getByTestId("sign-up-last-name-input").fill("Doe");
    await page
      .getByTestId("sign-up-email-input")
      .fill("johndoe2489@cartera.es");
    await page.getByTestId("sign-up-password-input").fill("Rt3$YiOO");
    await page.getByTestId("sign-up-password-input-confirm").fill("Rt3$YiOO");
    await page.getByTestId("sign-up-btn").click();

    await page
      .getByTestId("sign-up-error")
      .waitFor({ timeout: 30000, state: "visible" });
  });
});

test("Test sign in valid and invalid credentials", async ({ page }) => {
  await test.step("Sign in with invalid credentials", async () => {
    await page.goto("http://localhost:3000/en");
    await page.waitForURL("http://localhost:3000/en", {
      timeout: 10000,
      waitUntil: "domcontentloaded",
    });

    await page.goto("http://localhost:3000/en/auth/sign-in");

    await page
      .getByTestId("sign-in-email-input")
      .fill("john_doe8889@cartera.es");
    await page.getByTestId("sign-in-password-input").fill("Rt3$YiOO");
    await page.getByTestId("sign-in-btn").click();

    await page.getByTestId("sign-in-error").textContent;
  });

  await test.step("Sign in with valid credentials", async () => {
    await page.goto("http://localhost:3000/en");
    await page.waitForURL("http://localhost:3000/en", {
      timeout: 10000,
      waitUntil: "domcontentloaded",
    });

    await page.goto("http://localhost:3000/en/auth/sign-in");

    await page
      .getByTestId("sign-in-email-input")
      .fill("johndoe8889@cartera.es");
    await page.getByTestId("sign-in-password-input").fill("Rt3$YiOO");
    await page.getByTestId("sign-in-btn").click();

    await page.waitForURL("http://localhost:3000/en/dashboard");
  });
});
