import bigland from "../assets/Merek_Bigland_Logo.svg";
import olympic from "../assets/Merek_Olympic_Logo.svg";
import president from "../assets/Merek_President_Logo.svg";
import napolly from "../assets/Merek_Napolly_Logo.svg";
import Card from "../components/Card";

function BrandSection() {
  return (
    <div className="mt-6 w-full flex justify-center gap-4">

      {/* BRAND 1 */}
      <Card className="hover:scale-100 bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm flex items-center">
        <img src={bigland} alt="Bigland" className="h-5 sm:h-6 md:h-7 w-auto object-contain" />
      </Card>

      {/* BRAND 2 */}
      <Card className="bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm flex items-center">
        <img src={olympic} alt="Olympic" className="h-5 sm:h-6 md:h-7 w-auto object-contain" />
      </Card>

      {/* BRAND 3 */}
      <Card className="bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm flex items-center">
        <img src={president} alt="President Furniture" className="h-5 sm:h-6 md:h-7 w-auto object-contain" />
      </Card>

      {/* BRAND 4 */}
      <Card className="bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm flex items-center">
        <img src={napolly} alt="Napolly" className="h-5 sm:h-6 md:h-7 w-auto object-contain" />
      </Card>

    </div>
  );
}

export default BrandSection;