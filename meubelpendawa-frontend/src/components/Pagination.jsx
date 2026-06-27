function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center gap-2 my-8">
      {/* Tombol Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-full border-2 border-gray-300 bg-white text-gray-600 font-bold flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ‹
      </button>

      {/* Nomor Halaman */}
      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={`dots-${index}`} className="px-1 text-white font-bold">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-full font-bold text-sm transition ${
              currentPage === page
                ? "bg-[#FF6B00] text-white shadow-md"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Tombol Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-full border-2 border-gray-300 bg-white text-gray-600 font-bold flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ›
      </button>
    </div>
  );
}

export default Pagination;