import axiosClient from "./axiosClient";

const BASE_URL = "/merek";

export const getAllMerek = async () => {
  const response = await axiosClient.get(BASE_URL);
  return response.data;
};

export const createMerek = async (data) => {
  const response = await axiosClient.post(BASE_URL, data);
  return response.data;
};

export const updateMerek = async (data) => {
  const response = await axiosClient.put(BASE_URL, data);
  return response.data;
};

export const isMerekUsed = async (idMerek) => {
  const response = await axiosClient.get(
    `${BASE_URL}/${idMerek}/is-used`
  );

  return response.data;
};

export const getMerekUsageCount = async (idMerek) => {
  const response = await axiosClient.get(
    `${BASE_URL}/${idMerek}/usage-count`
  );

  return response.data;
};