import { links } from "@data/pageData";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-gray-800 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col text-center md:flex-row md:justify-between md:items-center md:text-left">
          <div className="mb-6 md:mb-0">
            <span className="text-xl font-bold text-brand-orange">
              LeetBuddy
            </span>
            <p className="mt-2 text-gray-400">
              Your AI-Powered LeetCode Assistant
            </p>
          </div>
          <nav aria-label="Footer links">
            <ul className="flex flex-wrap items-center justify-center gap-8">
              {links.map(({ title, url, target, rel, aria }) => (
                <li key={title}>
                  <a
                    href={url}
                    target={target}
                    rel={rel}
                    className="redirect"
                    aria-label={aria}
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>An RSFN Production.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
