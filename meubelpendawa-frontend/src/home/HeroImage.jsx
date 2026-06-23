import heroSofa from "../assets/Sofa_Putih.png";

function HomeImage() {
  return (
    <div
      className="
        bg-white
        rounded-[40px] md:rounded-[60px] lg:rounded-[80px]

        w-[280px] sm:w-[350px] md:w-[500px] lg:w-[625px]
        h-[220px] sm:h-[260px] md:h-[320px] lg:h-[350px]

        mt-10 md:mt-16 lg:mt-20

        overflow-hidden
        flex items-center justify-center

        mx-auto lg:mx-0

        
      "
    >
      <img
        src={heroSofa}
        alt="Furniture"
        className="
          w-[90%]
          h-full
          object-contain

          translate-y-0
          md:-translate-y-6
          lg:-translate-y-10
        "
      />
    </div>
  );
}


export default HomeImage;