import axiosClient from "./axiosClient";

const BASE_URL = "/api/dashboard";

// Pengiriman belum selesai

export const getPengirimanBelumSelesai = async () => {
    const response = await axiosClient.get(
        `${BASE_URL}/pengiriman-belum-selesai`
    );

    return response.data;
};

// Produk terlaris bulan ini

export const getProdukTerlarisBulanIni = async () => {
    const response = await axiosClient.get(
        `${BASE_URL}/produk-terlaris`
    );

    return response.data;
};

// Top 3 merek terpopuler

export const getTopMerekPopuler = async () => {
    const response = await axiosClient.get(
        `${BASE_URL}/merek-populer`
    );

    return response.data;
};

// Transaksi terbesar hari ini

export const getTransaksiTerbesarHariIni = async () => {
    const response = await axiosClient.get(
        `${BASE_URL}/transaksi-terbesar`
    );

    return response.data;
};

// Stok menipis

export const getStokMenipis = async () => {
    const response = await axiosClient.get(
        `${BASE_URL}/stok-menipis`
    );

    return response.data;
};

// Pickup vs delivery

export const getDeliveryVsPickup = async () => {
    const response = await axiosClient.get(
        "/api/dashboard/delivery-vs-pickup"
    );

    return response.data;
};

// Top wilayah pelanggan

export const getTopWilayahPelanggan = async () => {
    const response = await axiosClient.get(
        `${BASE_URL}/wilayah-pelanggan`
    );

    return response.data;
};

// Trafik transaksi mingguan

export const getTrafikTransaksiMingguan = async () => {
    const response = await axiosClient.get(
        `${BASE_URL}/trafik-mingguan`
    );

    return response.data;
};

// Transaksi terbaru

export const getTransaksiTerbaru = async () => {
    const response = await axiosClient.get(
        `${BASE_URL}/transaksi-terbaru`
    );

    return response.data;
};