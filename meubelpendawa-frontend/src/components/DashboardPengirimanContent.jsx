import { FaShippingFast } from "react-icons/fa";

function PengirimanBelumSelesaiCard({
  totalAktif,
  totalTerlambat,
  drivers = [],
}) {
  return (
    <div className="relative h-full flex flex-col overflow-hidden">
      {/* ICON */}
      <div className="absolute top-0 right-0">
        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
          <FaShippingFast className="text-orange-500 text-2xl" />
        </div>
      </div>

      {/* HEADER */}
      <h3 className="font-bold text-base md:text-lg text-gray-800 pr-16">
        Pengiriman Belum Selesai
      </h3>

      {/* SUMMARY */}
      <div className="mt-4">
        <div className="text-4xl md:text-5xl font-extrabold text-orange-500">
          {totalAktif}
        </div>

        <p className="text-sm md:text-base text-gray-500 font-medium">
          Pengiriman Aktif
        </p>

        <div className="mt-2 inline-flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500" />

          <span className="text-xs md:text-sm font-semibold text-orange-600">
            {totalTerlambat} Pengiriman Terlambat
          </span>
        </div>
      </div>

      {/* DRIVER LIST */}
      <div className="mt-6 flex-1 flex flex-col min-h-0">
        <div className="flex justify-between text-xs font-bold uppercase text-gray-400 border-b border-orange-200 pb-2">
          <span>Driver</span>
          <span>Belum Dikirim</span>
        </div>

        <div className="mt-3 space-y-3 overflow-y-auto pr-1">
          {drivers.map((driver) => (
            <div
              key={driver.nama}
              className="flex items-center justify-between gap-3"
            >
              <span
                className="
                  flex-1
                  min-w-0
                  truncate
                  text-gray-700
                  font-medium
                  text-sm
                "
                title={driver.nama}
              >
                {driver.nama}
              </span>

              <span
                className="
                  flex-shrink-0
                  min-w-[36px]
                  h-8
                  px-3
                  rounded-full
                  bg-orange-100
                  text-orange-600
                  font-bold
                  text-sm
                  flex
                  items-center
                  justify-center
                "
              >
                {driver.total}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PengirimanBelumSelesaiCard;
