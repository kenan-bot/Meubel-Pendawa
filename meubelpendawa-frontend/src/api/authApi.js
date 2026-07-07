import axiosClient from "./axiosClient";

export const login = async (username, password) => {
  const response = await axiosClient.post("/auth/login", {
    username,
    password,
  });

  return response.data;
};

export const requestOtp = async (email) => {
  const response = await axiosClient.post("/auth/request-otp", {
    email,
  });

  return response.data;
};

export const verifyOtp = async (email, kodeOtp) => {
  const response = await axiosClient.post("/auth/verify-otp", {
    email,
    kodeOtp,
  });

  return response.data;
};

export const resetPassword = async (email, passwordBaru) => {
  const response = await axiosClient.post("/auth/reset-password", {
    email,
    passwordBaru,
  });

  return response.data;
};