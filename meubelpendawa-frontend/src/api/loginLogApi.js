import axiosClient from "./axiosClient";

export const getAllLoginLog = async () => {
  const response = await axiosClient.get("/login-log");
  return response.data;
};

export const getLoginLogByKaryawan = async (idKaryawan) => {
  const response = await axiosClient.get(`/login-log/karyawan/${idKaryawan}`);
  return response.data;
};