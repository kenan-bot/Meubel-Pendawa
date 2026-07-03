import { formatDateTime } from "../utils/dateFormatter";

function LoginLogCard({ loginLogs }) {
  if (!loginLogs.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        Belum ada riwayat login.
      </div>
    );
  }

  return (
    <>
      {loginLogs.map((log) => (
        <div
          key={log.idLog}
          className="
            bg-white
            border
            border-gray-200
            rounded-2xl
            shadow-sm
            hover:shadow-md
            transition
            duration-300
            mb-4
            px-5
            py-4
          "
        >
          {/* ================= Desktop ================= */}
          <div
            className="
              hidden
              lg:grid
              grid-cols-[240px_120px_190px_190px_170px_120px]
              items-center
            "
          >
            {/* Nama */}
            <div>
              <p className="font-semibold text-gray-800">{log.namaKaryawan}</p>

              <p className="text-xs text-gray-400">{log.idKaryawan}</p>
            </div>

            {/* Role */}
            <div>
              <span
                className="
                  inline-block
                  bg-orange-100
                  text-orange-600
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-semibold
                "
              >
                {log.role}
              </span>
            </div>

            {/* Login Logout */}
            <div className="text-sm">{formatDateTime(log.loginAt)}</div>

            <div className="text-sm">{formatDateTime(log.logoutAt)}</div>

            {/* Durasi */}
            <div className="font-medium">{log.durasi}</div>

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
      ))}
    </>
  );
}

export default LoginLogCard;
