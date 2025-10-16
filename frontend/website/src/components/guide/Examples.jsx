import { examples } from "@data/pageData";

const Examples = () => {
  return (
    <section className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Example Prompts</h2>
      <p className="text-center text-gray-300 mb-8">
        Here are some effective ways to interact with LeetBuddy:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {examples.map((item, index) => (
          <div
            key={index}
            className="bg-brand-gray-icon rounded-2xl p-5 shadow-lg border border-gray-800 h-full flex items-center"
          >
            <div className="flex items-center">
              <div className="shrink-0 mr-4">
                <item.icon className="h-6 w-6 text-brand-orange" />
              </div>
              <div className="flex items-center">
                <p className="text-gray-300 leading-normal">{item.example}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Examples;
