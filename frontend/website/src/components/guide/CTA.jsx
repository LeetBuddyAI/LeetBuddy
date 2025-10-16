import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-brand-gray-icon to-brand-gray-icon-secondary rounded-2xl p-8 shadow-xl border border-gray-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-2/3">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to supercharge your LeetCode practice?
            </h2>
            <p className="text-gray-300 text-lg">
              Install LeetBuddy now and start solving problems more efficiently.
            </p>
          </div>
          <div>
            <a
              href={import.meta.env.VITE_CHROME_STORE_URL}
              className="bg-brand-orange hover:bg-brand-orange-hover text-black font-medium px-6 py-3 rounded-lg text-lg inline-flex items-center transition-colors"
            >
              Add to Chrome <ArrowRight className="ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
