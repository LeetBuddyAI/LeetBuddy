import { useScreenSize } from "@hooks/useScreenSize";
import { useNavVisibility } from "@hooks/useNavVisibility";
import { navigation } from "@data/pageData";
import DesktopNavbar from "@components/other/DesktopNavbar";
import MobileNavbar from "@components/other/MobileNavbar";

const Header = () => {
  const isLargeScreen = useScreenSize();
  const { isOpen, setIsOpen, instantClose, setInstantClose, navVisible } =
    useNavVisibility();

  return (
    <header
      className={`absolute top-0 left-0 right-0 z-50 ${
        isLargeScreen ? "h-16 border-b border-gray-800" : ""
      }`}
    >
      {isLargeScreen ? (
        <DesktopNavbar navigation={navigation} />
      ) : (
        <MobileNavbar
          navigation={navigation}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          instantClose={instantClose}
          setInstantClose={setInstantClose}
          navVisible={navVisible}
        />
      )}
    </header>
  );
};

export default Header;
