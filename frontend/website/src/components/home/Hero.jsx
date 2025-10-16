import { Chrome } from "lucide-react";

const Hero = ({ videoUrl }) => {
  return (
    <section className="hero-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row items-center gap-12">
          <div className="xl:w-2/5 space-y-4 text-center xl:text-left">
            <h1 className="text-4xl xl:text-6xl font-bold leading-tight space-y-4">
              <span className="block">LeetBuddy</span>
              <span className="block text-gray-300 text-2xl xl:text-4xl leading-snug">
                Your AI-Powered LeetCode Assistant
              </span>
            </h1>
            <p className="text-lg xl:text-xl text-gray-300">
              Get real-time hints, explanations, and edge cases while you code.
            </p>
            <div className="pt-8 flex justify-center xl:justify-start">
              <a
                href={import.meta.env.VITE_CHROME_STORE_URL}
                className="bg-brand-orange hover:bg-brand-orange-hover text-black font-medium px-4 py-2.5 xl:px-5 xl:py-3 rounded-lg text-base xl:text-lg inline-flex items-center transition-colors"
              >
                <Chrome className="mr-2" /> Add to Chrome
              </a>
            </div>
          </div>
          <video
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="relative xl:w-3/5 rounded-2xl overflow-hidden w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
