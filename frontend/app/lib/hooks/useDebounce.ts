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
  dependencies: unknown[];
}) {
  const [debouncedValue, setDebouncedValue] = useState<unknown | null>(null);
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
        setDebouncedValue(value);
      }, delay);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);

  return debouncedValue;
}
