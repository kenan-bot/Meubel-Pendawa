import axiosClient from "./axiosClient";

const BASE_URL = "/transaksi";

export const getAllTransaksi = async () => {
  const response = await axiosClient.get(BASE_URL);
  return response.data;
};

export const searchTransaksi = async (keyword) => {
  const response = await axiosClient.get(`${BASE_URL}/search`, {
    params: { keyword },
  });
  return response.data;
};

export const createTransaksi = async (data) => {
  const response = await axiosClient.post(BASE_URL, data);
  return response.data;
};

export const prosesPembayaran = async (orderId, jumlahBayar) => {
  const response = await axiosClient.put(`${BASE_URL}/${orderId}/bayar`, null, {
    params: { jumlahBayar },
  });
  return response.data;
};