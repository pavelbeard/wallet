import { useEffect, useState } from "react";

export default function useCheckDesktopScreen() {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const changeDesktop = () => {
            setIsDesktop(window.innerWidth > 768);
        }

        addEventListener('resize', changeDesktop);

        return () => {
            removeEventListener('resize', changeDesktop);
        }
    }, [isDesktop]);

    return isDesktop;
}