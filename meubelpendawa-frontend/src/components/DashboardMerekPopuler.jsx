import { FaMedal } from "react-icons/fa";
import AnimatedSection from "./AnimatedSection";
import AnimatedProgressBar from "./AnimatedProgressBar";

function DashboardMerekPopulerContent({ merek = [] }) {
  const maxTerjual =
    merek.length > 0 ? Math.max(...merek.map((item) => item.totalTerjual)) : 1;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="font-bold text-xl text-gray-800">Merek Populer</h3>

          <p className="text-gray-500">Top 3 Bulan Ini</p>
        </div>

        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
          <FaMedal className="text-orange-500 text-xl" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-5">
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

                  <span className="font-semibold text-gray-700">
                    {item.namaMerek}
                  </span>
                </div>

                <span className="font-bold text-orange-500">
                  {item.totalTerjual}
                </span>
              </div>

              <div className="h-3 rounded-full bg-orange-100 overflow-hidden">
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
