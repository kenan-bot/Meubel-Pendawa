import AnimatedSection from "./AnimatedSection";
import { FaKey } from "react-icons/fa";
import { IoPower } from "react-icons/io5";

const KaryawanCard = ({ karyawan = [], onResetPassword, onToggleStatus }) => {
  return (
    <div className="space-y-3">
      {karyawan.map((item, index) => (
        <AnimatedSection key={item.idKaryawan} delay={index * 0.05}>
          <>
            {/* =========== DESKTOP ======= */}
            <div
              className="hidden lg:grid grid-cols-[230px_170px_315px_160px_105px_80px]
                items-center bg-white rounded-2xl px-5 py-4 transition-all duration-300
                hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="font-semibold">{item.namaKaryawan}</div>

              <div>{item.role ?? "-"}</div>

              <div className="truncate">{item.email}</div>

              <div>{item.username ?? "-"}</div>

              <div>
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

              <div className="flex justify-center gap-2">
                <button
                  onClick={() => onResetPassword?.(item)}
                  className="p-2 rounded-lg bg-orange-50 text-orange-500
                  hover:bg-[#E7DBFF] transition"
                >
                  <FaKey />
                </button>

                <button
                  onClick={() => onToggleStatus?.(item)}
                  className={`p-2 rounded-lg transition
                  ${
                    item.statusAktif
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-green-100 text-green-600 hover:bg-green-200"
                  }`}
                >
                  <IoPower />
                </button>
              </div>
            </div>

            {/* =========== MOBILE ========== */}
            <div className="lg:hidden bg-white rounded-2xl shadow-sm p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500">Nama Karyawan</p>

                  <p className="font-semibold">{item.namaKaryawan}</p>
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
                  className="
                    flex-1
                    flex items-center justify-center gap-2
                    bg-[#F3EDFF]
                    text-[#5F04E8]
                    rounded-lg
                    py-2
                    font-medium
                  "
                >
                  <FaKey />
                  Reset
                </button>

                <button
                  onClick={() => onToggleStatus?.(item)}
                  className={`flex-1
                  flex items-center justify-center gap-2
                  rounded-lg
                  py-2
                  font-medium
                  ${
                    item.statusAktif
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  <IoPower />
                  {item.statusAktif ? "Nonaktifkan" : "Aktifkan"}
                </button>
              </div>
            </div>
          </>
        </AnimatedSection>
      ))}
    </div>
  );
};

export default KaryawanCard;
