import { Link } from "react-router-dom";

const DesktopNavbar = ({ navigation }) => {
  return (
    <div className="h-full container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-3 items-center h-full">
        <div className="justify-self-start">
          <Link to="/">
            <img
              src="/LeetBuddyLogo.svg"
              alt="LeetBuddy Logo"
              className="h-10 translate-y-[-1px]"
            />
          </Link>
        </div>

        <nav aria-label="Main navigation" className="justify-self-center">
          <ul className="flex gap-x-12 text-lg">
            {navigation.map(({ title, path }) => (
              <li key={title}>
                <Link to={path} className="redirect">
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="justify-self-end">
          <a
            href={import.meta.env.VITE_CHROME_STORE_URL}
            className="bg-brand-orange text-black font-medium px-4 py-2 rounded-lg"
          >
            Add to Chrome
          </a>
        </div>
      </div>
    </div>
  );
};

export default DesktopNavbar;
