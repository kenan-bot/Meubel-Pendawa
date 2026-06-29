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

export const updateKategori = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteKategori = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};