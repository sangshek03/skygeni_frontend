// components/charts/AccountIndustryPieChart.tsx
'use client';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

export default function AccountIndustryPieChart({ data }: { data: any[] }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    // Clear previous render
    d3.select(svgElement).selectAll('*').remove();

    if (!data || data.length === 0) {
      d3.select(svgElement)
        .attr('width', 400)
        .attr('height', 100)
        .append('text')
        .attr('x', 200)
        .attr('y', 50)
        .attr('text-anchor', 'middle')
        .text('No data available for selected year/quarter');
      return;
    }

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(svgElement)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3
      .scaleOrdinal(d3.schemeCategory10)
      .domain(data.map((d) => d.industry));

    const pie = d3.pie<any>().value((d) => parseFloat(d.acv));
    const arc = d3.arc<any>().innerRadius(100).outerRadius(radius);
    const labelArc = d3.arc<any>().innerRadius(120).outerRadius(radius + 20);

    svg
      .selectAll('path')
      .data(pie(data))
      .join('path')
      .attr('d', arc)
      .attr('fill', (d) => color(d.data.industry))
      .append('title')
      .text((d) => `${d.data.industry}: $${d.data.acv}`);

    // Add labels
    svg
      .selectAll('text.label')
      .data(pie(data))
      .join('text')
      .attr('class', 'label')
      .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#000')
      .text((d) => d.data.industry);
  }, [data]);

  return <svg ref={svgRef} />;
}
