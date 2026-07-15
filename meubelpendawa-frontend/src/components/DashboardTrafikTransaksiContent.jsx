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
      className="
        rounded-2xl
        border
        border-white/60
        bg-white/80
        backdrop-blur-xl
        shadow-2xl
        px-5
        py-4
        min-w-[220px]
      "
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

          <span className="font-semibold">{item.jamTersibuk || "-"}</span>
        </div>
      </div>
    </motion.div>
  );
};

function DashboardTrafikTransaksiContent({ data = [] }) {
  console.log("DATA TRAFIK");
  console.table(data);
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

      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Trafik Transaksi Mingguan
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Tren omzet selama 7 hari terakhir
          </p>
        </div>

        <div
          className="flex items-center gap-2 rounded-xl border border-orange-100 bg-gradient-to-r
          from-orange-50 to-orange-100 px-3 py-2 shadow-sm"
        >
          <FiTrendingUp className="text-orange-500" />

          <span className="text-sm font-semibold text-orange-500">Omzet</span>
        </div>
      </div>

      {/* CHART */}

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
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
              dataKey="totalOmzet"
              fill="url(#trafficGradient)"
              stroke="none"
              animationDuration={1200}
            />

            {/* LINE */}

            <Line
              type="monotone"
              dataKey="totalOmzet"
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

          <span className="text-sm font-medium text-gray-500">
            Omzet Mingguan
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1">
          <FiTrendingUp className="text-orange-500 text-sm" />

          <span className="text-sm font-bold text-orange-500">
            {formatRupiah(data.reduce((sum, item) => sum + item.totalOmzet, 0))}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default DashboardTrafikTransaksiContent;
