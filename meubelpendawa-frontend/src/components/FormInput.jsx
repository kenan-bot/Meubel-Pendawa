const FormInput = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  autoComplete = "off",

  rightIcon = null,
  onRightIconClick,
}) => {
  return (
    <div className="w-full">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10
          focus:outline-none focus:ring-2 focus:ring-orange-500
          transition-all duration-200"
        />

        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2
            text-gray-500 hover:text-orange-500 transition"
          >
            {rightIcon}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormInput;