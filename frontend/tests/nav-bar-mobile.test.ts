import { expect, test } from "@playwright/test";

// DEPRECATED

test("Mobile menu", async ({ browser }) => {
  const ctx = await browser.newContext();
  ctx.addCookies([
    { name: "NEXT_LOCALE", value: "es", url: "http://localhost:3000" },
  ]);
  const page = await ctx.newPage();

  await test.step("Is it appearing in webkit?", async () => {
    await page.goto("http://localhost:3000/es");
    await page.waitForURL("http://localhost:3000/es");

    await page.getByTestId("burger-menu-btn").click();

    expect(await page.getAttribute("//html/body", "style")).toContain(
      "overflow: hidden",
    );

    const dropdownMobile = page.locator("#dropdown-mobile");
    expect(dropdownMobile).toBeTruthy();

    const menuItems = await page.getByTestId("mobile-item").all();

    expect(menuItems.at(0)?.isVisible()).toBeTruthy();

    const btn = menuItems.at(0)?.getByTestId("dropdown-submenu-mobile");

    expect(btn?.isVisible).toBeTruthy();
  });
});
