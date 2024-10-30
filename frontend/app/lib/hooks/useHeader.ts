import { useCallback, useState } from "react";

export default function useNavBar() {
    const [openMenus, setOpenMenus] = useState<Record<number, string | null>>({});

    const isVisible = useCallback((level: number, title: string) => {
        return openMenus[level] === title;
    }, [openMenus]);

    const changeVisibility = useCallback((level: number, title: string) => {
        setOpenMenus(prevState => ({
            ...prevState,
            [level]: prevState[level] === title ? null : title }));
    }, []);

    return { visibility: isVisible, changeVisibility };
}