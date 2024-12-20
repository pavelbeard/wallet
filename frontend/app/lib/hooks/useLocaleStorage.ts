import { useState } from "react";

export default function useLocaleStorage(
  key: string,
  initialValue: string | null,
) {
  const [data, setData] = useState(localStorage.getItem(key) || initialValue);

  const setDataLocalStorage = (value: string) => {
    localStorage.setItem(key, value);
    setData(value);
  };

  return [data, setDataLocalStorage];
}
