import Page from "@/app/[locale]/(public)/page";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test("should render the home page", async () => {
  // @ts-ignore
  render(async () => await Page({ params: { locale: "es" } }));

  const signInText = screen.getByRole("heading", { level: 1 });
  expect(signInText.innerText).toContain("Ir a iniciar sesión");
});
