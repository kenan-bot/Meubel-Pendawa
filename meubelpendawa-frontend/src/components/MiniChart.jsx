import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis } from "recharts";

function formatRupiah(value) {
  return "Rp" + Number(value).toLocaleString("id-ID");
}

export default function MiniChart({ data = [] }) {
  return (
    <div className="w-full h-16 sm:h-20 md:h-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 2,
            right: 2,
            left: -18,
            bottom: 0,
          }}
        >
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            dy={6}
          />

          <Tooltip
            formatter={(value) => [formatRupiah(value), "Omzet"]}
            labelFormatter={(label) => `Periode : ${label}`}
          />

          <Line
            type="monotone"
            dataKey="omzet"
            stroke="#F97316"
            strokeWidth={2.5}
            dot={{
              r: 3,
              fill: "#F97316",
            }}
            activeDot={{
              r: 5,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
