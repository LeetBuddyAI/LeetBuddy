import { interaction } from "@data/pageData";

const Interaction = () => {
  return (
    <section className="max-w-6xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-center">Modes of Interaction</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {interaction.map((mode, index) => (
          <div
            key={index}
            className="flex flex-col h-full bg-brand-gray-icon rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-800"
          >
            <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center mb-6">
              <mode.icon className="h-6 w-6 text-brand-orange" />
            </div>
            <div className="grow">
              <h3 className="text-xl font-bold mb-3">{mode.title}</h3>
              <p className="text-gray-300">{mode.description}</p>
            </div>
            <div className="mt-4 p-3 bg-brand-gray-icon-secondary rounded-lg">
              <div className="flex items-center">
                <div className="shrink-0 mr-3">
                  <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center text-black font-bold">
                    <mode.exampleIcon className="h-4 w-4 block" />
                  </div>
                </div>
                <p className="text-sm text-gray-300 italic">"{mode.example}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Interaction;
