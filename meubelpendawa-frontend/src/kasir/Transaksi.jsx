import { TransaksiProvider, useTransaksi } from "../context/TransaksiContext";

import SearchBar from "../components/SearchBar";
import FilterKategori from "../components/FilterKategori";
import FilterMerek from "../components/FilterMerek";
import PageHeader from "../components/PageHeader";
import DateTimeDisplay from "../components/DateTimeDisplay";
import FormPemesan from "../components/FormPemesan";
import KeranjangItem from "../components/KeranjangItem";
import RingkasanBayar from "../components/RingkasanBayar";
import Card from "../components/Card";
import CardImage from "../components/CardImage";
import CardBody from "../components/CardBody";
import Toast from "../components/Toast";

import { GiShoppingBag } from "react-icons/gi";

function formatRupiah(nominal) {
  if (!nominal && nominal !== 0) return "Rp 0";
  return "Rp" + Number(nominal).toLocaleString("id-ID");
}

function TransaksiContent() {
  const t = useTransaksi();

  return (
    // [RESPONSIVE] mobile: kolom tunggal, halaman scroll normal (natural height).
    // lg+: dua panel berdampingan, tinggi terkunci ke viewport, masing-masing scroll sendiri (layout lama).
    <div className="flex flex-col lg:flex-row gap-4 -m-8 p-4 bg-gray-50 lg:h-[calc(100vh-2rem)] lg:overflow-hidden text-sm">
      {/* ===== KIRI: FORM + PRODUK ===== */}
      <div className="flex-1 bg-white text-gray-800 rounded-2xl shadow-sm flex flex-col lg:min-h-0">
        <div className="p-4 lg:p-5 pb-0 flex-shrink-0">
          <PageHeader title="Form Pemesan" subtitle="Halaman Form Pemesan" />
          <FormPemesan />
        </div>

        {/* Search & filter — khusus untuk cari produk di bawah ini */}
        <div className="relative z-30 flex flex-wrap items-center gap-2 px-4 lg:px-5 pt-2">
          <SearchBar
            theme="orange"
            placeholder="Search furniture..."
            value={t.keyword}
            onChange={(e) => t.setKeyword(e.target.value)}
          />
          <FilterKategori onSelect={t.setKategoriPick} />
          <FilterMerek onSelect={t.setMerekPick} />
        </div>

        {/* Grid produk — klik untuk tambah ke keranjang.
            [RESPONSIVE] mobile: bagian dari scroll halaman (bukan box scroll sendiri) supaya enak di-scroll pakai jari. */}
        <div className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto custom-scrollbar px-4 lg:px-5 pb-4 pt-2">
          {t.loading ? (
            <div className="text-center py-8 text-gray-500">
              Memuat produk...
            </div>
          ) : t.produkTersaring.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Produk tidak ditemukan.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {t.produkTersaring.map((item) => (
                <Card
                  key={item.idProduk}
                  padding="none"
                  hover={false}
                  onClick={() => t.tambahKeKeranjang(item)}
                  className="cursor-pointer text-[#5F04E8] overflow-hidden"
                >
                  <CardImage
                    src={item.gambarUrl}
                    alt={item.namaProduk}
                    className="!h-20"
                  />
                  <div className="p-2">
                    <div className="flex flex-wrap gap-1 mb-1">
                      {item.merek && (
                        <span className="inline-block px-1.5 py-0.5 border border-[#5F04E8] text-[#5F04E8] text-[9px] font-semibold rounded-full">
                          {item.merek.namaMerek}
                        </span>
                      )}
                      {item.kategori && (
                        <span className="inline-block px-1.5 py-0.5 border border-orange-500 text-orange-500 text-[9px] font-semibold rounded-full">
                          {item.kategori.namaKategori}
                        </span>
                      )}
                    </div>
                    <CardBody className="font-bold text-xs leading-tight truncate text-[#5F04E8]">
                      {item.namaProduk}
                    </CardBody>
                    <span
                      className={`inline-block px-1.5 py-0.5 my-1 text-[9px] font-semibold text-white rounded-md ${item.stok > 5 ? "bg-[#5F04E8]" : "bg-orange-500"}`}
                    >
                      {item.stok > 5
                        ? `Tersedia ${item.stok}`
                        : `Tersisa ${item.stok}`}
                    </span>
                    <p className="text-xs font-semibold">
                      {formatRupiah(item.hargaDefault)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== KANAN: KERANJANG =====
          [RESPONSIVE] mobile: full-width, di bawah panel produk (bukan sidebar tetap).
          Tombol "Proses Pesanan" dibuat sticky di bawah layar supaya tetap mudah dijangkau saat scroll. */}
      <div className="relative w-full lg:w-[300px] bg-white rounded-2xl shadow-sm flex flex-col lg:min-h-0">
        {t.pesan && <Toast message={t.pesan} type={t.pesanType} />}

        <div className="p-4 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-bold text-orange-500">
              Keranjang Pesanan
            </h2>
            <GiShoppingBag className="text-orange-500" size={20} />
          </div>
          <DateTimeDisplay className="text-[8px] md:text-[11px] text-gray-500" />
          <p className="text-orange-500 font-bold text-xs">Order</p>
        </div>

        <div className="max-h-72 lg:max-h-none lg:flex-1 lg:min-h-0 overflow-y-auto custom-scrollbar px-4 space-y-2.5">
          {t.keranjang.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-8">
              Belum ada produk di keranjang.
            </p>
          )}
          {t.keranjang.map((item) => (
            <KeranjangItem key={item.produk.idProduk} item={item} />
          ))}
        </div>

        <div className="flex-shrink-0 p-4 pt-3 sticky bottom-0 lg:static bg-white rounded-b-2xl shadow-[0_-4px_10px_rgba(0,0,0,0.04)] lg:shadow-none">
          <RingkasanBayar />
        </div>
      </div>
    </div>
  );
}

export default function Transaksi() {
  return (
    <TransaksiProvider>
      <TransaksiContent />
    </TransaksiProvider>
  );
}