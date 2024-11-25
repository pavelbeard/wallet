import { useEffect } from "react";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

type State = {
  isOverflowHidden: boolean;
};

type Action = {
  toggleOverflow: () => void;
  setOverflowHidden: () => void;
  setOverflowAuto: () => void;
};

export const useOverflowControlStore = create<State & Action>((set) => ({
  isOverflowHidden: false,
  toggleOverflow: () =>
    set((state) => ({ ...state, isOverflowHidden: !state.isOverflowHidden })),
  setOverflowHidden: () =>
    set((state) => ({ ...state, isOverflowHidden: true })),
  setOverflowAuto: () =>
    set((state) => ({ ...state, isOverflowHidden: false })),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("useOverflowControlStore", useOverflowControlStore);
}

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

export function useOverflow() {
  const { isOverflowHidden, setOverflowAuto, setOverflowHidden } =
    useOverflowControlStore(
      useShallow((state) => ({
        setOverflowAuto: state.setOverflowAuto,
        setOverflowHidden: state.setOverflowHidden,
        isOverflowHidden: state.isOverflowHidden,
      })),
    );

  return { isOverflowHidden, setOverflowAuto, setOverflowHidden };
}
