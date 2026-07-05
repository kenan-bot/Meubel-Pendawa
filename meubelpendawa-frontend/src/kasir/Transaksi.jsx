import { useEffect, useState } from "react";
import { TransaksiProvider, useTransaksi } from "../context/TransaksiContext";

import SearchBar from "../components/SearchBar";
import FilterKategori from "../components/FilterKategori";
import FilterMerek from "../components/FilterMerek";
import PageHeader from "../components/PageHeader";
import DateTimeDisplay from "../components/DateTimeDisplay";
import FormPemesan from "../components/FormPemesan";
import KeranjangItem from "../components/KeranjangItem";
import RingkasanBayar from "../components/RingkasanBayar";
import ProductCard from "../components/ProductCard";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import QrisPaymentModal from "../components/QrisPaymentModal";
import StrukModal from "../components/StrukModal";
import usePagination from "../hooks/usePagination";
import Pagination from "../components/Pagination";

import { GiShoppingBag } from "react-icons/gi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function formatRupiah(nominal) {
  if (!nominal && nominal !== 0) return "Rp 0";
  return "Rp" + Number(nominal).toLocaleString("id-ID");
}

function TransaksiContent() {
  const t = useTransaksi();
  const {
    paginatedData,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    resetPage,
  } = usePagination(t.produkTersaring, 12);

  // [BARU] Form Pemesan bisa dibuka/tutup -- default TERTUTUP supaya grid produk
  // langsung dominan begitu halaman dibuka. Data yang sudah diisi tetap tersimpan
  // di context walau form disembunyikan (tidak hilang saat toggle).
  const [formTerbuka, setFormTerbuka] = useState(false);

  // [BARU] Konfirmasi sebelum proses pesanan -- mencegah salah klik / salah total
  // saat kasir menekan tombol "Proses Pesanan" di RingkasanBayar.
  const [showConfirm, setShowConfirm] = useState(false);

  const isDelivery = t.metodePengiriman === "DELIVERY";

  const ringkasanPemesan = [
    t.namaPemesan,
    t.noWhatsapp,
    isDelivery ? "Delivery" : "Pickup",
  ]
    .filter(Boolean)
    .join(" • ");

  // kalau proses pesanan gagal (misal Nama/No.WA/Alamat belum diisi) sementara form ditutup,
  // buka lagi otomatis supaya kasir bisa langsung lihat kolom yang perlu dilengkapi
  useEffect(() => {
    if (t.pesan && t.pesanType === "error" && !formTerbuka) {
      setFormTerbuka(true);
    }
  }, [t.pesan, t.pesanType]);

  const handleConfirmProses = () => {
    setShowConfirm(false);
    t.prosesPesanan();
  };

  return (
    // [RESPONSIVE] mobile: kolom tunggal, halaman scroll normal (natural height).
    // lg+: dua panel berdampingan, tinggi terkunci ke viewport, masing-masing scroll sendiri (layout lama).
    <div className="flex flex-col lg:flex-row gap-4 -m-8 p-4 bg-gray-50 lg:h-[calc(100vh-2rem)] lg:overflow-hidden text-sm">
      {/* ===== KIRI: FORM + PRODUK ===== */}
      <div className="flex-1 bg-white text-gray-800 rounded-2xl shadow-sm flex flex-col lg:min-h-0">
        <div className="p-4 lg:p-5 pb-0 flex-shrink-0">
          <PageHeader title="Form Pemesan" subtitle="Halaman Form Pemesan">
            <button
              type="button"
              onClick={() => setFormTerbuka((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#5F04E8] px-3 py-1.5 rounded-full border border-[#5F04E8]/30 hover:bg-[#5F04E8]/5 transition flex-shrink-0"
            >
              {formTerbuka ? (
                <FaChevronUp size={10} />
              ) : (
                <FaChevronDown size={10} />
              )}
              {formTerbuka ? "Sembunyikan Form" : "Tampilkan Form"}
            </button>

            {!formTerbuka && (
              <span className="text-xs text-gray-400 truncate">
                {ringkasanPemesan || "Data pemesan belum diisi"}
              </span>
            )}
          </PageHeader>

          {formTerbuka && <FormPemesan />}
        </div>

        {/* Search & filter — khusus untuk cari produk di bawah ini */}
        <div className="relative z-30 flex flex-wrap items-center gap-2 px-4 lg:px-5 pt-2 pb-5">
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
          ) : (
            <ProductCard
              produk={paginatedData}
              mode="cashier"
              onCardClick={(item) => t.tambahKeKeranjang(item)}
            />
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onNext={nextPage}
            onPrev={prevPage}
          />
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
          <DateTimeDisplay className="text-[8px] md:text-[12px] text-gray-500" />
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
          <RingkasanBayar onRequestProses={() => setShowConfirm(true)} />
        </div>
      </div>

      {/* Konfirmasi sebelum transaksi benar-benar diproses */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Konfirmasi Pesanan"
        message={`Proses pesanan senilai ${formatRupiah(t.totalPesanan)}?`}
        confirmText="Proses"
        cancelText="Batal"
        onConfirm={handleConfirmProses}
        onClose={() => setShowConfirm(false)}
      />

      {/* Loading/error singkat saat menyiapkan Snap Token -- popup pembayaran aslinya
          langsung diambil alih oleh window.snap.pay() begitu token didapat. */}
      <QrisPaymentModal
        isOpen={t.showQrisModal}
        status={t.qrisStatus}
        message={t.qrisMessage}
        onClose={t.closeQrisModal}
      />

      {/* Muncul begitu pesanan berhasil diproses -- bisa dicetak/download PDF-nya,
          dan salinannya sudah otomatis terkirim ke email toko oleh backend. */}
      <StrukModal data={t.strukData} onClose={t.closeStruk} />
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
