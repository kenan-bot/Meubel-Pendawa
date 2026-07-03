import { formatDateTime } from "../utils/dateFormatter";
import AnimatedSection from "./AnimatedSection";

function LoginLogCard({ loginLogs }) {
  if (!loginLogs.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        Belum ada riwayat login ditanggal ini.
      </div>
    );
  }

  return (
    <>
      {loginLogs.map((log, index) => (
        <AnimatedSection key={log.idLog} delay={Math.min(index * 0.04, 0.3)}>
          <div
            className="
          bg-white
          border
          border-gray-200
          rounded-2xl
          shadow-sm
          hover:shadow-md
          transition-all
          duration-300
          mb-4
          px-5
          py-4
          hover:scale-[1.02]
        "
          >
            {/* ================= Desktop ================= */}
            <div className="hidden lg:grid grid-cols-[2fr_1fr_1.8fr_1.8fr_1.3fr_1.4fr_1fr] items-center">
              {/* Nama */}
              <div className="min-w-0">
                <p className="font-semibold truncate">{log.namaKaryawan}</p>
                <p className="text-xs text-gray-400 truncate">
                  {" "}
                  {log.idKaryawan}
                </p>
              </div>

              {/* Role */}
              <div className="flex items-center">
                <span
                  className="inline-flex whitespace-nowrap bg-orange-100 text-orange-600 px-3 py-1 rounded-full
                  text-xs font-semibold">{" "}{log.role}
                </span>
              </div>

              {/* Login */}
              <div className="min-w-0">
                <p className="text-sm whitespace-nowrap">
                  {formatDateTime(log.loginAt)}
                </p>
              </div>

              {/* Logout */}
              <div className="min-w-0">
                <p className="text-sm whitespace-nowrap">
                  {formatDateTime(log.logoutAt)}
                </p>
              </div>

              {/* Durasi */}
              <div className="min-w-0">
                <p className="font-normal leading-5">{log.durasi}</p>
              </div>

              {/* Jam Kerja */}
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                ${
                  log.loginDiluarJamOperasional
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
                >
                  {log.loginDiluarJamOperasional
                    ? "Diluar Jam Kerja"
                    : "Jam Kerja"}
                </span>
              </div>

              {/* Status */}
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                ${
                  log.status === "Aktif"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
                >
                  {log.status}
                </span>
              </div>
            </div>

            {/* ================= Mobile ================= */}
            <div className="lg:hidden space-y-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {log.namaKaryawan}
                  </h3>

                  <p className="text-xs text-gray-400">{log.idKaryawan}</p>
                </div>

                <span
                  className="
                bg-orange-100
                text-orange-600
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
                h-fit
              "
                >
                  {log.role}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-gray-500">Login</span>
                <span>{formatDateTime(log.loginAt)}</span>

                <span className="text-gray-500">Logout</span>
                <span>{formatDateTime(log.logoutAt)}</span>

                <span className="text-gray-500">Durasi</span>
                <span>{log.durasi}</span>

                <span className="text-gray-500">Jam Kerja</span>
                <span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    log.loginDiluarJamOperasional
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                  >
                    {log.loginDiluarJamOperasional
                      ? "Diluar Jam Kerja"
                      : "Jam Kerja"}
                  </span>
                </span>

                <span className="text-gray-500">Status</span>
                <span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    log.status === "Aktif"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  >
                    {log.status}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      ))}
    </>
  );
}

export default LoginLogCard;
