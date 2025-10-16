import { testimonials } from "@data/pageData";

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-16 bg-brand-gray-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">What Users Say</h2>
          <p className="mt-4 text-xl text-gray-300">
            Join developers worldwide who've improved their coding skills
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-brand-gray-icon rounded-2xl p-6 shadow-lg border border-gray-800"
            >
              <div className="flex items-center mb-4">
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-300">{testimonial.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
