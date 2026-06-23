import HeroContent from "./HeroContent";
import HomeImage from "./HeroImage";
import BrandSection from "./BrandSection";

function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto py-16 px-6">

      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

        {/* LEFT - TEXT */}
        <HeroContent />

        {/* RIGHT - IMAGE */}
        <div className="flex flex-col items-center lg:items-end gap-4">
          <HomeImage />
          <BrandSection />
        </div>
      </div>

    </section>
  );
}

export default HeroSection;