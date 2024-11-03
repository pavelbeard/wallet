import getUser from "@/app/lib/getUser";
import { LayoutLogo } from "@/app/ui/layout-logo";
import UserInfo from "../user/user-info";
import SideBar from "./side-bar";

type Props = {};

export default async function LayoutSideElementsDesktop({}: Props) {
  const user = await getUser();
  return (
    <>
      <LayoutLogo />
      <UserInfo user={user} />
      <SideBar />
    </>
  );
}
