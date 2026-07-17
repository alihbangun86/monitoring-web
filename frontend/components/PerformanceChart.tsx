"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

interface Data {
  time: string;
  ping: number;
  response: number;
  jitter: number;
}

interface Props {
  data: Data[];
}

export default function PerformanceChart({
  data,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="time" />

        <YAxis />

        <Tooltip />

        <Legend />

        <Line
          type="monotone"
          dataKey="response"
          name="HTTP Response"
          stroke="#2563eb"
          strokeWidth={3}
          dot={false}
        />

        <Line
          type="monotone"
          dataKey="jitter"
          name="Jitter"
          stroke="#9333ea"
          strokeWidth={3}
          dot={false}
        />

        <Line
          type="monotone"
          dataKey="ping"
          name="Ping"
          stroke="#16a34a"
          strokeWidth={3}
          dot={false}
        />

      </LineChart>
    </ResponsiveContainer>
  );
}