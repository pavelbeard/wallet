import clsx from "clsx";

type Props = { isBurgerOpen: boolean; toggleBurgerMenu: () => void };

export default function BurgerButtonMenu({
  isBurgerOpen,
  toggleBurgerMenu,
}: Props) {
  return (
    <div className="lg:hidden flex isolate items-center gap-6 z-50">
      <button
        aria-label="burger navigation menu"
        aria-expanded={isBurgerOpen}
        role="button"
        className="h-5 w-full flex flex-col items-center justify-center"
        onClick={toggleBurgerMenu}
        data-state={isBurgerOpen ? "open" : "closed"}
      >
        <span
          className={clsx(
            "burger-menu",
            isBurgerOpen ? "up opened" : "up closed",
          )}
        ></span>
        <span
          className={clsx(
            "burger-menu",
            isBurgerOpen ? "middle opened" : "middle closed",
          )}
        ></span>
        <span
          className={clsx(
            "burger-menu",
            isBurgerOpen ? "down opened" : "down closed",
          )}
        ></span>
      </button>
    </div>
  );
}
