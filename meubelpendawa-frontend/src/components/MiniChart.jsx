import { LineChart, Line, ResponsiveContainer } from "recharts";

const data = [
  { value: 12 },
  { value: 18 },
  { value: 15 },
  { value: 22 },
  { value: 20 },
  { value: 25 },
  { value: 28 },
];

export default function MiniChart() {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke="#F97316"
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
