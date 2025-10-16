import { features } from "@data/pageData";

const Features = () => {
  return (
    <section id="features" className="py-16 bg-brand-gray-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Powerful Features</h2>
          <p className="mt-4 text-xl text-gray-300">
            Everything you need to ace your coding interviews
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ feature, description, icon: Icon }) => (
            <div
              key={feature}
              className="bg-brand-gray-icon rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-800"
            >
              <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center mb-6">
                <Icon className="h-6 w-6 text-brand-orange" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature}</h3>
              <p className="text-gray-300">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
