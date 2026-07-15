import { FaRankingStar } from "react-icons/fa6";
import AnimatedCount from "./AnimatedCount";
import AnimatedProgressBar from "./AnimatedProgressBar";

function DashboardMerekPopulerContent({ merek = [] }) {
  if (!merek.length) return null;

  const item = merek[0];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-center gap-2">
        <p className="text-base sm:text-lg font-bold text-gray-800 truncate">
          Merek Terpopuler
        </p>

        <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
          <FaRankingStar className="text-orange-500 text-base sm:text-lg" />
        </div>
      </div>

      {/* CONTENT */}
      <div
        className="
        flex-1 
        flex 
        flex-col 
        sm:flex-row 
        sm:items-center 
        sm:justify-between 
        gap-3 
        min-w-0
      "
      >
        {/* Kiri */}
        <div className="min-w-0 flex-1">
          <h2
            className="
            text-xl 
            sm:text-2xl 
            lg:text-3xl 
            font-extrabold 
            text-orange-500 
            uppercase 
            leading-tight 
            break-words
            line-clamp-2
          "
          >
            {item.namaMerek}
          </h2>

          <p
            className="
            mt-1 
            text-xs 
            sm:text-sm 
            font-medium 
            text-gray-500
            truncate
          "
          >
            Paling diminati hingga saat ini
          </p>
        </div>

        {/* Kanan */}
        <div
          className="
          shrink-0 
          text-left 
          sm:text-right
        "
        >
          <AnimatedCount
            value={item.totalTerjual}
            duration={1200}
            className="
              text-3xl 
              sm:text-4xl 
              lg:text-5xl 
              font-extrabold 
              text-orange-500 
              leading-none
            "
          />

          <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1">
            Terjual
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-0 shrink-0">
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
