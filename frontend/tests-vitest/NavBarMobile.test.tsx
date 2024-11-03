import NavBarRoot from "@/app/components/header/nav-bar-root";
import { NavBarItem } from "@/app/lib/types";
import es from "@/messages/es.json";
import { fireEvent, render, screen } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, expect, test, vi } from "vitest";

test("should be in the screen after closing...", async () => {
  afterEach(() => vi.restoreAllMocks());

  vi.mock("../app/lib/hooks/useDesktopBreakpoint.ts", async (importOriginal) => {
    const actual: object = await importOriginal();
    return {
      ...actual,
      useDesktopBreakpoint: vi.fn(() => false),
    }
  });

  const menu: NavBarItem[] = [
    {
      title: "Por qué Cartera",
      subMenu: [
        {
          title: "Ventajas",
          url: "/advantages",
          subMenu: [
            {
              title: "Change password",
              url: "/change-password",
            },
            {
              title: "Create password",
              url: "/create-password",
            },
          ],
        },
        {
          title: "Cards",
          subMenu: [
            {
              title: "New card",
              url: "/new-card",
            },
          ],
        },
        {
          title: "About",
        },
      ],
    },
    {
      title: "Seguridad",
      subMenu: [
        {
          title: "Como nos preocupamos",
          url: "/how-we-worry-about",
        },
      ],
    },
  ];

  render(
    <SessionProvider>
      <NextIntlClientProvider locale="es" messages={es}>
        <NavBarRoot position="center" menu={menu} />
      </NextIntlClientProvider>
    </SessionProvider>,
  );

  const why = await screen.findAllByRole("button");

  const whyFirst = screen.getByTestId("Por qué Cartera");

  expect(whyFirst);

  fireEvent.click(whyFirst);

  const closeBtn = screen.getByTestId("dropdown-submenu-mobile");

  expect(closeBtn).toBe(closeBtn);
  fireEvent.click(closeBtn);

  const security = screen.getByText("Seguridad");
  expect(security).toBe(security);

  const whySecond = screen.getByTestId("Por qué Cartera");
  expect(whySecond).toBe(whySecond);

  console.log(why);
});
