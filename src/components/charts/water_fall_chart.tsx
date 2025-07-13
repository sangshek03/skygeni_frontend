'use client';
import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Tooltip, CartesianGrid, LabelList } from 'recharts';

interface WaterfallChartProps {
  data: {
    range: string;
    total_acv: string;
    total_count: string;
  }[];
}

export default function WaterfallChart({ data }: WaterfallChartProps) {
  const formattedData = data.map((item) => ({
    range: item.range,
    totalACV: parseFloat(item.total_acv),
    totalCount: parseInt(item.total_count, 10),
  }));

  return (
    <div className="w-full bg-white shadow-md rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4">Total ACV by Range</h2>
      {formattedData.length === 0 ? (
        <p className="text-gray-500 text-center">No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Bar dataKey="totalACV" fill="#6366f1">
              
              <LabelList dataKey="totalACV" position="top" 
              // @ts-ignore
              formatter={(val: number) => `$${Math.round(val / 1000)}k`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}