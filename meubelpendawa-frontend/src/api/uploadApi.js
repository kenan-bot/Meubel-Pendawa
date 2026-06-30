import axiosClient from "./axiosClient";

export const uploadGambar = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axiosClient.post(
    "/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.url;
};