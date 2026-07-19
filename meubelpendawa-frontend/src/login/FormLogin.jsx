import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "../components/AnimatedSection";
import Toast from "../components/Toast";
import { login } from "../api/authApi";

export default function FormLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await login(username, password);

      if (!data.success) {
        setToast({
          type: "error",
          message: data.message,
        });
        return;
      }

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("role", data.role);
      sessionStorage.setItem("idKaryawan", data.idKaryawan);
      sessionStorage.setItem("namaKaryawan", data.namaKaryawan);

      if (data.role === "OWNER") {
        navigate("/owner");
      } else if (data.role === "CASHIER_SALES") {
        navigate("/kasir");
      } else if (data.role === "DRIVER") {
        navigate("/driver");
      }
    } catch (error) {
      setToast({
        type: "error",
        message:
          error.response?.data?.message || "Tidak dapat terhubung ke server",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-[#5B21F5]
    px-4 sm:px-6 lg:px-8 py-6 md:py-8 relative overflow-hidden"
    >
      {/* tombol kembali */}
      <button
        onClick={() => navigate("/")}
        className="bg-orange-500 px-5 py-2 rounded-lg absolute top-4 right-4 sm:top-5 sm:right-5 text-white font-medium flex items-center gap-2 hover:bg-white hover:text-orange-500 transition-all duration-500 ease-in-out hover:scale-105 hover:scale-105"
        aria-label="Tutup"
      >
        Kembali
      </button>

      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        {/* left panel - branding card */}
        <AnimatedSection delay={0.1}>
          <div className="bg-white rounded-2xl shadow-xl transition-all duration-300 flex flex-col items-center justify-center px-10 py-12 w-full max-w-xs sm:max-w-sm flex-shrink-0 mx-auto">
            {/* Icon Box */}
            <div
              className="bg-[#5B21F5] rounded-2xl w-32 h-32 sm:w-40 sm:h-40
          md:w-44 md:h-44 flex items-center justify-center mb-6"
            >
              {/* sofa / chair svg */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 80 60"
                fill="none"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
              >
                {/* Backrest */}
                <rect x="8" y="8" width="64" height="22" rx="6" fill="white" />
                {/* Seat */}
                <rect x="4" y="30" width="72" height="16" rx="6" fill="white" />
                {/* Left armrest */}
                <rect x="4" y="22" width="12" height="24" rx="5" fill="white" />
                {/* Right armrest */}
                <rect
                  x="64"
                  y="22"
                  width="12"
                  height="24"
                  rx="5"
                  fill="white"
                />
                {/* left leg */}
                <rect x="12" y="46" width="7" height="10" rx="3" fill="white" />
                {/* right leg */}
                <rect x="61" y="46" width="7" height="10" rx="3" fill="white" />
              </svg>
            </div>

            {/* title */}
            <h1 className="text-[#5B21F5] text-lg sm:text-xl md:text-2xl font-bold text-center leading-tight">
              Internal Management
              <br />
              System
            </h1>
          </div>
        </AnimatedSection>

        {/* right panel - login form */}
        <div className="w-full max-w-sm md:max-w-md flex flex-col mx-auto">
          <AnimatedSection delay={0.2}>
            <>
              {/* heading */}
              <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-1">
                Toko Meubel Pendawa
              </h2>
              <p className="text-white/70 text-sm mb-7">
                Login Portal Management
              </p>
            </>
          </AnimatedSection>

          {/* form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* username field */}
            <AnimatedSection delay={0.2}>
              <div className="flex flex-col gap-1.5">
                <label className="text-white text-sm font-medium">
                  Username
                </label>
                <div className="flex items-center bg-white/95 rounded-xl px-4 py-3 gap-3 focus-within:ring-2 focus-within:ring-white/60 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Masukkan Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-700 text-sm placeholder-gray-400"
                    autoComplete="username"
                  />
                </div>
              </div>
            </AnimatedSection>

            {/* password field */}
            <AnimatedSection delay={0.2}>
              <div className="flex flex-col gap-1.5">
                <label className="text-white text-sm font-medium">
                  Password
                </label>
                <div className="flex items-center bg-white/95 rounded-xl px-4 py-3 gap-3 focus-within:ring-2 focus-within:ring-white/60 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-700 text-sm placeholder-gray-400"
                    autoComplete="current-password"
                  />
                  {/* eye toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </AnimatedSection>

            {/* notice */}
            <AnimatedSection delay={0.2}>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0 shadow-sm" />
                <p className="text-white/80 text-xs md:text-sm">
                  Lapor Owner jika mengalami kendala Login.
                </p>
              </div>
            </AnimatedSection>

            {/* login button */}
            <AnimatedSection delay={0.2}>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-amber-500 active:scale-[0.98] text-white font-semibold text-sm sm:text-base rounded-xl py-3.5 mt-2 transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Masuk...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </AnimatedSection>
          </form>
        </div>
        {toast && <Toast type={toast.type} message={toast.message} />}
      </div>
    </div>
  );
}
