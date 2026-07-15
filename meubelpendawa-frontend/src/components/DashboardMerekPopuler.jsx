import { FaRankingStar } from "react-icons/fa6";
import AnimatedCount from "./AnimatedCount";
import AnimatedProgressBar from "./AnimatedProgressBar";

function DashboardMerekPopulerContent({ merek = [] }) {
  if (!merek.length) return null;

  const item = merek[0];

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-bold text-gray-800">
            Merek Terpopuler
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
          <FaRankingStar className="text-orange-500 text-lg" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex items-center justify-between">
        {/* Kiri */}
        <div>
          <h2 className="text-3xl font-extrabold text-orange-500 uppercase leading-none">
            {item.namaMerek}
          </h2>

          <p className="mt-2 font-medium text-sm text-gray-500">
            Paling diminati hingga saat ini
          </p>
        </div>

        {/* Kanan */}
        <div className="text-right">
          <AnimatedCount
            value={item.totalTerjual}
            duration={1200}
            className="text-5xl font-extrabold text-orange-500 leading-none"
          />

          <p className="text-sm font-medium text-gray-500 mt-1">Terjual</p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-2">
        <div className="h-2 rounded-full bg-orange-100 overflow-hidden">
          <AnimatedProgressBar
            value={100}
            max={100}
            color="bg-orange-500"
            duration={1200}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardMerekPopulerContent;
