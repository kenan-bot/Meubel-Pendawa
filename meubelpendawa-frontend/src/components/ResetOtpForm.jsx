import { useState } from "react";
import FormInput from "./FormInput";
import { HiCheckCircle } from "react-icons/hi2";
import { FiLoader } from "react-icons/fi";

const ResetOtpForm = ({
  email,
  onClose,
  onVerify,
  loading = false,

  sendingOtp = false,
  sendError = "",

  otpVerified = false,
  countdown = 3,
}) => {
  const [kodeOtp, setKodeOtp] = useState("");

  const handleSubmit = () => {
    if (kodeOtp.length !== 6) return;

    onVerify?.(kodeOtp);
  };

  if (otpVerified) {
    return (
      <div className="py-8 text-center">
        <div className="flex justify-center mb-5">
          <div className="rounded-full bg-green-100 p-4 shadow-lg shadow-green-200/50">
            <HiCheckCircle className="text-green-600" size={52} />
          </div>
        </div>

        <h2 className="text-xl font-bold">Verifikasi Berhasil</h2>

        <p className="text-gray-500 mt-3">
          Anda akan diarahkan ke form
          <br />
          Reset Password
        </p>

        <div className="mt-6 text-5xl font-extrabold text-orange-500">
          {countdown}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        {sendingOtp ? (
          <>
            <FiLoader
              className="mx-auto mb-3 animate-spin text-orange-500"
              size={30}
            />

            <p className="font-medium">Mengirim kode OTP...</p>
          </>
        ) : sendError ? (
          <>
            <p className="text-red-500 font-medium">{sendError}</p>
          </>
        ) : (
          <>
            <p className="text-gray-500">Kode OTP telah dikirim ke</p>

            <p className="font-semibold text-[#FF6B00] mt-1">{email}</p>
          </>
        )}
      </div>

      <FormInput
        label="Kode OTP"
        placeholder="Masukkan 6 digit OTP"
        value={kodeOtp}
        onChange={(e) => setKodeOtp(e.target.value)}
        maxLength={6}
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          Batal
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading || sendingOtp}
          className="px-5 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition disabled:opacity-60"
        >
          {loading ? "Memverifikasi..." : "Verifikasi OTP"}
        </button>
      </div>
    </div>
  );
};

export default ResetOtpForm;
