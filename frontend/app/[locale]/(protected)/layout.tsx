import Header from "@/app/components/header/header";
import HeaderProvider from "@/app/components/header/header-provider";
import { Props } from "@/app/lib/types";
import LayoutContainer from "@/app/ui/layout-container";

export default async function Layout({ children }: Props) {
  return (
    <LayoutContainer color="dashboard-bg">
      <HeaderProvider>
        <Header />
      </HeaderProvider>
      {children}
    </LayoutContainer>
  );
}
