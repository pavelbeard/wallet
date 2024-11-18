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

export default useBurgerMenuStore;
