import { FaMedal } from "react-icons/fa";
import AnimatedSection from "./AnimatedSection";
import AnimatedProgressBar from "./AnimatedProgressBar";

function DashboardMerekPopulerContent({ merek = [] }) {
  const maxTerjual =
    merek.length > 0 ? Math.max(...merek.map((item) => item.totalTerjual)) : 1;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-base text-gray-800">Merek Populer</h3>

          <p className="text-xs text-gray-500">Top 3 Bulan Ini</p>
        </div>

        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
          <FaMedal className="text-orange-500 text-base" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {merek.map((item, index) => (
          <AnimatedSection
            key={item.namaMerek}
            delay={index * 0.12}
            y={15}
            scale={0.96}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </span>

                  <span className="font-semibold text-gray-700 truncate max-w-[90px]">
                    {item.namaMerek}
                  </span>
                </div>

                <span className="font-bold text-orange-500">
                  {item.totalTerjual}
                </span>
              </div>

              <div className="h-1 rounded-full bg-orange-100 overflow-hidden">
                <AnimatedProgressBar
                  value={item.totalTerjual}
                  max={maxTerjual}
                  color="bg-orange-500"
                  duration={900}
                  delay={200 + index * 200}
                />
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}

export default DashboardMerekPopulerContent;
