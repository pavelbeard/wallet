import { RefObject } from "react";

export type DropdownMenuProps = {
  children?: ReactNode;
};

export type NavBarProps = {
  className?: string;
  children: ReactNode;
};

export type NavItemProps = {
  title: string;
  href?: string;
  isOnHeader?: boolean;
  isMenuRoot?: boolean;
  animationOrder?: number;
  onClick?: () => void;
  children?:
    | ReactElement<DropdownMenuProps>
    | ReactElement<DropdownMenuProps>[];
};

export enum VisibilityState {
  CLOSED = "closed",
  OPENING = "opening",
  OPENED = "opened",
  UPDATING = "updating",
}

export type InnerHeaderContextType = {
  isVisible: boolean;
};

export type OuterHeaderContextType = {
  visibilityState: VisibilityState;
  setVisibilityMain: Dispatch<SetStateAction<VisibilityState>>;
  dropdownMenuRef: RefObject<T>;
  sidebarMenuRef: RefObject<T>;
};

export type DesktopMenuItem = {
  title: string;
  isOnHeader?: boolean;
  isMenuRoot?: boolean;
  href?: string;
  children?: DesktopMenuItem[];
};
