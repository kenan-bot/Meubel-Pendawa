import axiosClient from "./axiosClient";

const BASE_URL = "/api/laporan-penjualan";

// SUMMARY

export const getSummaryLaporanPenjualan = async () => {
    const response = await axiosClient.get(
        `${BASE_URL}/summary`
    );

    return response.data;
};

export const getSummaryLaporanPenjualanByPeriode = async (
    startDate,
    endDate
) => {
    const response = await axiosClient.get(
        `${BASE_URL}/summary`,
        {
            params: {
                startDate,
                endDate,
            },
        }
    );

    return response.data;
};

// DETAIL PENJUALAN

export const getDetailLaporanPenjualan = async (
    startDate,
    endDate
) => {
    const response = await axiosClient.get(
        `${BASE_URL}/detail`,
        {
            params: {
                startDate,
                endDate,
            },
        }
    );

    return response.data;
};

// KONTRIBUSI PRODUK

export const getKontribusiProduk = async (
    startDate,
    endDate
) => {
    const response = await axiosClient.get(
        `${BASE_URL}/kontribusi-produk`,
        {
            params: {
                startDate,
                endDate,
            },
        }
    );

    return response.data;
};

// TREN PENJUALAN

export const getTrenPenjualan = async (
    startDate,
    endDate
) => {
    const response = await axiosClient.get(
        `${BASE_URL}/tren`,
        {
            params: {
                startDate,
                endDate,
            },
        }
    );

    return response.data;
};

// EXPORT PDF & EMAIL

export const kirimLaporanPenjualanEmail = async (
    startDate,
    endDate
) => {
    const response = await axiosClient.post(
        `${BASE_URL}/export`,
        null,
        {
            params: {
                startDate,
                endDate,
            },
        }
    );

    return response.data;
};