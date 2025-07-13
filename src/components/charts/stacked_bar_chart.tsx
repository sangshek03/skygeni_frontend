// @ts-ignore
'use client';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

export default function AccountIndustryStackedBar({ data }: { data: any[] }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // D3 stacked bar setup here — colors, scales, axes, stacks...
    // Clear SVG on every render
    d3.select(svgRef.current).selectAll('*').remove();

    const industries = new Set();
    data.forEach((q) =>
      q.industries.forEach((i: any) => industries.add(i.name))
    );

    const keys = Array.from(industries);

    const stackedData = data.map((q) => {
      const entry: any = { quarter: q.quarter };
      keys.forEach((key) => {
        const found = q.industries.find((i: any) => i.name === key);
        entry[key] = found ? found.acv : 0;
      });
      return entry;
    });

    const margin = { top: 30, right: 30, bottom: 50, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(stackedData.map((d) => d.quarter))
      .range([0, width])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(stackedData, (d) =>
          d3.sum(keys, (k) => parseFloat(d[k]))
        ) as number,
      ])
      .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(keys);

    const stack = d3.stack().keys(keys)(stackedData as any);

    svg.append('g').call(d3.axisLeft(y));
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg
      .selectAll('g.layer')
      .data(stack)
      .join('g')
      .attr('fill', (d) => color(d.key)!)
      .selectAll('rect')
      .data((d) => d)
      .join('rect')
      .attr('x', (d) => x(d.data.quarter)!)
      .attr('y', (d) => y(d[1]))
      .attr('height', (d) => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth());
  }, [data]);

  return <svg ref={svgRef} />;
}
