import { useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import { FaKey } from "react-icons/fa";
import { useKaryawan } from "../context/KaryawanContext";
import { updateStatusKaryawan } from "../api/karyawanApi";
import StatusToggle from "./StatusToggle";
import ConfirmModal from "./ConfirmModal";

const KaryawanCard = ({ karyawan = [], onResetPassword, onToggleStatus }) => {
  const { updateStatusState } = useKaryawan();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedKaryawan, setSelectedKaryawan] = useState(null);

  const handleToggle = async (item) => {
    try {
      console.log("TOGGLE:", item.idKaryawan);

      const result = await updateStatusKaryawan(
        item.idKaryawan,
        !item.statusAktif,
      );

      console.log("RESULT:", result);

      updateStatusState(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirm = async () => {
    console.log("KONFIRM DIKLIK");
    console.log(selectedKaryawan);

    await handleToggle(selectedKaryawan);

    setShowConfirm(false);
    setSelectedKaryawan(null);
  };

  const handleSwitchClick = (item) => {
    if (item.statusAktif) {
      setSelectedKaryawan(item);
      setShowConfirm(true);
      return;
    }

    handleToggle(item);
  };

  return (
    <>
      <div className="space-y-3">
        {karyawan.map((item, index) => (
          <AnimatedSection
            key={item.idKaryawan}
            delay={Math.min(index * 0.04, 0.3)}
          >
            <>
              {/* =========== DESKTOP ======= */}
              <div
                className="hidden lg:grid grid-cols-[3fr_2.7fr_2.8fr_2fr_1.5fr_0.8fr] items-center
                bg-white rounded-2xl px-5 py-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                {/* Nama */}
                <div className="justify-self-start">
                  <p className="font-semibold text-gray-800">
                    {item.namaKaryawan}
                  </p>
                  <p className="text-xs text-gray-400">{item.idKaryawan}</p>
                </div>

                {/* Role */}
                <div>{item.role ?? "-"}</div>

                {/* Email */}
                <div className="justify-self-start min-w-0 w-full">
                  <span className="truncate block">{item.email}</span>
                </div>

                {/* Username */}
                <div className="justify-self-start">{item.username ?? "-"}</div>

                {/* Status */}
                <div className="justify-self-start">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold
                  ${item.statusAktif
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"}`}
                  >
                    {item.statusAktif ? "Aktif" : "Nonaktif"}
                  </span>
                </div>

                {/* Tindakan */}
                <div className="justify-self-center flex items-center gap-2">
                  <button
                    onClick={() => onResetPassword?.(item)}
                    className="p-2 rounded-lg text-orange-500 hover:bg-orange-100 transition"
                  >
                    <FaKey />
                  </button>

                  <StatusToggle
                    checked={item.statusAktif}
                    onChange={() => handleSwitchClick(item)}
                  />
                </div>
              </div>

              {/* =========== MOBILE ========== */}
              <div className="lg:hidden bg-white rounded-2xl shadow-sm p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500">Nama Karyawan</p>

                    <p className="font-semibold text-gray-800">
                      {item.namaKaryawan}
                    </p>

                    <p className="text-xs text-gray-400">{item.idKaryawan}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      item.statusAktif
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.statusAktif ? "Aktif" : "Nonaktif"}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p>{item.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Role</p>
                    <p>{item.role ?? "-"}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Username</p>
                    <p>{item.username ?? "-"}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => onResetPassword?.(item)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#F3EDFF]
                  text-[#5F04E8] rounded-lg py-2 font-medium"
                  >
                    <FaKey />
                    Reset
                  </button>

                  <div className="flex-1 flex items-center justify-center gap-2">
                    <StatusToggle
                      checked={item.statusAktif}
                      onChange={() => handleSwitchClick(item)}
                    />

                    <span className="font-medium">
                      {item.statusAktif ? "Nonaktifkan" : "Aktifkan"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          </AnimatedSection>
        ))}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Nonaktifkan Karyawan"
        message={`Karyawan "${selectedKaryawan?.namaKaryawan}" akan dinonaktifkan dan disembunyikan 
        dari daftar setelah 24 jam.`}
        onConfirm={handleConfirm}
        onClose={() => {
          setShowConfirm(false);
          setSelectedKaryawan(null);
        }}
      />
    </>
  );
};

export default KaryawanCard;
