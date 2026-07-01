import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";

import { requestOtp, verifyOtp, resetPassword } from "../api/authApi";
import { useKaryawan } from "../context/KaryawanContext";
import SearchBar from "../components/SearchBar";
import KaryawanCard from "../components/KaryawanCard";
import { FiPlus } from "react-icons/fi";
import KaryawanForm from "../components/KaryawanForm";
import Modal from "../components/Modal";
import ResetOtpForm from "../components/ResetOtpForm";
import ResetPasswordForm from "../components/ResetPasswordForm";
import Toast from "../components/Toast";

function Karyawan() {
  const [openModal, setOpenModal] = useState(false);
  const { filteredKaryawan, loading, searchTerm, setSearchTerm } =
    useKaryawan();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [selectedKaryawan, setSelectedKaryawan] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleResetPassword = async (item) => {
    if (!item.aksesSistem) {
      setToast({
        type: "warning",
        message: "Karyawan ini tidak mempunyai akses sistem.",
      });

      return;
    }

    try {
      await requestOtp(item.email);

      setSelectedKaryawan(item);
      setShowOtpModal(true);

      setToast({
        type: "success",
        message: "Kode OTP berhasil dikirim.",
      });
    } catch (error) {
      console.error(error);

      console.log("Status:", error.response?.status);
      console.log("Data:", error.response?.data);

      setToast({
        type: "error",
        message: "Gagal mengirim kode OTP.",
      });
    }
  };

  const handleVerifyOtp = async (otp) => {
    try {
      setOtpLoading(true);
      if (!selectedKaryawan) return;

      await verifyOtp(selectedKaryawan.email, otp);
      await verifyOtp(selectedKaryawan.email, otp);
      setOtpVerified(true);

      setToast({
        type: "success",
        message: "OTP berhasil diverifikasi",
      });

      let timer = 3;
      setCountdown(3);

      const interval = setInterval(() => {
        timer--;
        setCountdown(timer);

        if (timer === 0) {
          clearInterval(interval);
          setShowOtpModal(false);
          setOtpVerified(false);
          setShowResetModal(true);
        }
      }, 1000);
    } catch (error) {
      console.error(error);

      setToast({
        type: "error",
        message: "Kode OTP salah atau sudah kadaluarsa",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResetPasswordBaru = async (passwordBaru) => {
    try {
      if (!selectedKaryawan) return;

      setResetLoading(true);

      await resetPassword(selectedKaryawan.email, passwordBaru);

      setToast({
        type: "success",
        message: "Password berhasil diperbarui.",
      });

      setShowResetModal(false);

      setSelectedKaryawan(null);
    } catch (error) {
      console.error(error);

      setToast({
        type: "error",
        message: "Gagal memperbarui password.",
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="px-3 py-5 md:p-5">
      {/* Judul */}
      <div className="md:-mt-7 mb-6">
        <h1 className="font-extrabold text-2xl md:text-3xl leading-tight">
          Kelola Karyawan
        </h1>

        <p className="text-sm md:text-base text-gray-500">
          Kelola karyawan dan akses sistem karyawan
        </p>
      </div>

      {/* Search + Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <SearchBar
          theme="orange"
          placeholder="Cari karyawan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          onClick={() => setOpenModal(true)}
          className="md:ml-auto flex items-center gap-1.5 bg-orange-500 text-white text-sm font-medium
          px-3 py-1.5 rounded-md hover:bg-orange-600 hover:scale-[1.02]
          transition-all duration-300 ease-out"
        >
          <FiPlus size={18} />
          Tambah Karyawan
        </button>
      </div>

      {/* Header */}
      <div
        className="hidden lg:grid grid-cols-[230px_170px_315px_160px_105px_80px] items-center
        border border-orange-500 text-orange-500 rounded-2xl px-5 py-4 font-semibold mb-4"
      >
        <div>Nama Karyawan</div>
        <div>Role</div>
        <div>Email</div>
        <div>Username</div>
        <div>Status</div>
        <div className="text-center">Tindakan</div>
      </div>

      {/* Card */}
      {loading ? (
        <div className="p-6">Memuat data karyawan...</div>
      ) : (
        <KaryawanCard
          karyawan={filteredKaryawan}
          onResetPassword={handleResetPassword}
        />
      )}

      {/* modal tambah karyawan */}
      <Modal
        maxWidth="max-w-3xl"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Tambah Karyawan"
      >
        <KaryawanForm />
      </Modal>

      {/* modal otp */}
      <Modal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
          setSelectedKaryawan(null);

          setOtpVerified(false);
          setCountdown(3);
        }}
        title="Verifikasi OTP"
        maxWidth="max-w-sm"
      >
        <ResetOtpForm
          email={selectedKaryawan?.email}
          onClose={() => {
            setShowOtpModal(false);
            setSelectedKaryawan(null);
            setOtpVerified(false);
            setCountdown(3);
          }}
          onVerify={handleVerifyOtp}
          loading={otpLoading}
          otpVerified={otpVerified}
          countdown={countdown}
        />
      </Modal>

      {/* modal reset password */}
      <Modal
        isOpen={showResetModal}
        onClose={() => {
          setShowResetModal(false);
          setSelectedKaryawan(null);
        }}
        title="Reset Password"
        maxWidth="max-w-md"
      >
        <ResetPasswordForm
          namaKaryawan={selectedKaryawan?.namaKaryawan}
          onClose={() => {
            setShowResetModal(false);
            setSelectedKaryawan(null);
          }}
          onSubmit={handleResetPasswordBaru}
          loading={resetLoading}
          onError={(message) =>
            setToast({
              type: "warning",
              message,
            })
          }
        />
      </Modal>

      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

export default Karyawan;
