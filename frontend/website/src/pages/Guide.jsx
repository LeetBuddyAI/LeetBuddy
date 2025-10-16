import Intro from "@components/guide/Intro";
import Interaction from "@components/guide/Interaction";
import Examples from "@components/guide/Examples";
import Tips from "@components/guide/Tips";
import FAQ from "@components/guide/FAQ";
import CTA from "@components/guide/CTA";
import { useScreenSize } from "@hooks/useScreenSize";
import { usePageMeta } from "@hooks/usePageMeta";
import { pageMeta } from "@data/pageData";

const Guide = () => {
  const isLargeScreen = useScreenSize();
  usePageMeta(pageMeta.guide);

  return (
    <main
      className={`pb-16 container space-y-16 mx-auto px-4 sm:px-6 lg:px-8 ${
        isLargeScreen ? "pt-32" : "pt-16"
      }`}
    >
      <Intro />
      <Interaction />
      <Examples />
      <Tips />
      <FAQ />
      <CTA />
    </main>
  );
};

export default Guide;
