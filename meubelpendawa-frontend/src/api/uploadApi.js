import axiosClient from "./axiosClient";

const BASE_URL = "/upload";

export const uploadGambar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClient.post(
    BASE_URL,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.url;
};