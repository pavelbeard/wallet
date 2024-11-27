import { DesktopMenuItem } from "@/app/lib/types/header";

const MENU: DesktopMenuItem[] = [
  {
    title: "Why is Cartera?",
    isOnHeader: true,
  },
  {
    title: "Advantages",
    isOnHeader: true,
    children: [
      {
        title: "First one",
        isMenuRoot: true,
        children: [
          {
            title: "Because we are strong!",
          },
          {
            title: "And ferries!",
          },
        ],
      },
      {
        title: "Second one",
        isMenuRoot: true,
        children: [
          {
            title: "Because we are robust!",
          },
          {
            title: "And penguins!",
          },
        ],
      },
      {
        title: "Next?",
        isMenuRoot: true,
        children: [
          {
            title: "What will be next?",
          },
          {
            title: "I don't know...",
          },
          {
            title: "You're sure?",
          },
        ],
      },
    ],
  },
  {
    title: "Passwords",
    isOnHeader: true,
    children: [
      {
        title: "Create new password",
        isMenuRoot: true,
      },
    ],
  },
];

export { MENU };
