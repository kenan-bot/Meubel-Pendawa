import { FaCrown } from "react-icons/fa";

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
      height: "h-24",
      omzet: "text-xl",
      nama: "text-lg",
    },
    {
      bg: "bg-orange-100",
      height: "h-20",
      omzet: "text-lg text-orange-600",
      nama: "text-base",
    },
    {
      bg: "bg-orange-50",
      height: "h-16",
      omzet: "text-base text-orange-600",
      nama: "text-sm",
    },
    {
      bg: "bg-gray-50",
      height: "h-14",
      omzet: "text-sm text-orange-600",
      nama: "text-sm",
    },
    {
      bg: "bg-gray-50",
      height: "h-14",
      omzet: "text-sm text-orange-600",
      nama: "text-sm",
    },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-xl text-gray-800">Produk Terlaris</h3>

          <p className="text-gray-500">Bulan Ini</p>
        </div>

        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
          <FaCrown className="text-orange-500 text-xl" />
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {produk.slice(0, 5).map((item, index) => {
          const style = styles[index];

          return (
            <div
              key={item.namaProduk}
              className={`
                ${style.bg}
                ${style.height}
                rounded-2xl
                px-4
                flex
                items-center
                justify-between
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:font-bold
                hover:shadow-[0_0_25px_rgba(249,115,22,0.35)]
                cursor-pointer
              `}
            >
              <div className="min-w-0">
                <div
                  className={`
                    font-extrabold
                    ${index === 0 ? "text-3xl" : "text-2xl"}
                  `}
                >
                  #{index + 1}
                </div>

                <div
                  className={`
                    ${style.nama}
                    font-bold
                    truncate
                    max-w-[160px]
                  `}
                >
                  {item.namaProduk}
                </div>

                {index < 3 && (
                  <div
                    className={`
                      text-xs
                      ${index === 0 ? "text-orange-100" : "text-gray-500"}
                    `}
                  >
                    {item.totalTerjual} terjual
                  </div>
                )}
              </div>

              <div
                className={`
                  font-extrabold
                  ${style.omzet}
                `}
              >
                {formatRupiah(item.totalOmzet)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardProdukTerlarisContent;
