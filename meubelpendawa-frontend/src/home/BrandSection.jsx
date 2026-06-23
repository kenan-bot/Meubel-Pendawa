import bigland from "../assets/Merek_Bigland_Logo.png";
import olympic from "../assets/Merek_Olympic_Logo.png";
import president from "../assets/Merek_President_Logo.png";
import napolly from "../assets/Merek_Napoly_Logo.png";

function BrandSection() {
  return (
    <div className="mt-6 w-full flex justify-center gap-4">

      {/* BRAND 1 */}
      <div className="bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm flex items-center">
        <img src={bigland} alt="Bigland" className="h-5 sm:h-6 md:h-7 w-auto object-contain" />
      </div>

      {/* BRAND 2 */}
      <div className="bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm flex items-center">
        <img src={olympic} alt="Olympic" className="h-5 sm:h-6 md:h-7 w-auto object-contain" />
      </div>

      {/* BRAND 3 */}
      <div className="bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm flex items-center">
        <img src={president} alt="President Furniture" className="h-5 sm:h-6 md:h-7 w-auto object-contain" />
      </div>

      {/* BRAND 4 */}
      <div className="bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm flex items-center">
        <img src={napolly} alt="Napolly" className="h-5 sm:h-6 md:h-7 w-auto object-contain" />
      </div>

    </div>
  );
}

export default BrandSection;