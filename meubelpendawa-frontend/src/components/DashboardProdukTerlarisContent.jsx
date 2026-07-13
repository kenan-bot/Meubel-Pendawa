import { FaCrown } from "react-icons/fa";
import AnimatedSection from "./AnimatedSection";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function DashboardProdukTerlarisContent({ produk = [] }) {
  const styles = [
    {
      bg: "bg-orange-500 text-white",
      height: "h-16",
      nama: "text-lg sm:text-xl",
    },
    {
      bg: "bg-orange-100 text-gray-800",
      height: "h-14",
      nama: "text-base sm:text-lg",
    },
    {
      bg: "bg-orange-50 text-gray-700",
      height: "h-13",
      nama: "text-sm sm:text-base",
    },
    {
      bg: "bg-gray-50 text-gray-500",
      height: "h-9",
      nama: "text-xs sm:text-sm",
    },
  ];

  return (
    <div className="h-full flex flex-col overflow-visible">
      <div className="flex justify-between items-start mb-4">
        <div className="min-w-0">
          <h3 className="font-bold text-base sm:text-xl text-gray-800 truncate">
            Produk Terlaris
          </h3>

          <p className="text-xs sm:text-sm text-gray-500">Berdasar Item terjual</p>
        </div>

        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
          <FaCrown className="text-orange-500 text-lg sm:text-xl" />
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-visible">
        {produk.slice(0, 4).map((item, index) => {
          const style = styles[index];

          return (
            <AnimatedSection
              key={item.namaProduk}
              delay={index * 0.12}
              y={20}
              scale={0.95}
            >
              <div
                className={`
                  ${style.bg}
                  ${style.height}
                  rounded-md
                  px-3 sm:px-4
                  flex
                  items-center
                  gap-3 sm:gap-4
                  relative
                  transition-all
                  duration-300
                  hover:scale-125
                  hover:z-20
                  hover:shadow-sm
                  cursor-pointer
                `}
              >
                {/* Ranking */}
                <div
                  className={`
                    font-black
                    flex-shrink-0
                    leading-none
                    ${
                      index === 0
                        ? "text-4xl sm:text-5xl"
                        : index === 1
                          ? "text-3xl sm:text-4xl"
                          : "text-2xl sm:text-3xl"
                    }
                  `}
                >
                  {index + 1}
                </div>

                {/* Informasi Produk */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`
                      ${style.nama}
                      font-bold
                      truncate
                    `}
                  >
                    {item.namaProduk}
                  </div>

                  <div
                    className={`
                      flex
                      items-center
                      justify-between
                      gap-2
                      text-xs sm:text-sm
                      ${index === 0 ? "text-orange-100" : "text-gray-600"}
                    `}
                  >
                    <span className="truncate">
                      {item.totalTerjual} terjual
                    </span>

                    <span className="font-bold truncate text-right">
                      {formatRupiah(item.totalOmzet)}
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardProdukTerlarisContent;
