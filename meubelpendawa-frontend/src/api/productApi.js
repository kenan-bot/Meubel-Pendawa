import axiosClient from "./axiosClient";

const BASE_URL = "/produk";

export const getAllProduk = async () => {
  const response = await axiosClient.get("/produk");
  return response.data;
};

export const getProdukById = async (id) => {
  const response = await axiosClient.get(`/produk/${id}`);
  return response.data;
};

export const createProduk = async (data) => {
  const response = await axiosClient.post("/produk", data);
  return response.data;
};

export const updateProduk = async (data) => {
  const response = await axiosClient.put("/produk", data);
  return response.data;
};

export const deleteProduk = async (id) => {
  const response = await axiosClient.delete(`/produk/${id}`);
  return response.data;
};