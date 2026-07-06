import StatusPengirimanPage from "../components/StatusPengirimanPage";

function StatusPengiriman() {
  return (
    <div className="px-3 py-5 md:p-5">
      <div className="md:-mt-7 mb-6">
        <h1 className="font-extrabold text-2xl md:text-3xl">
          Lihat Status Pengiriman
        </h1>

        <p className="text-sm md:text-base text-gray-500">
          Halaman untuk memantau status pengiriman
        </p>
      </div>

      <StatusPengirimanPage role="kasir" />
    </div>
  );
}

export default StatusPengiriman;