import React, { ReactNode } from "react";

// style and ui
export type InputProps = {
  labelText: string;
  htmlFor: string;
  name: string;
  id: string;
};
export type Color = "container-bg" | "auth-bg" | "dashboard-bg" | "error-bg";
export type Props = { children: React.ReactNode };
export type LayoutProps = Props & { color: Color };
export type LangProps = { params: { lang: string } };
export type NavBarItem = {
  title: string;
  url?: string;
  subMenu?: NavBarItem[];
};
export type NavBarItems = NavBarItem[];
export type NavBarItemLevel = { level: number };
export type SideBarItem = {
  title: string;
  url: string;
  icon: ReactNode;

}

// data
