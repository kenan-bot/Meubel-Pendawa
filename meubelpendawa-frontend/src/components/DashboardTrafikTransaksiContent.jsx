import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { motion } from "framer-motion";

import {
  FiTrendingUp,
  FiClock,
  FiShoppingBag,
  FiDollarSign,
} from "react-icons/fi";

/* ===========================
   FORMATTER
=========================== */

function formatRupiah(value = 0) {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(Number(value));
}

function formatAxis(value = 0) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)} jt`;
  }

  if (value >= 1000) {
    return `${Math.round(value / 1000)} rb`;
  }

  return value;
}

/* ===========================
   TOOLTIP
=========================== */

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
        y: 8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.2,
      }}
      className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl shadow-2xl px-5
      py-4 min-w-[220px]"
    >
      <div className="font-bold text-gray-800 mb-3">{label}</div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <FiDollarSign size={15} />
            <span>Omzet</span>
          </div>

          <span className="font-bold text-orange-500">
            {formatRupiah(item.totalOmzet)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <FiShoppingBag size={15} />
            <span>Transaksi</span>
          </div>

          <span className="font-bold">{item.totalTransaksi ?? 0}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <FiClock size={15} />
            <span>Jam Ramai</span>
          </div>

          <span className="font-semibold">{item.intervalJam || "-"}</span>
        </div>
      </div>
    </motion.div>
  );
};
const renderedDays = new Set();

const formatHariAxis = (value, index, payload) => {
  if (index === 0) {
    renderedDays.clear();
  }

  if (renderedDays.has(value)) {
    return "";
  }

  renderedDays.add(value);

  return value;
};

function DashboardTrafikTransaksiContent({ summary, chart = [] }) {
  const statistik = summary ?? {
    totalTransaksi: 0,
    totalOmzet: 0,
    persentasePertumbuhan: 0,
    peakHari: "-",
    peakInterval: "-",
    peakTransaksi: 0,
    peakOmzet: 0,
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="h-full flex flex-col"
    >
      {/* HEADER */}

      <div className="mb-6 flex items-start justify-between">
        {/* Judul */}
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Trafik Transaksi Mingguan
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Aktivitas transaksi selama 7 hari terakhir
          </p>
        </div>

        {/* Growth */}
        <div
          className="
            flex items-center gap-2
            rounded-full
            bg-orange-50
            px-3 py-2
        "
        >
          <FiTrendingUp className="text-orange-500" />

          <span className="font-semibold text-orange-500">
            {statistik.persentasePertumbuhan >= 0 ? "+" : ""}
            {statistik.persentasePertumbuhan.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* KPI */}

      <div className="mb-4 grid grid-cols-3 gap-2">
        {/* Total Transaksi */}
        <div className="rounded-xl border border-orange-500 bg-orange-50/70 px-4 py-2 flex flex-col justify-center transition-all duration-300 hover:scale-105">
          <span className="text-[10px] uppercase tracking-wide text-gray-500">
            Total Transaksi
          </span>

          <span className="mt-0.5 text-2xl font-bold text-gray-800 leading-none">
            {statistik.totalTransaksi}
          </span>
        </div>

        {/* Peak Hour */}
        <div className="rounded-xl border border-orange-200 bg-white px-4 py-2 flex flex-col justify-center transition-all duration-300 hover:scale-105">
          <span className="text-[10px] uppercase tracking-wide text-gray-500">
            Aktivitas Tersibuk
          </span>

          <span className="mt-0.5 text-lg font-bold text-gray-800 leading-none">
            {statistik.peakHari}
          </span>

          <span className="mt-0.5 text-xs text-gray-500 leading-none">
            {statistik.peakInterval}
          </span>
        </div>

        {/* Omzet */}
        <div className="rounded-xl border border-orange-200 bg-white px-4 py-2 flex flex-col justify-center transition-all duration-300 hover:scale-105">
          <span className="text-[10px] uppercase tracking-wide text-gray-500">
            Omzet
          </span>

          <span className="mt-0.5 text-xl font-bold text-gray-800 leading-none">
            {formatRupiah(statistik.totalOmzet)}
          </span>
        </div>
      </div>

      {/* CHART */}

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chart}
            margin={{
              top: 15,
              right: 20,
              left: 5,
              bottom: 5,
            }}
          >
            <defs>
              {/* Area */}
              <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="45%" stopColor="#fb923c" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>

              {/* Line */}
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>

              {/* Glow */}
              <filter
                id="lineGlow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="4"
                  floodColor="#fb923c"
                  floodOpacity="0.45"
                />
              </filter>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#f3f4f6"
              strokeDasharray="4 8"
            />

            <XAxis
              dataKey="hari"
              tickFormatter={formatHariAxis}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 12,
                fontWeight: 600,
              }}
            />

            <YAxis
              tickFormatter={formatAxis}
              tickLine={false}
              axisLine={false}
              width={45}
              tick={{
                fill: "#9ca3af",
                fontSize: 11,
              }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#fb923c",
                strokeWidth: 1.5,
                strokeDasharray: "5 5",
              }}
            />

            {/* AREA */}

            <Area
              type="monotone"
              dataKey="totalTransaksi"
              fill="url(#trafficGradient)"
              stroke="none"
              animationDuration={1200}
            />

            {/* LINE */}

            <Line
              type="monotone"
              dataKey="totalTransaksi"
              stroke="url(#lineGradient)"
              strokeWidth={4}
              filter="url(#lineGlow)"
              dot={false}
              activeDot={{
                r: 8,
                fill: "#ffffff",
                stroke: "#f97316",
                strokeWidth: 4,
              }}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER */}

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-1 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

          <span className="text-sm font-medium text-gray-500">Total Omzet</span>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1">
          <FiTrendingUp className="text-orange-500 text-sm" />

          <span className="text-sm font-bold text-orange-500">
            {formatRupiah(statistik.totalOmzet)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default DashboardTrafikTransaksiContent;
