import axiosClient from "./axiosClient";

const BASE_URL = "/api/dashboard";

// PENGIRIMAN BELUM SELESAI

export const getPengirimanBelumSelesai = async () => {
    const response = await axiosClient.get(
        `${BASE_URL}/pengiriman-belum-selesai`
    );

    return response.data;
};

// PRODUK TERLARIS BULAN INI

export const getProdukTerlarisBulanIni = async () => {
  const response = await axiosClient.get(
    `${BASE_URL}/produk-terlaris`
  );

  return response.data;
};

// TOP 3 MEREK TERPOPULER

export const getTopMerekPopuler = async () => {
    const response = await axiosClient.get(
        `${BASE_URL}/merek-populer`
    );

    return response.data;
};

// Transaksi Terbesar Hari Ini

export const getTransaksiTerbesarHariIni = async () => {
    const response = await axiosClient.get(
        `${BASE_URL}/transaksi-terbesar`
    );

    return response.data;
};

// STOK MENIPIS

export const getStokMenipis = async () => {
    const response = await axiosClient.get(
        `${BASE_URL}/stok-menipis`
    );

    return response.data;
};

// CASH VS CASHLESS HARI INI

export const getCashVsCashless = async () => {
    const response = await axiosClient.get(
        `${BASE_URL}/cash-vs-cashless`
    );

    return response.data;
};

// TOP WILAYAH PELANGGAN

export const getTopWilayahPelanggan = async () => {
    const response = await axiosClient.get(
        `${BASE_URL}/top-wilayah`
    );

    return response.data;
};

// TRAFIK TRANSAKSI MINGGUAN

export const getTrafikTransaksiMingguan = async () => {
    const response = await axiosClient.get(
        `${BASE_URL}/trafik-mingguan`
    );

    return response.data;
};

// TRANSAKSI TERBARU

export const getTransaksiTerbaru = async () => {
    const response = await axiosClient.get(
        `${BASE_URL}/transaksi-terbaru`
    );

    return response.data;
};