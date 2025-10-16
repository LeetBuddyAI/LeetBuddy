const Mission = () => {
  return (
    <section id="mission" className="py-16 bg-brand-gray-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
          <p className="mt-4 text-xl text-gray-300">
            Making interview prep smarter, fairer, and free for all.
          </p>
        </div>
        <div className="mt-12 max-w-4xl mx-auto text-gray-300 text-lg leading-relaxed">
          <p>
            We started LeetBuddy because we've been through the grind, spending
            countless hours on LeetCode, confused by edge cases, switching
            between tutorials and AI tools that never truly understood our
            context. Most solutions were locked behind paywalls or felt
            disconnected from how real prep happens. So we built what we always
            needed: a Chrome extension that reads your LeetCode problem in real
            time, understands where you're stuck, and gives you clear, tailored
            help instantly. And we made it completely free, because we believe
            every developer deserves the chance to succeed, not just the ones
            who can afford it.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Mission;
