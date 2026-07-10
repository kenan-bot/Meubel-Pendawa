const StatusToggle = ({ checked = false, onChange, disabled = false }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!disabled) {
          onChange?.();
        }
      }}
      className={`
        relative w-14 h-8 rounded-full
        transition-all duration-300
        ${checked ? "bg-green-500" : "bg-gray-300"}
        ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <span
        className={`
          absolute top-1 left-1
          w-6 h-6 rounded-full bg-white shadow-md
          transition-all duration-300
          ${checked ? "translate-x-6" : ""}
        `}
      />
    </button>
  );
};

export default StatusToggle;
