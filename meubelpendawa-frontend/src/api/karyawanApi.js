import axiosClient from "./axiosClient";

const BASE_URL = "/karyawan";

export const getAllKaryawan = async () => {
  const response = await axiosClient.get(BASE_URL);
  return response.data;
};

export const searchKaryawan = async (keyword) => {
  const response = await axiosClient.get(`${BASE_URL}/search`, {
    params: { keyword },
  });
  return response.data;
};

export const createKaryawan = async (data) => {
  const response = await axiosClient.post(BASE_URL, data);
  return response.data;
};