import {
  InnerHeaderContextType,
  OuterHeaderContextType,
} from "@/app/lib/types/header/index.d";
import { createContext, useContext } from "react";

export const InnerHeaderContext = createContext<InnerHeaderContextType | null>(
  null,
);
export const OuterHeaderContext = createContext<OuterHeaderContextType | null>(
  null,
);

export const useInnerHeaderContext = () => {
  const ctx = useContext<InnerHeaderContextType | null>(InnerHeaderContext);
  if (!ctx) {
    throw new Error(
      "useVisibilityContext has to be used within <VisibilityContext.Provider>",
    );
  }

  return ctx;
};

export const useOuterHeaderContext = () => {
  const ctx = useContext<OuterHeaderContextType | null>(OuterHeaderContext);
  if (!ctx) {
    throw new Error(
      "useVisibilityMainContext has to be used within <VisibilityMainContext.Provider>",
    );
  }

  return ctx;
};
