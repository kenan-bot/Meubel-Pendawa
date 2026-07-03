import { useMemo, useState, useEffect } from "react";

const usePagination = (data = [], itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Reset ke halaman pertama jika data berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [data]);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        return data.slice(start, end);
    }, [data, currentPage, itemsPerPage]);

    const nextPage = () => {
        if (currentPage < totalPages)
            setCurrentPage((prev) => prev + 1);
    };

    const prevPage = () => {
        if (currentPage > 1)
            setCurrentPage((prev) => prev - 1);
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages)
            setCurrentPage(page);
    };

    return {
        currentPage,
        totalPages,
        paginatedData,

        nextPage,
        prevPage,
        goToPage,

        setCurrentPage,
    };
};

export default usePagination;