"use client"
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';

interface WaterfallChartProps {
  data: { range: string; total_acv: number }[];
  width?: number;
  height?: number;
}

export const WaterfallChart = ({ data, width = 600, height = 400 }: WaterfallChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Set up dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.range))
      .range([0, innerWidth])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.total_acv)! * 1.1])
      .range([innerHeight, 0])
      .nice();

    // Create SVG group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add properly formatted Y-axis
    g.append('g')
      .call(d3.axisLeft(yScale))
      .call(g => {
        g.select('.domain').remove();
        g.selectAll('.tick text')
          .text(d => `$${d3.format('.2s')(d)}`);
      });

    // Add X-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    // Draw bars
    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.range)!)
      .attr('y', d => yScale(d.total_acv))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.total_acv))
      .attr('fill', '#4f46e5')
      .attr('rx', 4);

    // Add value labels
    g.selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', d => xScale(d.range)! + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.total_acv) - 5)
      .attr('text-anchor', 'middle')
      .text(d => `$${d3.format(',.0f')(d.total_acv)}`)
      .style('font-size', '12px')
      .style('fill', '#111827');

  }, [data, width, height]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>ACV by Range</Typography>
      <svg 
        ref={svgRef} 
        width={width} 
        height={height}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </Box>
  );
};