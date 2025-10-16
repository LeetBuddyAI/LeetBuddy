import { faqItems, faqPlaceholders } from "@data/pageData";
import { highlightLinks } from "@utilities/utilities";

const FAQ = () => {
  return (
    <section className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="bg-brand-gray-icon rounded-2xl p-6 shadow-lg border border-gray-800"
          >
            <h3 className="text-xl font-bold mb-3">{item.question}</h3>
            <p className="text-gray-300">
              {highlightLinks(item.answer, faqPlaceholders).map((part, i) =>
                part.isLink ? (
                  <a
                    key={i}
                    href={part.href}
                    className="text-brand-orange hover:underline"
                    {...(part.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {part.text}
                  </a>
                ) : (
                  <span key={i}>{part.text}</span>
                )
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
