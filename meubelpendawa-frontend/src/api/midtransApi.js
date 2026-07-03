import axiosClient from "./axiosClient";

const BASE_URL = "/transaksi";

// Panggil setelah transaksi + detail item tersimpan di backend (totalPesanan sudah final).
// Return { token, orderId, clientKey, isProduction } -- clientKey & isProduction ikut dikirim
// backend (dari application.properties) supaya frontend gak perlu simpan config sendiri.
export const buatSnapToken = async (orderId) => {
  const response = await axiosClient.post(`${BASE_URL}/${orderId}/midtrans-token`);
  return response.data;
};

// Dipanggil dari callback Snap (onSuccess/onPending) -- minta backend cek status ASLI
// ke Midtrans lalu update database. Gantiin peran webhook buat dev lokal tanpa ngrok.
export const cekStatusPembayaran = async (orderId) => {
  const response = await axiosClient.post(`${BASE_URL}/${orderId}/cek-status`);
  return response.data;
};

// Inject <script src="snap.js"> sekali saja dan cache promise-nya, supaya kalau kasir
// klik "Proses Pesanan" berkali-kali tidak nge-load script yang sama berulang-ulang.
let loadingPromise = null;
let loadedForClientKey = null;

export function loadMidtransScript(clientKey, isProduction = false) {
  if (!clientKey) {
    return Promise.reject(new Error("clientKey Midtrans tidak ditemukan dari response backend."));
  }
  if (window.snap && loadedForClientKey === clientKey) return Promise.resolve(window.snap);
  if (loadingPromise && loadedForClientKey === clientKey) return loadingPromise;

  const snapSrc = isProduction
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

  loadedForClientKey = clientKey;
  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = snapSrc;
    script.setAttribute("data-client-key", clientKey);
    script.onload = () => resolve(window.snap);
    script.onerror = () => {
      loadingPromise = null; // biar bisa dicoba lagi kalau gagal (mis. internet putus)
      reject(new Error("Gagal memuat script pembayaran Midtrans."));
    };
    document.body.appendChild(script);
  });

  return loadingPromise;
}