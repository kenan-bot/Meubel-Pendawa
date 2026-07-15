import Card from "../components/Card";
import modernImg from "../assets/modernImg.svg";
import luxuryImg from "../assets/luxuryImg.svg";

function HeroContent() {
  return (
    <div className="flex-1 text-white px-4 sm:px-6 lg:pl-20 max-w-sm sm:max-w-md lg:max-w-xl mt-10">
      {/* tag */}
      <span className="bg-orange-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-semibold">
        Furniture
      </span>

      {/* title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-2 leading-tight">
        Bring Your Dream
        <br />
        Space to Life.
      </h1>

      {/* description */}
      <p className="mt-2 text-xs sm:text-sm md:text-base text-white leading-none font-light max-w-xs sm:max-w-sm break-words">
        We offer a curated collection of modern and functional furniture
        designed to enhance comfort and elevate the beauty of every corner of
        your home.
      </p>

      <div className="mt-8 lg:mt-4 flex items-center justify-center gap-1">
        <Card
          variant="default"
          padding="none"
          className="w-40 pt-2 pb-4 flex flex-col items-center text-center rotate-[-8deg] rounded-3xl text-[#5F04E8]"
        >
          <img src={luxuryImg} alt="" className="scale-125 w-full h-24 object-contain" />
          <h3 className="text-2xl font-extrabold leading-none">Modern</h3>
          <p className="text-sm leading-none font-light mt-1 w-32">
            Clean simple functional style
          </p>
        </Card>

        <Card
          variant="orange"
          padding="none"
          className="w-40 pt-2 pb-4 flex flex-col items-center text-center rotate-[8deg] rounded-3xl text-white"
        >
          <img src={modernImg} alt="" className="scale-150 w-full h-24 object-contain"/>
          <h3 className="text-2xl font-extrabold leading-none">Luxury</h3>
          <p className="text-sm leading-none font-light mt-1 w-32">
            Clean simple functional style
          </p>
        </Card>
      </div>
    </div>
  );
}

export default HeroContent;
