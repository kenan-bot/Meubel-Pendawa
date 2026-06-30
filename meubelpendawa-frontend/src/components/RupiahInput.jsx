const RupiahInput = ({
  label,
  value,
  onChange,
}) => {

  const formatRupiah = (angka) => {
    return "Rp" + Number(angka || 0).toLocaleString("id-ID");
  };

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");

    onChange(rawValue);
  };

  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type="text"
        value={formatRupiah(value)}
        onChange={handleChange}
        className="
          w-full border border-gray-300 rounded-md px-3 py-2
          focus:outline-none focus:ring-2 focus:ring-orange-500
        "
      />
    </div>
  );
};

export default RupiahInput;