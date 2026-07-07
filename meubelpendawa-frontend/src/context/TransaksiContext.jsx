import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useProduk } from "./ProdukContext";
import {
  createTransaksi,
  prosesPembayaran,
  batalkanTransaksi,
} from "../api/transaksiApi";
import { createDetailTransaksi } from "../api/detailTransaksiApi";
import { getAllKaryawan } from "../api/karyawanApi";
import {
  buatSnapToken,
  loadMidtransScript,
  cekStatusPembayaran,
} from "../api/midtransApi";

const TransaksiContext = createContext(null);

export function TransaksiProvider({ children }) {
  const { produk, loading, updateProdukState, reloadProduk } = useProduk();

  // ----- form pemesan -----
  const [namaPemesan, setNamaPemesan] = useState("");
  const [noWhatsapp, setNoWhatsapp] = useState("");
  const [alamatPengiriman, setAlamatPengiriman] = useState("");
  const [metodePengiriman, setMetodePengiriman] = useState("DELIVERY");
  const [metodePembayaran, setMetodePembayaran] = useState("CASH");
  const [driverId, setDriverId] = useState("");
  const [driverList, setDriverList] = useState([]);
  const isDelivery = metodePengiriman === "DELIVERY";
  const isCashless = metodePembayaran === "CASHLESS";

  useEffect(() => {
    getAllKaryawan()
      .then((data) => {
        const driverAktif = data.filter(
          (k) => k.role?.toUpperCase() === "DRIVER" && k.statusAktif,
        );

        setDriverList(driverAktif);
      })
      .catch((err) => {
        console.error("Gagal mengambil daftar driver:", err);
      });
  }, []);

  useEffect(() => {
    if (!isDelivery) {
      setAlamatPengiriman("");
      setDriverId("");
    }
  }, [isDelivery]);

  // ----- filter produk -----
  const [keyword, setKeyword] = useState("");
  const [kategoriPick, setKategoriPick] = useState(null);
  const [merekPick, setMerekPick] = useState(null);

  const produkTersaring = useMemo(
    () =>
      produk.filter((item) => {
        const cocokKeyword = item.namaProduk
          ?.toLowerCase()
          .includes(keyword.toLowerCase());
        const cocokKategori = kategoriPick
          ? item.kategori?.idKategori === kategoriPick.idKategori
          : true;
        const cocokMerek = merekPick
          ? item.merek?.idMerek === merekPick.idMerek
          : true;
        return cocokKeyword && cocokKategori && cocokMerek;
      }),
    [produk, keyword, kategoriPick, merekPick],
  );

  // ----- keranjang -----
  const [keranjang, setKeranjang] = useState([]);
  const [waktu] = useState(new Date());
  const [jumlahBayar, setJumlahBayar] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pesan, setPesan] = useState("");
  const [pesanType, setPesanType] = useState("error");

  // ----- pembayaran QRIS (Midtrans) -----
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [qrisStatus, setQrisStatus] = useState("loading"); // "loading" | "error"
  const [qrisMessage, setQrisMessage] = useState("");
  const closeQrisModal = () => setShowQrisModal(false);

  // ----- struk pesanan (muncul setelah pesanan berhasil diproses) -----
  // Diisi dari snapshot data pesanan (bukan dibaca ulang dari keranjang/form) karena
  // keranjang & form sudah direset begitu pesanan selesai diproses.
  const [strukData, setStrukData] = useState(null);
  const closeStruk = () => setStrukData(null);

  const tampilkanPesan = (text, type = "error") => {
    setPesan(text);
    setPesanType(type);
  };

  useEffect(() => {
    if (!pesan) return;
    const timer = setTimeout(() => setPesan(""), 3000);
    return () => clearTimeout(timer);
  }, [pesan]);

  const tambahKeKeranjang = (item) => {
    if (item.stok === 0) {
      tampilkanPesan(`${item.namaProduk} stoknya habis.`, "error");
      return;
    }
    setKeranjang((prev) => {
      const ada = prev.find((c) => c.produk.idProduk === item.idProduk);
      if (ada) {
        if (ada.qty >= item.stok) {
          tampilkanPesan(
            `Stok ${item.namaProduk} cuma tersisa ${item.stok}.`,
            "error",
          );
          return prev;
        }
        return prev.map((c) =>
          c.produk.idProduk === item.idProduk ? { ...c, qty: c.qty + 1 } : c,
        );
      }
      return [...prev, { produk: item, qty: 1, hargaJual: item.hargaDefault }];
    });
  };

  const ubahQty = (idProduk, delta) =>
    setKeranjang((prev) =>
      prev.map((c) => {
        if (c.produk.idProduk !== idProduk) return c;
        const qtyBaru = Math.max(1, c.qty + delta);
        if (delta > 0 && qtyBaru > c.produk.stok) {
          tampilkanPesan(
            `Stok ${c.produk.namaProduk} cuma tersisa ${c.produk.stok}.`,
            "error",
          );
          return c;
        }
        return { ...c, qty: qtyBaru };
      }),
    );

  const hapusItem = (idProduk) =>
    setKeranjang((prev) => prev.filter((c) => c.produk.idProduk !== idProduk));

  const ubahHarga = (idProduk, harga) =>
    setKeranjang((prev) =>
      prev.map((c) =>
        c.produk.idProduk === idProduk
          ? { ...c, hargaJual: Number(harga) || 0 }
          : c,
      ),
    );

  const totalPesanan = keranjang.reduce(
    (sum, c) => sum + c.qty * c.hargaJual,
    0,
  );
  const kembalian = jumlahBayar ? Number(jumlahBayar) - totalPesanan : 0;

  const resetForm = () => {
    setNamaPemesan("");
    setNoWhatsapp("");
    setAlamatPengiriman("");
    setDriverId("");
    setKeranjang([]);
    setJumlahBayar("");
  };

  const prosesPesanan = async () => {
    setPesan("");
    if (!namaPemesan || !noWhatsapp)
      return tampilkanPesan("Nama dan No. Telp/WhatsApp wajib diisi.");
    if (isDelivery && (!alamatPengiriman || !driverId))
      return tampilkanPesan("Alamat & driver wajib diisi untuk Delivery.");
    if (keranjang.length === 0)
      return tampilkanPesan("Keranjang masih kosong.");
    // Untuk CASHLESS, nominal yang dibayar mengikuti gross_amount di Midtrans (persis totalPesanan),
    // jadi input "Jumlah Bayar" manual tidak wajib divalidasi seperti alur CASH.
    if (!isCashless && (!jumlahBayar || Number(jumlahBayar) < totalPesanan)) {
      return tampilkanPesan("Jumlah bayar belum mencukupi total pesanan.");
    }

    // Snapshot data pesanan SEBELUM keranjang/form direset -- dipakai untuk tampilkan
    // struk setelah pesanan selesai diproses (baik jalur CASH langsung, maupun CASHLESS
    // yang baru "selesai" setelah callback Snap sukses, saat form sudah kosong lagi).
    const snapshotItems = keranjang.map((c) => ({
      namaProduk: c.produk.namaProduk,
      qty: c.qty,
      hargaJual: c.hargaJual,
    }));
    const buatSnapshotStruk = (orderId, jumlahBayarFinal, kembalianFinal) => ({
      orderId,
      namaPemesan,
      noWhatsapp,
      metodePengiriman,
      alamatPengiriman: isDelivery ? alamatPengiriman : "-",
      metodePembayaran,
      items: snapshotItems,
      totalPesanan,
      jumlahBayar: jumlahBayarFinal,
      kembalian: kembalianFinal,
    });

    try {
      setSubmitting(true);
      const transaksiBaru = await createTransaksi({
        namaPemesan,
        noWhatsapp,
        alamatPengiriman: isDelivery ? alamatPengiriman : "-",
        metodePengiriman,
        metodePembayaran,
        driver: isDelivery ? { idKaryawan: driverId } : null,
      });
      for (const item of keranjang) {
        await createDetailTransaksi({
          qty: item.qty,
          hargaJual: item.hargaJual,
          produk: { idProduk: item.produk.idProduk },
          transaksi: { orderId: transaksiBaru.orderId },
        });
        // Backend sudah decrement stok di titik ini (lihat DetailTransaksiService), jadi
        // sinkronkan juga stok di ProdukContext biar grid produk ikut update tanpa refresh manual.
        updateProdukState({
          ...item.produk,
          stok: item.produk.stok - item.qty,
        });
      }

      if (isCashless) {
        // Order & detail sudah tersimpan; sisanya (buka Snap, tunggu bayar) ditangani terpisah.
        // Kalau gagal siapkan Snap Token, JANGAN resetForm -- biarkan kasir retry tanpa input ulang.
        const berhasilSiapkanQris = await bayarViaMidtrans(
          transaksiBaru.orderId,
          () => buatSnapshotStruk(transaksiBaru.orderId, totalPesanan, 0),
        );
        if (!berhasilSiapkanQris) return;
      } else {
        await prosesPembayaran(transaksiBaru.orderId, Number(jumlahBayar));
        const kembalianFinal = Number(jumlahBayar) - totalPesanan;
        tampilkanPesan(
          `Pesanan ${transaksiBaru.orderId} berhasil diproses.`,
          "success",
        );
        setStrukData(
          buatSnapshotStruk(
            transaksiBaru.orderId,
            Number(jumlahBayar),
            kembalianFinal,
          ),
        );
      }
      resetForm();
    } catch (error) {
      console.error(error);
      tampilkanPesan(
        error?.response?.data?.message ||
          "Gagal memproses pesanan. Coba periksa kembali data.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Dipanggil saat popup QRIS ditutup/error tanpa selesai bayar. Order dihapus di backend
  // (kecuali ternyata sudah terlanjur SUCCESS -- lihat batalkanTransaksi di TransaksiService),
  // lalu daftar produk di-reload supaya stok yang dikembalikan backend ikut kesinkron di UI.
  const batalkanOrderQris = (orderId) => {
    batalkanTransaksi(orderId)
      .then(() => reloadProduk())
      .catch((err) => {
        // Kalau ternyata order sudah SUCCESS (race condition), backend menolak hapus --
        // itu bukan error yang perlu ditampilkan sebagai kegagalan, cukup dicatat di console.
        console.error(
          `Gagal membatalkan order ${orderId}:`,
          err?.response?.data?.error || err.message,
        );
      });
  };

  // Ambil Snap Token dari backend lalu buka popup pembayaran Midtrans.
  // Status akhir (SUCCESS/FAILED) sebenarnya diputuskan lewat webhook backend (langkah 6),
  // callback di sini cuma untuk feedback cepat ke kasir di layar.
  const bayarViaMidtrans = async (orderId, buatSnapshotStruk) => {
    setQrisStatus("loading");
    setQrisMessage("Menyiapkan pembayaran, mohon tunggu...");
    setShowQrisModal(true);

    try {
      const { token, clientKey, isProduction } = await buatSnapToken(orderId);
      await loadMidtransScript(clientKey, isProduction);

      setShowQrisModal(false); // biar popup Snap yang tampil, bukan numpuk sama modal kita

      window.snap.pay(token, {
        onSuccess: () => {
          tampilkanPesan(`Pembayaran ${orderId} berhasil.`, "success");
          if (buatSnapshotStruk) setStrukData(buatSnapshotStruk());
          // Gantiin peran webhook: minta backend cek ulang status ASLI ke Midtrans & simpan
          // ke database. Tanpa ini, statusPembayaran/jumlahBayar di DB tetap nyangkut PENDING/0
          // walau popup Snap sudah bilang sukses -- soalnya webhook butuh URL publik (ngrok dkk).
          cekStatusPembayaran(orderId).catch((err) =>
            console.error("Gagal sinkronkan status:", err),
          );
        },
        onPending: () => {
          tampilkanPesan(
            `Pembayaran ${orderId} tertunda, menunggu konfirmasi.`,
            "warning",
          );
          cekStatusPembayaran(orderId).catch((err) =>
            console.error("Gagal sinkronkan status:", err),
          );
        },
        onError: () => {
          tampilkanPesan(
            `Pembayaran ${orderId} gagal, silakan coba lagi.`,
            "error",
          );
          batalkanOrderQris(orderId);
        },
        onClose: () => {
          tampilkanPesan(`Pembayaran ${orderId} dibatalkan.`, "error");
          batalkanOrderQris(orderId);
        },
      });
      return true;
    } catch (error) {
      console.error(error);
      setQrisStatus("error");
      setQrisMessage(
        error?.response?.data?.error ||
          error.message ||
          "Gagal menyiapkan pembayaran QRIS. Coba lagi.",
      );
      return false;
    }
  };

  const value = {
    loading,
    produkTersaring,
    keyword,
    setKeyword,
    setKategoriPick,
    setMerekPick,
    namaPemesan,
    setNamaPemesan,
    noWhatsapp,
    setNoWhatsapp,
    metodePengiriman,
    setMetodePengiriman,
    metodePembayaran,
    setMetodePembayaran,
    alamatPengiriman,
    setAlamatPengiriman,
    driverId,
    setDriverId,
    driverList,
    keranjang,
    tambahKeKeranjang,
    ubahQty,
    hapusItem,
    ubahHarga,
    waktu,
    jumlahBayar,
    setJumlahBayar,
    totalPesanan,
    kembalian,
    isCashless,
    submitting,
    pesan,
    pesanType,
    prosesPesanan,
    tampilkanPesan,
    showQrisModal,
    qrisStatus,
    qrisMessage,
    closeQrisModal,
    strukData,
    closeStruk,
  };

  return (
    <TransaksiContext.Provider value={value}>
      {children}
    </TransaksiContext.Provider>
  );
}

export function useTransaksi() {
  const ctx = useContext(TransaksiContext);
  if (!ctx)
    throw new Error("useTransaksi harus dipakai di dalam <TransaksiProvider>");
  return ctx;
}
