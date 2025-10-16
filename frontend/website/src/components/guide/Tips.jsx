import { Lightbulb } from "lucide-react";
import { tips, tipsKeywords } from "@data/pageData";
import { highlightKeywords } from "@utilities/utilities";

const Tips = () => {
  return (
    <section className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Tips for Better Results
      </h2>
      <div className="bg-brand-gray-icon rounded-2xl p-8 shadow-lg border border-gray-800">
        <ul className="space-y-6">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-center">
              <div className="shrink-0 mr-4">
                <div className="w-8 h-8 bg-brand-orange/10 rounded-full flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-brand-orange" />
                </div>
              </div>
              <div>
                <p className="text-gray-300">
                  {highlightKeywords(tip.text, tipsKeywords).map((part, i) =>
                    part.isKeyword ? (
                      <span key={i} className="text-brand-orange font-medium">
                        {part.text}
                      </span>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Tips;
