import axiosClient from "./axiosClient";

const BASE_URL = "/detail-transaksi";

export const getAllDetailTransaksi = async () => {
  const response = await axiosClient.get(BASE_URL);
  return response.data;
};

export const createDetailTransaksi = async (data) => {
  const response = await axiosClient.post(BASE_URL, data);
  return response.data;
};