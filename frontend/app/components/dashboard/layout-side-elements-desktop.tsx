import { LayoutLogo } from "@/app/ui/layout-logo";
import TopBar from "./top-bar";
import SideBar from "./side-bar";

export default function LayoutSideElementsDesktop() {
  return (
    <>
      <LayoutLogo />
      <TopBar />
      <SideBar />
    </>
  );
}
