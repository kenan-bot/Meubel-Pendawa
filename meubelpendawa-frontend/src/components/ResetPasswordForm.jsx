import { useState } from "react";
import FormInput from "./FormInput";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPasswordForm = ({
  namaKaryawan,
  onClose,
  onSubmit,
  loading = false,
  onError,
}) => {
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    if (!passwordBaru.trim()) {
      onError?.("Password baru wajib diisi.");
      return;
    }

    if (!konfirmasiPassword.trim()) {
      onError?.("Konfirmasi password wajib diisi.");
      return;
    }

    if (passwordBaru !== konfirmasiPassword) {
      onError?.("Konfirmasi password tidak sesuai.");
      return;
    }

    if (passwordBaru.length < 12) {
      onError?.("Password minimal 12 karakter.");
      return;
    }

    if (!/[A-Z]/.test(passwordBaru)) {
      onError?.("Password harus mengandung huruf besar.");
      return;
    }

    if (!/[a-z]/.test(passwordBaru)) {
      onError?.("Password harus mengandung huruf kecil.");
      return;
    }

    if (!/\d/.test(passwordBaru)) {
      onError?.("Password harus mengandung angka.");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(passwordBaru)) {
      onError?.("Password harus mengandung karakter khusus.");
      return;
    }

    onSubmit(passwordBaru);
  };

  const hasMinLength = passwordBaru.length >= 12;
  const hasUpperCase = /[A-Z]/.test(passwordBaru);
  const hasLowerCase = /[a-z]/.test(passwordBaru);
  const hasNumber = /\d/.test(passwordBaru);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(passwordBaru);

  const Rule = ({ valid, children }) => (
    <p className={`text-sm ${valid ? "text-green-600" : "text-gray-500"}`}>
      {valid ? "✓" : "•"} {children}
    </p>
  );

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-gray-500">Nama Karyawan</p>

        <p className="font-semibold text-lg text-[#FF6B00]">{namaKaryawan}</p>
      </div>

      <FormInput
        label="Password Baru"
        type={showPassword ? "text" : "password"}
        value={passwordBaru}
        onChange={(e) => setPasswordBaru(e.target.value)}
        rightIcon={showPassword ? <FaEyeSlash /> : <FaEye />}
        onRightIconClick={() => setShowPassword(!showPassword)}
        autoComplete="new-password"
      />

      <FormInput
        label="Konfirmasi Password"
        type={showConfirmPassword ? "text" : "password"}
        value={konfirmasiPassword}
        onChange={(e) => setKonfirmasiPassword(e.target.value)}
        rightIcon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
        autoComplete="new-password"
      />

      <div className="space-y-1 bg-gray-50 rounded-lg p-3">
        <Rule valid={hasMinLength}>Minimal 12 karakter</Rule>

        <Rule valid={hasUpperCase}>Mengandung huruf besar</Rule>

        <Rule valid={hasLowerCase}>Mengandung huruf kecil</Rule>

        <Rule valid={hasNumber}>Mengandung angka</Rule>

        <Rule valid={hasSpecial}>Mengandung karakter khusus</Rule>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
        >
          Batal
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition disabled:opacity-60"
        >
          {loading ? "Menyimpan..." : "Simpan Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
