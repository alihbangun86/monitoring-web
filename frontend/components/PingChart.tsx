"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface PingData {
  time: string;
  value: number;
}

interface Props {
  data: PingData[];
}

export default function PingChart({
  data,
}: Props) {

  return (

    <div className="h-[350px] w-full">

      <ResponsiveContainer width="100%" height="100%">

        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 25,
            left: 0,
            bottom: 10,
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="time"
            tick={{
              fontSize: 12,
            }}
          />

          <YAxis
            unit=" ms"
            tick={{
              fontSize: 12,
            }}
          />

          <Tooltip
            formatter={(value) => [
              `${value} ms`,
              "Ping",
            ]}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#16a34a"
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
            }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

}