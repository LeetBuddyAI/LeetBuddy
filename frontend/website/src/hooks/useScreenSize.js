import { useState, useEffect } from "react";

export const useScreenSize = (minWidth = 768, minHeight = 480) => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const isLarge =
        window.innerWidth >= minWidth && window.innerHeight >= minHeight;
      setIsLargeScreen(isLarge);
    };

    // Initial check
    checkScreenSize();

    // Add resize listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [minWidth, minHeight]);

  return isLargeScreen;
};
