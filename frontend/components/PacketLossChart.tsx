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

interface ChartData {
  time: string;
  value: number;
}

interface Props {
  data: ChartData[];
}

export default function PacketLossChart({
  data,
}: Props) {

  return (

    <div className="h-[320px]">

      <ResponsiveContainer width="100%" height="100%">

        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            unit="%"
            tick={{ fontSize: 12 }}
          />

          <Tooltip
            formatter={(value) => [
              `${value}%`,
              "Packet Loss",
            ]}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#ef4444"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5 }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

}