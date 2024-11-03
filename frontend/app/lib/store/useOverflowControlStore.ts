import { useEffect } from "react";
import { create } from "zustand";

type State = {
  isOverflowHidden: boolean;
};

type Action = {
  toggleOverflow: () => void;
};

const useOverflowControlStore = create<State & Action>((set) => ({
  isOverflowHidden: false,
  toggleOverflow: () =>
    set((state) => ({ ...state, isOverflowHidden: !state.isOverflowHidden })),
}));

export function useEffectOverflow() {
  const isOverflowHidden = useOverflowControlStore(
    (state) => state.isOverflowHidden,
  );

  useEffect(() => {
    document.body.style.overflow = isOverflowHidden ? "hidden" : "auto";
  }, [isOverflowHidden]);
}

export function useToggleOverflow() {
  const toggleOverflow = useOverflowControlStore(
    (state) => state.toggleOverflow,
  );
  return toggleOverflow;
}
