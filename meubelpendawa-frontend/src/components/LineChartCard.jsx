import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-orange-500 shadow-xl rounded-xl p-3 border">
      <p className="text-white font-semibold mb-2">{label}</p>

      <p className="text-white text-sm">
        Omzet: Rp {payload[0].value.toLocaleString("id-ID")}
      </p>

      <p className="text-orange-200 text-sm">
        Transaksi: {payload[0].payload.transaksi}
      </p>
    </div>
  );
}

export default function LineChartCard({ data }) {
  if (!data?.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="font-semibold">Tidak ada data penjualan</h3>

          <p className="text-sm text-gray-500 mt-1">
            Tidak ditemukan transaksi pada periode ini
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis dataKey="label" tick={{ fontSize: 15 }} tickMargin={10} />

          <YAxis
            width={60}
            tick={{ fontSize: 15 }}
            tickFormatter={(value) =>
              new Intl.NumberFormat("id-ID", {
                notation: "compact",
                compactDisplay: "short",
              }).format(value)
            }
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="omzet"
            stroke="#f97316"
            strokeWidth={3}
            animationDuration={1000}
            dot={{
              r: 5,
              strokeWidth: 3,
              fill: "#fff",
            }}
            activeDot={{
              r: 8,
              fill: "#f97316",
              stroke: "#f97316",
              strokeWidth: 3,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
