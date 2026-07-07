import axiosClient from "./axiosClient";

const BASE_URL = "/api/laporan-harian";


export const exportLaporanHarian = async () => {
  const response = await axiosClient.post(
    `${BASE_URL}/export`
  );

  return response.data;
};