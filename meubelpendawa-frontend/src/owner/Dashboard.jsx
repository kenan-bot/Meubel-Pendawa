import Card from "../components/Card";
import PengirimanBelumSelesaiCard from "../components/DashboardPengirimanContent";

function Dashboard() {
  return (
    <div className="px-3 py-5 md:p-5">
      {/* HEADER */}
      <div className="md:-mt-7 mb-6">
        <h1 className="font-extrabold text-2xl md:text-3xl">Dashboard Owner</h1>
        <p className="text-sm md:text-base text-gray-500">
          Monitoring cepat dashboard pintar
        </p>
      </div>

      {/* GRID DASHBOARD */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Row 1 */}
        <div className="col-span-1 row-span-1">
          <Card dashboard className="h-[170px]">
            <p className="font-bold text-center">Transaksi Terbesar Hari Ini</p>
          </Card>
        </div>

        <div className="col-span-1 row-span-1">
          <Card dashboard className="h-[170px]">
            <p className="font-bold text-center">Top 3 Merek Populer</p>
          </Card>
        </div>

        <div className="col-span-1 row-span-2">
          <Card dashboard className="h-[380px]">
            <PengirimanBelumSelesaiCard
              totalAktif={8}
              totalTerlambat={2}
              drivers={[
                { nama: "Budi Santoso", total: 4 },
                { nama: "Andi Saputra", total: 3 },
                { nama: "Rudi Hartono", total: 1 },
              ]}
            />
          </Card>
        </div>

        <div className="col-span-1 row-span-2">
          <Card dashboard className="h-[380px]">
            <p className="font-bold text-center">Produk Terlaris</p>
          </Card>
        </div>

        {/* Row 2-3 */}
        <div className="col-span-2 row-span-2">
          <Card dashboard className="h-[480px]">
            <p className="font-bold text-center">Trafik Transaksi Mingguan</p>
          </Card>
        </div>

        <div className="col-span-1 row-span-1">
          <Card dashboard className="h-[270px]">
            <p className="font-bold text-center">Cash / Cashless</p>
          </Card>
        </div>

        <div className="col-span-1 row-span-1">
          <Card dashboard className="h-[270px]">
            <p className="font-bold text-center">Stok Menipis</p>
          </Card>
        </div>

        {/* Row 4 */}
        <div className="col-span-2 row-span-1">
          <Card dashboard className="h-[300px]">
            <p className="font-bold text-center">Top Wilayah Pelanggan</p>
          </Card>
        </div>

        <div className="col-span-2 row-span-1">
          <Card dashboard className="h-[300px]">
            <p className="font-bold text-center">Transaksi Terbaru</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
