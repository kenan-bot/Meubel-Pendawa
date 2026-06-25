function Pagination() {
  return (
    <div className="flex items-center gap-2">
      <button className="px-3 py-2 rounded-lg border border-gray-300">
        Prev
      </button>

      <button className="px-3 py-2 rounded-lg bg-[#5F04E8] text-white">
        1
      </button>

      <button className="px-3 py-2 rounded-lg border border-gray-300">
        2
      </button>

      <button className="px-3 py-2 rounded-lg border border-gray-300">
        3
      </button>

      <button className="px-3 py-2 rounded-lg border border-gray-300">
        Next
      </button>
    </div>
  );
}

export default Pagination;