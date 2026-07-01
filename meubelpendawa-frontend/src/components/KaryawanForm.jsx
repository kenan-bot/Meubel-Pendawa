import { useState } from "react";
import { useEffect } from "react";

import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import Toast from "./Toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { createKaryawan } from "../api/karyawanApi";
import { useKaryawan } from "../context/KaryawanContext";

const KaryawanForm = () => {
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const [namaKaryawan, setNamaKaryawan] = useState("");
  const [email, setEmail] = useState("");
  const [aksesSistem, setAksesSistem] = useState("");
  const [role, setRole] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { addKaryawan } = useKaryawan();

  const usernameValidation = {
    minLength: username.length >= 8,
    hasLetter: /[A-Za-z]/.test(username),
    hasNumber: /\d/.test(username),
    noSpecialChar: /^[A-Za-z\d]*$/.test(username),
  };

  const passwordValidation = {
    minLength: password.length >= 12,
    upperCase: /[A-Z]/.test(password),
    lowerCase: /[a-z]/.test(password),
    number: /\d/.test(password),
    specialChar: /[@$!%*?&.#_-]/.test(password),
  };

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const resetForm = () => {
    setNamaKaryawan("");
    setEmail("");
    setAksesSistem("");

    setRole("");
    setUsername("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!namaKaryawan.trim()) {
      setToast({
        type: "warning",
        message: "Nama karyawan wajib diisi",
      });
      return;
    }

    if (!email.trim()) {
      setToast({
        type: "warning",
        message: "Email wajib diisi",
      });
      return;
    }

    if (!aksesSistem) {
      setToast({
        type: "warning",
        message: "Pilih akses sistem",
      });
      return;
    }

    if (aksesSistem === "YA") {
      if (!role) {
        setToast({
          type: "warning",
          message: "Role wajib dipilih",
        });
        return;
      }

      if (!username.trim()) {
        setToast({
          type: "warning",
          message: "Username wajib diisi",
        });
        return;
      }

      if (!password.trim()) {
        setToast({
          type: "warning",
          message: "Password wajib diisi",
        });
        return;
      }
      if (
        !usernameValidation.minLength ||
        !usernameValidation.hasLetter ||
        !usernameValidation.hasNumber ||
        !usernameValidation.noSpecialChar
      ) {
        setToast({
          type: "warning",
          message: "Username belum memenuhi syarat",
        });
        return;
      }

      if (
        !passwordValidation.minLength ||
        !passwordValidation.upperCase ||
        !passwordValidation.lowerCase ||
        !passwordValidation.number ||
        !passwordValidation.specialChar
      ) {
        setToast({
          type: "warning",
          message: "Password belum memenuhi syarat",
        });
        return;
      }
    }

    setLoading(true);

    try {
      const data = {
        namaKaryawan,
        email,

        aksesSistem: aksesSistem === "YA",

        role: aksesSistem === "YA" ? role : null,

        username: aksesSistem === "YA" ? username : null,

        password: aksesSistem === "YA" ? password : null,

        statusAktif: true,
      };

      console.log("DATA KARYAWAN:");
      console.log(data);

      const karyawanBaru = await createKaryawan(data);
      addKaryawan(karyawanBaru);

      setToast({
        type: "success",
        message: "Karyawan berhasil ditambahkan",
      });

      resetForm();
    } catch (error) {
      console.error(error);

      setToast({
        type: "error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Gagal menambahkan karyawan",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input type="text" autoComplete="username" className="hidden" />

      <input
        type="password"
        autoComplete="current-password"
        className="hidden"
      />

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* KOLOM KIRI */}
          <div className="space-y-4">
            <FormInput
              label="Nama Karyawan"
              value={namaKaryawan}
              onChange={(e) => setNamaKaryawan(e.target.value)}
              placeholder="Masukkan nama karyawan"
            />

            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="karyawan@gmail.com"
              autoComplete="new-email"
            />

            <FormSelect
              label="Akses Sistem"
              value={aksesSistem}
              onChange={(e) => setAksesSistem(e.target.value)}
            >
              <option value="YA">Ya</option>
              <option value="TIDAK">Tidak</option>
            </FormSelect>
          </div>

          {/* KOLOM KANAN */}
          <div className="space-y-4">
            {aksesSistem === "YA" && (
              <>
                <div className="font-semibold text-orange-500">
                  Buat Akses Login User
                </div>

                <FormSelect
                  label="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="OWNER">Owner</option>
                  <option value="CASHIER_SALES">Kasir & Sales</option>
                  <option value="DRIVER">Driver</option>
                </FormSelect>

                <FormInput
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="buat username"
                />

                {/* validasi teks username*/}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
                  <span
                    className={
                      usernameValidation.minLength
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    ✓ Minimal 8 karakter
                  </span>

                  <span
                    className={
                      usernameValidation.hasLetter
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    ✓ Mengandung huruf
                  </span>

                  <span
                    className={
                      usernameValidation.hasNumber
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    ✓ Mengandung angka
                  </span>

                  <span
                    className={
                      usernameValidation.noSpecialChar
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    ✓ Tanpa karakter khusus
                  </span>
                </div>

                <div className="relative">
                  <FormInput
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="buat password"
                  />

                  {/* validasi teks password */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
                    <span
                      className={
                        passwordValidation.minLength
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ✓ Minimal 12 karakter
                    </span>

                    <span
                      className={
                        passwordValidation.upperCase
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ✓ Huruf besar
                    </span>

                    <span
                      className={
                        passwordValidation.lowerCase
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ✓ Huruf kecil
                    </span>

                    <span
                      className={
                        passwordValidation.number
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ✓ Angka
                    </span>

                    <span
                      className={
                        passwordValidation.specialChar
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      ✓ Karakter khusus
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className="
              bg-orange-500
              text-white
              px-5
              py-2
              rounded-md
              hover:bg-orange-600
              hover:scale-105
              active:scale-95
              transition-all
              duration-200
            "
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>

      {toast && <Toast type={toast.type} message={toast.message} />}
    </>
  );
};

export default KaryawanForm;
