const StatusToggle = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange(e);
      }}
      className={`
        relative w-14 h-8 rounded-full transition-all duration-300
        ${checked ? "bg-green-500" : "bg-gray-300"}
      `}
    >
      <span
        className={`
          absolute top-1 left-1
          w-6 h-6 bg-white rounded-full shadow-md
          transition-all duration-300
          ${checked ? "translate-x-6" : ""}
        `}
      />
    </button>
  );
};

export default StatusToggle;
