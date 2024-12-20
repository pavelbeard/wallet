import { useCallback, useEffect, useRef } from "react";

type Event = MouseEvent | TouchEvent;

export default function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void,
) {
  const ref = useRef<T>(null);

  const listener = useCallback(
    (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    },
    [callback],
  );

  useEffect(() => {
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [listener]);

  return ref;
}
