'use client';

import React, { useMemo } from 'react';
import { scaleLinear } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';

interface HeatmapChartProps {
  data: {
    quarter: string;
    range: string;
    deal_count: string;
    total_acv: string;
  }[];
  normalize: 'acv' | 'count';
  quarters: string[];
  ranges: string[];
}

export default function HeatmapChart({ data, normalize, quarters, ranges }: HeatmapChartProps) {
  const processedData = useMemo(() => {
    const map = new Map<string, number>();
    let maxValue = 0;

    data.forEach((item) => {
      const key = `${item.quarter}_${item.range}`;
      const value = normalize === 'acv' ? parseFloat(item.total_acv) : parseInt(item.deal_count);
      map.set(key, value);
      if (value > maxValue) maxValue = value;
    });

    return { map, maxValue };
  }, [data, normalize]);

  const colorScale = scaleLinear<string>()
    .domain([0, processedData.maxValue])
    .range([interpolateBlues(0.1), interpolateBlues(1)]);

  return (
    <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Heatmap: {normalize === 'acv' ? 'Total ACV' : 'Deal Count'}</h2>
      {quarters.length === 0 || ranges.length === 0 ? (
        <p className="text-gray-500 text-center">No data available.</p>
      ) : (
        <table className="table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Range ↓ / Quarter →</th>
              {quarters.map((q) => (
                <th key={q} className="border px-4 py-2 text-sm font-medium">
                  {q}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ranges.map((range) => (
              <tr key={range}>
                <td className="border px-4 py-2 text-sm font-medium">{range}</td>
                {quarters.map((q) => {
                  const key = `${q}_${range}`;
                  const val = processedData.map.get(key) || 0;
                  return (
                    <td
                      key={key}
                      className="border px-4 py-2 text-sm text-center"
                      style={{
                        backgroundColor: val ? colorScale(val) : '#f0f0f0',
                        color: val > processedData.maxValue / 2 ? 'white' : 'black',
                      }}
                    >
                      {normalize === 'acv' ? `$${Math.round(val / 1000)}k` : val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
