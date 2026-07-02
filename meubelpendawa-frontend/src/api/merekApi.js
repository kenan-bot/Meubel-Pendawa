import axios from "axios";

const BASE_URL = "http://localhost:8080/merek";

export const getAllMerek = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const createMerek = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const updateMerek = async (data) => {
  const response = await axios.put(
    BASE_URL,
    data
  );

  return response.data;
};

export const isMerekUsed = async (idMerek) => {
  const response = await axios.get(
    `${BASE_URL}/${idMerek}/is-used`
  );

  return response.data;
}

export const getMerekUsageCount = async (
  idMerek
) => {
  const response = await axios.get(
    `${BASE_URL}/${idMerek}/usage-count`
  );

  return response.data;
};