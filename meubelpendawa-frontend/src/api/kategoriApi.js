import axios from "axios";

const BASE_URL = "http://localhost:8080/kategori";

export const getAllKategori = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const createKategori = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const updateKategori = async (data) => {
  const response = await axios.put(
    BASE_URL,
    data
  );

  return response.data;
};

export const isKategoriUsed = async (
  idKategori
) => {
  const response = await axios.get(
    `${BASE_URL}/${idKategori}/is-used`
  );

  return response.data;
};

export const getKategoriUsageCount = async (
  idKategori
) => {
  const response = await axios.get(
    `${BASE_URL}/${idKategori}/usage-count`
  );

  return response.data;
};