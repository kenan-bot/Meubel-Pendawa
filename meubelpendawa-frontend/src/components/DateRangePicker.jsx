import { useRef } from "react";
import { FiCalendar, FiX } from "react-icons/fi";

function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onReset,
}) {
  const startRef = useRef(null);
  const endRef = useRef(null);

  const openPicker = (ref) => {
    if (!ref.current) return;

    ref.current.focus();

    // Chrome, Edge, Opera
    if (ref.current.showPicker) {
      ref.current.showPicker();
    }
  };

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      {/* Tanggal Awal */}
      <div
        onClick={() => openPicker(startRef)}
        className="relative w-full sm:w-44 cursor-pointer"
      >
        <FiCalendar
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none"
        />

        <input
          ref={startRef}
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-sm
          outline-none transition-all duration-300 hover:border-orange-400
          focus:border-orange-500 focus:ring-2 focus:ring-orange-200 cursor-pointer"
        />
      </div>

      <span className="hidden lg:block text-gray-400 text-sm font-medium">
        -
      </span>

      {/* Tanggal Akhir */}
      <div
        onClick={() => openPicker(endRef)}
        className="relative w-full sm:w-44 cursor-pointer"
      >
        <FiCalendar
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none"
        />

        <input
          ref={endRef}
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-3 py-2.5 text-sm
          outline-none transition-all duration-300 hover:border-orange-400
          focus:border-orange-500 focus:ring-2 focus:ring-orange-200 cursor-pointer"
        />
      </div>

      <button
        onClick={onReset}
        className="flex items-center justify-center gap-2 h-8 px-3 rounded-lg
        bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all
        duration-300 text-white font-medium whitespace-nowrap"
      >
        <FiX size={16} />
        Clear
      </button>
    </div>
  );
}

export default DateRangePicker;
