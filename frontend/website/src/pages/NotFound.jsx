import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";
import { useScreenSize } from "@hooks/useScreenSize";
import { usePageMeta } from "@hooks/usePageMeta";
import { pageMeta } from "@data/pageData";

const NotFound = () => {
  const isLargeScreen = useScreenSize();
  usePageMeta(pageMeta.notFound);

  return (
    <main className="responsive-404-height">
      <div
        className={`flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 ${
          isLargeScreen ? "pt-32" : "pt-16"
        } pb-16`}
      >
        <div className="text-center w-full max-w-2xl mx-auto">
          {/* Icon and 404 Display */}
          <div className="mb-8 sm:mb-10">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-brand-orange/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-brand-orange" />
              </div>
            </div>
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold text-brand-orange">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8 sm:mb-10 space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Page Not Found
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. Let's
              get you back on track.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link
              to="/"
              className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orange-hover text-black font-medium px-6 py-3 rounded-lg inline-flex items-center justify-center transition-colors"
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
            <Link
              to="/guide"
              className="w-full sm:w-auto bg-brand-gray-icon hover:bg-brand-gray-icon-secondary text-white font-medium px-6 py-3 rounded-lg inline-flex items-center justify-center transition-colors border border-gray-700"
            >
              View Guide
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
