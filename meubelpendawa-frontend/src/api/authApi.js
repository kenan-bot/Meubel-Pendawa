import axiosClient from "./axiosClient";

const BASE_URL = "/auth";

export const login = async (username, password) => {
  const response = await axiosClient.post(`${BASE_URL}/login`, {
    username,
    password,
  });

  return response.data;
};

export const requestOtp = async (email) => {
  const response = await axiosClient.post(`${BASE_URL}/request-otp`, {
    email,
  });

  return response.data;
};

export const verifyOtp = async (email, kodeOtp) => {
  const response = await axiosClient.post(`${BASE_URL}/verify-otp`, {
    email,
    kodeOtp,
  });

  return response.data;
};

export const resetPassword = async (email, passwordBaru) => {
  const response = await axiosClient.post(`${BASE_URL}/reset-password`, {
    email,
    passwordBaru,
  });

  return response.data;
};