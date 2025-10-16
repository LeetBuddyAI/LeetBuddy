import Hero from "@components/home/Hero";
import Features from "@components/home/Features";
import HowItWorks from "@components/home/HowItWorks";
import Mission from "@components/home/Mission";
import Companies from "@components/home/Companies";
import Testimonials from "@components/home/Testimonials";
import CTA from "@components/home/CTA";
import { usePageMeta } from "@hooks/usePageMeta";
import { pageMeta } from "@data/pageData";

const Home = () => {
  usePageMeta(pageMeta.home);
  const videoUrl = import.meta.env.VITE_VIDEO_URL;

  return (
    <main>
      <Hero videoUrl={videoUrl} />
      <Features />
      <HowItWorks />
      <Mission />
      <Companies />
      <Testimonials />
      <CTA />
    </main>
  );
};

export default Home;
