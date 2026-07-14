import axiosClient from "./axiosClient";

const BASE_URL = "/transaksi";

// URL PDF struk untuk dibuka di tab baru

export const getStrukPdfUrl = (orderId) => {
  return `${axiosClient.defaults.baseURL}${BASE_URL}/${orderId}/struk`;
};

// Kirim ulang struk ke email

export const kirimUlangStrukEmail = async (orderId) => {
  const response = await axiosClient.post(
    `${BASE_URL}/${orderId}/struk/kirim-email`
  );

  return response.data;
};