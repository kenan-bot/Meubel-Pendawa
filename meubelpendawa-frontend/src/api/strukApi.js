import axiosClient from "./axiosClient";

const BASE_URL = "/transaksi";

// URL PDF struk sebuah order -- dibuka di tab baru supaya kasir bisa cetak/download
// langsung lewat viewer PDF bawaan browser (tombol print ada di situ).
export const getStrukPdfUrl = (orderId) =>
  `${axiosClient.defaults.baseURL}${BASE_URL}/${orderId}/struk`;

// Kirim ulang struk ke email toko secara manual (dipakai kalau pengiriman
// otomatis sebelumnya gagal, atau kasir mau kirim ulang).
export const kirimUlangStrukEmail = async (orderId) => {
  const response = await axiosClient.post(`${BASE_URL}/${orderId}/struk/kirim-email`);
  return response.data;
};
