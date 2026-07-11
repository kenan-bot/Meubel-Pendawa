import axiosClient from "./axiosClient";

const BASE_URL = "/api/laporan-penjualan";

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

export const getDetailLaporanPenjualan = async (startDate, endDate) => {
    const response = await axiosClient.get(`${BASE_URL}/detail`, {
        params: {
            startDate,
            endDate,
        },
    });

    return response.data;
};