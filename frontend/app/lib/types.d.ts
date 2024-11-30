import React, { ReactNode } from "react";
import { UseFormRegister } from "react-hook-form";

// style and ui
export type InputProps = {
  labelText: string;
  htmlFor: string;
  name: string;
  id: string;
};

export type InputPropsWithRegister = {
  labelText?: string;
  placeholder?: string;
  htmlFor: string;
  name: string;
  register: UseFormRegister;
  id: string;
  disabled?: boolean;
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
};

export type UserMenuItem = {
  icon: ReactNode;
  title: string;
  url: string;
  fontBold?: boolean;
};

// data

export type ToggleActiveItem = (index: number) => void;

export type TOTPData = { config_key: string; detail?: string };

export type AuthData = {
  access_token: string | undefined;
  access_token_exp: number | undefined;
  refresh_token: string | undefined;
  expires_at: number | undefined;
};

export type Awaitable<T> = T | PromiseLike<T>;
