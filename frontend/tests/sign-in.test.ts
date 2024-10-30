import { test } from "@playwright/test";

test("Basic auth", async ({ page, browser }) => {
  const username = "heavycream9090@icloud.com";
  const password = "Rt3$YiOO";

  await test.step("should login", async () => {
    await page.goto("http://localhost:3000/es/auth/sign-in");
    await page.getByText("Correo electrónico:").waitFor();
    await page.getByLabel("Correo electrónico:").fill(username);
    await page.getByText("Contraseña:").waitFor();
    await page.getByLabel("Contraseña:").fill(password);

    await page.getByRole("button", { name: "Entrar", exact: true}).click();

    await page.waitForURL("http://localhost:3000/es/dashboard")

  });
});
