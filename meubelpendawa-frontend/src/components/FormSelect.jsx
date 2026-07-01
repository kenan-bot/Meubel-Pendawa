const FormSelect = ({ label, value, onChange, children }) => {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="w-full h-10 border border-gray-300 rounded-md px-3 py-2
        focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <option value="" disabled hidden>
          Pilih
        </option>

        {children}
      </select>
    </div>
  );
};

export default FormSelect;
