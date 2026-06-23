function HeroContent() {
  return (
    <div className="flex-1 text-white px-4 sm:px-6 lg:pl-20 max-w-sm sm:max-w-md lg:max-w-xl mt-10 lg:-mt-20">

      {/* TAG */}
      <span className="bg-orange-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-semibold">
        Furniture
      </span>

      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-2 leading-tight">
        Bring Your Dream
        <br />
        Space to Life.
      </h1>

      {/* DESCRIPTION */}
      <p className="mt-2 text-xs sm:text-sm md:text-base text-white leading-none font-light max-w-xs sm:max-w-sm break-words">
        We offer a curated collection of modern and functional furniture
        designed to enhance comfort and elevate the beauty of every corner
        of your home.
      </p>

    </div>
  );
}

export default HeroContent;