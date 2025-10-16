import { steps } from "@data/pageData";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="mt-4 text-xl text-gray-300">
            Get started in just three simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <div className="text-center" key={index}>
              <div className="relative mx-auto w-24 h-24 bg-brand-gray-icon rounded-full flex items-center justify-center mb-6 border border-gray-800">
                <span className="text-brand-orange text-4xl font-bold">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3">{item.step}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
