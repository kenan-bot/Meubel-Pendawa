import axiosClient from "./axiosClient";

const BASE_URL = "/login-log";

export const getAllLoginLog = async () => {
  const response = await axiosClient.get(BASE_URL);
  return response.data;
};

export const getLoginLogByKaryawan = async (idKaryawan) => {
  const response = await axiosClient.get(
    `${BASE_URL}/karyawan/${idKaryawan}`
  );
  return response.data;
};