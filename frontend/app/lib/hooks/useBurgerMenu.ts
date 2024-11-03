import { useEffect, useState } from "react";

export default function useBurgerMenu() {
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);
    const toggleBurgerMenu = () => setIsBurgerOpen(!isBurgerOpen);

    useEffect(() => {
        const listenWindowWidth = () => {
            if (window.innerWidth > 768) setIsBurgerOpen(false);
         }

        addEventListener('resize', listenWindowWidth);

        return () => {
            window.removeEventListener('resize', listenWindowWidth);
        }
    });

    return {
        isBurgerOpen,
        toggleBurgerMenu,
        setIsBurgerOpen // in very rare cases it need to use
    }
}