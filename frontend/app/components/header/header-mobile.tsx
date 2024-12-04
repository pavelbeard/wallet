import { WalletUser } from "@/auth";
import BurgerMenu from "./burger-menu";
import BurgerButtonMenu from "./burger-menu-btn";
import LogoHeader from "./logo-header";

export default function HeaderMobile({
  sidebarMenuRef,
  sidebarSection,
  toggleSidebarSection,
  isBurgerOpen,
  toggleBurgerMenu,
  user,
}: {
  sidebarMenuRef: React.RefObject<HTMLDivElement>;
  sidebarSection: string | null;
  toggleSidebarSection: (section: string) => void;
  isBurgerOpen: boolean;
  toggleBurgerMenu: () => void;
  user: WalletUser | undefined;
}) {
  return (
    <>
      <LogoHeader className="flex flex-grow basis-0 items-center" />

      <BurgerButtonMenu
        isBurgerOpen={isBurgerOpen}
        toggleBurgerMenu={toggleBurgerMenu}
        data-testid="burger-button-menu"
      />

      {isBurgerOpen && (
        <BurgerMenu
          sidebarMenuRef={sidebarMenuRef}
          user={user}
          sidebarSection={sidebarSection}
          toggleSidebarSection={toggleSidebarSection}
          data-testid="burger-menu"
        />
      )}
    </>
  );
}
