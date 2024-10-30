import { Props } from "@/app/lib/types";
import { createContext, useContext, useState } from "react";
import useCheckDesktopScreen from "@/app/lib/hooks/useCheckDesktopScreen";

type NavBarContext = {
    isDesktopScreen: boolean
    isVisibleGlobal: boolean
    visibleGlobalTrue: () => void
    visibleGlobalFalse: () => void
}

const NavBarContext = createContext<NavBarContext>({} as NavBarContext);

export default function NavBarProvider({ children }: Props) {
    const isDesktopScreen = useCheckDesktopScreen();
    const [isVisibleGlobal, setIsVisibleGlobal] = useState(false);
    const visibleGlobalTrue = () => setIsVisibleGlobal(true);
    const visibleGlobalFalse = () => setIsVisibleGlobal(false);

    return (
        <NavBarContext.Provider value={{
            isDesktopScreen, isVisibleGlobal, visibleGlobalTrue, visibleGlobalFalse,

        }}>
            {children}
        </NavBarContext.Provider>
    );
}

export const useNavBarContext = () => {
    return useContext(NavBarContext);
}