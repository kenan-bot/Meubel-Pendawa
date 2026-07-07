import axiosClient from "./axiosClient";

const BASE_URL = "/transaksi";

// Membuat Snap Token Midtrans
export const buatSnapToken = async (orderId) => {
  const response = await axiosClient.post(
    `${BASE_URL}/${orderId}/midtrans-token`
  );
  return response.data;
};

// Sinkronisasi status pembayaran dari Midtrans
export const cekStatusPembayaran = async (orderId) => {
  const response = await axiosClient.post(
    `${BASE_URL}/${orderId}/cek-status`
  );
  return response.data;
};

// Cache script Midtrans agar tidak dimuat berulang
let loadingPromise = null;
let loadedForClientKey = null;

export const loadMidtransScript = (
  clientKey,
  isProduction = false
) => {
  if (!clientKey) {
    return Promise.reject(
      new Error(
        "Client Key Midtrans tidak ditemukan dari response backend."
      )
    );
  }

  if (window.snap && loadedForClientKey === clientKey) {
    return Promise.resolve(window.snap);
  }

  if (loadingPromise && loadedForClientKey === clientKey) {
    return loadingPromise;
  }

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
      loadingPromise = null;
      loadedForClientKey = null;
      reject(new Error("Gagal memuat script pembayaran Midtrans."));
    };

    document.body.appendChild(script);
  });

  return loadingPromise;
};