import { useEffect, useRef } from "react";

type Event = MouseEvent | TouchEvent;

export default function useClickOutside(callback: () => void) {
  const ref = useRef<HTMLElement>(null);

  const listener = (e: Event) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {      
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [callback]);

  return ref;
}
