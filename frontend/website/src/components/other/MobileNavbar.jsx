import { Link } from "react-router-dom";

const MobileNavbar = ({
  navigation,
  isOpen,
  setIsOpen,
  instantClose,
  setInstantClose,
  navVisible,
}) => {
  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="safe fixed top-0 right-0 w-12 h-12 flex flex-col items-center justify-center gap-1.5 z-50"
        aria-label="Toggle navigation menu"
        onClick={() => {
          if (!isOpen) {
            setInstantClose(false);
          }
          setIsOpen(!isOpen);
        }}
      >
        <div
          className={`w-6 h-0.5 bg-white transition-transform ${
            instantClose ? "duration-0" : "duration-300"
          } ${isOpen ? "rotate-45 translate-y-2" : ""}`}
        />
        <div
          className={`w-6 h-0.5 bg-white transition-opacity ${
            instantClose ? "duration-0" : "duration-300"
          } ${isOpen ? "opacity-0" : ""}`}
        />
        <div
          className={`w-6 h-0.5 bg-white transition-transform ${
            instantClose ? "duration-0" : "duration-300"
          } ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
        />
      </button>

      {/* Mobile Navigation Menu */}
      <nav
        className={`safe w-full bg-brand-gray/90 backdrop-blur-sm border-b-2 border-brand-orange/50 transition-transform ${
          instantClose ? "duration-0" : "duration-300 ease-in-out"
        } ${isOpen ? "translate-y-0" : "-translate-y-full"} ${
          navVisible ? "opacity-100" : "opacity-0"
        } fixed top-0 left-0 right-0 z-40`}
      >
        <div className="mt-12">
          <div className="container mx-auto">
            <ul className="flex flex-col">
              {navigation.map(({ title, path }) => (
                <li
                  key={title}
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    setInstantClose(true);
                  }}
                >
                  <div className="mx-4 sm:mx-6 lg:mx-8">
                    <Link
                      to={path}
                      className="block text-lg py-3 transition-colors duration-200 hover:text-brand-orange border-b border-brand-orange/25"
                    >
                      {title}
                    </Link>
                  </div>
                </li>
              ))}
              <li
                className="w-full"
                onClick={() => {
                  setIsOpen(false);
                  setInstantClose(true);
                }}
              >
                <div className="mx-4 sm:mx-6 lg:mx-8">
                  <a
                    href={import.meta.env.VITE_CHROME_STORE_URL}
                    className="block text-lg py-3 transition-colors duration-200 hover:text-brand-orange"
                  >
                    Add to Chrome
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default MobileNavbar;
