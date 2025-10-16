import { Sparkles } from "lucide-react";

const Intro = () => {
  return (
    <section className="max-w-3xl mx-auto text-center space-y-8">
      <h1 className="text-4xl md:text-5xl font-bold">
        Getting Started with LeetBuddy
      </h1>
      <div className="bg-brand-gray-icon rounded-2xl p-8 shadow-lg border border-gray-800">
        <p className="text-xl text-gray-300 leading-relaxed">
          LeetBuddy helps you solve{" "}
          <a
            href="https://leetcode.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-orange hover:underline"
          >
            LeetCode
          </a>{" "}
          problems with AI-powered assistance. Both Chat mode and the
          interactive Whiteboard are powered by{" "}
          <a
            href="https://gemini.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-orange hover:underline"
          >
            Gemini AI
          </a>
          , giving you support as you code.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center bg-brand-orange/10 px-4 py-2 rounded-lg">
            <Sparkles className="h-5 w-5 text-brand-orange mr-2" />
            <span className="text-brand-orange font-medium">
              AI-powered coding assistant
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
