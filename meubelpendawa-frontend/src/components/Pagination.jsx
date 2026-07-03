import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import React from "react";
import { useEffect } from "react";

function Pagination({ currentPage, totalPages, onPageChange, onNext, onPrev }) {
  if (totalPages <= 1) return null;

  const generatePages = () => {
    const pages = [];

    // Jika halaman sedikit tampilkan semua
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    // ===== Awal =====
    if (currentPage <= 2) {
      pages.push(1, 2, 3, "...", totalPages);
      return pages;
    }

    // ===== Akhir =====
    if (currentPage >= totalPages - 1) {
      pages.push(totalPages - 2, totalPages - 1, totalPages);

      return pages;
    }

    // ===== Tengah =====
    pages.push(currentPage - 1, currentPage, currentPage + 1);

    if (currentPage + 1 < totalPages) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  useEffect(() => {
    const container = document.getElementById("page-content");

    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [currentPage]);

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
      {/* Previous */}
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="
          flex items-center gap-1
          px-2 py-2
          rounded-full
          border
          border-gray-300
          bg-white
          hover:bg-orange-500
          hover:text-white
          disabled:opacity-40
          disabled:cursor-not-allowed
          transition-all
          duration-300
        "
      >
        <FiChevronLeft />
      </button>

      {/* Nomor Halaman */}
      {generatePages().map((page, index) => {
        const uniqueKey = `${page}-${index}`;

        return page === "..." ? (
          <span key={uniqueKey} className="px-2 text-gray-500 font-semibold">
            ...
          </span>
        ) : (
          <button
            key={uniqueKey}
            onClick={() => onPageChange(page)}
            className={`
        w-10 h-10
        rounded-full
        font-semibold
        transition-all
        duration-300
        ${
          currentPage === page
            ? "bg-orange-500 text-white shadow-md"
            : "bg-white border border-gray-300 hover:bg-orange-100"
        }
      `}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="
          flex items-center gap-1
          px-2 py-2
          rounded-full
          border
          border-gray-300
          bg-white
          hover:bg-orange-500
          hover:text-white
          disabled:opacity-40
          disabled:cursor-not-allowed
          transition-all
          duration-300
        "
      >
        <FiChevronRight />
      </button>
    </div>
  );
}

export default Pagination;
