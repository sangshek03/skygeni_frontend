"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const SparklineChart = ({ data }: { data: any[] }) => {
  const formatted = data.map((entry) => ({
    type: entry.type,
    data: entry.trend.map((t: any) => ({
      quarter: t.quarter,
      value: parseInt(t.value),
    })),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart>
        {formatted.map((lineData, idx) => (
          <Line
            key={lineData.type}
            data={lineData.data}
            name={lineData.type}
            dataKey="value"
            type="monotone"
            stroke={idx === 0 ? "#8884d8" : "#FF8042"}
            dot={{ r: 4 }}
          />
        ))}
        <XAxis dataKey="quarter" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};
