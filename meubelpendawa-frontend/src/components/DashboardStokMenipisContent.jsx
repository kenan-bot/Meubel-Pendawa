import { FaBoxes } from "react-icons/fa";
import { MdWarningAmber } from "react-icons/md";
import AnimatedCount from "./AnimatedCount";

function DashboardStokMenipisContent({ produk = [] }) {
  const getBadgeStyle = (stok) => {
    if (stok <= 2) {
      return "bg-red-100 text-red-600";
    }

    if (stok <= 5) {
      return "bg-orange-100 text-orange-600";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-800">Stok Menipis</h3>

          <p className="text-xs text-red-500 font-medium">
            Produk dengan stok ≤ 5
          </p>
        </div>

        <div className="text-right">
          <AnimatedCount
            value={produk.length}
            duration={1200}
            className="text-3xl font-extrabold text-red-500"
          />

          <p className="text-xs text-gray-400">Perlu Restock</p>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {produk.map((item, index) => (
          <div
            key={item.namaProduk}
            className="
              flex
              items-center
              justify-between
              gap-3
              p-2
              rounded-xl
              hover:bg-orange-50
              transition-all
              duration-300
            "
          >
            {/* Kiri */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="
                  w-8
                  h-8
                  rounded-full
                  bg-orange-100
                  text-orange-600
                  flex
                  items-center
                  justify-center
                  text-xs
                  font-bold
                  flex-shrink-0
                "
              >
                {index + 1}
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-sm
                    font-medium
                    text-gray-800
                    truncate
                  "
                  title={item.namaProduk}
                >
                  {item.namaProduk}
                </p>
              </div>
            </div>

            {/* Kanan */}
            <div
              className="
    flex
    items-center
    gap-1
    px-3
    py-1
    rounded-full
    bg-red-100
    text-red-600
    font-bold
    text-xs
    whitespace-nowrap
  "
            >
              <MdWarningAmber className="text-sm" />
              {item.stok}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardStokMenipisContent;
