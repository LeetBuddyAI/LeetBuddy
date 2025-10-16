import { useState, useEffect } from "react";

export const useNavVisibility = (transitionDuration = 300) => {
  const [isOpen, setIsOpen] = useState(false);
  const [instantClose, setInstantClose] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Show nav immediately when opening
      setNavVisible(true);
    } else {
      // Hide after transition (or instantly if instantClose is true)
      const timeout = setTimeout(
        () => {
          setNavVisible(false);
        },
        instantClose ? 0 : transitionDuration
      );
      return () => clearTimeout(timeout);
    }
  }, [isOpen, instantClose, transitionDuration]);

  return {
    isOpen,
    setIsOpen,
    instantClose,
    setInstantClose,
    navVisible,
  };
};
