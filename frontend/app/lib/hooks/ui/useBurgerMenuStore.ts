import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

type State = {
  isBurgerOpen: boolean;
};

type Action = {
  setIsBurgerOpen: (payload: boolean) => void;
};

const useBurgerMenuStore = create<State & Action>((set) => ({
  isBurgerOpen: false,
  setIsBurgerOpen: (payload) => set(() => ({ isBurgerOpen: payload })),
}));

if (process.env.NODE_ENV !== "production") {
  mountStoreDevtool("useBurgerMenuStore", useBurgerMenuStore);
}

export default useBurgerMenuStore;
