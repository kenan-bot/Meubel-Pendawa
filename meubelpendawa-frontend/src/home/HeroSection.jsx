import HeroContent from "./HeroContent";
import HomeImage from "./HeroImage";
import BrandSection from "./BrandSection";
import AnimatedSection from "../components/AnimatedSection";

function HeroSection() {
  return (
    <section
    id="home"
    className="max-w-7xl mx-auto py-16 px-6">

      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

        {/* LEFT - TEXT */}
        <AnimatedSection className="mt-8 md:8 lg:mt-8">
          <HeroContent />
        </AnimatedSection>

        {/* RIGHT - IMAGE */}
        <AnimatedSection delay={0.2} className="flex flex-col items-center gap-0 lg:mr-12 lg:mt-15">
          <HomeImage />
          <BrandSection />
        </AnimatedSection>
      </div>

    </section>
  );
}

export default HeroSection;