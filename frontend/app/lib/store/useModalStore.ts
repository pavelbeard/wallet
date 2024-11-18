import { create } from "zustand";

type State = {
  isChangeEmailFormOpen: boolean;
};

type Action = {
  toggleChangeEmailForm: () => void;
};

export const useModalStore = create<State & Action>((set) => ({
  isChangeEmailFormOpen: false,
  toggleChangeEmailForm: () =>
    set((state) => ({
      ...state,
      isChangeEmailFormOpen: !state.isChangeEmailFormOpen,
    })),
}));

export default function useModals() {
  const isChangeEmailFormOpen = useModalStore(
    (state) => state.isChangeEmailFormOpen,
  );
  const toggleChangeEmailForm = useModalStore(
    (state) => state.toggleChangeEmailForm,
  );

  return {
    isChangeEmailFormOpen,
    toggleChangeEmailForm,
  };
}
