import { useEffect, useRef, useState } from "react";

export default function useDebounce({
  callback,
  value,
  delay,
  dependencies,
}: {
  callback?: () => void;
  value?: unknown;
  delay: number;
  dependencies: any[];
}) {
  const [debouncedValue, setDebouncedValue] = useState(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (callback) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(callback, delay);
    }

    if (value) {
      timerRef.current = setTimeout(() => {
        setDebouncedValue(value as any);
      }, delay);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, dependencies);

  return debouncedValue;
}
