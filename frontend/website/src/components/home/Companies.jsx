import { companyLogos } from "@data/pageData";
import { useMarquee } from "@hooks/useMarquee";

const Companies = () => {
  const { containerRef, scrollRef } = useMarquee();

  return (
    <section className="py-16 bg-brand-gray overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Where Our Users Work
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            Trusted by engineers at top companies worldwide
          </p>
        </div>

        <div className="relative w-full overflow-hidden" ref={containerRef}>
          <div className="absolute left-0 top-0 h-full w-16 sm:w-20 md:w-24 bg-gradient-to-r from-brand-gray to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-16 sm:w-20 md:w-24 bg-gradient-to-l from-brand-gray to-transparent z-10 pointer-events-none" />
          <div
            ref={scrollRef}
            className="flex items-center"
            style={{
              width: "fit-content",
              willChange: "transform",
            }}
          >
            {[...companyLogos, ...companyLogos].map((logo, index) => (
              <div
                key={index}
                className="shrink-0 px-5 md:px-6 lg:px-8 xl:px-9"
              >
                <img
                  src={logo.src}
                  alt={`${logo.name} logo`}
                  className="h-12 w-auto"
                  loading="eager"
                  draggable="false"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Companies;
