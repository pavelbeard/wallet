import { useState } from "react";

/**
 * Manages a state of the menu, allows to be open to only on menu item.
 */
export default function useActiveMenuItem() {
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const handleToggle = (index: number): void => {
    setActiveItem((prevState) => {
      if (prevState == index) {
        return null;
      } else {
        return index;
      }
    });
  };

  return { activeItem, handleToggle };
}
