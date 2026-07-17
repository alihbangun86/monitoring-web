"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface ChartData {
  time: string;
  ping: number;
  jitter: number;
  response: number;
}

interface Props {
  data: ChartData[];
}

export default function ResponseChart({
  data,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">

      <div className="mb-5">

        <h2 className="text-xl font-bold text-gray-900">
          Monitoring Performance
        </h2>

        <p className="text-gray-500">
          Ping, Jitter dan HTTP Response 30 Menit Terakhir
        </p>

      </div>

      <div className="h-[420px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 10,
              bottom: 10,
            }}
          >

            <CartesianGrid strokeDasharray="4 4" />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              tick={{ fontSize: 12 }}
              unit=" ms"
            />

            <Tooltip
              formatter={(value: any, name: any) => [
                `${value} ms`,
                name,
              ]}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="ping"
              name="Ping"
              stroke="#22c55e"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="jitter"
              name="Jitter"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="response"
              name="HTTP Response"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}