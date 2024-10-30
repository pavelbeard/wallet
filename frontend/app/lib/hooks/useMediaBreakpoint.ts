import { useCallback, useEffect, useState } from "react";

export default function useMediaBreakpoint(width: number) {
  const [targetReached, setTargetReached] = useState(false);
  const updateTarget = useCallback((e: MediaQueryListEvent) => {
    setTargetReached(e.matches);
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${width}px)`);
    media.addEventListener("change", updateTarget);

    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeEventListener("change", updateTarget);
  }, []);

  return targetReached;
}
