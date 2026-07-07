import axiosClient from "./axiosClient";

const BASE_URL = "/kategori";

export const getAllKategori = async () => {
  const response = await axiosClient.get(BASE_URL);
  return response.data;
};

export const createKategori = async (data) => {
  const response = await axiosClient.post(BASE_URL, data);
  return response.data;
};

export const updateKategori = async (data) => {
  const response = await axiosClient.put(BASE_URL, data);
  return response.data;
};

export const isKategoriUsed = async (idKategori) => {
  const response = await axiosClient.get(
    `${BASE_URL}/${idKategori}/is-used`
  );

  return response.data;
};

export const getKategoriUsageCount = async (idKategori) => {
  const response = await axiosClient.get(
    `${BASE_URL}/${idKategori}/usage-count`
  );

  return response.data;
};