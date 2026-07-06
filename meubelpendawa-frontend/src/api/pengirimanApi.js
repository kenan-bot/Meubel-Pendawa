import axiosClient from "./axiosClient";

const BASE_URL = "/pengiriman";

export const getAllPengiriman = async () => {
  const response = await axiosClient.get(BASE_URL);
  return response.data;
};

export const getPengirimanByDriver = async (idKaryawan) => {
  const response = await axiosClient.get(
    `${BASE_URL}/driver/${idKaryawan}`
  );

  return response.data;
};

export const updateStatusPengiriman = async (
  idPengiriman,
  status = "COMPLETED"
) => {
  const response = await axiosClient.put(
    `${BASE_URL}/${idPengiriman}/status`,
    null,
    {
      params: { status },
    }
  );

  return response.data;
};