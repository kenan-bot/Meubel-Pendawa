import axiosClient from "./axiosClient";

const BASE_URL = "/produk";

export const getAllProduk = async () => {
  const response = await axiosClient.get(BASE_URL);
  return response.data;
};

export const getProdukById = async (id) => {
  const response = await axiosClient.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createProduk = async (data) => {
  const response = await axiosClient.post(BASE_URL, data);
  return response.data;
};

export const updateProduk = async (data) => {
  const response = await axiosClient.put(BASE_URL, data);
  return response.data;
};

export const deleteProduk = async (id) => {
  const response = await axiosClient.delete(`${BASE_URL}/${id}`);
  return response.data;
};