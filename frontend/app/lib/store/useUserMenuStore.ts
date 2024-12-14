import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

type State = {
  isOpenDesktop: boolean;
  isOpenMobile: boolean;
};

type Action = {
  toggleOpenDesktop: () => void;
  toggleOpenMobile: () => void;
  closeDesktop: () => void;
  closeMobile: () => void;
};

const useUserMenuStore = create<State & Action>((set) => ({
  isOpenDesktop: false,
  toggleOpenDesktop: () =>
    set((state) => ({ ...state, isOpenDesktop: !state.isOpenDesktop })),
  closeDesktop: () => set((state) => ({ ...state, isOpenDesktop: false })),
  isOpenMobile: false,
  toggleOpenMobile: () =>
    set((state) => ({ ...state, isOpenMobile: !state.isOpenMobile })),
  closeMobile: () => set((state) => ({ ...state, isOpenMobile: false })),
}));

if (process.env.NODE_ENV !== "production") {
  mountStoreDevtool("useUserMenuStore", useUserMenuStore);
}

export default useUserMenuStore;
